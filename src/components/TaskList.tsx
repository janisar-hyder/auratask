import { Task } from "@/types";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Task>) => void;
  onAssign: (taskId: string, userId: string) => void;
  onAddCollaborator: (taskId: string, userId: string) => void;
  onAddComment: (taskId: string, comment: string) => void;
}

export const TaskList = ({
  tasks,
  onComplete,
  onDelete,
  onEdit,
  onAssign,
  onAddCollaborator,
  onAddComment,
}: TaskListProps) => {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onComplete={onComplete}
          onDelete={onDelete}
          onEdit={onEdit}
          onAssign={onAssign}
          onAddCollaborator={onAddCollaborator}
          onAddComment={onAddComment}
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
  );
};