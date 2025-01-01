import { useState } from "react";
import { Check, Trash2, Calendar, Edit2, X, Save } from "lucide-react";
import { Task } from "@/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskItemProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Task>) => void;
}

export const TaskItem = ({ 
  task, 
  onComplete, 
  onDelete, 
  onEdit,
}: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description || "");
  const [editedPriority, setEditedPriority] = useState<"high" | "medium" | "low">(task.priority);

  const handleSave = () => {
    onEdit(task.id, {
      title: editedTitle,
      description: editedDescription,
      priority: editedPriority,
    });
    setIsEditing(false);
  };

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
    <div className="group rounded-lg border bg-card p-4 shadow-sm space-y-4">
      {isEditing ? (
      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <div className="space-y-4">
          <Input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder="Task title"
          />
          
          <Textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            placeholder="Task description"
          />
          
          <div className="flex items-center gap-2">
            <Select 
              value={editedPriority} 
              onValueChange={(value: "high" | "medium" | "low") => setEditedPriority(value)}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={handleSave} size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            
            <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      </div>
      ) : (
        <div className="flex items-center gap-3">
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
              {task.estimatedTime && (
                <Badge variant="outline" className="ml-2">
                  {task.estimatedTime}h
                </Badge>
              )}
            </div>
            
            {task.description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {task.description}
              </p>
            )}
            
            <div className="mt-2 flex items-center gap-2">
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

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsEditing(true)}
              className="text-muted-foreground hover:text-primary"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => onDelete(task.id)}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};