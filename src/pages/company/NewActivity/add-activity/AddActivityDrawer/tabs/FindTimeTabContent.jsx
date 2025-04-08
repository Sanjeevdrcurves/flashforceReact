import React from "react";
import { FindTimeTab } from "../FindTimeTab";

export const FindTimeTabContent = ({ formState }) => {
  return (
    <FindTimeTab 
      startDate={formState.startDate}
      dueDate={formState.dueDate}
      startTime={formState.startTime}
      dueTime={formState.dueTime}
      setStartDate={formState.setStartDate}
      setDueDate={formState.setDueDate}
      setStartTime={formState.setStartTime}
      setDueTime={formState.setDueTime}
      activities={formState.activities || []}
    />
  );
};
