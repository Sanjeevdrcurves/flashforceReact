import { Device } from "@twilio/voice-sdk";
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
const TOKEN_ENDPOINT = `${API_URL}/twilio/get-client-token-new`;

const TwilioCallHandlerNew = () => {
  const [device, setDevice] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);

  useEffect(() => {
    const initializeTwilioDevice = async () => {
      try {
        const { data } = await axios.get(TOKEN_ENDPOINT);
        const twilioDevice = new Device(data.token, { logLevel: "debug" });

        twilioDevice.on("incoming", (call) => {
          setIncomingCall(call);
          if (window.confirm("Incoming call. Answer?")) {
            call.accept();
          } else {
            call.reject();
          }
        });

        await twilioDevice.register();
        setDevice(twilioDevice);
      } catch (error) {
        console.error("Error initializing Twilio device:", error);
      }
    };

    initializeTwilioDevice();
  }, []);

  return <div>Twilio Voice Initialized</div>;
};

export default TwilioCallHandlerNew;
