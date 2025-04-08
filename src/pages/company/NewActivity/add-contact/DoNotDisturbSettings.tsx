
import React from "react";
import { BellOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { DndSettings } from "./types";

interface DoNotDisturbSettingsProps {
  dndSettings: DndSettings;
  updateDndSettings: (settings: Partial<DndSettings>) => void;
}

const DoNotDisturbSettings: React.FC<DoNotDisturbSettingsProps> = ({
  dndSettings,
  updateDndSettings,
}) => {
  const handleDndAllChannelsToggle = (checked: boolean) => {
    if (checked) {
      // Set all specific channels to true when main toggle is enabled
      updateDndSettings({
        allChannels: true,
        email: true,
        text: true,
        phone: true,
        googleBusiness: true,
        facebook: true
      });
    } else {
      updateDndSettings({ allChannels: false });
    }
  };

  return (
    <div className="space-y-4 mb-6 p-4 bg-slate-50 border border-slate-200 rounded-md">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-sm font-medium flex items-center">
            <BellOff size={16} className="mr-2 text-slate-500" />
            Do Not Disturb All Channels
          </h3>
          <p className="text-xs text-slate-500">
            Mute all notifications for this contact
          </p>
        </div>
        <Switch 
          checked={dndSettings.allChannels} 
          onCheckedChange={handleDndAllChannelsToggle}
        />
      </div>
      
      <div className="space-y-3 pt-2 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <Label htmlFor="dnd-email" className="text-sm font-normal cursor-pointer">
            Email
          </Label>
          <Checkbox 
            id="dnd-email" 
            checked={dndSettings.email} 
            onCheckedChange={(checked) => 
              updateDndSettings({ email: checked === true })
            }
            disabled={dndSettings.allChannels}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="dnd-text" className="text-sm font-normal cursor-pointer">
            Text Message
          </Label>
          <Checkbox 
            id="dnd-text" 
            checked={dndSettings.text} 
            onCheckedChange={(checked) => 
              updateDndSettings({ text: checked === true })
            }
            disabled={dndSettings.allChannels}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="dnd-phone" className="text-sm font-normal cursor-pointer">
            Phone and Voice
          </Label>
          <Checkbox 
            id="dnd-phone" 
            checked={dndSettings.phone} 
            onCheckedChange={(checked) => 
              updateDndSettings({ phone: checked === true })
            }
            disabled={dndSettings.allChannels}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="dnd-google" className="text-sm font-normal cursor-pointer">
            Google Business Profile
          </Label>
          <Checkbox 
            id="dnd-google" 
            checked={dndSettings.googleBusiness} 
            onCheckedChange={(checked) => 
              updateDndSettings({ googleBusiness: checked === true })
            }
            disabled={dndSettings.allChannels}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="dnd-facebook" className="text-sm font-normal cursor-pointer">
            Facebook
          </Label>
          <Checkbox 
            id="dnd-facebook" 
            checked={dndSettings.facebook} 
            onCheckedChange={(checked) => 
              updateDndSettings({ facebook: checked === true })
            }
            disabled={dndSettings.allChannels}
          />
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-2 border-t border-slate-200">
        <div className="space-y-1">
          <h3 className="text-sm font-medium">Do Not Disturb Inbound Calls and SMS</h3>
          <p className="text-xs text-slate-500">
            Mute incoming calls and messages
          </p>
        </div>
        <Switch 
          checked={dndSettings.inboundCallsAndSms} 
          onCheckedChange={(checked) => 
            updateDndSettings({ inboundCallsAndSms: checked })
          }
        />
      </div>
    </div>
  );
};

export default DoNotDisturbSettings;
