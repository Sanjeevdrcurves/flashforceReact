
import React from "react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export const TimeInput: React.FC<TimeInputProps> = ({
  value,
  onChange,
  className = "w-24 h-9 text-xs",
  placeholder = "Time"
}) => {
  // Generate time options in 15-minute increments for more precision
  const timeOptions = Array.from({ length: 96 }, (_, i) => {
    const hour = Math.floor(i / 4);
    const minute = (i % 4) * 15;
    const formattedHour = hour.toString().padStart(2, '0');
    const formattedMinute = minute.toString().padStart(2, '0');
    return `${formattedHour}:${formattedMinute}`;
  });

  // Generate common time presets
  const commonTimes = ['08:00', '09:00', '12:00', '13:00', '15:00', '17:00', '18:00'];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            type="text"
            value={value}
            readOnly
            className={cn(className, "cursor-pointer")}
            placeholder={placeholder}
          />
          <Clock className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0" align="start">
        <div className="max-h-[300px] overflow-y-auto py-1">
          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            Common times
          </div>
          <div className="grid grid-cols-2 gap-1 p-1">
            {commonTimes.map(time => (
              <Button
                key={time}
                variant="ghost"
                size="sm"
                onClick={() => onChange(time)}
                className={cn(
                  "justify-start text-xs h-8",
                  value === time && "bg-muted"
                )}
              >
                {time}
              </Button>
            ))}
          </div>
          
          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            All times
          </div>
          <div className="grid grid-cols-2 gap-1 p-1">
            {timeOptions.map(time => (
              <Button
                key={time}
                variant="ghost"
                size="sm"
                onClick={() => onChange(time)}
                className={cn(
                  "justify-start text-xs h-8",
                  value === time && "bg-muted"
                )}
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
