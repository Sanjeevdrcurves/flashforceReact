
import React from "react";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ScheduledCallInfo = ({
  isScheduled,
  scheduledDate,
  scheduledTime,
  participants,
  isCallActive,
}) => {
  if (!isScheduled || isCallActive) {
    return null;
  }

  return (
    <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
      <div className="flex items-center gap-2 text-blue-800 font-medium mb-2">
        <Calendar className="h-4 w-4" />
        <span>Scheduled for: {scheduledDate} at {scheduledTime}</span>
      </div>
      
      {participants && participants.length > 0 && (
        <div className="mt-2">
          <p className="text-sm text-gray-600 mb-1">Participants:</p>
          <div className="flex flex-wrap gap-1">
            {participants.map((participant, index) => (
              <Badge key={index} variant="outline" className="bg-blue-50">
                {participant.name}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export { ScheduledCallInfo };
