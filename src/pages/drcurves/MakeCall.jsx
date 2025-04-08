import React, { useEffect, useState } from "react";
import axios from "axios";
import { Device } from "@twilio/voice-sdk";

/**
 * ENV VARIABLES:
 *   VITE_FLASHFORCE_API_URL:  your back-end base URL (e.g., "https://yourdomain.com/api")
 */
const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

// This is the endpoint where you fetch a Twilio token for the browser device.
// Adjust if your endpoint is different.
const TOKEN_ENDPOINT = `${API_URL}/twilio/get-client-token`;

function MakeCall() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState("");
  const [device, setDevice] = useState(null);
  const [connected, setConnected] = useState(false);

  // 1) On mount, fetch the Twilio Access Token and create the Device
  // useEffect(() => {
  //   const setupTwilioDevice = async () => {
  //     try {
  //       // Fetch token from your .NET server
  //       const response = await axios.get(TOKEN_ENDPOINT);
  //       const token = response.data.token;

  //       // Create a new Twilio Device with that token
  //       const twilioDevice = new Device(token, {
  //         logLevel: "info", // or 'debug' for more logs
  //         codecPreferences: ["opus", "pcmu"],
  //       });

  //       // Set up event listeners
  //       twilioDevice.on("ready", () => {
  //         setStatus("Browser device is ready to receive calls.");
  //       });

  //       twilioDevice.on("error", (error) => {
  //         console.error("Twilio Device Error:", error);
  //         setStatus(`Device error: ${error.message}`);
  //       });

  //       twilioDevice.on("incoming", (connection) => {
  //         setStatus(`Incoming call from: ${connection.parameters.From}`);
  //         // Automatically accept the call or prompt the user
  //         connection.accept();
  //       });

  //       twilioDevice.on("connect", () => {
  //         setStatus("Call is connected (browser side).");
  //         setConnected(true);
  //       });

  //       twilioDevice.on("disconnect", () => {
  //         setStatus("Call ended.");
  //         setConnected(false);
  //       });

  //       setDevice(twilioDevice);
  //     } catch (err) {
  //       console.error("Failed to fetch token or set up device:", err);
  //       setStatus("Could not set up Twilio Device. Check console for details.");
  //     }
  //   };

  //   setupTwilioDevice();
  // }, []);

  // 2) Dial Pad Handlers for PSTN Outbound Calls via your .NET endpoint
  const handleDial = (digit) => {
    setPhoneNumber((prev) => prev + digit);
  };

  const handleBackspace = () => {
    setPhoneNumber((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPhoneNumber("");
  };

  // 3) Place Outbound PSTN Call (Server triggers call)
  const handleMakeCall = async (e) => {
    e.preventDefault();
    setStatus("Placing call via server...");
    try {
      const response = await axios.post(`${API_URL}/twilio/make-call`, {
        to: phoneNumber,
      });

      if (response.data.success) {
        setStatus(
          `Server call initiated! SID: ${response.data.callSid}, Status: ${response.data.status}`
        );
      } else {
        setStatus(`Failed to make call: ${response.data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setStatus("An error occurred while making the PSTN call.");
    }
  };

  // 4) Hang up any active browser calls
  const handleHangUp = () => {
    if (device) {
      device.disconnectAll();
    }
  };

  // 5) (Optional) Make an outbound call directly *from browser* (Twilio.Client -> PSTN)
  //    This requires your TwiML App to handle outgoing parameters. 
  //    If you don't need this, remove or comment out.
  const handleBrowserDial = () => {
    if (!device) {
      setStatus("Twilio Device not ready yet.");
      return;
    }
    setStatus(`Dialing from browser as 'client' identity...`);
    // Connect can accept custom parameters if your TwiML is set to handle them
    device.connect({
      phoneNumber: phoneNumber,
    });
  };

  return (
    <div style={styles.container}>
      <h2>Make a Phone Call via Twilio</h2>

      {/* Phone Number + Dial Pad */}
      <form onSubmit={handleMakeCall}>
        <div>
          <label>Phone Number to Call:</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter phone number"
            required
            style={styles.input}
          />
        </div>

        <div style={styles.dialPad}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"].map((num) => (
            <button key={num} onClick={() => handleDial(num)} style={styles.button} type="button">
              {num}
            </button>
          ))}
        </div>

        <div style={styles.controls}>
          <button type="button" onClick={handleBackspace} style={styles.controlButton}>
            ⬅️
          </button>
          <button type="button" onClick={handleClear} style={styles.controlButton}>
            ❌
          </button>
          <button
            type="submit"
            className="flex items-center gap-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            📞 Call
          </button>
        </div>
      </form>

      {/* Optional: Buttons to handle Twilio.Device calls directly from the browser */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={handleBrowserDial} disabled={!device} style={styles.controlButton}>
          Call from Browser
        </button>
        <button onClick={handleHangUp} disabled={!connected} style={styles.controlButton}>
          Hang Up
        </button>
      </div>

      {/* Status Output */}
      {status && <p>{status}</p>}
    </div>
  );
}

// Basic Styles
const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    maxWidth: "350px",
    margin: "auto",
    border: "2px solid #ddd",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
  },
  input: {
    width: "100%",
    fontSize: "18px",
    padding: "10px",
    textAlign: "center",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ddd",
  },
  dialPad: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
    marginBottom: "10px",
  },
  button: {
    fontSize: "20px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    cursor: "pointer",
    backgroundColor: "#f8f8f8",
  },
  controls: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  controlButton: {
    fontSize: "16px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    cursor: "pointer",
    backgroundColor: "#f8f8f8",
    marginRight: "5px",
  },
};

export default MakeCall;
