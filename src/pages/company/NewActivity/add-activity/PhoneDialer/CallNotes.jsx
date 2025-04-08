
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const CallNotes = ({
  isCallActive,
  callDuration,
  callNotes,
  setCallNotes,
  isScheduled,
  markAsCompleted,
  setMarkAsCompleted,
}) => {
  if (isCallActive || callDuration === 0) {
    return null;
  }

  return (
    <div className="space-y-2 pt-2">
      <label className="text-sm font-medium">Call Notes</label>
      <Textarea
        rows={3}
        className="w-full border rounded-md p-2"
        placeholder="Enter notes about the call"
        value={callNotes}
        onChange={(e) => setCallNotes(e.target.value)}
      />
      
      {isScheduled && setMarkAsCompleted && (
        <div className="flex items-center space-x-2 mt-2">
          <Checkbox
            id="markAsCompleted"
            checked={markAsCompleted}
            onCheckedChange={(checked) => setMarkAsCompleted(!!checked)}
          />
          <Label htmlFor="markAsCompleted" className="text-sm">
            Mark scheduled activity as completed
          </Label>
        </div>
      )}
    </div>
  );
};

export { CallNotes };
