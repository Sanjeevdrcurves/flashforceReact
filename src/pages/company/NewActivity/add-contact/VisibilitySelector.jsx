
import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { visibilityOptions } from "./constants";

const VisibilitySelector = ({
  visibility,
  setVisibility,
}) => {
  return (
    <div className="space-y-2 mb-6">
      <Label htmlFor="visibility">Visible To</Label>
      <Select value={visibility} onValueChange={setVisibility}>
        <SelectTrigger id="visibility" className="bg-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {visibilityOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default VisibilitySelector;
