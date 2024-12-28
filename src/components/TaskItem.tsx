import { Check, Trash2, Calendar } from "lucide-react";
import { Task } from "@/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

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

  const priorityBadgeColors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
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
        <div className="flex items-center gap-2">
          <p className={cn(
            "text-sm font-medium transition-colors",
            task.completed ? "text-muted-foreground line-through" : "text-foreground"
          )}>
            {task.title}
          </p>
          <Badge variant="secondary" className={cn("text-xs", priorityBadgeColors[task.priority])}>
            {task.priority}
          </Badge>
          <Badge variant="outline">{task.category}</Badge>
        </div>
        
        <div className="mt-1 flex items-center gap-2">
          <span className={cn(
            "inline-block h-2 w-2 rounded-full",
            priorityColors[task.priority]
          )} />
          {task.deadline && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {format(new Date(task.deadline), "PPP")}
            </span>
          )}
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