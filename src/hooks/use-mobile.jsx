
import * as React from "react";

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 992;
const DESKTOP_BREAKPOINT = 1200;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    // Function to check if the screen is mobile-sized
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Check on initial load
    checkMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile);
    
    // Clean up event listener
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

// Additional utility function to determine device type more precisely
export function useDeviceType() {
  const [deviceType, setDeviceType] = React.useState("desktop");
  
  React.useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      if (width < MOBILE_BREAKPOINT) {
        setDeviceType("mobile");
      } else if (width < DESKTOP_BREAKPOINT) {
        setDeviceType("tablet");
      } else {
        setDeviceType("desktop");
      }
    };
    
    checkDeviceType();
    window.addEventListener("resize", checkDeviceType);
    
    return () => window.removeEventListener("resize", checkDeviceType);
  }, []);
  
  return deviceType;
}

// Hook to get current window width
export function useWindowWidth() {
  const [windowWidth, setWindowWidth] = React.useState(undefined);
  
  React.useEffect(() => {
    const updateWidth = () => {
      setWindowWidth(window.innerWidth);
    };
    
    // Set width on initial load
    updateWidth();
    
    // Update width on resize
    window.addEventListener('resize', updateWidth);
    
    return () => window.removeEventListener('resize', updateWidth);
  }, []);
  
  return windowWidth;
}
