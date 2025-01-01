import { useState } from "react";
import { TaskInsights } from "@/components/TaskInsights";
import { AddTask } from "@/components/AddTask";
import { TaskHeader } from "@/components/TaskHeader";
import { TaskList } from "@/components/TaskList";
import { TaskSort } from "@/components/TaskSort";
import { useTasks } from "@/hooks/useTasks";
import { Task } from "@/types";

const Index = () => {
  const [sortBy, setSortBy] = useState<"priority" | "deadline" | "category">("priority");
  const { tasks, categories, addTask, completeTask, deleteTask, editTask } = useTasks();

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

            <TaskSort sortBy={sortBy} onSortChange={setSortBy} />

            <TaskList
              tasks={sortedTasks}
              onComplete={completeTask}
              onDelete={deleteTask}
              onEdit={editTask}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;