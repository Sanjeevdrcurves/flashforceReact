
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CalendarCheck } from "lucide-react";
import { RecurrenceSelector } from "../RecurrenceSelector";
import { ReminderSelector } from "../ReminderSelector";
import { ParticipantsList } from "../ParticipantsList";
import { CalendarView } from "../CalendarView";
import { RecurrencePattern, Reminder } from "@/types/activity";

interface ScheduleTabProps {
  startDate?: Date;
  dueDate: Date;
  startTime: string;
  dueTime: string;
  showStartDate: boolean;
  showCalendarView: boolean;
  setShowCalendarView: (show: boolean) => void;
  setStartDate: (date?: Date) => void;
  setDueDate: (date: Date) => void;
  setStartTime: (time: string) => void;
  setDueTime: (time: string) => void;
  isRecurring: boolean;
  recurrencePattern: RecurrencePattern;
  recurrenceEndDate?: Date;
  recurrenceCount?: number;
  recurrenceDays: number[];
  setIsRecurring: (isRecurring: boolean) => void;
  setRecurrencePattern: (pattern: RecurrencePattern) => void;
  setRecurrenceEndDate: (date?: Date) => void;
  setRecurrenceCount: (count?: number) => void;
  setRecurrenceDays: (days: number[]) => void;
  reminders: Reminder[];
  addReminder: (time: number, type: "email" | "notification" | "sms") => void;
  removeReminder: (id: string) => void;
  owner: string;
  setOwner: (owner: string) => void;
  showParticipants: boolean;
  participants: Array<{
    id: string;
    name: string;
    email: string;
    external: boolean;
  }>;
  addParticipant: () => void;
  removeParticipant: (id: string) => void;
  updateParticipant: (id: string, field: string, value: any) => void;
}

export const ScheduleTab: React.FC<ScheduleTabProps> = ({
  startDate,
  dueDate,
  startTime,
  dueTime,
  showStartDate,
  showCalendarView,
  setShowCalendarView,
  setStartDate,
  setDueDate,
  setStartTime,
  setDueTime,
  isRecurring,
  recurrencePattern,
  recurrenceEndDate,
  recurrenceCount,
  recurrenceDays,
  setIsRecurring,
  setRecurrencePattern,
  setRecurrenceEndDate,
  setRecurrenceCount,
  setRecurrenceDays,
  reminders,
  addReminder,
  removeReminder,
  owner,
  setOwner,
  showParticipants,
  participants,
  addParticipant,
  removeParticipant,
  updateParticipant,
}) => {
  return (
    <div className="space-y-6">
      {/* Calendar View */}
      {showCalendarView && (
        <div className="bg-muted/30 rounded-md p-4 border border-muted">
          <CalendarView 
            activities={[]}
            selectedDate={dueDate}
            onSelectDate={setDueDate}
            onSelectTime={(time) => {
              if (showStartDate) {
                setStartTime(time);
                setDueTime(time);
              } else {
                setDueTime(time);
              }
            }}
          />
        </div>
      )}
      
      <Separator className="my-4" />
      
      {/* Detailed Recurrence Settings */}
      <div>
        <h3 className="text-sm font-medium mb-3">Advanced Recurrence Settings</h3>
        <RecurrenceSelector 
          isRecurring={isRecurring || false}
          recurrencePattern={recurrencePattern || "weekly"}
          recurrenceEndDate={recurrenceEndDate}
          recurrenceCount={recurrenceCount}
          recurrenceDays={recurrenceDays || []}
          onIsRecurringChange={setIsRecurring}
          onPatternChange={setRecurrencePattern}
          onEndDateChange={setRecurrenceEndDate}
          onCountChange={setRecurrenceCount}
          onDaysChange={setRecurrenceDays}
        />
      </div>
      
      <Separator className="my-4" />
      
      {/* Detailed Reminders */}
      <div>
        <h3 className="text-sm font-medium mb-3">Reminders</h3>
        <ReminderSelector 
          reminders={reminders || []}
          onAdd={addReminder}
          onRemove={removeReminder}
        />
      </div>
      
      <Separator className="my-4" />
      
      {/* Owner (User) */}
      <div className="space-y-2">
        <Label htmlFor="owner" className="text-sm font-medium">Owner</Label>
        <Input
          id="owner"
          placeholder="Activity owner"
          value={owner || ""}
          onChange={(e) => setOwner(e.target.value)}
          className="h-9"
        />
      </div>
      
      {/* Participants (conditional) */}
      {showParticipants && (
        <>
          <Separator className="my-4" />
          <ParticipantsList
            participants={participants}
            onAdd={addParticipant}
            onRemove={removeParticipant}
            onUpdate={updateParticipant}
          />
        </>
      )}
    </div>
  );
};
