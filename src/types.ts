export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
  category: "Personal" | "Work";
  deadline?: Date;
}