import { Check, Trash2 } from "lucide-react";
import { Task } from "@/types";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskItem = ({ task, onComplete, onDelete }: TaskItemProps) => {
  const priorityColors = {
    high: "bg-priority-high",
    medium: "bg-priority-medium",
    low: "bg-priority-low",
  };

  return (
    <div className="group flex items-center gap-3 rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md">
      <button
        onClick={() => onComplete(task.id)}
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-full border transition-colors",
          task.completed ? "bg-primary border-primary" : "border-gray-300 hover:border-primary"
        )}
      >
        {task.completed && <Check className="h-3 w-3 text-primary-foreground" />}
      </button>
      
      <div className="flex-1">
        <p className={cn(
          "text-sm font-medium transition-colors",
          task.completed ? "text-muted-foreground line-through" : "text-foreground"
        )}>
          {task.title}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <span className={cn(
            "inline-block h-2 w-2 rounded-full",
            priorityColors[task.priority]
          )} />
          <span className="text-xs text-muted-foreground">
            {task.category}
          </span>
        </div>
      </div>

      <button
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
};