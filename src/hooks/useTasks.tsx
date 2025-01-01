import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Task } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { taskService } from "@/services/taskService";
import { supabase } from "@/lib/supabase";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<string[]>(["Personal", "Work"]);
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

  return {
    tasks,
    categories,
    addTask,
    completeTask,
    deleteTask,
    editTask,
  };
};