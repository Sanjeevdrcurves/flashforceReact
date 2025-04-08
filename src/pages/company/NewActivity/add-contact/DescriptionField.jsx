
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const DescriptionField = ({
  description,
  setDescription,
}) => {
  return (
    <div className="space-y-2 mb-6">
      <Label htmlFor="description">Description</Label>
      <Textarea 
        id="description" 
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Add notes about this contact..."
        className="min-h-[100px] bg-white"
      />
    </div>
  );
};

export default DescriptionField;
