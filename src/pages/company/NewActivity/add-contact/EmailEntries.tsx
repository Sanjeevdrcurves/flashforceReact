
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
import { emailTypes } from "./constants";
import { EmailEntry } from "./types";

interface EmailEntriesProps {
  emailEntries: EmailEntry[];
  updateEmailEntry: (id: string, field: keyof EmailEntry, value: string) => void;
  addEmailEntry: () => void;
  removeEmailEntry: (id: string) => void;
}

const EmailEntries: React.FC<EmailEntriesProps> = ({
  emailEntries,
  updateEmailEntry,
  addEmailEntry,
  removeEmailEntry,
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <Label className="text-sm font-medium">Email Addresses</Label>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addEmailEntry}
          className="flex items-center text-blue-600 hover:text-blue-700"
        >
          <Plus size={14} className="mr-1" />
          Add Email
        </Button>
      </div>
      
      <div className="space-y-3">
        {emailEntries.map((entry) => (
          <div key={entry.id} className="flex items-center gap-2">
            <Select 
              value={entry.type} 
              onValueChange={(value) => updateEmailEntry(entry.id, 'type', value)}
            >
              <SelectTrigger className="flex-shrink-0 w-[110px] bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {emailTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Input 
              value={entry.email} 
              onChange={(e) => updateEmailEntry(entry.id, 'email', e.target.value)}
              placeholder="Email address" 
              type="email" 
              className="flex-grow bg-white"
            />
            
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              onClick={() => removeEmailEntry(entry.id)}
              disabled={emailEntries.length === 1}
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

export default EmailEntries;
