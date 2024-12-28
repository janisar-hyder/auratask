export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
  category: string;
  deadline?: Date;
  assignedTo?: string;
  estimatedTime?: number;
  actualTime?: number;
  completedAt?: Date;
  collaborators?: string[];
  comments?: {
    id: string;
    text: string;
    author: string;
    createdAt: Date;
  }[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}