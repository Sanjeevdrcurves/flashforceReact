
import React from "react";
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

const DrawerHeader = () => {
  return (
    <SheetHeader className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
      <SheetTitle className="text-xl font-semibold text-slate-800">Add Contact</SheetTitle>
      <SheetDescription>
        Create a new contact in your database
      </SheetDescription>
    </SheetHeader>
  );
};

export default DrawerHeader;
