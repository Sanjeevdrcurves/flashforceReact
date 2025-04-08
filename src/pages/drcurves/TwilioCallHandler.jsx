/* eslint-disable prettier/prettier */
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Device } from "@twilio/voice-sdk";

// If you're using environment variables for your API URL:
const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
const TOKEN_ENDPOINT = `${API_URL}/twilio/get-client-token`;

/**
 * TwilioInboundCallHandler
 * 
 * @param {Function} onIncomingCall - (optional) callback fired on an incoming call event
 *
 */
const TwilioInboundCallHandler = ({ onIncomingCall, incoming }) => {
  const [device, setDevice] = useState(null);
  const [incomingConnection, setIncomingConnection] = useState(null);
  const [activeConnection, setActiveConnection] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState("");
  const [connected, setConnected] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const timerRef = useRef(null);

  // Setup the Twilio Device on mount
  // useEffect(() => {
  //   const setupDevice = async () => {
  //     try {
  //       const { data } = await axios.get(TOKEN_ENDPOINT);
  //       const token = data.token;

  //       // Create and register the Twilio Device
  //       const twilioDevice = new Device(token, {
  //         logLevel: "debug",
  //       });

  //       twilioDevice.on("ready", () => {
  //         setStatus("Device is ready.");
  //         console.log("Device ready.");
  //       });

  //       twilioDevice.on("error", (error) => {
  //         console.error("Twilio Device Error:", error);
  //         setStatus(`Device error: ${error.message}`);
  //       });

  //       // Handle inbound calls
  //       twilioDevice.on("incoming", (connection) => {
  //         setStatus(`Incoming call from: ${connection.parameters.From}`);
  //         console.log("Incoming connection:", connection);
  //         setIncomingConnection(connection);
  //         if (connection) {
  //           onIncomingCall(true);
  //         }
  //       });

  //       // When a call connects, store the active connection
  //       twilioDevice.on("connect", (connection) => {
  //         setStatus("Call connected.");
  //         console.log("Call connected event:", connection);
  //         setConnected(true);
  //         setActiveConnection(connection);
  //       });

  //       // When a call disconnects, clear the active connection and stop the timer
  //       twilioDevice.on("disconnect", (connection) => {
  //         console.log("Call disconnected event:", connection);
  //         setConnected(false);
  //         setActiveConnection(null);
  //         setIncomingConnection(null);
  //         onIncomingCall(false);
  //       });

  //       // Register this device for incoming calls
  //       await twilioDevice.register();
  //       setDevice(twilioDevice);
  //     } catch (err) {
  //       console.error("Error setting up device:", err);
  //       setStatus("Failed to set up device.");
  //     }
  //   };

  //   setupDevice();

  //   // Cleanup device on unmount if needed
  //   return () => {
  //     if (device) {
  //       device.destroy();
  //     }
  //   };
  // }, [onIncomingCall]);

  // Manage the call duration timer when connected
  useEffect(() => {
    if (connected) {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      setCallDuration(0);
    }
    return () => clearInterval(timerRef.current);
  }, [connected]);

  // Dial pad handlers
  const handleDial = (digit) => {
    setPhoneNumber((prev) => prev + digit);
  };
  const handleBackspace = () => {
    setPhoneNumber((prev) => prev.slice(0, -1));
  };
  const handleClear = () => {
    setPhoneNumber("");
    onIncomingCall(false);
  };

  // Outbound call
  const handleOutboundCall = () => {
    if (!device) {
      setStatus("Device not ready.");
      return;
    }
    setStatus("Placing outbound call...");
    device.connect({ To: phoneNumber });
  };

  // Accept incoming call
  const handleAcceptCall = () => {
    if (incomingConnection) {
      incomingConnection.accept();
      setStatus("Call accepted.");
      setConnected(true);
      setIncomingConnection(null);
    }
  };

  // Reject incoming call
  const handleRejectCall = () => {
    if (incomingConnection) {
      incomingConnection.reject();
      setStatus("Call rejected.");
      setIncomingConnection(null);
    }
  };

  // Hang up active call, stop the timer, and reset the UI
  const handleHangUp = () => {
    if (activeConnection) {
      activeConnection.disconnect();
      console.log("Active connection disconnected.");
    }
    if (device) {
      device.disconnectAll();
      console.log("Device.disconnectAll() called.");
    }
    setStatus("Call cancelled.");
    onIncomingCall(false);
    setConnected(false);
    setActiveConnection(null);
    setIncomingConnection(null);
    setCallDuration(0);
    setPhoneNumber("");
  };

  // Helper to format time as mm:ss
  const formatTime = (seconds) => {
    const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
    const ss = String(seconds % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  return (
    <>
      {incoming ? (
        <div style={styles.container}>
          <h2>Twilio Dialer</h2>
          <p>Status: {status}</p>
          <div style={styles.inputSection}>
            <input
              type="text"
              placeholder="Enter phone number (+14155552671)"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.dialPad}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"].map((digit) => (
              <button
                key={digit}
                style={styles.dialButton}
                onClick={() => handleDial(digit)}
                type="button"
              >
                {digit}
              </button>
            ))}
          </div>

          <div style={styles.controls}>
            <button onClick={handleBackspace} style={styles.controlButton}>
              ⬅️
            </button>
            <button onClick={handleClear} style={styles.controlButton}>
              ❌
            </button>
            <button onClick={handleOutboundCall} style={styles.callButton}>
              📞 Call
            </button>
          </div>

          {/* Incoming call UI: Only show if there is an incoming connection and not connected */}
          {incomingConnection && !connected && (
            <div style={styles.incomingCall}>
              <p>
                Incoming call from {incomingConnection.parameters.From || "Unknown"}
              </p>
              <button onClick={handleAcceptCall} style={styles.answerButton}>
                Accept
              </button>
              <button onClick={handleRejectCall} style={styles.rejectButton}>
                Reject
              </button>
            </div>
          )}

          {/* Active call UI */}
          {connected && (
            <div style={styles.hangupSection}>
              <p>Call Duration: {formatTime(callDuration)}</p>
              <button onClick={handleHangUp} style={styles.hangupButton}>
                End Call
              </button>
            </div>
          )}
        </div>
      ) : null}
    </>
  );
};

const styles = {
  container: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-0%, -0%)",
    maxWidth: "400px",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  inputSection: {
    marginBottom: "15px",
  },
  input: {
    width: "90%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    textAlign: "center",
  },
  dialPad: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
    marginBottom: "15px",
  },
  dialButton: {
    padding: "15px",
    fontSize: "18px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    cursor: "pointer",
    backgroundColor: "#f9f9f9",
  },
  controls: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "15px",
  },
  controlButton: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    cursor: "pointer",
    backgroundColor: "#e0e0e0",
  },
  callButton: {
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "#fff",
  },
  incomingCall: {
    marginTop: "20px",
    padding: "15px",
    border: "1px solid #ffcc00",
    borderRadius: "5px",
    backgroundColor: "#fff8e1",
  },
  answerButton: {
    padding: "10px",
    fontSize: "16px",
    marginRight: "10px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#28a745",
    color: "#fff",
    cursor: "pointer",
  },
  rejectButton: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#dc3545",
    color: "#fff",
    cursor: "pointer",
  },
  hangupSection: {
    marginTop: "20px",
  },
  hangupButton: {
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#dc3545",
    color: "#fff",
    cursor: "pointer",
  },
};

export default TwilioInboundCallHandler;
