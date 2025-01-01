import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { TeamMember } from "@/types";
import { UserPlus, MessageSquare } from "lucide-react";

interface TaskCollaborationProps {
  taskId: string;
  assignedTo?: string;
  collaborators?: string[];
  onAssign: (taskId: string, userId: string) => void;
  onAddCollaborator: (taskId: string, userId: string) => void;
  onAddComment: (taskId: string, comment: string) => void;
}

export const TaskCollaboration = ({
  taskId,
  assignedTo,
  collaborators = [], // Provide default empty array
  onAssign,
  onAddCollaborator,
  onAddComment,
}: TaskCollaborationProps) => {
  const [comment, setComment] = useState("");
  const { toast } = useToast();

  // Mock team members data (in a real app, this would come from your backend)
  const teamMembers: TeamMember[] = [
    { id: "1", name: "John Doe", email: "john@example.com" },
    { id: "2", name: "Jane Smith", email: "jane@example.com" },
  ];

  const handleAssign = (userId: string) => {
    if (!userId) return;
    onAssign(taskId, userId);
    toast({
      title: "Task assigned",
      description: `Task assigned to ${teamMembers.find(m => m.id === userId)?.name}`,
    });
  };

  const handleAddComment = () => {
    if (!comment.trim()) return;
    onAddComment(taskId, comment);
    setComment("");
    toast({
      title: "Comment added",
      description: "Your comment has been added to the task",
    });
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center gap-4">
        <Select value={assignedTo} onValueChange={handleAssign}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Assign to..." />
          </SelectTrigger>
          <SelectContent>
            {teamMembers.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {member.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex -space-x-2">
          {Array.isArray(collaborators) && collaborators.map((collaboratorId) => {
            const member = teamMembers.find(m => m.id === collaboratorId);
            return member ? (
              <Avatar key={collaboratorId} className="h-8 w-8 border-2 border-background">
                <AvatarImage src={member.avatar} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ) : null;
          })}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => onAddCollaborator(taskId, teamMembers[0].id)}
          >
            <UserPlus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        <Input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1"
        />
        <Button onClick={handleAddComment}>
          <MessageSquare className="h-4 w-4 mr-2" />
          Comment
        </Button>
      </div>
    </div>
  );
};