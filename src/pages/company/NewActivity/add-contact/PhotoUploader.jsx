
import React from "react";
import { User, Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const PhotoUploader = ({
  photoUrl,
  setPhotoUrl,
}) => {
  // This would be implemented with actual file upload functionality in a real app
  const handleUpload = () => {
    // Mock implementation - in a real app, this would upload to a server
    console.log("Upload photo");
    // For demo purposes, we'll just set a placeholder image
    setPhotoUrl("https://via.placeholder.com/150");
  };

  return (
    <div className="space-y-2 mb-6">
      <Label>Photo</Label>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 border border-gray-200 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden">
          {photoUrl ? (
            <img 
              src={photoUrl} 
              alt="Contact" 
              className="w-full h-full object-cover" 
            />
          ) : (
            <User className="w-8 h-8 text-gray-400" />
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          className="flex items-center"
          onClick={handleUpload}
        >
          <Upload size={14} className="mr-2" />
          Upload photo
        </Button>
      </div>
    </div>
  );
};

export default PhotoUploader;
