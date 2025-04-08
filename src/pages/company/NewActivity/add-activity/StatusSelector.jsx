
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Calendar, 
  CheckCircle, 
  FileText 
} from "lucide-react";

const StatusSelector = ({ 
  value, 
  onChange 
}) => {
  const statuses = [
    { value: "scheduled", label: "Scheduled", icon: <Calendar className="h-4 w-4" /> },
    { value: "completed", label: "Completed", icon: <CheckCircle className="h-4 w-4" /> },
    { value: "log", label: "Log Entry", icon: <FileText className="h-4 w-4" /> },
  ];

  return (
    <Select value={value} onValueChange={(v) => onChange(v)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        {statuses.map(status => (
          <SelectItem key={status.value} value={status.value} className="cursor-pointer">
            <div className="flex items-center">
              <span className="mr-2">{status.icon}</span>
              {status.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export { StatusSelector };
