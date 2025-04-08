import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

export default function CustomFormManager({ formId, companyId }) {
  const [formName, setFormName] = useState("");
  const [entries, setEntries] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const[objectFields,setobjectFields]=useState("")

  // Fetch entries from the API
  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(
          `${API_URL}/CustomObject/GetObjects/0`
        );
        console.log("API Response:", response.data);

        const fetchedEntries = Array.isArray(response.data)
          ? response.data
          : response.data?.data;
        if (fetchedEntries) {
          setEntries(fetchedEntries);
        } else {
          throw new Error("Unexpected API response format.");
        }
      } catch (err) {
        console.error(
          "Error fetching entries:",
          err.response ? err.response.data : err.message
        );
        const errorMsg = `Failed to load entries: ${err.message}`;
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [formId, companyId]);

  // Handle Add/Update form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formName.trim()) return;

    try {
      const action = editId !== null ? "update" : "insert";
      const requestData = { objectName:formName, action,objectFields:objectFields };
      if (editId !== null) {
        requestData.objectID = editId;
      }

      const response = await axios.post(
        `${API_URL}/CustomObject/AddObject`,
        requestData
      );
      
      console.log("API Response:", response.data);

      if (action === "update") {
        setEntries((prevEntries) =>
          prevEntries.map((entry) =>
            entry.objectID === editId
              ? { ...entry, objectName:formName }
              : entry
          )
        );
        toast.success("Custom form updated successfully!");
      } else {
        const newEntry = response.data?.masterCustomFormFieldId
          ? response.data
          : {
            objectID:
               0,
                objectName:formName,
            };

        setEntries((prevEntries) => [...prevEntries, newEntry]);
        toast.success("Custom form added successfully!");
      }

      setFormName("");
      setEditId(null);
    } catch (err) {
      console.error(
        "Submit Error:",
        err.response ? err.response.data : err.message
      );
      const errorMsg = `Failed to submit entry: ${err.message}`;
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  // Prepare the form for editing an entry
  const handleEdit = (entry) => {
    debugger
    setFormName(entry.objectName);
    setEditId(entry.objectID);
    setobjectFields(entry.objectFields);
    toast("Editing custom form", {
      description: `You are editing "${entry.formName}"`,
    });
  };

  // Handle deletion of an entry with confirmation
  const handleDelete = async (id) => {
    const entryToDelete = entries.find(
      (entry) => entry.objectID === id
    );
    if (!entryToDelete) return;

    const isConfirmed = window.confirm(
      `Are you sure you want to delete "${entryToDelete.objectName}"?`
    );
    if (!isConfirmed) return;

    try {
      // const requestData = {
      //   objectID: id,
      //   formName: entryToDelete.formName,
      //   action: "delete",
      // };

      // console.log("Sending Delete Request:", requestData);

      const response = await axios.delete(`${API_URL}/CustomObject/DeleteObject/${id}`);
      console.log("Delete API Response:", response.data);
debugger
      if (response.status === 200) {
        setEntries((prevEntries) =>
          prevEntries.filter(
            (entry) => entry.objectID !== id
          )
        );
        toast.success("Custom form deleted successfully!");
      } else {
        throw new Error("Delete request failed.");
      }
    } catch (err) {
      console.error(
        "Delete Error:",
        err.response ? err.response.data : err.message
      );
      const errorMsg = `Failed to delete entry: ${err.message}`;
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Manage Object
        </h2>

        {loading && (
          <p className="text-blue-600 mb-4">Loading entries...</p>
        )}
        {error && (
          <p className="text-red-600 mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter Form Name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            {editId !== null ? "Update" : "Add"}
          </button>
        </form>

        <h3 className="text-2xl font-semibold mb-4 text-gray-700">
          Custom Form List
        </h3>
        {entries.length === 0 ? (
          <p className="text-gray-500">No custom forms found.</p>
        ) : (
          <ul className="space-y-3">
            {entries.map((entry) => (
              <li
                key={entry.masterCustomFormFieldId}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-md shadow-sm"
              >
                <span className="text-lg text-gray-800">
                  {entry.objectName || "Unnamed Form"}
                </span>
                <div>
                  <button
                    onClick={() => handleEdit(entry)}
                    className="mr-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      handleDelete(entry.objectID)
                    }
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
