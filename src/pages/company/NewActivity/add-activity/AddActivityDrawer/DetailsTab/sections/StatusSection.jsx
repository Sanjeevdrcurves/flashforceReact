
import React from "react";
import { Label } from "@/components/ui/label";
import { StatusSelector } from "@/components/add-activity/StatusSelector";
import { PrioritySelector } from "@/components/add-activity/PrioritySelector";
import { AvailabilitySelector } from "@/components/add-activity/AvailabilitySelector";

const StatusSection = ({
  status,
  setStatus,
  priority,
  setPriority,
  availability,
  setAvailability,
}) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="status" className="text-sm font-medium">Status</Label>
        <StatusSelector
          value={status}
          onChange={setStatus}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="priority" className="text-sm font-medium">Priority</Label>
        <PrioritySelector
          value={priority || "medium"}
          onChange={setPriority}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="availability" className="text-sm font-medium">Availability</Label>
        <AvailabilitySelector
          value={availability || "busy"}
          onChange={setAvailability}
        />
      </div>
    </div>
  );
};

export { StatusSection };
