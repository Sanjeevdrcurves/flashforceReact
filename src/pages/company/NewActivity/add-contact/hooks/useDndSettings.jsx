
import { useState } from "react";

export const useDndSettings = () => {
  const [dndSettings, setDndSettings] = useState({
    allChannels: false,
    email: false,
    text: false,
    phone: false,
    googleBusiness: false,
    facebook: false,
    inboundCallsAndSms: false
  });

  const updateDndSettings = (newSettings) => {
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
