
import React from "react";
import { Clock } from "lucide-react";
import { formatDuration } from "./utils";

const CallStatus = ({
  isCallActive,
  callDuration,
}) => {
  if (!isCallActive && callDuration === 0) {
    return null;
  }

  return (
    <div className="text-center p-2 bg-green-50 border border-green-200 rounded-md">
      <div className="text-sm text-green-600 font-medium">
        {isCallActive ? "Call in progress" : "Call ended"}
      </div>
      <div className="text-xl font-mono font-bold flex items-center justify-center">
        <Clock className="mr-2 h-4 w-4" />
        {formatDuration(callDuration)}
      </div>
    </div>
  );
};

export { CallStatus };
