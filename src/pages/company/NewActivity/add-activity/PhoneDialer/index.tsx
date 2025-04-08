
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Phone, Calendar } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

import { PhoneDialerProps } from "./types";
import { DialPad } from "./DialPad";
import { CallStatus } from "./CallStatus";
import { CallControls } from "./CallControls";
import { CallNotes } from "./CallNotes";
import { ScheduledCallInfo } from "./ScheduledCallInfo";
import { DialogFooterButtons } from "./DialogFooterButtons";
import { validatePhoneNumber, showCallStartToast, showCallEndToast } from "./utils";

export const PhoneDialer: React.FC<PhoneDialerProps> = ({
  contactNumber = "",
  contactName = "",
  onCallComplete,
  isImmediate = false,
  isScheduled = false,
  scheduledTime = "",
  scheduledDate = "",
  participants = []
}) => {
  const [isDialerOpen, setIsDialerOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(contactNumber);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callNotes, setCallNotes] = useState("");
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [markAsCompleted, setMarkAsCompleted] = useState(true);

  useEffect(() => {
    // Update phone number if contact info changes
    if (contactNumber) {
      setPhoneNumber(contactNumber);
    }
  }, [contactNumber]);

  const startCall = () => {
    if (!validatePhoneNumber(phoneNumber)) {
      toast({
        title: "Error",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    setIsCallActive(true);
    
    // Start the call timer
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    
    setTimerInterval(interval);
    showCallStartToast(contactName, phoneNumber);
  };

  const endCall = () => {
    setIsCallActive(false);
    
    // Clear the timer
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    showCallEndToast(callDuration);
  };

  const handleCompleteLogging = () => {
    if (onCallComplete) {
      onCallComplete(callDuration, callNotes);
    }
    
    // Reset states
    setCallDuration(0);
    setCallNotes("");
    setIsDialerOpen(false);
  };

  const handleCancelDialog = () => {
    if (isCallActive && timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setIsDialerOpen(false);
    setIsCallActive(false);
    setCallDuration(0);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant={isScheduled ? "outline" : isImmediate ? "default" : "outline"} 
              size="sm" 
              className={cn(
                "rounded-full w-10 h-10 p-0", 
                isImmediate ? "bg-green-600 text-white hover:bg-green-700" : 
                isScheduled ? "bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700" : ""
              )}
              onClick={() => setIsDialerOpen(true)}
            >
              {isScheduled ? <Calendar className="h-5 w-5" /> : <Phone className="h-5 w-5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isImmediate ? "Initiate Call Now" : isScheduled ? "Scheduled Call" : "Phone Dialer"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={isDialerOpen} onOpenChange={setIsDialerOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isImmediate ? "Immediate Call" : 
               isScheduled ? "Scheduled Call" : 
               "Phone Dialer"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col space-y-4">
            {/* Scheduled call info */}
            <ScheduledCallInfo 
              isScheduled={isScheduled}
              scheduledDate={scheduledDate}
              scheduledTime={scheduledTime}
              participants={participants}
              isCallActive={isCallActive}
            />
            
            {/* Phone number input and dial pad */}
            <DialPad 
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              isCallActive={isCallActive}
            />
            
            {/* Call status and duration */}
            <CallStatus 
              isCallActive={isCallActive}
              callDuration={callDuration}
            />
            
            {/* Call controls */}
            <CallControls 
              isCallActive={isCallActive}
              isMuted={isMuted}
              isSpeakerOn={isSpeakerOn}
              phoneNumber={phoneNumber}
              setIsMuted={setIsMuted}
              setIsSpeakerOn={setIsSpeakerOn}
              startCall={startCall}
              endCall={endCall}
            />
            
            {/* Call notes */}
            <CallNotes 
              isCallActive={isCallActive}
              callDuration={callDuration}
              callNotes={callNotes}
              setCallNotes={setCallNotes}
              isScheduled={isScheduled}
              markAsCompleted={markAsCompleted}
              setMarkAsCompleted={setMarkAsCompleted}
            />
          </div>
          
          <DialogFooter className="flex justify-between">
            <DialogFooterButtons 
              onCancel={handleCancelDialog}
              onComplete={handleCompleteLogging}
              isCallActive={isCallActive}
              callDuration={callDuration}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Re-export for backward compatibility
export * from "./types";
