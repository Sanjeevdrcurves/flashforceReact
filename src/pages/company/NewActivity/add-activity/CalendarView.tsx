
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { format, setHours, setMinutes, addDays, parseISO, isSameDay } from 'date-fns';
import { Activity } from '@/types/activity';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon } from 'lucide-react';

interface CalendarViewProps {
  activities: Activity[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onSelectTime: (time: string) => void;
}

// Time slots for the day view (30-minute increments)
const timeSlots = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? '00' : '30';
  const formattedHour = hour.toString().padStart(2, '0');
  return `${formattedHour}:${minute}`;
});

export const CalendarView: React.FC<CalendarViewProps> = ({
  activities = [],
  selectedDate,
  onSelectDate,
  onSelectTime,
}) => {
  const [view, setView] = useState<'month' | 'day'>('month');
  const [currentDate, setCurrentDate] = useState<Date>(selectedDate);
  
  // Update when selectedDate changes externally
  useEffect(() => {
    setCurrentDate(selectedDate);
  }, [selectedDate]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onSelectDate(date);
      setCurrentDate(date);
      setView('day');
    }
  };

  const handleTimeSelect = (time: string) => {
    onSelectTime(time);
  };

  // Filter activities for the selected day
  const dayActivities = activities.filter(activity => {
    const activityDate = activity.startDate || activity.dueDate;
    return isSameDay(activityDate, selectedDate);
  });

  // Navigate between days
  const navigateDay = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    onSelectDate(newDate);
    setCurrentDate(newDate);
  };

  // Generate activity markers for the calendar
  const getDayActivityCount = (day: Date) => {
    return activities.filter(activity => {
      const activityDate = activity.startDate || activity.dueDate;
      return isSameDay(activityDate, day);
    }).length;
  };

  return (
    <div className="space-y-4">
      {view === 'month' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <Button variant="ghost" size="sm" className="text-sm font-medium">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Select date & view schedule
            </Button>
          </div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="p-0 pointer-events-auto border rounded-md"
            classNames={{
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground",
              head_cell: "text-muted-foreground rounded-md w-9 font-normal text-xs",
              cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              nav_button: "h-7 w-7 bg-transparent p-0 opacity-90 hover:opacity-100"
            }}
            components={{
              DayContent: (props) => {
                const activityCount = getDayActivityCount(props.date);
                return (
                  <div className="flex flex-col items-center justify-center">
                    <div>{props.date.getDate()}</div>
                    {activityCount > 0 && (
                      <div className="h-1 w-1 rounded-full bg-primary mt-0.5"></div>
                    )}
                  </div>
                );
              }
            }}
          />
        </div>
      )}

      {view === 'day' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="icon" onClick={() => navigateDay('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setView('month')}
              className="font-medium"
            >
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </Button>
            <Button variant="outline" size="icon" onClick={() => navigateDay('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="border rounded-md h-[300px] overflow-y-auto">
            <div className="relative h-full">
              {/* Time slots */}
              <div className="p-1 overflow-y-auto">
                {timeSlots.filter((_, i) => i % 2 === 0).map((time, index) => (
                  <div 
                    key={time} 
                    className={cn(
                      "flex items-start py-2 relative cursor-pointer hover:bg-muted/50 group",
                      index % 2 === 0 ? "bg-white" : "bg-muted/20"
                    )}
                    onClick={() => handleTimeSelect(time)}
                  >
                    <div className="w-14 text-xs text-muted-foreground font-medium px-2">
                      {time}
                    </div>
                    <div className="flex-1 min-h-[30px] relative">
                      {dayActivities.filter(a => {
                        const activityTime = a.startTime || a.dueTime || '';
                        return activityTime.startsWith(time.split(':')[0]);
                      }).map(activity => (
                        <div 
                          key={activity.id}
                          className={cn(
                            "absolute left-0 right-2 rounded px-2 py-1 text-xs shadow-sm border opacity-90",
                            activity.type === 'meeting' ? "bg-blue-50 border-blue-200 text-blue-700" :
                            activity.type === 'call' ? "bg-green-50 border-green-200 text-green-700" :
                            activity.type === 'task' ? "bg-purple-50 border-purple-200 text-purple-700" :
                            "bg-gray-50 border-gray-200 text-gray-700"
                          )}
                          style={{
                            top: `${(parseInt((activity.startTime || '00:00').split(':')[1] || '0') / 60) * 100}%`,
                            height: '28px'
                          }}
                        >
                          <div className="font-medium truncate">{activity.title}</div>
                        </div>
                      ))}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                      <Button 
                        size="sm" 
                        variant="secondary"
                        className="pointer-events-auto shadow-md" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTimeSelect(time);
                        }}
                      >
                        <Clock className="mr-1 h-3.5 w-3.5" />
                        Select {time}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium">Select a specific time:</span>
            </div>
            <Select 
              value={format(selectedDate, 'HH:mm')}
              onValueChange={handleTimeSelect}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
};
