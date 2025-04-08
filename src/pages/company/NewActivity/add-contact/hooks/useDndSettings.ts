
import { useState } from "react";
import { DndSettings } from "../types";

export const useDndSettings = () => {
  const [dndSettings, setDndSettings] = useState<DndSettings>({
    allChannels: false,
    email: false,
    text: false,
    phone: false,
    googleBusiness: false,
    facebook: false,
    inboundCallsAndSms: false
  });

  const updateDndSettings = (newSettings: Partial<DndSettings>) => {
    setDndSettings(prevSettings => ({
      ...prevSettings,
      ...newSettings
    }));
  };

  return {
    dndSettings,
    updateDndSettings
  };
};
