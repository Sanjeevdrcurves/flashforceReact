import React, { useState } from "react";
import EventType from "./EventType";
import Group from "./Group";
import SchedulerTemplate from "./SchedulerTemplate";
import SchedulerTemplateAttributes from "./SchedulerTemplateAttributes";
import WeeklySchedule from "./WeeklySchedule";

const SchedulerTemplateTabs = () => {
  const [activeTab, setActiveTab] = useState("schedulerTemplate");

  return (
    <div>
      {/* Tabs Navigation */}
      <div className="border-b mb-4 flex space-x-4">
        {[
     
          { key: "schedulerTemplate", label: "Scheduler Template" },
          { key: "schedulerTemplateAttributes", label: "Scheduler Template Attributes" },
          { key: "weeklySchedule", label: "Weekly Schedule" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 ${
              activeTab === key ? "border-b-2 border-blue-500 font-bold" : "text-gray-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
   
      {activeTab === "schedulerTemplate" && <SchedulerTemplate />}
      {activeTab === "schedulerTemplateAttributes" && <SchedulerTemplateAttributes />}
      {activeTab === "weeklySchedule" && <WeeklySchedule />}
    </div>
  );
};

export default SchedulerTemplateTabs;
