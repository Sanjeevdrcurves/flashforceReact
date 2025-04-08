import React, { useState } from "react";
import { Tab } from "@headlessui/react";

// Dummy Data
const dummyData = {
  serviceCalendars: [
    { id: 1, name: "Haircut", staff: "John Doe", duration: "30 mins", price: "$20" },
    { id: 2, name: "Massage", staff: "Jane Smith", duration: "60 mins", price: "$50" },
  ],
  bookings: [
    { id: 1, customer: "Alice Johnson", service: "Haircut", date: "2025-04-10", status: "Confirmed" },
    { id: 2, customer: "Bob Brown", service: "Massage", date: "2025-04-12", status: "Pending" },
  ],
  staff: [
    { id: 1, name: "John Doe", assignedService: "Haircut" },
    { id: 2, name: "Jane Smith", assignedService: "Massage" },
  ],
  payments: [
    { id: 1, bookingId: 1, amount: "$20", status: "Paid" },
    { id: 2, bookingId: 2, amount: "$50", status: "Pending" },
  ],
};

const FlashforceDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("calendars");

  return (
    <div className="container mx-auto p-6">
      {/* Tabs */}
      <Tab.Group>
        <Tab.List className="flex space-x-4 border-b pb-2">
          {["calendars", "bookings", "staff", "payments"].map((tab) => (
            <Tab
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-2 rounded-md cursor-pointer ${
                selectedTab === tab ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels>
          {/* Service Calendars */}
          <Tab.Panel className="p-4" hidden={selectedTab !== "calendars"}>
            <Table title="Service Calendars" data={dummyData.serviceCalendars} columns={["Name", "Staff", "Duration", "Price"]} />
          </Tab.Panel>

          {/* Bookings */}
          <Tab.Panel className="p-4" hidden={selectedTab !== "bookings"}>
            <Table title="Bookings" data={dummyData.bookings} columns={["Customer", "Service", "Date", "Status"]} />
          </Tab.Panel>

          {/* Staff */}
          <Tab.Panel className="p-4" hidden={selectedTab !== "staff"}>
            <Table title="Staff Members" data={dummyData.staff} columns={["Name", "Assigned Service"]} />
          </Tab.Panel>

          {/* Payments */}
          <Tab.Panel className="p-4" hidden={selectedTab !== "payments"}>
            <Table title="Payments" data={dummyData.payments} columns={["Booking ID", "Amount", "Status"]} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

// Table Component
const Table = ({ title, data, columns }) => {
  return (
    <div className="shadow-md rounded-lg overflow-hidden">
      <h2 className="text-lg font-semibold bg-gray-100 p-4">{title}</h2>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="border-b bg-gray-50">
            {columns.map((col) => (
              <th key={col} className="p-3 text-left text-sm font-medium text-gray-600 uppercase">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b">
              {Object.values(row).map((value, index) => (
                <td key={index} className="p-3 text-sm text-gray-700">{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FlashforceDashboard;
