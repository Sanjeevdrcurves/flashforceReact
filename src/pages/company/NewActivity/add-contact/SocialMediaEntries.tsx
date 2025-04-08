
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
import { socialMediaOptions } from "./constants";
import { SocialMediaEntry } from "./types";

interface SocialMediaEntriesProps {
  socialMediaEntries: SocialMediaEntry[];
  updateSocialMediaEntry: (id: string, field: keyof SocialMediaEntry, value: string) => void;
  addSocialMediaEntry: () => void;
  removeSocialMediaEntry: (id: string) => void;
}

const SocialMediaEntries: React.FC<SocialMediaEntriesProps> = ({
  socialMediaEntries,
  updateSocialMediaEntry,
  addSocialMediaEntry,
  removeSocialMediaEntry,
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <Label className="text-sm font-medium">Social Media Profiles</Label>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addSocialMediaEntry}
          className="flex items-center text-blue-600 hover:text-blue-700"
        >
          <Plus size={14} className="mr-1" />
          Add Profile
        </Button>
      </div>
      
      {socialMediaEntries.length > 0 ? (
        <div className="space-y-3">
          {socialMediaEntries.map((entry) => (
            <div key={entry.id} className="flex items-center gap-2">
              <Select 
                value={entry.platform} 
                onValueChange={(value) => updateSocialMediaEntry(entry.id, 'platform', value)}
              >
                <SelectTrigger className="flex-shrink-0 w-[140px] bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {socialMediaOptions.map((platform) => (
                    <SelectItem key={platform.value} value={platform.value}>
                      {platform.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Input 
                value={entry.handle} 
                onChange={(e) => updateSocialMediaEntry(entry.id, 'handle', e.target.value)}
                placeholder="Username or URL" 
                className="flex-grow bg-white"
              />
              
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={() => removeSocialMediaEntry(entry.id)}
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
            No social media profiles added yet
          </p>
        </div>
      )}
    </div>
  );
};

export default SocialMediaEntries;
