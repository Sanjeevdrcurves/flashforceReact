
import React from "react";
import { Plus, Trash } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UrlEntriesProps {
  urls: string[];
  updateUrlEntry: (index: number, value: string) => void;
  addUrlEntry: () => void;
  removeUrlEntry: (index: number) => void;
}

const UrlEntries: React.FC<UrlEntriesProps> = ({
  urls,
  updateUrlEntry,
  addUrlEntry,
  removeUrlEntry,
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <Label className="text-sm font-medium">URLs</Label>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addUrlEntry}
          className="flex items-center text-blue-600 hover:text-blue-700"
        >
          <Plus size={14} className="mr-1" />
          Add URL
        </Button>
      </div>
      
      {urls.length > 0 ? (
        <div className="space-y-3">
          {urls.map((url, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input 
                value={url} 
                onChange={(e) => updateUrlEntry(index, e.target.value)}
                placeholder="https://example.com" 
                className="flex-grow bg-white"
              />
              
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={() => removeUrlEntry(index)}
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
            No URLs added yet
          </p>
        </div>
      )}
    </div>
  );
};

export default UrlEntries;
