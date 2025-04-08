
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Flag } from "lucide-react";

const PrioritySelector = ({ 
  value, 
  onChange 
}) => {
  const priorities = [
    { value: "high", label: "High Priority", color: "text-red-500" },
    { value: "medium", label: "Medium Priority", color: "text-amber-500" },
    { value: "low", label: "Low Priority", color: "text-green-500" },
  ];

  return (
    <Select value={value} onValueChange={(v) => onChange(v)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select priority" />
      </SelectTrigger>
      <SelectContent>
        {priorities.map(priority => (
          <SelectItem key={priority.value} value={priority.value} className="cursor-pointer">
            <div className="flex items-center">
              <Flag className={`h-4 w-4 mr-2 ${priority.color}`} />
              {priority.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export { PrioritySelector };
