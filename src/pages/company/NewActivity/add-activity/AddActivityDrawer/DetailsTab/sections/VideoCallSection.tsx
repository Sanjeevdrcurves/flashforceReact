
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { VideoCallPlatform } from "@/types/activity";
import { VideoCallPlatformSelector } from "@/components/add-activity/VideoCallPlatformSelector";

interface VideoCallSectionProps {
  videoCallPlatform: VideoCallPlatform;
  setVideoCallPlatform: (platform: VideoCallPlatform) => void;
  videoCallUrl: string;
  setVideoCallUrl: (url: string) => void;
}

export const VideoCallSection: React.FC<VideoCallSectionProps> = ({
  videoCallPlatform,
  setVideoCallPlatform,
  videoCallUrl,
  setVideoCallUrl,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="videoCallPlatform" className="text-sm font-medium">Video Call Platform</Label>
      <VideoCallPlatformSelector
        value={videoCallPlatform || "none"}
        onChange={setVideoCallPlatform}
      />
      
      {videoCallPlatform && videoCallPlatform !== "none" && (
        <div className="mt-2">
          <Input
            id="videoCallUrl"
            placeholder="Video call URL (optional)"
            value={videoCallUrl || ""}
            onChange={(e) => setVideoCallUrl(e.target.value)}
            className="h-9"
          />
        </div>
      )}
    </div>
  );
};
