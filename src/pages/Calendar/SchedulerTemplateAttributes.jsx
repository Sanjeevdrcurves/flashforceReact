import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { DataGrid } from "@/components";
import { SketchPicker } from "react-color";
import { FaFillDrip, FaSave,FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

// Interval options (in minutes)
const intervalOptions = [
  15, 30, 45, 60, 75, 90, 105, 120, 135, 150,
  165, 180, 195, 210, 225, 240, 255, 270, 285, 300,
];

export default function SchedulerTemplateAttributes() {
  const [schedulerTemplates, setSchedulerTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [attributes, setAttributes] = useState([]);
  const [showColorPickerIndex, setShowColorPickerIndex] = useState(null);
  const { userId, companyId } = useSelector((state) => state.AuthReducerKey);
  const [eventTypes, setEventTypes] = useState([]);
  const [bulkUpdateDrawerOpen, setBulkUpdateDrawerOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [showDropdown, setShowDropdown] = useState(false);
  const [presets, setPresets] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState(""); 
  const [cloneModalOpen, setCloneModalOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
 // const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [bulkUpdateData, setBulkUpdateData] = useState({
    timeFrom: "",
    timeTo: "",
    interval: "",
    eventTypeId: "",
    doubleBooking: false,
    noBooking: false,
    schedulerColor: "#ffffff",
  });

  useEffect(() => {
    loadSchedulerTemplates();
    loadEventTypes();
  }, [companyId]);
  
  
  const loadPresets = async (templateId) => {
    try {
      const { data } = await axios.get(`${API_URL}/Calendar/GetSchedulerTemplatePreset?schedulerTemplateID=${templateId}`);
      setPresets(data);
    } catch (error) {
      toast.error("Failed to load presets.");
    }
  };
  
  const loadSchedulerTemplates = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/Calendar/GetAllSchedulerTemplate?companyId=${companyId}`
      );
      setSchedulerTemplates(data);
    } catch (error) {
      toast.error("Failed to load scheduler templates.");
    }
  };

  const loadAttributes = async (templateId) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/Calendar/GetAllSchedulerTemplateAttribute?schedulerTemplateId=${templateId}`
      );
      setAttributes(
        data.map((attr) => ({
          ...attr,
          schedulerColor: attr.schedulerColor || "#ffffff",
        }))
      );
    } catch (error) {
      toast.error("Failed to load attributes.");
    }
  };

  const loadEventTypes = async () => {
    try {
      const { data } = await axios.get(
                 `${API_URL}/Calendar/GetEventTypeById`, 
                 { params: { EventTypeId: 0, CompanyId: companyId, Type:"All" } } // Passing query parameters correctly
             );
      setEventTypes(data);
    } catch (error) {
      toast.error("Failed to load event types.");
    }
  };

  const handleTemplateChange = (e) => {
    const id = e.target.value;
    setSelectedTemplateId(id);
    if (id) {
       loadAttributes(id);
       loadPresets(id);  // Load presets for this template
    }
  };

  const handleCheckboxChange = (index, field) => {
    setAttributes((prev) =>
      prev.map((attr, i) =>
        i === index ? { ...attr, [field]: !attr[field] } : attr
      )
    );
  };

  const handleColorChange = (index, color) => {
    setAttributes((prev) =>
      prev.map((attr, i) =>
        i === index ? { ...attr, schedulerColor: color.hex } : attr
      )
    );
  };

  const handleUpdateRow = async (index) => {
    try {debugger
      const updatedRow = attributes[index];
      // Ensure the property names match exactly what the C# DTO expects:
      await axios.post(`${API_URL}/Calendar/UpdateSchedulerTemplateAttribute`, {
        SchedulerTemplateAttributeId: updatedRow.schedulerTemplateAttributesID, // use the correct property name
        SchedulerTemplateId: updatedRow.schedulerTemplateID,
        TimeFrom: updatedRow.timeFrom,
        TimeTo: updatedRow.timeTo,
        Interval: updatedRow.interval,
        SchedulerColor: updatedRow.schedulerColor,
        DoubleBooking: updatedRow.doubleBooking, // send boolean
        NoBooking: updatedRow.noBooking,         // send boolean
        EventId: updatedRow.eventTypeId,
        ModifiedBy: userId,
        CompanyId: companyId
      });
      toast.success("Row updated successfully!")
      if (selectedTemplateId) {
        await loadAttributes(selectedTemplateId);
      }
    } catch (error) {
      console.error("Update error:", error.response?.data || error);
      toast.error("Failed to update row.");
    }
  };
  
  const handleDeleteRow = async (index) => {
    try {
      // Ask the user for confirmation before deleting.
      const confirmed = window.confirm("Are you sure you want to delete this slot?");
      if (!confirmed) return;
  
      const updatedRow = attributes[index];
      await axios.post(`${API_URL}/Calendar/DeleteTemplateAttribute`, {
        SchedulerTemplateAttributeId: updatedRow.schedulerTemplateAttributesID,
        DuplicateNum: 0,
        CreatedBy: userId,
      });
      toast.success("Slot deleted successfully!");
      if (selectedTemplateId) {
        await loadAttributes(selectedTemplateId);
      }
    } catch (error) {
      console.error("Delete error:", error.response?.data || error);
      toast.error("Failed to delete row.");
    }
  };
  
  // Function to clone the template
  const handleCloneTemplate = async () => {
    if (!newTemplateName.trim()) {
      toast.error("Please enter a valid template name.");
      return;
    }
    const selectedIdsString = Array.from(selectedRows).join(",");
    try {
      await axios.post(`${API_URL}/Calendar/CloneSchedulerTemplate`, {
        OriginalTemplateId: selectedTemplateId,
        SchedulerTemplateAttributeIds:selectedIdsString,
        NewTemplateName: newTemplateName,
        CompanyId: companyId,
        CreatedBy: userId,
      });

      toast.success("Template cloned successfully!");
      setCloneModalOpen(false);
      setNewTemplateName("");
      loadSchedulerTemplates(); // Reload templates
    } catch (error) {
      console.error("Clone template error:", error.response?.data || error);
      toast.error("Failed to clone template.");
    }
  };
  
  // New function to handle duplication
   const handleDuplicateRow = async (index, duplicateNum) => {
    try {
      debugger
      const updatedRow = attributes[index];
      await axios.post(`${API_URL}/Calendar/SchedulerTemplateAttributeDuplicates`, {
        SchedulerTemplateAttributeId: updatedRow.schedulerTemplateAttributesID,
        DuplicateNum: duplicateNum,
        CreatedBy: userId,
      });
      toast.success("Duplicate slot(s) added successfully!");
      if (selectedTemplateId) {
        await loadAttributes(selectedTemplateId);
      }
    } catch (error) {
      console.error("Duplicate error:", error.response?.data || error);
      toast.error("Failed to add duplicate slot(s).");
    }
  };


  const handleCheckboxChange1 = (id) => {
    setSelectedRows((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(id)) {
        newSelection.delete(id);
      } else {
        newSelection.add(id);
      }
      return newSelection;
    });
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedRows(new Set(attributes.map((row) => row.schedulerTemplateAttributesID)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleBulkUpdate = async () => {
    // Ensure required fields are selected
    if (!bulkUpdateData.interval) {
        toast.error("Please select an Interval.");
        return;
    }

    if (!bulkUpdateData.eventTypeId) {
        toast.error("Please select an Event.");
        return;
    }

    // Get selected row IDs as a comma-separated string
    const selectedIdsString = Array.from(selectedRows).join(",");

    // Ensure at least one row is selected
    if (!selectedIdsString) {
        toast.error("No rows selected for bulk update.");
        return;
    }

    try {
        debugger;
        await axios.post(`${API_URL}/Calendar/UpdateBulkSchedulerTemplateAttributes`, {
            SchedulerTemplateAttributeIds: selectedIdsString, // Sending IDs as a comma-separated string
            SchedulerTemplateId: selectedTemplateId,
            Interval: bulkUpdateData.interval,
            SchedulerColor: bulkUpdateData.schedulerColor,
            DoubleBooking: bulkUpdateData.doubleBooking,
            NoBooking: bulkUpdateData.noBooking,
            EventId: bulkUpdateData.eventTypeId,
            ModifiedBy: userId,
            CompanyId: companyId,
        });

        toast.success("Bulk update successful!");
        setBulkUpdateDrawerOpen(false);
        if (selectedTemplateId) {
            await loadAttributes(selectedTemplateId);
        }
    } catch (error) {
        console.error("Bulk update error:", error.response?.data || error);
        toast.error("Failed to update selected rows.");
    }
};

const handlePreset = async (presetId) => {
  // Ensure required fields are selected
 debugger
  if (!presetId) return;
  

  // Get selected row IDs as a comma-separated string
  const selectedIdsString = Array.from(selectedRows).join(",");

 

  try {
      debugger;
      await axios.post(`${API_URL}/Calendar/UpdateSchedulerTemplateAttributesWithPreset`, {
          SchedulerTemplateAttributeIds: selectedIdsString, // Sending IDs as a comma-separated string
          PresetId:presetId,
          ModifiedBy: userId,
      });

          await loadAttributes(selectedTemplateId);
          await loadPresets(selectedTemplateId);
  } catch (error) {
      console.error("Bulk update error:", error.response?.data || error);
      toast.error("Failed to update selected rows.");
  }
};

const [presetModalOpen, setPresetModalOpen] = useState(false);
const [presetName, setPresetName] = useState("");
const [selectedPresetRow, setSelectedPresetRow] = useState(null);

const handleSaveAsPreset = (index) => {
  setSelectedPresetRow(attributes[index]);
  setPresetModalOpen(true);
};

const handleConfirmSavePreset = async () => {
  if (!presetName.trim()) {
    toast.error("Please enter a preset name.");
    return;
  }debugger

  try {
    await axios.post(`${API_URL}/Calendar/AddSchedulerTemplatePreset`, {
      PresetName: presetName, // Store preset name
     // SchedulerTemplateAttributeId: selectedPresetRow.schedulerTemplateAttributesID,
      SchedulerTemplatePresetID:0,
      CompanyId: companyId,
      SchedulerTemplateId: selectedPresetRow.schedulerTemplateID,
      TimeFrom: selectedPresetRow.timeFrom,
      TimeTo: selectedPresetRow.timeTo,
      Interval: selectedPresetRow.interval,
      SchedulerColor: selectedPresetRow.schedulerColor,
      DoubleBooking: selectedPresetRow.doubleBooking,
      NoBooking: selectedPresetRow.noBooking,
      EventTypeId: selectedPresetRow.eventTypeId,
      CreatedBy: userId
    });

    toast.success("Preset saved successfully!");
    loadPresets(selectedPresetRow.schedulerTemplateID);
    setPresetModalOpen(false);
    setPresetName(""); // Reset input
  } catch (error) { debugger
    console.error("Preset save error:", error.response?.data || error);
    toast.error("Failed to save as preset.");
  }
};

  const handleColorChange1 = (color) => {
    setBulkUpdateData({ ...bulkUpdateData, schedulerColor: color.hex });
  };
  const columns = [
    {
      id: "checkbox",
      header: <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />,
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selectedRows.has(row.original.schedulerTemplateAttributesID)}
          onChange={() => handleCheckboxChange1(row.original.schedulerTemplateAttributesID)}
        />
      ),
    },

    { accessorKey: "timeFrom", header: "Time From" },
    { accessorKey: "timeTo", header: "Time To" },
    {
      header: "Interval",
      cell: ({ row }) => (
        <select
          value={row.original.interval || ""}
          onChange={(e) => {
            const newInterval = e.target.value;
            setAttributes((prev) =>
              prev.map((attr, i) =>
                i === row.index ? { ...attr, interval: newInterval } : attr
              )
            );
          }}
          className="border rounded p-1"
        >
          <option value="">Select Interval</option>
          {intervalOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt} Min
            </option>
          ))}
        </select>
      ),
    },
    {
      accessorKey: "eventTypeId",
      header: "Event",
      cell: ({ row }) => (
        <select
        value={row.original.eventTypeId || ""}
          onChange={(e) => { 
            const newValue = e.target.value;
            setAttributes((prev) =>
              prev.map((attr, i) =>
                i === row.index ? { ...attr, eventTypeId: newValue } : attr
              )
            );
          }}
          className="border rounded p-1"
        >
          <option value="">Select Event</option>
          {eventTypes.map((type) => (
            <option key={type.eventTypeId} value={type.eventTypeId}>
              {type.eventName}
            </option>
          ))}
        </select>
      ),
    },
    {
      header: "Double Booking",
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.original.doubleBooking}
          disabled={row.original.noBooking}
          onChange={() => handleCheckboxChange(row.index, "doubleBooking")}
        />
      ),
    },
    {
      header: "No Booking",
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.original.noBooking}
          onChange={() => handleCheckboxChange(row.index, "noBooking")}
        />
      ),
    },
    {
      header: "Color",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full border"
            style={{ backgroundColor: row.original.schedulerColor || "#ffffff" }}
          ></div>
          <button
            className="text-gray-600"
            onClick={(e) => {
              e.stopPropagation();
              setShowColorPickerIndex(row.index);
            }}
          >
            <FaFillDrip size={20} />
          </button>
        </div>
      ),
    },
    {
      header: "Update",
      cell: ({ row }) => {
        const [showDropdown, setShowDropdown] = useState(false);
    
        return(
       
        <div className="flex items-center gap-2">
          <button
            className="text-blue-600"
            onClick={() => handleUpdateRow(row.index)}
          >
            <FaSave size={20} />
          </button>
          <button
            className="text-red-600"
            onClick={() => handleDeleteRow(row.index)}
          >
             <FaTrash size={20} />
          </button>
          <div className="relative">
        {/* Three-dot Button */}
        <button
          className="text-gray-600 hover:text-gray-800 p-1"
          onClick={() => setShowDropdown((prev) => !prev)}
        >
          ⋮
        </button>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md z-50">
            <button
              className="block px-4 py-2 text-left text-blue-600 hover:bg-blue-100 w-full"
              onClick={() => {
                handleSaveAsPreset(row.index);
                setShowDropdown(false);
              }}
            >
              Save as Preset
            </button>
          </div>
        )}
      </div>
        </div>
      );
    },
    },
    {
      header: "Action",
      cell: ({ row }) => (
        <select
          defaultValue=""
          onChange={(e) => {
            const duplicateNum = parseInt(e.target.value, 10);
            if (duplicateNum) {
              handleDuplicateRow(row.index, duplicateNum);
            }
          }}
          className="border rounded p-1"
        >
          <option value="">Action</option>
          <option value="1">Add 1 Duplicate slot</option>
          <option value="2">Add 2 Duplicate slot</option>
          <option value="3">Add 3 Duplicate slot</option>
          <option value="4">Add 4 Duplicate slot</option>
          <option value="5">Add 5 Duplicate slot</option>
        </select>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex items-center gap-4 mb-4">
  {/* Scheduler Template Dropdown */}
  <div className="flex flex-col">
    <label className="text-gray-700 font-medium mb-1">Scheduler Template Attributes</label>
    <select
      value={selectedTemplateId}
      onChange={handleTemplateChange}
      className="border p-2 rounded w-64"
    >
      <option value="">Select Scheduler Template</option>
      {schedulerTemplates.map((template) => (
        <option key={template.schedulerTemplateId} value={template.schedulerTemplateId}>
          {template.description}
        </option>
      ))}
    </select>
  </div>

  {/* Preset Dropdown */}
  <div className="flex flex-col">
    <label className="text-gray-700 font-medium mb-1">Preset</label>
    <select
      value={selectedPreset}
      onChange={(e) => {
        const presetId = e.target.value;
        setSelectedPreset(presetId);
        handlePreset(presetId);
      }}
      className="border p-2 rounded w-64"
    >
      <option value="">Select Preset</option>
      {presets.map((preset) => (
        <option key={preset.schedulerTemplatePresetID} value={preset.schedulerTemplatePresetID}>
          {preset.presetName}
        </option>
      ))}
    </select>
  </div>

  {/* Bulk Update Button */}
  <button
    className="bg-blue-600 text-white px-6 py-2 rounded mt-5 hover:bg-blue-700 transition"
    onClick={() => setBulkUpdateDrawerOpen(true)}
  >
    Bulk Update
  </button>

   {/* Clone Template Button */}
   <button
          className="bg-purple-600 text-white px-6 py-2 rounded mt-5 hover:bg-purple-700 transition"
          onClick={() => setCloneModalOpen(true)}
          disabled={!selectedTemplateId}
        >
          Clone Template
        </button>
</div>

      <DataGrid
        columns={columns}
        data={attributes}
        pagination={{ size: 10 }}
        layout={{ card: true }}
      />

      {/* Color Picker Popup */}
      {showColorPickerIndex !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <SketchPicker
              color={
                attributes[showColorPickerIndex]?.schedulerColor || "#ffffff"
              }
              onChangeComplete={(color) =>
                handleColorChange(showColorPickerIndex, color)
              }
            />
            <button
              onClick={() => setShowColorPickerIndex(null)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

{/* Bulk Update Drawer */}
{bulkUpdateDrawerOpen && (
  <div className="fixed inset-0 flex justify-end bg-black bg-opacity-50 z-50">
    <div className="bg-white w-96 h-full p-6 shadow-lg flex flex-col relative">
      <h2 className="text-xl font-bold mb-4 border-b pb-2">Bulk Update Fields</h2>

      {/* Interval Selection */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Interval</label>
        <select 
          value={bulkUpdateData.interval} 
          onChange={(e) => setBulkUpdateData({ ...bulkUpdateData, interval: e.target.value })} 
          className="border rounded px-3 py-2 w-full focus:ring focus:ring-blue-300"
        >
          <option value="">Select Interval</option>
          {intervalOptions.map((opt) => (
            <option key={opt} value={opt}>{opt} Min</option>
          ))}
        </select>
      </div>

      {/* Event Selection */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Event</label>
        <select 
          value={bulkUpdateData.eventTypeId} 
          onChange={(e) => setBulkUpdateData({ ...bulkUpdateData, eventTypeId: e.target.value })} 
          className="border rounded px-3 py-2 w-full focus:ring focus:ring-blue-300"
        >
          <option value="">Select Event</option>
          {eventTypes.map((type) => (
            <option key={type.eventTypeId} value={type.eventTypeId}>{type.eventName}</option>
          ))}
        </select>
      </div>

      {/* Double Booking & No Booking Checkboxes */}
      <div className="mb-4 flex flex-col gap-2">
        <label className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            checked={bulkUpdateData.doubleBooking} 
            onChange={() => setBulkUpdateData({ ...bulkUpdateData, doubleBooking: !bulkUpdateData.doubleBooking })} 
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-300"
          />
          <span className="text-gray-700">Double Booking</span>
        </label>

        <label className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            checked={bulkUpdateData.noBooking} 
            onChange={() => setBulkUpdateData({ ...bulkUpdateData, noBooking: !bulkUpdateData.noBooking })} 
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-300"
          />
          <span className="text-gray-700">No Booking</span>
        </label>
      </div>

      {/* Color Picker with Icon Toggle */}
      <div className="mb-4 relative">
        <label className="block text-gray-700 font-medium mb-1">Color</label>
        <div className="flex items-center space-x-3">
          {/* Color Preview Button */}
          <div 
            className="w-10 h-10 rounded-full border cursor-pointer shadow-md" 
            style={{ backgroundColor: bulkUpdateData.schedulerColor }} 
            onClick={() => setBulkUpdateData({ ...bulkUpdateData, showColorPicker: !bulkUpdateData.showColorPicker })}
          ></div>

          <button 
            className="text-gray-600 hover:text-gray-800 transition"
            onClick={() => setBulkUpdateData({ ...bulkUpdateData, showColorPicker: !bulkUpdateData.showColorPicker })}
          >
            🎨 Pick Color
          </button>
        </div>

        {/* Color Picker Popup (Properly Aligned Below the Color Box) */}
        {bulkUpdateData.showColorPicker && (
          <div className="absolute top-full left-0 mt-2 bg-white p-3 shadow-lg rounded border z-50">
            <SketchPicker 
              color={bulkUpdateData.schedulerColor} 
              onChangeComplete={(color) => setBulkUpdateData({ ...bulkUpdateData, schedulerColor: color.hex })}
            />
            <button 
              className="mt-2 bg-red-600 text-white px-3 py-1 rounded w-full text-center block hover:bg-red-700"
              onClick={() => setBulkUpdateData({ ...bulkUpdateData, showColorPicker: false })}
            >
              Close
            </button>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 mt-auto border-t pt-4">
        <button 
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
          onClick={() => setBulkUpdateDrawerOpen(false)}
        >
          Cancel
        </button>

        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={handleBulkUpdate}
        >
          Apply Changes
        </button>
      </div>
    </div>
  </div>
)}

{/* Preset Save Modal */}
{presetModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-xl font-bold mb-4">Save as Preset</h2>

      <label className="block text-gray-700 font-medium mb-2">Preset Name</label>
      <input
        type="text"
        value={presetName}
        onChange={(e) => setPresetName(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        placeholder="Enter preset name"
      />

      <div className="flex justify-end gap-2">
        <button
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          onClick={() => setPresetModalOpen(false)}
        >
          Cancel
        </button>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleConfirmSavePreset}
        >
          Save Preset
        </button>
      </div>
    </div>
  </div>
)}

  {/* Clone Template Modal */}
  {cloneModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Clone Template</h2>

            <label className="block text-gray-700 font-medium mb-2">New Template Name</label>
            <input
              type="text"
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="Enter new template name"
            />

            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                onClick={() => setCloneModalOpen(false)}
              >
                Cancel
              </button>

              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleCloneTemplate}
              >
                Clone Template
              </button>
            </div>
          </div>
        </div>
      )}
   


    </div>
  );
}
