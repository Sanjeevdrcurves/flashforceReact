
import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { personContactTypeOptions, placeContactTypeOptions } from "./constants";

interface CategoryTypeSelectorProps {
  selectedCategory: "person" | "place";
  setSelectedCategory: (category: "person" | "place") => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  isAdmin?: boolean;
}

const CategoryTypeSelector: React.FC<CategoryTypeSelectorProps> = ({
  selectedCategory,
  setSelectedCategory,
  selectedType,
  setSelectedType,
  isAdmin = false,
}) => {
  // Get type options based on selected category
  const typeOptions = selectedCategory === "person" 
    ? personContactTypeOptions 
    : placeContactTypeOptions;

  // Handle category button click
  const handleCategoryClick = (category: "person" | "place") => {
    console.log("Button clicked for category:", category);
    if (category !== selectedCategory) {
      setSelectedCategory(category);
    }
  };

  return (
    <div className="space-y-6 mb-6">
      {/* Category Selection */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Contact Category</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={selectedCategory === "person" ? "default" : "outline"}
            className={selectedCategory === "person" ? "bg-blue-600 text-white" : ""}
            onClick={() => handleCategoryClick("person")}
          >
            Person
          </Button>
          <Button
            type="button"
            variant={selectedCategory === "place" ? "default" : "outline"}
            className={selectedCategory === "place" ? "bg-blue-600 text-white" : ""}
            onClick={() => handleCategoryClick("place")}
          >
            Place
          </Button>
        </div>
      </div>

      {/* Type Selection */}
      <div className="space-y-2">
        <Label htmlFor="contactType" className="text-sm font-medium">
          Contact Type
        </Label>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger 
            id="contactType" 
            className="w-full border-slate-200 focus:border-blue-500 focus:ring-blue-500 bg-white"
          >
            <SelectValue placeholder="Select contact type" />
          </SelectTrigger>
          <SelectContent className="bg-white z-50">
            {typeOptions.map((option) => (
              <SelectItem key={option.id} value={option.id} className="flex items-center">
                <div className="flex items-center">
                  {option.icon && 
                    <option.icon className="w-4 h-4 mr-2 inline-block text-blue-500" />
                  }
                  {option.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CategoryTypeSelector;
