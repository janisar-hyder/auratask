import { useState } from "react";
import { TaskItem } from "@/components/TaskItem";
import { TaskInsights } from "@/components/TaskInsights";
import { AddTask } from "@/components/AddTask";
import { Task } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/components/ThemeProvider";

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<string[]>(["Personal", "Work"]);
  const [sortBy, setSortBy] = useState<"priority" | "deadline" | "category">("priority");
  const [view, setView] = useState<"list" | "kanban">("list");
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();

  // Remove the old toggleTheme function since we're using the one from context now

  const addTask = (taskData: {
    title: string;
    description?: string;
    priority: "high" | "medium" | "low";
    category: string;
    deadline?: Date;
    estimatedTime?: number;
  }) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      completed: false,
      ...taskData,
    };
    
    setTasks((prev) => [newTask, ...prev]);
    
    if (!categories.includes(taskData.category)) {
      setCategories((prev) => [...prev, taskData.category]);
    }
    
    toast({
      title: "Task added",
      description: "Your new task has been created successfully.",
    });
  };

  const completeTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    toast({
      title: "Task deleted",
      description: "The task has been removed successfully.",
    });
  };

  const editTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      )
    );
    toast({
      title: "Task updated",
      description: "The task has been updated successfully.",
    });
  };

  const assignTask = (taskId: string, userId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, assignedTo: userId } : task
      )
    );
  };

  const addCollaborator = (taskId: string, userId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? {
              ...task,
              collaborators: [...(task.collaborators || []), userId],
            }
          : task
      )
    );
  };

  const addComment = (taskId: string, comment: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? {
              ...task,
              comments: [
                ...(task.comments || []),
                {
                  id: crypto.randomUUID(),
                  text: comment,
                  author: "Current User",
                  createdAt: new Date(),
                },
              ],
            }
          : task
      )
    );
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
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Tasks</h1>
              <p className="mt-2 text-muted-foreground">
                Manage your tasks and stay organized
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={toggleTheme}>
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setView(view === "list" ? "kanban" : "list")}
              >
                {view === "list" ? "Kanban View" : "List View"}
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <TaskInsights tasks={tasks} currentTask={sortedTasks[0]} />
            
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
