import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddTaskProps {
  onAdd: (task: {
    title: string;
    priority: "high" | "medium" | "low";
    category: "Personal" | "Work";
  }) => void;
}

export const AddTask = ({ onAdd }: AddTaskProps) => {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [category, setCategory] = useState<"Personal" | "Work">("Personal");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onAdd({ title, priority, category });
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new task..."
        className="flex-1"
      />
      
      <Select value={priority} onValueChange={(value: "high" | "medium" | "low") => setPriority(value)}>
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </SelectContent>
      </Select>

      <Select value={category} onValueChange={(value: "Personal" | "Work") => setCategory(value)}>
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Personal">Personal</SelectItem>
          <SelectItem value="Work">Work</SelectItem>
        </SelectContent>
      </Select>

      <Button type="submit">
        <Plus className="h-4 w-4" />
        Add Task
      </Button>
    </form>
  );
};