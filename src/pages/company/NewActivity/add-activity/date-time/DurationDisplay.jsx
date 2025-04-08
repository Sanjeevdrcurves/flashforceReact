
import React from "react";
import { Clock } from "lucide-react";

const DurationDisplay = ({ duration, compact = false }) => {
  if (!duration) return null;

  if (compact) {
    return (
      <div className="inline-flex items-center text-xs text-muted-foreground px-2 py-1 bg-muted/60 rounded-md">
        <Clock className="h-3 w-3 mr-1" />
        <span>{duration}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center text-xs text-muted-foreground">
      <Clock className="h-3.5 w-3.5 mr-1" />
      <span>Duration: {duration}</span>
    </div>
  );
};

export { DurationDisplay };
