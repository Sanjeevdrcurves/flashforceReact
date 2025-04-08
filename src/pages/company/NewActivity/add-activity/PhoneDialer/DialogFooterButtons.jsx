
import React from "react";
import { Button } from "@/components/ui/button";

const DialogFooterButtons = ({
  onCancel,
  onComplete,
  isCallActive,
  callDuration,
}) => {
  return (
    <>
      <Button variant="ghost" onClick={onCancel}>
        Cancel
      </Button>
      
      {!isCallActive && callDuration > 0 && onComplete && (
        <Button onClick={onComplete}>
          Complete & Log Call
        </Button>
      )}
    </>
  );
};

export { DialogFooterButtons };
