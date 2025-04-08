
import React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const DateButton = ({
  date,
  onSelect,
  className,
  label = "Pick a date",
  dateFormat = "MMM d, yyyy",
  buttonSize = "sm"
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size={buttonSize}
          className={cn(
            buttonSize === "sm" ? "w-full justify-between text-xs h-9" : "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          {date ? format(date, dateFormat) : <span>{label}</span>}
          <CalendarIcon className={buttonSize === "sm" ? "h-3.5 w-3.5 opacity-70" : "h-4 w-4 opacity-70"} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onSelect}
          initialFocus
          className="p-3 pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
};

export { DateButton };
