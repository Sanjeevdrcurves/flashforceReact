
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus, Bell, ChevronDown } from 'lucide-react';
import { Reminder } from '@/types/activity';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ReminderSelectorProps {
  reminders: Reminder[];
  onAdd: (time: number, type: "email" | "notification" | "sms") => void;
  onRemove: (id: string) => void;
  simplified?: boolean;
}

const reminderTimeOptions = [
  { value: 0, label: 'At time of activity' },
  { value: 5, label: '5 minutes before' },
  { value: 15, label: '15 minutes before' },
  { value: 30, label: '30 minutes before' },
  { value: 60, label: '1 hour before' },
  { value: 120, label: '2 hours before' },
  { value: 1440, label: '1 day before' },
  { value: 2880, label: '2 days before' },
  { value: 10080, label: '1 week before' },
];

export const ReminderSelector: React.FC<ReminderSelectorProps> = ({
  reminders,
  onAdd,
  onRemove,
  simplified = false,
}) => {
  const [reminderTime, setReminderTime] = useState(15); // 15 minutes before by default
  const [reminderType, setReminderType] = useState<"email" | "notification" | "sms">("notification");
  const [showPopover, setShowPopover] = useState(false);

  const handleAddReminder = () => {
    onAdd(reminderTime, reminderType);
  };

  const getReminderTimeLabel = (minutes: number) => {
    const option = reminderTimeOptions.find(opt => opt.value === minutes);
    return option ? option.label : `${minutes} minutes before`;
  };

  const getTypeBadgeText = (type: string) => {
    switch (type) {
      case 'notification': return 'Notification';
      case 'email': return 'Email';
      case 'sms': return 'SMS';
      default: return type;
    }
  };

  if (simplified) {
    return (
      <div>
        <Popover open={showPopover} onOpenChange={setShowPopover}>
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {reminders.length > 0 
                  ? `Remind ${getReminderTimeLabel(reminders[0].time).toLowerCase()} via ${getTypeBadgeText(reminders[0].type)}` 
                  : "Add reminder"}
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              {reminders.length === 0 ? (
                <PopoverTrigger asChild>
                  <Select 
                    value={String(reminderTime)} 
                    onValueChange={(val) => {
                      const time = parseInt(val);
                      setReminderTime(time);
                      onAdd(time, reminderType);
                    }}
                  >
                    <SelectTrigger className="w-44 h-8 text-xs border-dashed border-muted-foreground/40 text-muted-foreground">
                      <SelectValue placeholder="Add reminder" />
                    </SelectTrigger>
                    <SelectContent>
                      {reminderTimeOptions.map((option) => (
                        <SelectItem key={option.value} value={String(option.value)}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </PopoverTrigger>
              ) : (
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
              )}
            </div>
          </div>
          
          <PopoverContent className="w-80 p-4" align="end">
            <div className="space-y-4">
              <h3 className="font-medium text-sm">Current Reminders</h3>
              
              {reminders.length > 0 ? (
                <div className="space-y-2">
                  {reminders.map((reminder) => (
                    <div key={reminder.id} className="flex items-center justify-between py-1.5 px-3 bg-muted/50 rounded-md group">
                      <div>
                        <span className="text-sm">
                          {getReminderTimeLabel(reminder.time)}
                        </span>
                        <span className="text-xs text-muted-foreground ml-2">
                          via {getTypeBadgeText(reminder.type)}
                        </span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 opacity-70 hover:opacity-100"
                        onClick={() => onRemove(reminder.id)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground py-2">
                  No reminders set yet.
                </div>
              )}
              
              <div className="border-t pt-3 space-y-2">
                <h3 className="font-medium text-sm">Add Reminder</h3>
                
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <Label htmlFor="reminderTime" className="text-xs mb-1 block">Time</Label>
                    <Select value={String(reminderTime)} onValueChange={(val) => setReminderTime(parseInt(val))}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {reminderTimeOptions.map((option) => (
                          <SelectItem key={option.value} value={String(option.value)}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="w-[120px]">
                    <Label htmlFor="reminderType" className="text-xs mb-1 block">Via</Label>
                    <Select value={reminderType} onValueChange={(val) => setReminderType(val as "email" | "notification" | "sms")}>
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="notification">Notification</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    onClick={() => {
                      handleAddReminder();
                      setShowPopover(false);
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="font-medium text-sm flex items-center">
          <Bell className="mr-2 h-4 w-4" />
          Reminders
        </h3>
      </div>

      <div className="space-y-2">
        {reminders.map((reminder) => (
          <div key={reminder.id} className="flex items-center justify-between py-1.5 px-3 bg-muted/50 rounded-md group">
            <div>
              <span className="text-sm">
                {getReminderTimeLabel(reminder.time)}
              </span>
              <span className="text-xs text-muted-foreground ml-2">
                via {reminder.type}
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onRemove(reminder.id)}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-2">
        <Select value={String(reminderTime)} onValueChange={(val) => setReminderTime(parseInt(val))}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Reminder time" />
          </SelectTrigger>
          <SelectContent>
            {reminderTimeOptions.map((option) => (
              <SelectItem key={option.value} value={String(option.value)}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={reminderType} onValueChange={(val) => setReminderType(val as "email" | "notification" | "sms")}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Notification type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="notification">Notification</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="h-10 w-10"
          onClick={handleAddReminder}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
