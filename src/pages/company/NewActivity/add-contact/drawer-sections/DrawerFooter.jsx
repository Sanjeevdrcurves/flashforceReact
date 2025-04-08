
import React from "react";
import { Button } from "@/components/ui/button";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";

const DrawerFooter = ({ onSave }) => {
  return (
    <SheetFooter className="p-6 border-t border-slate-200 bg-slate-50">
      <div className="flex justify-between w-full">
        <SheetClose asChild>
          <Button variant="outline">Cancel</Button>
        </SheetClose>
        <Button 
          onClick={onSave}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Save Contact
        </Button>
      </div>
    </SheetFooter>
  );
};

export default DrawerFooter;
