
import React from "react";
import { Button } from "@/components/ui/button";

const DialPad = ({
  phoneNumber,
  setPhoneNumber,
  isCallActive = false,
}) => {
  const dialNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];

  const handleKeyPress = (key) => {
    setPhoneNumber(phoneNumber + key);
  };

  const handleBackspace = () => {
    if (phoneNumber.length > 0) {
      setPhoneNumber(phoneNumber.slice(0, -1));
    }
  };

  if (isCallActive) {
    return null; // Don't render the DialPad when a call is active
  }

  return (
    <div className="mt-4">
      <div className="grid grid-cols-3 gap-3">
        {dialNumbers.map((num) => (
          <Button
            key={num}
            type="button"
            variant="outline"
            className="h-12 text-lg font-medium"
            onClick={() => handleKeyPress(num)}
          >
            {num}
          </Button>
        ))}
      </div>
      
      <div className="mt-3 flex justify-center">
        <Button 
          variant="outline"
          className="h-12 px-4"
          onClick={handleBackspace}
        >
          Backspace
        </Button>
      </div>
    </div>
  );
};

export { DialPad };
