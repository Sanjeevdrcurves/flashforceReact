
import React from "react";
import { Label } from "@/components/ui/label";
import { DateButton } from "./DateButton";
import { TimeInput } from "./TimeInput";

interface StandardDateTimeFieldsProps {
  startDate?: Date;
  dueDate: Date;
  startTime: string;
  dueTime: string;
  showStartDate: boolean;
  onStartDateChange: (date?: Date) => void;
  onDueDateChange: (date: Date) => void;
  onStartTimeChange: (time: string) => void;
  onDueTimeChange: (time: string) => void;
}

export const StandardDateTimeFields: React.FC<StandardDateTimeFieldsProps> = ({
  startDate,
  dueDate,
  startTime,
  dueTime,
  showStartDate,
  onStartDateChange,
  onDueDateChange,
  onStartTimeChange,
  onDueTimeChange,
}) => {
  return (
    <div className="space-y-4">
      {showStartDate && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <DateButton
              date={startDate}
              onSelect={onStartDateChange}
              buttonSize="default"
              dateFormat="PPP"
              label="Pick a date"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <TimeInput
              value={startTime}
              onChange={onStartTimeChange}
              className="h-10"
              placeholder="Start time"
            />
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <DateButton
            date={dueDate}
            onSelect={(date) => date && onDueDateChange(date)}
            buttonSize="default"
            dateFormat="PPP"
            label="Pick a date"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dueTime">Due Time</Label>
          <TimeInput
            value={dueTime}
            onChange={onDueTimeChange}
            className="h-10"
            placeholder="Due time"
          />
        </div>
      </div>
    </div>
  );
};
