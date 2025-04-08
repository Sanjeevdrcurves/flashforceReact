
export interface PhoneDialerProps {
  contactNumber?: string;
  contactName?: string;
  onCallComplete?: (duration: number, notes: string) => void;
  isImmediate?: boolean;
  isScheduled?: boolean;
  scheduledTime?: string;
  scheduledDate?: string;
  participants?: Array<{name: string, email: string}>;
}
