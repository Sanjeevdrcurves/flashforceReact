
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DescriptionSectionProps {
  description: string;
  setDescription: (description: string) => void;
}

export const DescriptionSection: React.FC<DescriptionSectionProps> = ({
  description,
  setDescription,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="description" className="text-sm font-medium">Description/Notes</Label>
      <Textarea
        id="description"
        placeholder="Enter description or notes"
        value={description || ""}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        className="resize-none"
      />
    </div>
  );
};
