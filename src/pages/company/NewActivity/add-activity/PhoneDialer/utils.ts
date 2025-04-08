
import { toast } from "@/hooks/use-toast";

export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const validatePhoneNumber = (phoneNumber: string): boolean => {
  return !!phoneNumber.trim();
};

export const showCallStartToast = (contactName: string, phoneNumber: string): void => {
  toast({
    title: "Call Started",
    description: `Calling ${contactName || phoneNumber}...`,
  });
};

export const showCallEndToast = (callDuration: number): void => {
  toast({
    title: "Call Ended",
    description: `Call duration: ${formatDuration(callDuration)}`,
  });
};

export const dialPad = [
  '1', '2', '3',
  '4', '5', '6',
  '7', '8', '9',
  '*', '0', '#'
];
