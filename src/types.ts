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
}