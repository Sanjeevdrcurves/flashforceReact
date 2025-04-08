
import React from "react";
import { FileText } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// Mock templates based on activity type
const TEMPLATES = {
  "call": [
    { id: "1", name: "Sales Call" },
    { id: "2", name: "Follow-up Call" }
  ],
  "meeting": [
    { id: "1", name: "Initial Consultation" },
    { id: "2", name: "Project Kickoff" }
  ],
  "task": [
    { id: "1", name: "Research" },
    { id: "2", name: "Document Review" }
  ],
  "deadline": [
    { id: "1", name: "Project Deadline" }
  ],
  "visit": [
    { id: "1", name: "On-site Visit" }
  ],
  "email": [
    { id: "1", name: "Introduction Email" },
    { id: "2", name: "Follow-up Email" }
  ],
  "lunch": [
    { id: "1", name: "Client Lunch" }
  ],
  "service appointment": [
    { id: "1", name: "Initial Consultation" },
    { id: "2", name: "Follow-up Appointment" }
  ],
  "custom": []
};

export const TemplateSelector = ({
  type,
  value,
  onChange
}) => {
  const templates = TEMPLATES[type] || [];

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select a template">
          <div className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            <span>
              {value 
                ? templates.find(t => t.id === value)?.name || "Select template" 
                : "Select template"}
            </span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {templates.map(template => (
          <SelectItem key={template.id} value={template.id}>
            {template.name}
          </SelectItem>
        ))}
        {templates.length === 0 && (
          <SelectItem value="none" disabled>
            No templates available
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
};
