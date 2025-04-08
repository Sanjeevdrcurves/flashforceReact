import React from "react";
import { KeenIcon } from "@/components";
const getSeverityBadge = (severity) => {
  switch (severity) {
    case 'High':
      return 'badge-danger';
    case 'Medium':
      return 'badge-warning';
    case 'Low':
      return 'badge-success';
    case 'Critical':
      return 'badge-primary';
    default:
      return 'badge-secondary';
  }
};
const RightDrawer = ({ isDrawerOpen, onClose, selectedItem }) => {
  if (!selectedItem) {
    return null; // Return nothing if no data is provided
  }
 // Format the timestamp to 'DD MMM YYYY' (e.g., '19 Dec 2024')
 const formattedDate = new Date(selectedItem.timestamp).toLocaleDateString('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});
  return (
    <div className={`right-drawer ${isDrawerOpen ? "open" : ""}`}>
      {/* Drawer Header */}
      <div className="drawer-header">
        <div className="flex justify-between items-center w-full">
          <div>
              <span className={`badge ${getSeverityBadge(selectedItem.severity)}`}>
            {selectedItem.severity}
          </span>
            <span className="text-gray-500 ml-1 text-xs">
              {formattedDate}
              
            </span>
          </div>
          <button
            onClick={onClose}
            className="btn btn-icon btn-icon-lg size-9 rounded-full hover:bg-primary-light hover:text-primary text-gray-500"
          >
            <KeenIcon icon="cross" />
          </button>
        </div>
      </div>

      {/* Title Section */}
      <div className="drawer-title p-4 rounded-md">
      <h2>Event Type:</h2> <h2 className="text-xs font-bold text-gray-900 mt-2">{selectedItem.eventType}</h2>
      <h2>Action Taken:</h2>   <h2 className="text-gray-900  font-bold text-xs mt-2">{selectedItem.actionTaken}</h2>
      </div>

      {/* Details Section */}
      <div className="drawer-body p-4">
        <div className="scrollable-x-auto pb-3">
          <table className="table align-middle text-sm text-gray-500" id="general_info_table">
          <tbody>
              {/* Map each key-value pair */}
              {Object.entries(selectedItem).map(([key, value]) => (
                 (
                  <tr key={key}>
                    <td className="text-gray-600 font-normal">{key}</td>
                    <td className="text-gray-800 font-normal">{value}</td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export { RightDrawer };
