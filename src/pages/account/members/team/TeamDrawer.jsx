import React, { useState } from "react";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";

const TeamDrawer = ({ team, onSave, onClose }) => {
  const [formState, setFormState] = useState(team || {});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  return (
    <SheetContent className="w-full sm:max-w-lg">
      <SheetHeader className="mb-6">
        <SheetTitle>{formState?.id ? "Edit Team" : "Create Team"}</SheetTitle>
      </SheetHeader>

      {/* Form Inputs */}
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Team Name</label>
          <Input
            name="name"
            value={formState?.name || ""}
            onChange={handleInputChange}
            placeholder="Enter team name"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Team Type</label>
          <Input
            name="type"
            value={formState?.type || ""}
            onChange={handleInputChange}
            placeholder="E.g., Marketing, Sales"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <Textarea
            name="description"
            value={formState?.description || ""}
            onChange={handleInputChange}
            placeholder="Describe the team"
            rows={3}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              name="email"
              value={formState?.email || ""}
              onChange={handleInputChange}
              placeholder="team@example.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Phone</label>
            <Input
              type="tel"
              name="phone"
              value={formState?.phone || ""}
              onChange={handleInputChange}
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={() => onSave(formState)} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Team
        </Button>
      </div>
    </SheetContent>
  );
};

export default TeamDrawer;
