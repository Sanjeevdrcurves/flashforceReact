import React from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

const ImportButton = () => {
  return (
    <div className="mb-6">
      <Button 
        type="button" 
        variant="outline" 
        className="w-full flex items-center justify-center text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300"
      >
        <Upload size={16} className="mr-2" />
        Import Data
      </Button>
    </div>
  );
};

export default ImportButton;
