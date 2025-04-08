
import React from "react";
import { Plus, Trash } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { phoneTypes } from "./constants";
import { PhoneEntry } from "./types";

interface PhoneEntriesProps {
  phoneEntries: PhoneEntry[];
  updatePhoneEntry: (id: string, field: keyof PhoneEntry, value: string) => void;
  addPhoneEntry: () => void;
  removePhoneEntry: (id: string) => void;
}

const PhoneEntries: React.FC<PhoneEntriesProps> = ({
  phoneEntries,
  updatePhoneEntry,
  addPhoneEntry,
  removePhoneEntry,
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <Label className="text-sm font-medium">Phone Numbers</Label>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addPhoneEntry}
          className="flex items-center text-blue-600 hover:text-blue-700"
        >
          <Plus size={14} className="mr-1" />
          Add Phone
        </Button>
      </div>
      
      <div className="space-y-3">
        {phoneEntries.map((entry) => (
          <div key={entry.id} className="flex items-center gap-2">
            <Select 
              value={entry.type} 
              onValueChange={(value) => updatePhoneEntry(entry.id, 'type', value)}
            >
              <SelectTrigger className="flex-shrink-0 w-[110px] bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {phoneTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Input 
              value={entry.number} 
              onChange={(e) => updatePhoneEntry(entry.id, 'number', e.target.value)}
              placeholder="Phone number" 
              className="flex-grow bg-white"
            />
            
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              onClick={() => removePhoneEntry(entry.id)}
              disabled={phoneEntries.length === 1}
              className="flex-shrink-0 text-gray-400 hover:text-red-500"
            >
              <Trash size={16} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhoneEntries;
