import { useState } from "react";
import { TaskItem } from "@/components/TaskItem";
import { AddTask } from "@/components/AddTask";
import { Task } from "@/types";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();

  const addTask = (taskData: {
    title: string;
    priority: "high" | "medium" | "low";
    category: "Personal" | "Work";
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

            <div className="space-y-4">
              {tasks.map((task) => (
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