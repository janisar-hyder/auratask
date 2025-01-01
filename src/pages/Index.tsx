import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TaskItem } from "@/components/TaskItem";
import { TaskInsights } from "@/components/TaskInsights";
import { AddTask } from "@/components/AddTask";
import { Task } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { TaskHeader } from "@/components/TaskHeader";
import { taskService } from "@/services/taskService";
import { supabase } from "@/lib/supabase";

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<string[]>(["Personal", "Work"]);
  const [sortBy, setSortBy] = useState<"priority" | "deadline" | "category">("priority");
  const [view, setView] = useState<"list" | "kanban">("list");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      loadTasks();
    };

    checkAuth();
  }, [navigate]);

  const loadTasks = async () => {
    try {
      const tasks = await taskService.getUserTasks();
      setTasks(tasks);
      const uniqueCategories = [...new Set(tasks.map(t => t.category))];
      if (uniqueCategories.length > 0) {
        setCategories(uniqueCategories);
      }
    } catch (error) {
      toast({
        title: "Error loading tasks",
        description: "Failed to load your tasks. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addTask = async (taskData: {
    title: string;
    description?: string;
    priority: "high" | "medium" | "low";
    category: string;
    deadline?: Date;
    estimatedTime?: number;
  }) => {
    try {
      await taskService.createTask(taskData);
      await loadTasks();
      await taskService.updateUserStats();
      
      toast({
        title: "Task added",
        description: "Your new task has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Error adding task",
        description: "Failed to add the task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const completeTask = async (id: string) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (!task) return;

      await taskService.updateTask(id, { 
        completed: !task.completed,
        completedAt: !task.completed ? new Date() : undefined
      });
      await loadTasks();
      await taskService.updateUserStats();
    } catch (error) {
      toast({
        title: "Error updating task",
        description: "Failed to update the task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      await loadTasks();
      await taskService.updateUserStats();
      
      toast({
        title: "Task deleted",
        description: "The task has been removed successfully.",
      });
    } catch (error) {
      toast({
        title: "Error deleting task",
        description: "Failed to delete the task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const editTask = async (id: string, updates: Partial<Task>) => {
    try {
      await taskService.updateTask(id, updates);
      await loadTasks();
      await taskService.updateUserStats();
      
      toast({
        title: "Task updated",
        description: "The task has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error updating task",
        description: "Failed to update the task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const sortTasks = (tasks: Task[]) => {
    return [...tasks].sort((a, b) => {
      switch (sortBy) {
        case "priority":
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case "deadline":
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case "category":
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });
  };

  const sortedTasks = sortTasks(tasks);

  const renderKanbanBoard = () => {
    const columns = {
      todo: sortedTasks.filter(task => !task.completed),
      done: sortedTasks.filter(task => task.completed),
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">To Do</h2>
          <div className="space-y-4">
            {columns.todo.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onComplete={completeTask}
                onDelete={deleteTask}
                onEdit={editTask}
                onAssign={assignTask}
                onAddCollaborator={addCollaborator}
                onAddComment={addComment}
              />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Done</h2>
          <div className="space-y-4">
            {columns.done.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onComplete={completeTask}
                onDelete={deleteTask}
                onEdit={editTask}
                onAssign={assignTask}
                onAddCollaborator={addCollaborator}
                onAddComment={addComment}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mx-auto max-w-4xl">
          <TaskHeader />

          <div className="space-y-6">
            <TaskInsights tasks={tasks} currentTask={tasks[0]} />
            
            <AddTask onAdd={addTask} categories={categories} />

            <div className="flex justify-end">
              <Select value={sortBy} onValueChange={(value: "priority" | "deadline" | "category") => setSortBy(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="priority">Sort by Priority</SelectItem>
                  <SelectItem value="deadline">Sort by Deadline</SelectItem>
                  <SelectItem value="category">Sort by Category</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {view === "list" ? (
              <div className="space-y-4">
                {sortedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onComplete={completeTask}
                    onDelete={deleteTask}
                    onEdit={editTask}
                    onAssign={assignTask}
                    onAddCollaborator={addCollaborator}
                    onAddComment={addComment}
                  />
                ))}
                
                {tasks.length === 0 && (
                  <div className="rounded-lg border border-dashed p-8 text-center">
                    <p className="text-muted-foreground">
                      No tasks yet. Add your first task above!
                    </p>
                  </div>
                )}
              </div>
            ) : (
              renderKanbanBoard()
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
