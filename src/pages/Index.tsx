import { useState } from "react";
import { TaskItem } from "@/components/TaskItem";
import { AddTask } from "@/components/AddTask";
import { Task } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sortBy, setSortBy] = useState<"priority" | "deadline" | "category">("priority");
  const { toast } = useToast();

  const addTask = (taskData: {
    title: string;
    priority: "high" | "medium" | "low";
    category: "Personal" | "Work";
    deadline?: Date;
  }) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      completed: false,
      ...taskData,
    };
    
    setTasks((prev) => [newTask, ...prev]);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight">Tasks</h1>
            <p className="mt-2 text-muted-foreground">
              Manage your tasks and stay organized
            </p>
          </div>

          <div className="space-y-6">
            <AddTask onAdd={addTask} />

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

            <div className="space-y-4">
              {sortedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onComplete={completeTask}
                  onDelete={deleteTask}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;