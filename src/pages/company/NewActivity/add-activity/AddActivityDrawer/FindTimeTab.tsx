
import React, { useState } from "react";
import { format, addDays } from "date-fns";
import { ChevronLeft, ChevronRight, Clock, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarView } from "../CalendarView";
import { TimeInput } from "../date-time/TimeInput";

interface FindTimeTabProps {
  startDate?: Date;
  dueDate: Date;
  startTime: string;
  dueTime: string;
  setStartDate: (date?: Date) => void;
  setDueDate: (date: Date) => void;
  setStartTime: (time: string) => void;
  setDueTime: (time: string) => void;
  activities: any[];
}

export const FindTimeTab: React.FC<FindTimeTabProps> = ({
  startDate,
  dueDate,
  startTime,
  dueTime,
  setStartDate,
  setDueDate,
  setStartTime,
  setDueTime,
  activities = []
}) => {
  const [selectedDate, setSelectedDate] = useState(dueDate);
  const [viewMode, setViewMode] = useState<"day" | "week">("day");

  // Suggested times based on calendar availability
  const suggestedTimes = [
    { start: "09:00", end: "10:00" },
    { start: "11:00", end: "12:00" },
    { start: "14:00", end: "15:00" },
    { start: "16:00", end: "17:00" }
  ];

  const handleSelectSuggestedTime = (start: string, end: string) => {
    setStartTime(start);
    setDueTime(end);
  };

  const handlePrevDay = () => {
    setSelectedDate(prev => addDays(prev, -1));
  };

  const handleNextDay = () => {
    setSelectedDate(prev => addDays(prev, 1));
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setDueDate(date);
    if (startDate) {
      setStartDate(date);
    }
  };

  return (
    <div className="space-y-6">
      {/* Date Navigation */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={handlePrevDay} className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 px-3 flex items-center gap-2"
            onClick={() => setSelectedDate(new Date())}
          >
            <CalendarDays className="h-4 w-4" />
            <span>Today</span>
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextDay} className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium px-2">
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "day" ? "default" : "outline"}
            size="sm"
            className="h-8"
            onClick={() => setViewMode("day")}
          >
            Day
          </Button>
          <Button
            variant={viewMode === "week" ? "default" : "outline"}
            size="sm"
            className="h-8"
            onClick={() => setViewMode("week")}
          >
            Week
          </Button>
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-muted/30 rounded-md p-4 border border-muted">
        <CalendarView
          activities={activities}
          selectedDate={selectedDate}
          onSelectDate={handleSelectDate}
          onSelectTime={(time) => {
            setStartTime(time);
            setDueTime(time);
          }}
        />
      </div>

      {/* Time Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Time Range</h3>
          <div className="flex items-center space-x-2">
            <TimeInput
              value={startTime}
              onChange={setStartTime}
              className="w-24 h-8 text-xs"
              placeholder="Start"
            />
            <span className="text-sm text-muted-foreground">to</span>
            <TimeInput
              value={dueTime}
              onChange={setDueTime}
              className="w-24 h-8 text-xs"
              placeholder="End"
            />
          </div>
        </div>
      </div>

      {/* Suggested Times */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium flex items-center gap-1">
          <Clock className="h-4 w-4" />
          Suggested Times
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {suggestedTimes.map(({ start, end }) => (
            <Button
              key={`${start}-${end}`}
              variant="outline"
              className={cn(
                "justify-start text-left h-10 px-3",
                startTime === start && dueTime === end && "border-primary bg-primary/10"
              )}
              onClick={() => handleSelectSuggestedTime(start, end)}
            >
              <div>
                <span className="font-medium">{start}</span>
                <span className="text-muted-foreground mx-1">-</span>
                <span className="font-medium">{end}</span>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
