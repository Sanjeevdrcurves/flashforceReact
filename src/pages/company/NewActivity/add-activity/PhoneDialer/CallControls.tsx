
import React from "react";
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

interface CallControlsProps {
  isCallActive: boolean;
  isMuted: boolean;
  isSpeakerOn: boolean;
  phoneNumber: string;
  setIsMuted: (value: boolean) => void;
  setIsSpeakerOn: (value: boolean) => void;
  startCall: () => void;
  endCall: () => void;
}

export const CallControls: React.FC<CallControlsProps> = ({
  isCallActive,
  isMuted,
  isSpeakerOn,
  phoneNumber,
  setIsMuted,
  setIsSpeakerOn,
  startCall,
  endCall,
}) => {
  return (
    <div className="flex justify-center space-x-4 pt-2">
      {!isCallActive ? (
        <Button 
          onClick={startCall} 
          className="bg-green-600 hover:bg-green-700 text-white"
          disabled={!phoneNumber.trim()}
        >
          <Phone className="mr-2 h-5 w-5" />
          Start Call
        </Button>
      ) : (
        <>
          <Button 
            variant="outline" 
            size="icon" 
            className={cn("rounded-full h-12 w-12", isMuted ? "bg-red-100" : "")}
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <MicOff className="h-5 w-5 text-red-600" /> : <Mic className="h-5 w-5" />}
          </Button>
          
          <Button 
            variant="destructive" 
            size="icon" 
            className="rounded-full h-12 w-12"
            onClick={endCall}
          >
            <PhoneOff className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className={cn("rounded-full h-12 w-12", isSpeakerOn ? "bg-blue-100" : "")}
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
          >
            {isSpeakerOn ? <Volume2 className="h-5 w-5 text-blue-600" /> : <VolumeX className="h-5 w-5" />}
          </Button>
        </>
      )}
    </div>
  );
};
