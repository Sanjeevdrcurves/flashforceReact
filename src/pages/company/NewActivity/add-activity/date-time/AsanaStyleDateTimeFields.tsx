
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Calendar as CalendarIcon, X, ChevronLeft, ChevronRight } from "lucide-react";
import { DateButton } from "./DateButton";
import { TimeInput } from "./TimeInput";
import { DurationDisplay } from "./DurationDisplay";
import { Calendar } from "@/components/ui/calendar";
import { format, addMonths, subMonths } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface AsanaStyleDateTimeFieldsProps {
  startDate?: Date;
  dueDate: Date;
  startTime: string;
  dueTime: string;
  showStartDate: boolean;
  onStartDateChange: (date?: Date) => void;
  onDueDateChange: (date: Date) => void;
  onStartTimeChange: (time: string) => void;
  onDueTimeChange: (time: string) => void;
  duration: string | null;
  onToggleCalendar?: () => void;
  showCalendar?: boolean;
  isRecurring?: boolean;
  setIsRecurring?: (value: boolean) => void;
  recurrenceDays?: number[];
  setRecurrenceDays?: (days: number[]) => void;
  recurrencePattern?: string;
  setRecurrencePattern?: (pattern: string) => void;
}

export const AsanaStyleDateTimeFields: React.FC<AsanaStyleDateTimeFieldsProps> = ({
  startDate,
  dueDate,
  startTime,
  dueTime,
  showStartDate,
  onStartDateChange,
  onDueDateChange,
  onStartTimeChange,
  onDueTimeChange,
  duration,
  onToggleCalendar,
  showCalendar,
  isRecurring = false,
  setIsRecurring = () => {},
  recurrenceDays = [],
  setRecurrenceDays = () => {},
  recurrencePattern = "weekly",
  setRecurrencePattern = () => {},
}) => {
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [datePickerType, setDatePickerType] = useState<'start' | 'due'>('due');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [nextMonth, setNextMonth] = useState(addMonths(new Date(), 1));
  const [showRecurrenceOptions, setShowRecurrenceOptions] = useState(false);

  const handleDateSelect = (date: Date) => {
    if (datePickerType === 'start') {
      onStartDateChange(date);
    } else {
      onDueDateChange(date);
    }
    setDatePickerVisible(false);
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
    setNextMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
    setNextMonth(prev => addMonths(prev, 1));
  };

  const toggleDaySelection = (day: number) => {
    if (recurrenceDays.includes(day)) {
      setRecurrenceDays(recurrenceDays.filter(d => d !== day));
    } else {
      setRecurrenceDays([...recurrenceDays, day]);
    }
  };

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Schedule</span>
        </div>
        {onToggleCalendar && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onToggleCalendar}
            className="h-8 text-xs"
          >
            {showCalendar ? "Hide Calendar" : "Show Calendar"}
            <CalendarIcon className="ml-1 h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Date Selection Area */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Start Date */}
          {showStartDate && (
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="w-full h-auto px-3 py-2 text-sm flex items-center justify-between"
                onClick={() => {
                  setDatePickerType('start');
                  setDatePickerVisible(!datePickerVisible && datePickerType === 'start');
                }}
              >
                <div className="flex flex-col items-start">
                  <span className="text-xs text-muted-foreground">Start date</span>
                  <span className="font-medium">{startDate ? format(startDate, "MM/dd/yy") : "Select date"}</span>
                </div>
                {startDate && (
                  <X 
                    className="h-4 w-4 text-muted-foreground hover:text-foreground" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartDateChange(undefined);
                    }}
                  />
                )}
              </Button>
            </div>
          )}

          {/* Start Time */}
          {showStartDate && (
            <div className="w-full sm:w-32">
              <div className="text-xs text-muted-foreground mb-1">Start time</div>
              <TimeInput
                value={startTime}
                onChange={onStartTimeChange}
                placeholder="--:--"
                className="w-full h-10"
              />
            </div>
          )}

          {/* Due Date */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="w-full h-auto px-3 py-2 text-sm flex items-center justify-between"
              onClick={() => {
                setDatePickerType('due');
                setDatePickerVisible(!datePickerVisible && datePickerType === 'due');
              }}
            >
              <div className="flex flex-col items-start">
                <span className="text-xs text-muted-foreground">Due date</span>
                <span className="font-medium">{format(dueDate, "MM/dd/yy")}</span>
              </div>
              <X 
                className="h-4 w-4 text-muted-foreground hover:text-foreground" 
                onClick={(e) => {
                  e.stopPropagation();
                  // Don't allow clearing the due date completely, set to today instead
                  onDueDateChange(new Date());
                }}
              />
            </Button>
          </div>

          {/* Due Time */}
          <div className="w-full sm:w-32">
            <div className="text-xs text-muted-foreground mb-1">Due time</div>
            <TimeInput
              value={dueTime}
              onChange={onDueTimeChange}
              placeholder="--:--"
              className="w-full h-10"
            />
          </div>
        </div>

        {/* Calendar Popover */}
        {datePickerVisible && (
          <div className="relative z-50">
            <div className="fixed inset-0" onClick={() => setDatePickerVisible(false)} />
            <div className="absolute top-0 left-0 z-50 mt-2 bg-background border rounded-md shadow-lg">
              {/* Calendar Header */}
              <div className="p-3 border-b">
                <div className="flex items-center justify-between mb-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handlePreviousMonth}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 text-center grid grid-cols-2 gap-4">
                    <h3 className="font-medium">{format(currentMonth, "MMMM yyyy")}</h3>
                    <h3 className="font-medium">{format(nextMonth, "MMMM yyyy")}</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleNextMonth}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Two-month calendar view */}
                <div className="grid grid-cols-2 gap-4">
                  <Calendar
                    mode="single"
                    selected={datePickerType === 'start' ? startDate : dueDate}
                    onSelect={(date) => date && handleDateSelect(date)}
                    month={currentMonth}
                    onMonthChange={setCurrentMonth}
                    className="w-full p-0 pointer-events-auto"
                    showOutsideDays={false}
                  />
                  <Calendar
                    mode="single"
                    selected={datePickerType === 'start' ? startDate : dueDate}
                    onSelect={(date) => date && handleDateSelect(date)}
                    month={nextMonth}
                    onMonthChange={setNextMonth}
                    className="w-full p-0 pointer-events-auto"
                    showOutsideDays={false}
                  />
                </div>
              </div>
              
              {/* Recurrence Options */}
              <div className="p-3 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={isRecurring}
                      onCheckedChange={setIsRecurring}
                      id="recurring-toggle"
                    />
                    <Label htmlFor="recurring-toggle" className="cursor-pointer">Repeats</Label>
                  </div>
                  
                  {isRecurring && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowRecurrenceOptions(!showRecurrenceOptions)}
                    >
                      {recurrencePattern.charAt(0).toUpperCase() + recurrencePattern.slice(1)}
                    </Button>
                  )}
                </div>
                
                {isRecurring && showRecurrenceOptions && (
                  <div className="mt-3 space-y-3">
                    <Select
                      value={recurrencePattern}
                      onValueChange={setRecurrencePattern}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {recurrencePattern === 'weekly' && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium">On these days</div>
                        <div className="flex justify-between">
                          {weekDays.map((day, index) => (
                            <div key={index} className="flex flex-col items-center">
                              <Checkbox
                                id={`day-${index}`}
                                checked={recurrenceDays.includes(index)}
                                onCheckedChange={() => toggleDaySelection(index)}
                                className="h-6 w-6 rounded-full"
                              />
                              <label htmlFor={`day-${index}`} className="text-xs mt-1">{day}</label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Footer Actions */}
              <div className="p-3 border-t flex justify-end space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setDatePickerVisible(false)}
                >
                  Clear
                </Button>
                <Button 
                  onClick={() => setDatePickerVisible(false)}
                  size="sm"
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Duration Display */}
        <DurationDisplay duration={duration} />
      </div>
    </div>
  );
};
