import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskSortProps {
  sortBy: "priority" | "deadline" | "category";
  onSortChange: (value: "priority" | "deadline" | "category") => void;
}

export const TaskSort = ({ sortBy, onSortChange }: TaskSortProps) => {
  return (
    <div className="flex justify-end">
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="priority">Sort by Priority</SelectItem>
          <SelectItem value="deadline">Sort by Deadline</SelectItem>
          <SelectItem value="category">Sort by Category</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};