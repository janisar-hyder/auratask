export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
  category: string;
  deadline?: Date;
  estimatedTime?: number;
  actualTime?: number;
  completedAt?: Date;
  collaborators?: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}