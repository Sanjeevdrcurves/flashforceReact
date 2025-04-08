
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Video, 
  VideoOff
} from "lucide-react";

const VideoCallPlatformSelector = ({ 
  value, 
  onChange 
}) => {
  const platforms = [
    { value: "none", label: "No Video Call" },
    { value: "zoom", label: "Zoom" },
    { value: "doxy", label: "Doxy" },
    { value: "google", label: "Google Meet" },
    { value: "teams", label: "Microsoft Teams" },
    { value: "custom", label: "Other Platform" },
  ];

  return (
    <Select value={value} onValueChange={(v) => onChange(v)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select video call platform" />
      </SelectTrigger>
      <SelectContent>
        {platforms.map(platform => (
          <SelectItem key={platform.value} value={platform.value} className="cursor-pointer">
            <div className="flex items-center">
              <span className="mr-2">
                {platform.value === "none" ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
              </span>
              {platform.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export { VideoCallPlatformSelector };
