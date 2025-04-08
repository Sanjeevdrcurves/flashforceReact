
import React, { useMemo } from "react";
import { format, differenceInMinutes } from "date-fns";
import { 
  AsanaStyleDateTimeFields,
  CondensedDateTimeFields,
  StandardDateTimeFields
} from "./date-time";

interface DateTimeFieldsProps {
  startDate?: Date;
  dueDate: Date;
  startTime: string;
  dueTime: string;
  showStartDate?: boolean;
  onStartDateChange: (date?: Date) => void;
  onDueDateChange: (date: Date) => void;
  onStartTimeChange: (time: string) => void;
  onDueTimeChange: (time: string) => void;
  condensed?: boolean;
  asanaStyle?: boolean;
  onToggleCalendar?: () => void;
  showCalendar?: boolean;
  isRecurring?: boolean;
  setIsRecurring?: (value: boolean) => void;
  recurrenceDays?: number[];
  setRecurrenceDays?: (days: number[]) => void;
  recurrencePattern?: string;
  setRecurrencePattern?: (pattern: string) => void;
}

export const DateTimeFields: React.FC<DateTimeFieldsProps> = ({
  startDate,
  dueDate,
  startTime,
  dueTime,
  showStartDate = false,
  onStartDateChange,
  onDueDateChange,
  onStartTimeChange,
  onDueTimeChange,
  condensed = false,
  asanaStyle = false,
  onToggleCalendar,
  showCalendar,
  isRecurring,
  setIsRecurring,
  recurrenceDays,
  setRecurrenceDays,
  recurrencePattern,
  setRecurrencePattern,
}) => {
  // Calculate duration between start and due times if both dates and times are set
  const duration = useMemo(() => {
    if (!showStartDate || !startDate || !dueDate || !startTime || !dueTime) {
      return null;
    }
    
    const startDateTime = new Date(startDate);
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    startDateTime.setHours(startHours || 0, startMinutes || 0);
    
    const dueDateTime = new Date(dueDate);
    const [dueHours, dueMinutes] = dueTime.split(':').map(Number);
    dueDateTime.setHours(dueHours || 0, dueMinutes || 0);
    
    const diffMinutes = differenceInMinutes(dueDateTime, startDateTime);
    
    if (diffMinutes < 0) return null;
    
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    
    if (hours === 0) {
      return `${minutes}m`;
    } else if (minutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${minutes}m`;
    }
  }, [startDate, dueDate, startTime, dueTime, showStartDate]);

  if (asanaStyle) {
    return (
      <AsanaStyleDateTimeFields
        startDate={startDate}
        dueDate={dueDate}
        startTime={startTime}
        dueTime={dueTime}
        showStartDate={showStartDate}
        onStartDateChange={onStartDateChange}
        onDueDateChange={onDueDateChange}
        onStartTimeChange={onStartTimeChange}
        onDueTimeChange={onDueTimeChange}
        duration={duration}
        onToggleCalendar={onToggleCalendar}
        showCalendar={showCalendar}
        isRecurring={isRecurring}
        setIsRecurring={setIsRecurring}
        recurrenceDays={recurrenceDays}
        setRecurrenceDays={setRecurrenceDays}
        recurrencePattern={recurrencePattern}
        setRecurrencePattern={setRecurrencePattern}
      />
    );
  }

  if (condensed) {
    return (
      <CondensedDateTimeFields 
        startDate={startDate}
        dueDate={dueDate}
        startTime={startTime}
        dueTime={dueTime}
        showStartDate={showStartDate}
        onStartDateChange={onStartDateChange}
        onDueDateChange={onDueDateChange}
        onStartTimeChange={onStartTimeChange}
        onDueTimeChange={onDueTimeChange}
      />
    );
  }

  // Default full-size layout
  return (
    <StandardDateTimeFields
      startDate={startDate}
      dueDate={dueDate}
      startTime={startTime}
      dueTime={dueTime}
      showStartDate={showStartDate}
      onStartDateChange={onStartDateChange}
      onDueDateChange={onDueDateChange}
      onStartTimeChange={onStartTimeChange}
      onDueTimeChange={onDueTimeChange}
    />
  );
};
