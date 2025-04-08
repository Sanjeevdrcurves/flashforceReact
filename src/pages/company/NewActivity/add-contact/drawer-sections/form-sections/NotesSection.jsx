
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const NotesSection = ({
  notes,
  setNotes,
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-semibold text-slate-700 mb-4 pb-2 border-b">Notes</h3>
      
      <div className="space-y-2 mb-4">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea 
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any additional notes about this contact..."
          className="min-h-[120px] bg-white"
        />
      </div>
    </div>
  );
};

export default NotesSection;
