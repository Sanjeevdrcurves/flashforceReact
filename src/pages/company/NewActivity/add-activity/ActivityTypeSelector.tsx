
import { ActivityType } from "@/types/activity";
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Phone, 
  Calendar, 
  CheckSquare, 
  Clock, 
  MapPin, 
  Mail, 
  Coffee, 
  Plus,
  Stethoscope
} from "lucide-react";

interface ActivityTypeSelectorProps {
  value: ActivityType;
  onChange: (value: ActivityType) => void;
  buttonClassName?: string;
}

const activityTypes: { value: ActivityType; label: string; icon: React.ReactNode }[] = [
  { value: "call", label: "Scheduled Call", icon: <Phone className="h-4 w-4" /> },
  { value: "meeting", label: "Meeting", icon: <Calendar className="h-4 w-4" /> },
  { value: "task", label: "Task", icon: <CheckSquare className="h-4 w-4" /> },
  { value: "deadline", label: "Deadline", icon: <Clock className="h-4 w-4" /> },
  { value: "visit", label: "Visit", icon: <MapPin className="h-4 w-4" /> },
  { value: "email", label: "Email", icon: <Mail className="h-4 w-4" /> },
  { value: "lunch", label: "Lunch", icon: <Coffee className="h-4 w-4" /> },
  { value: "service appointment", label: "Service Appointment", icon: <Stethoscope className="h-4 w-4" /> },
  { value: "custom", label: "Custom Type", icon: <Plus className="h-4 w-4" /> },
];

export const ActivityTypeSelector: React.FC<ActivityTypeSelectorProps> = ({ 
  value, 
  onChange,
  buttonClassName
}) => {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as ActivityType)}>
      <SelectTrigger className={buttonClassName || "w-full"}>
        <SelectValue placeholder="Select activity type" />
      </SelectTrigger>
      <SelectContent>
        {activityTypes.map(type => (
          <SelectItem key={type.value} value={type.value} className="cursor-pointer">
            <div className="flex items-center">
              <span className="mr-2">{type.icon}</span>
              {type.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
