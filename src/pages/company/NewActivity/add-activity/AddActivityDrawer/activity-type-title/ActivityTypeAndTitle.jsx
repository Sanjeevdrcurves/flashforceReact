
import React, { useState } from "react";
import { ActivityHeader } from "./ActivityHeader";
import { ActivityTitleInput } from "./ActivityTitleInput";
import { ActivityDateTimeSection } from "./ActivityDateTimeSection";
import { StatusSelector } from "@/components/add-activity/StatusSelector";
import { PrioritySelector } from "@/components/add-activity/PrioritySelector";
import { AvailabilitySelector } from "@/components/add-activity/AvailabilitySelector";

const ActivityTypeAndTitle = ({
  type,
  title,
  startDate,
  dueDate,
  startTime = "",
  dueTime = "",
  participants,
  showCalendarView = false,
  setType,
  setTitle,
  setStartDate,
  setDueDate,
  setStartTime,
  setDueTime,
  setShowCalendarView,
  isRecurring = false,
  setIsRecurring,
  reminders = [],
  addReminder,
  removeReminder,

  // Added status, priority, and availability fields with defaults
  status = "scheduled",
  setStatus = () => {},
  priority = "medium",
  setPriority = () => {},
  availability = "busy",
  setAvailability = () => {},
}) => {
  const [template, setTemplate] = useState("");

  const handleTemplateSelect = (templateId) => {
    // In a real app, this would populate form fields based on the template
    const templates = TEMPLATES[type] || [];
    const selectedTemplate = templates.find(t => t.id === templateId);
    if (selectedTemplate) {
      // Example: Set a default title based on the template
      setTitle(`${selectedTemplate.name} - ${new Date().toLocaleDateString()}`);
    }
  };

  const showStartDateField = ["meeting", "call", "service appointment", "visit", "lunch"].includes(type);

  return (
    <div className="space-y-4">
      {/* Activity Type and Template Header */}
      <ActivityHeader
        type={type}
        setType={setType}
        template={template}
        setTemplate={setTemplate}
        onTemplateSelect={handleTemplateSelect}
      />

      {/* Title Input */}
      <ActivityTitleInput 
        title={title} 
        setTitle={setTitle} 
      />

      {/* Status, Priority and Availability moved here */}
      <div className="grid grid-cols-3 gap-4 pt-2">
        <div>
          <StatusSelector
            value={status}
            onChange={setStatus}
          />
        </div>
        
        <div>
          <PrioritySelector
            value={priority}
            onChange={setPriority}
          />
        </div>
        
        <div>
          <AvailabilitySelector
            value={availability}
            onChange={setAvailability}
          />
        </div>
      </div>

      {/* Date, Time, Recurrence, and Reminders Section - removed "Date & Time" header */}
      <ActivityDateTimeSection
        startDate={startDate}
        dueDate={dueDate}
        startTime={startTime || ""}
        dueTime={dueTime || ""}
        showStartDate={showStartDateField}
        setStartDate={setStartDate}
        setDueDate={setDueDate}
        setStartTime={setStartTime}
        setDueTime={setDueTime}
        showCalendarView={showCalendarView}
        setShowCalendarView={setShowCalendarView}
        isRecurring={isRecurring}
        setIsRecurring={setIsRecurring}
        reminders={reminders}
        addReminder={addReminder}
        removeReminder={removeReminder}
      />
    </div>
  );
};

// Mock templates - imported from TemplateSelector but needed here for handleTemplateSelect
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

export { ActivityTypeAndTitle };
