
import React from "react";
import { Plus, Trash } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LabelEntry } from "./types";

interface LabelEntriesProps {
  labels: LabelEntry[];
  updateLabel: (id: string, name: string) => void;
  addLabel: () => void;
  removeLabel: (id: string) => void;
}

const LabelEntries: React.FC<LabelEntriesProps> = ({
  labels,
  updateLabel,
  addLabel,
  removeLabel,
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <Label className="text-sm font-medium">Labels</Label>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addLabel}
          className="flex items-center text-blue-600 hover:text-blue-700"
        >
          <Plus size={14} className="mr-1" />
          Add Label
        </Button>
      </div>
      
      {labels.length > 0 ? (
        <div className="space-y-3">
          {labels.map((label) => (
            <div key={label.id} className="flex items-center gap-2">
              <Input 
                value={label.name} 
                onChange={(e) => updateLabel(label.id, e.target.value)}
                placeholder="Label name" 
                className="flex-grow bg-white"
              />
              
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={() => removeLabel(label.id)}
                className="flex-shrink-0 text-gray-400 hover:text-red-500"
              >
                <Trash size={16} />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center p-4 border border-dashed border-gray-300 rounded-md bg-gray-50">
          <p className="text-sm text-gray-500">
            No labels added yet
          </p>
        </div>
      )}
    </div>
  );
};

export default LabelEntries;
