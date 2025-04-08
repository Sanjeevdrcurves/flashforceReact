
import React from "react";
import { DateButton } from "./DateButton";
import { TimeInput } from "./TimeInput";

interface CondensedDateTimeFieldsProps {
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

export const CondensedDateTimeFields: React.FC<CondensedDateTimeFieldsProps> = ({
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
    <div className="grid grid-cols-2 gap-3">
      {showStartDate && (
        <>
          <div className="space-y-1">
            <DateButton
              date={startDate}
              onSelect={onStartDateChange}
            />
          </div>
          <div className="space-y-1">
            <TimeInput
              value={startTime}
              onChange={onStartTimeChange}
              placeholder="Start time"
            />
          </div>
        </>
      )}
      
      <div className="space-y-1">
        <DateButton
          date={dueDate}
          onSelect={(date) => date && onDueDateChange(date)}
        />
      </div>
      <div className="space-y-1">
        <TimeInput
          value={dueTime}
          onChange={onDueTimeChange}
          placeholder="Due time"
        />
      </div>
    </div>
  );
};
