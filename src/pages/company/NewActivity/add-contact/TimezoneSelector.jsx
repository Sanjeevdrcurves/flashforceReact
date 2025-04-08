
import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { timezoneOptions } from "./constants";

const TimezoneSelector = ({
  timezone,
  setTimezone,
}) => {
  return (
    <div className="space-y-2 mb-6">
      <Label htmlFor="timezone">Time Zone</Label>
      <Select value={timezone} onValueChange={setTimezone}>
        <SelectTrigger id="timezone" className="bg-white">
          <SelectValue placeholder="Select time zone" />
        </SelectTrigger>
        <SelectContent className="max-h-[200px]">
          {timezoneOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimezoneSelector;
