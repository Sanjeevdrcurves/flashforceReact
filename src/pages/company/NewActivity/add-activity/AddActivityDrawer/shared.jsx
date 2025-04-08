import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SheetTitle } from "@/components/ui/sheet";
import { PhoneDialer } from "../PhoneDialer";

export const DrawerHeader = () => {
  return (
    <div className="flex items-center justify-between w-full">
      <SheetTitle className="text-lg font-semibold">Add Activity</SheetTitle>
      <PhoneDialer isImmediate={true} />
    </div>
  );
};

export const DrawerFooterButtons = ({ onClose, onSave }) => {
  return (
    <div className="flex justify-end w-full gap-2">
      <Button
        variant="outline"
        className="flex items-center"
        onClick={onClose}
      >
        <X className="mr-1 h-4 w-4" />
        Cancel
      </Button>
      <Button onClick={onSave}>Save Activity</Button>
    </div>
  );
};
