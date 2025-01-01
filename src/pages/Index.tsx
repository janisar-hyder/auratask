import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TaskInsights } from "@/components/TaskInsights";
import { AddTask } from "@/components/AddTask";
import { Task } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { TaskHeader } from "@/components/TaskHeader";
import { taskService } from "@/services/taskService";
import { supabase } from "@/lib/supabase";
import { TaskList } from "@/components/TaskList";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<string[]>(["Personal", "Work"]);
  const [sortBy, setSortBy] = useState<"priority" | "deadline" | "category">("priority");
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
      await taskService.createTask({
        ...taskData,
        completed: false,
      });
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

  const assignTask = async (taskId: string, userId: string) => {
    try {
      await taskService.updateTask(taskId, { assignedTo: userId });
      await loadTasks();
      toast({
        title: "Task assigned",
        description: "The task has been assigned successfully.",
      });
    } catch (error) {
      toast({
        title: "Error assigning task",
        description: "Failed to assign the task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addCollaborator = async (taskId: string, userId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;
      
      const collaborators = [...(task.collaborators || [])];
      if (!collaborators.includes(userId)) {
        collaborators.push(userId);
      }
      
      await taskService.updateTask(taskId, { collaborators });
      await loadTasks();
      toast({
        title: "Collaborator added",
        description: "The collaborator has been added successfully.",
      });
    } catch (error) {
      toast({
        title: "Error adding collaborator",
        description: "Failed to add the collaborator. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addComment = async (taskId: string, comment: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;
      
      const comments = [...(task.comments || [])];
      comments.push({
        id: crypto.randomUUID(),
        text: comment,
        author: "Current User", // Replace with actual user info
        createdAt: new Date(),
      });
      
      await taskService.updateTask(taskId, { comments });
      await loadTasks();
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully.",
      });
    } catch (error) {
      toast({
        title: "Error adding comment",
        description: "Failed to add the comment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
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

            <TaskList
              tasks={sortedTasks}
              onComplete={completeTask}
              onDelete={deleteTask}
              onEdit={editTask}
              onAssign={assignTask}
              onAddCollaborator={addCollaborator}
              onAddComment={addComment}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;