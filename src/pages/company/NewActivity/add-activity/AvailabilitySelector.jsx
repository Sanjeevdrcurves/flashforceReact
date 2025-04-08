
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Clock, 
  CheckCircle 
} from "lucide-react";

const AvailabilitySelector = ({ 
  value, 
  onChange 
}) => {
  const availabilityOptions = [
    { value: "busy", label: "Busy", icon: <Clock className="h-4 w-4" /> },
    { value: "free", label: "Free", icon: <CheckCircle className="h-4 w-4" /> },
  ];

  return (
    <Select value={value} onValueChange={(v) => onChange(v)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select availability" />
      </SelectTrigger>
      <SelectContent>
        {availabilityOptions.map(option => (
          <SelectItem key={option.value} value={option.value} className="cursor-pointer">
            <div className="flex items-center">
              <span className="mr-2">{option.icon}</span>
              {option.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export { AvailabilitySelector };
