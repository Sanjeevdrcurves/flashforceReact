
import React, { useState } from "react";
import { Settings } from "lucide-react";
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
import { contactTypeOptions } from "./constants";
import { ContactTypeOption } from "./types";

interface ContactTypeSelectorProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
  isAdmin?: boolean;
}

const ContactTypeSelector: React.FC<ContactTypeSelectorProps> = ({
  selectedType,
  onTypeChange,
  isAdmin = false,
}) => {
  const [showCustomTypeForm, setShowCustomTypeForm] = useState(false);
  const [customTypeName, setCustomTypeName] = useState("");

  const handleTypeChange = (value: string) => {
    if (value === "custom" && isAdmin) {
      setShowCustomTypeForm(true);
    } else {
      onTypeChange(value);
      setShowCustomTypeForm(false);
    }
  };

  const handleSaveCustomType = () => {
    if (customTypeName.trim()) {
      // In a real application, this would save the custom type to the database
      console.log("Custom type created:", customTypeName);
      setShowCustomTypeForm(false);
      // You could add the new type to contactTypeOptions here
    }
  };

  // Render custom type form
  const renderCustomTypeForm = () => {
    if (!showCustomTypeForm) return null;

    return (
      <div className="p-4 border border-slate-200 rounded-md mb-6 bg-slate-50">
        <h3 className="text-sm font-medium mb-3">Create Custom Contact Type</h3>
        <div className="space-y-2 mb-4">
          <Label htmlFor="customTypeName">Type Name</Label>
          <Input 
            id="customTypeName" 
            value={customTypeName} 
            onChange={(e) => setCustomTypeName(e.target.value)}
            className="border-slate-200 focus:border-blue-500 bg-white"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowCustomTypeForm(false)}
          >
            Cancel
          </Button>
          <Button 
            size="sm" 
            onClick={handleSaveCustomType}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save Type
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="space-y-2 mb-6">
        <Label htmlFor="contactType" className="text-sm font-medium">
          Contact Type
        </Label>
        <Select value={selectedType} onValueChange={handleTypeChange}>
          <SelectTrigger 
            id="contactType" 
            className="w-full border-slate-200 focus:border-blue-500 focus:ring-blue-500 bg-white"
          >
            <SelectValue placeholder="Select contact type" />
          </SelectTrigger>
          <SelectContent>
            {contactTypeOptions.map((option: ContactTypeOption) => (
              <SelectItem key={option.id} value={option.id} className="flex items-center">
                <div className="flex items-center">
                  <option.icon className="w-4 h-4 mr-2 inline-block text-blue-500" />
                  {option.label}
                </div>
              </SelectItem>
            ))}
            {isAdmin && (
              <SelectItem value="custom">
                <div className="flex items-center">
                  <Settings className="w-4 h-4 mr-2 inline-block text-purple-500" />
                  Add Custom Type...
                </div>
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      {renderCustomTypeForm()}
    </>
  );
};

export default ContactTypeSelector;
