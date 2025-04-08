
import React from "react";
import { ScheduleTab } from "../ScheduleTab";

interface ScheduleTabContentProps {
  formState: any;
  showCalendarView: boolean;
  setShowCalendarView: (show: boolean) => void;
}

export const ScheduleTabContent: React.FC<ScheduleTabContentProps> = ({
  formState,
  showCalendarView,
  setShowCalendarView,
}) => {
  // Determine which fields to show based on activity type
  const needsStartDate = ["call", "meeting", "visit", "lunch", "service appointment"].includes(
    formState.type
  );
  
  const needsParticipants = ["meeting", "call", "service appointment"].includes(formState.type);

  return (
    <ScheduleTab 
      startDate={formState.startDate}
      dueDate={formState.dueDate}
      startTime={formState.startTime}
      dueTime={formState.dueTime}
      showStartDate={needsStartDate}
      showCalendarView={showCalendarView}
      setShowCalendarView={setShowCalendarView}
      setStartDate={formState.setStartDate}
      setDueDate={formState.setDueDate}
      setStartTime={formState.setStartTime}
      setDueTime={formState.setDueTime}
      isRecurring={formState.isRecurring || false}
      recurrencePattern={formState.recurrencePattern || "weekly"}
      recurrenceEndDate={formState.recurrenceEndDate}
      recurrenceCount={formState.recurrenceCount}
      recurrenceDays={formState.recurrenceDays || []}
      setIsRecurring={formState.setIsRecurring}
      setRecurrencePattern={formState.setRecurrencePattern}
      setRecurrenceEndDate={formState.setRecurrenceEndDate}
      setRecurrenceCount={formState.setRecurrenceCount}
      setRecurrenceDays={formState.setRecurrenceDays}
      reminders={formState.reminders || []}
      addReminder={formState.addReminder}
      removeReminder={formState.removeReminder}
      owner={formState.owner || ""}
      setOwner={formState.setOwner}
      showParticipants={needsParticipants}
      participants={formState.participants}
      addParticipant={formState.addParticipant}
      removeParticipant={formState.removeParticipant}
      updateParticipant={formState.updateParticipant}
    />
  );
};
