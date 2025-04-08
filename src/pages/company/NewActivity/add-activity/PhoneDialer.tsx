
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Clock,
  Plus,
  Minus,
  Calendar
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface PhoneDialerProps {
  contactNumber?: string;
  contactName?: string;
  onCallComplete?: (duration: number, notes: string) => void;
  isImmediate?: boolean;
  isScheduled?: boolean;
  scheduledTime?: string;
  scheduledDate?: string;
  participants?: Array<{name: string, email: string}>;
}

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
    if (!phoneNumber.trim()) {
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
    
    toast({
      title: "Call Started",
      description: `Calling ${contactName || phoneNumber}...`,
    });
  };

  const endCall = () => {
    setIsCallActive(false);
    
    // Clear the timer
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    toast({
      title: "Call Ended",
      description: `Call duration: ${formatDuration(callDuration)}`,
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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

  const dialPad = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    '*', '0', '#'
  ];

  const handleKeyPress = (key: string) => {
    setPhoneNumber(prev => prev + key);
  };

  const handleBackspace = () => {
    setPhoneNumber(prev => prev.slice(0, -1));
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
            {isScheduled && !isCallActive && (
              <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                <div className="flex items-center gap-2 text-blue-800 font-medium mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>Scheduled for: {scheduledDate} at {scheduledTime}</span>
                </div>
                
                {participants && participants.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-1">Participants:</p>
                    <div className="flex flex-wrap gap-1">
                      {participants.map((participant, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-50">
                          {participant.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Phone number input */}
            <div className="flex items-center space-x-2">
              <Input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter phone number"
                className="text-lg font-mono"
                disabled={isCallActive}
              />
              {phoneNumber && !isCallActive && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleBackspace}
                  className="h-10 w-10"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {/* Call status and duration */}
            {isCallActive && (
              <div className="text-center p-2 bg-green-50 border border-green-200 rounded-md">
                <div className="text-sm text-green-600 font-medium">Call in progress</div>
                <div className="text-xl font-mono font-bold flex items-center justify-center">
                  <Clock className="mr-2 h-4 w-4" />
                  {formatDuration(callDuration)}
                </div>
              </div>
            )}
            
            {/* Dial pad */}
            {!isCallActive && (
              <div className="grid grid-cols-3 gap-2">
                {dialPad.map((key) => (
                  <Button
                    key={key}
                    variant="outline"
                    className="h-12 text-lg font-medium"
                    onClick={() => handleKeyPress(key)}
                  >
                    {key}
                  </Button>
                ))}
              </div>
            )}
            
            {/* Call controls */}
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
            
            {/* Call notes - visible after call ends */}
            {!isCallActive && callDuration > 0 && (
              <div className="space-y-2 pt-2">
                <label className="text-sm font-medium">Call Notes</label>
                <Textarea
                  rows={3}
                  className="w-full border rounded-md p-2"
                  placeholder="Enter notes about the call"
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                />
                
                {isScheduled && (
                  <div className="flex items-center space-x-2 mt-2">
                    <Checkbox
                      id="markAsCompleted"
                      checked={markAsCompleted}
                      onCheckedChange={(checked) => setMarkAsCompleted(!!checked)}
                    />
                    <Label htmlFor="markAsCompleted" className="text-sm">
                      Mark scheduled activity as completed
                    </Label>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <DialogFooter className="flex justify-between">
            <Button 
              variant="ghost" 
              onClick={() => {
                if (isCallActive && timerInterval) {
                  clearInterval(timerInterval);
                  setTimerInterval(null);
                }
                setIsDialerOpen(false);
                setIsCallActive(false);
                setCallDuration(0);
              }}
            >
              Cancel
            </Button>
            
            {!isCallActive && callDuration > 0 && (
              <Button onClick={handleCompleteLogging}>
                Complete & Log Call
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
