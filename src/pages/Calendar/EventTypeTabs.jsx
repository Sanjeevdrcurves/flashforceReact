import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from 'sonner';
import {
  DataGrid,
  DataGridColumnVisibility,
  KeenIcon,
  useDataGrid,
} from "@/components";
import EventType from "./EventType";
import Group from "./Group";
const EventTypeTabs = ({ eventTypeColumns, eventTypeData, groupColumns, groupData }) => {
  const [activeTab, setActiveTab] = useState("eventType");
  const [showEventTypeDrawer, setShowEventTypeDrawer] = useState(false);
  const [showGroupDrawer, setShowGroupDrawer] = useState(false);

  return (
    <div>
      {/* Tabs */}
      <div className="border-b mb-4">
        <button
          onClick={() => setActiveTab("eventType")}
          className={`px-4 py-2 ${
            activeTab === "eventType" ? "border-b-2 border-blue-500 font-bold" : "text-gray-600"
          }`}
        >
          Event Type
        </button>
        <button
          onClick={() => setActiveTab("group")}
          className={`px-4 py-2 ml-4 ${
            activeTab === "group" ? "border-b-2 border-blue-500 font-bold" : "text-gray-600"
          }`}
        >
          Group
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "eventType" && (
        <EventType />
      )}
      {activeTab === "group" && (
        <Group />
      )}
    </div>
  );
};

export default EventTypeTabs;
