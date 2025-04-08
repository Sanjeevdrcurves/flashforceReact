
import React, { useState } from "react";
import { DateTimeFields } from "@/components/add-activity/DateTimeFields";
import { RecurrenceSelector } from "@/components/add-activity/RecurrenceSelector";
import { ReminderSelector } from "@/components/add-activity/ReminderSelector";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RecurrencePattern } from "@/types/activity";

interface ActivityDateTimeSectionProps {
  startDate?: Date;
  dueDate?: Date;
  startTime?: string;
  dueTime?: string;
  showStartDate?: boolean;
  setStartDate?: (date?: Date) => void;
  setDueDate?: (date?: Date) => void;
  setStartTime?: (time: string) => void;
  setDueTime?: (time: string) => void;
  showCalendarView?: boolean;
  setShowCalendarView?: (show: boolean) => void;
  isRecurring?: boolean;
  setIsRecurring?: (isRecurring: boolean) => void;
  reminders?: Array<{
    id: string;
    time: number;
    type: "email" | "notification" | "sms";
  }>;
  addReminder?: (time: number, type: "email" | "notification" | "sms") => void;
  removeReminder?: (id: string) => void;
  recurrencePattern?: RecurrencePattern;
  recurrenceEndDate?: Date;
  recurrenceCount?: number;
  recurrenceDays?: number[];
  setRecurrencePattern?: (pattern: RecurrencePattern) => void;
  setRecurrenceEndDate?: (date?: Date) => void;
  setRecurrenceCount?: (count?: number) => void;
  setRecurrenceDays?: (days: number[]) => void;
}

export const ActivityDateTimeSection: React.FC<ActivityDateTimeSectionProps> = ({
  startDate,
  dueDate,
  startTime = "",
  dueTime = "",
  showStartDate = false,
  setStartDate = () => {},
  setDueDate = () => {},
  setStartTime = () => {},
  setDueTime = () => {},
  showCalendarView = false,
  setShowCalendarView = () => {},
  isRecurring = false,
  setIsRecurring = () => {},
  reminders = [],
  addReminder = () => {},
  removeReminder = () => {},
  recurrencePattern = "weekly",
  recurrenceEndDate,
  recurrenceCount,
  recurrenceDays = [],
  setRecurrencePattern = () => {},
  setRecurrenceEndDate = () => {},
  setRecurrenceCount = () => {},
  setRecurrenceDays = () => {},
}) => {
  // State for showing reminder selector
  const [showReminders, setShowReminders] = useState(reminders.length > 0);

  // Handle recurrence toggle
  const handleRecurrenceToggle = (value: boolean) => {
    setIsRecurring(value);
  };

  // Handle reminder toggle
  const handleReminderToggle = (value: boolean) => {
    setShowReminders(value);
    if (!value) {
      // Remove all reminders when toggled off
      reminders.forEach(reminder => removeReminder(reminder.id));
    } else if (reminders.length === 0) {
      // Add a default reminder when toggled on and no reminders exist
      addReminder(15, "notification");
    }
  };

  return (
    <div className="space-y-4">
      {/* Date and Time Fields */}
      <DateTimeFields
        startDate={startDate}
        dueDate={dueDate || new Date()}
        startTime={startTime}
        dueTime={dueTime}
        showStartDate={showStartDate}
        onStartDateChange={setStartDate}
        onDueDateChange={setDueDate}
        onStartTimeChange={setStartTime}
        onDueTimeChange={setDueTime}
        asanaStyle={true}
        onToggleCalendar={() => setShowCalendarView(!showCalendarView)}
        showCalendar={showCalendarView}
        isRecurring={isRecurring}
        setIsRecurring={setIsRecurring}
        recurrenceDays={recurrenceDays}
        setRecurrenceDays={setRecurrenceDays}
        recurrencePattern={recurrencePattern}
        setRecurrencePattern={setRecurrencePattern}
      />
      
      {/* Recurrence and Reminders Controls */}
      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="recurrence-toggle" className="text-sm font-medium">Recurring Activity</Label>
            <Switch
              id="recurrence-toggle"
              checked={isRecurring}
              onCheckedChange={handleRecurrenceToggle}
            />
          </div>
          
          {isRecurring && (
            <RecurrenceSelector
              isRecurring={isRecurring}
              recurrencePattern={recurrencePattern}
              recurrenceEndDate={recurrenceEndDate}
              recurrenceCount={recurrenceCount}
              recurrenceDays={recurrenceDays}
              onIsRecurringChange={setIsRecurring}
              onPatternChange={setRecurrencePattern}
              onEndDateChange={setRecurrenceEndDate}
              onCountChange={setRecurrenceCount}
              onDaysChange={setRecurrenceDays}
              simplified={true}
            />
          )}
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="reminders-toggle" className="text-sm font-medium">Set Reminders</Label>
            <Switch
              id="reminders-toggle"
              checked={showReminders}
              onCheckedChange={handleReminderToggle}
            />
          </div>
          
          {showReminders && (
            <ReminderSelector
              reminders={reminders}
              onAdd={addReminder}
              onRemove={removeReminder}
            />
          )}
        </div>
      </div>
    </div>
  );
};
