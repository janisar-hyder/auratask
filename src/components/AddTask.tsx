import { useState } from "react";
import { Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AddTaskProps {
  onAdd: (task: {
    title: string;
    description?: string;
    priority: "high" | "medium" | "low";
    category: string;
    deadline?: Date;
    estimatedTime?: number;
  }) => void;
  categories: string[];
}

export const AddTask = ({ onAdd, categories }: AddTaskProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [category, setCategory] = useState(categories[0]);
  const [deadline, setDeadline] = useState<Date>();
  const [estimatedTime, setEstimatedTime] = useState<number>();
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onAdd({ 
      title, 
      description, 
      priority, 
      category: showNewCategory ? newCategory : category, 
      deadline,
      estimatedTime 
    });
    
    setTitle("");
    setDescription("");
    setDeadline(undefined);
    setEstimatedTime(undefined);
    setNewCategory("");
    setShowNewCategory(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title..."
        className="flex-1"
      />
      
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task description (optional)"
        className="min-h-[100px]"
      />

      <div className="flex flex-wrap gap-3">
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

        {!showNewCategory ? (
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
              <SelectItem value="new">+ Add New</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <Input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category..."
            className="w-[130px]"
          />
        )}

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn("w-[140px] justify-start text-left font-normal", !deadline && "text-muted-foreground")}>
              <Calendar className="mr-2 h-4 w-4" />
              {deadline ? format(deadline, "PPP") : <span>Set deadline</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <CalendarComponent
              mode="single"
              selected={deadline}
              onSelect={setDeadline}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Input
          type="number"
          value={estimatedTime || ""}
          onChange={(e) => setEstimatedTime(Number(e.target.value))}
          placeholder="Est. hours"
          className="w-[100px]"
        />

        <Button type="submit" className="ml-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>
    </form>
  );
};