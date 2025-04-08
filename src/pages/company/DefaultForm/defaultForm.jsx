import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router";

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const FIELD_TYPES = [
  "text",
  "email",
  "number",
  "date",
  "tel",
  "select",
  "checkbox",
  "radio",
  "multiselect",
  "select2",
  "textarea",      // New field type: Textarea
  "timeDuration",  // New field type: Time Duration
];

const DEFAULT_FIELDS = [];

const AVAILABLE_COLORS = [
  "border-red-500",
  "border-green-500",
  "border-blue-500",
  "border-yellow-500",
  "border-purple-500",
];

const FormBuilder = () => {
  const { masterid } = useParams();
  console.log(masterid);
  const [FormId, setFormId] = useState(0);
  const [FormName, setFormName] = useState("");

  // NEW: Toggle switch state and handler
  const [toggleStatus, setToggleStatus] = useState(false);
  const handleToggleChange = async () => {
    const newStatus = !toggleStatus;
    setToggleStatus(newStatus);
    // try {
    //   // Make sure your API endpoint supports status updates!
    //   const response = await axios.post(
    //     `${API_URL}/CustomObject/UpdateStatus`,
    //     { status: newStatus }
    //   );
    //   console.log("Status updated:", response.data);
    // } catch (error) {
    //   console.error("Error updating status:", error);
    // }
  };

  const [sections, setSections] = useState([
    {
      id: Date.now(),
      name: "Section 1",
      color: AVAILABLE_COLORS[0],
      fields: [...DEFAULT_FIELDS],
    },
  ]);

  // Hardcoded for demo purposes
  const companyId = -1;
  const masterCustomFormFieldId = 27;

  useEffect(() => {
    const fetchLastSavedForm = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/CustomObject/GetObjects/${masterid}`
        );
        console.log("API response:", response.data);
        if (response.data && response.data.length > 0) {
          setFormId(response.data[0].objectID);
          setFormName(response.data[0].objectName);
          const lastForm = response.data[response.data.length - 1];
          console.log("Last form record:", lastForm);
          if (lastForm.objectFields) {
            const parsed = JSON.parse(lastForm.objectFields);
            console.log("Parsed JSON:", parsed);
            if (parsed.fields && Array.isArray(parsed.fields)) {
              setSections(parsed.fields);
            } else {
              console.error("Parsed JSON does not contain a 'fields' array.");
            }
          } else {
            console.error("No 'objectFields' found in the form record.");
          }
        } else {
          console.error("API response is empty or not an array.");
        }
      } catch (error) {
        console.error("Error fetching last saved form:", error);
      }
    };

    fetchLastSavedForm();
  }, [masterid]);

  // Drawer states and handlers
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState("core"); // "core" | "default"
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editingFieldId, setEditingFieldId] = useState(null);

  const [newField, setNewField] = useState({
    label: "",
    type: "text",
    required: false,
    optionsSource: "static",
    apiEndpoint: "",
    dbcoloumName: "",
    saveInColumn: false,
    hideFiled:false
  });
  const [optionInput, setOptionInput] = useState("");
  const [optionList, setOptionList] = useState([]);

  const handleAddSection = () => {
    const newSection = {
      id: Date.now(),
      name: `Section ${sections.length + 1}`,
      color: AVAILABLE_COLORS[sections.length % AVAILABLE_COLORS.length],
      fields: [],
    };
    setSections((prev) => [...prev, newSection]);
  };

  const handleSectionNameChange = (sectionId, newName) => {
    setSections((prevSections) =>
      prevSections.map((sec) =>
        sec.id === sectionId ? { ...sec, name: newName } : sec
      )
    );
  };

  const handleOpenAddDrawer = () => {
    setIsDrawerOpen(true);
    setIsEditing(false);
    setEditingFieldId(null);
    setEditingSectionId(null);
    setSelectedSectionId("");
    setDrawerMode("core");
    setNewField({
      label: "",
      type: "text",
      required: false,
      optionsSource: "static",
      apiEndpoint: "",
      dbcoloumName: "",
      saveInColumn: false,
      hideFiled:false,
    });
    setOptionInput("");
    setOptionList([]);
  };

  const handleOpenEditDrawer = (sectionId, field) => {
    setIsDrawerOpen(true);
    setIsEditing(true);
    setEditingSectionId(sectionId);
    setEditingFieldId(field.id);

    const existingSource = field.source || "core";
    setDrawerMode(existingSource);

    setNewField({
      label: field.label,
      type: field.type,
      required: field.required,
      hideFiled:field.hideFiled,
      dbcoloumName: field.dbcoloumName,
      optionsSource: field.optionsSource || "static",
      apiEndpoint: field.apiEndpoint || "",
      saveInColumn: field.saveInColumn || false,
    });

    if (
      ["select", "checkbox", "radio", "multiselect", "select2"].includes(
        field.type
      ) &&
      field.optionsSource !== "dynamic"
    ) {
      setOptionList(field.options || []);
    } else {
      setOptionList([]);
    }

    setSelectedSectionId(String(sectionId));
  };

  const handleSaveFieldFromDrawer = () => {
    if (!isEditing && !selectedSectionId) {
      alert("Please select a section.");
      return;
    }
    if (!newField.label.trim()) {
      alert("Please enter a label.");
      return;
    }

    isEditing ? handleUpdateExistingField() : handleAddNewField();
  };

  const handleAddNewField = () => {
    const finalField = {
      id: `${drawerMode}_${Date.now()}`,
      label: newField.label,
      type: newField.type,
      required: newField.required,
      hideFiled:newField.hideFiled,
      value: ["checkbox", "multiselect"].includes(newField.type) ? [] : "",
      error: "",
      dbcoloumName: newField.dbcoloumName,
      source: drawerMode,
      optionsSource: newField.optionsSource,
      apiEndpoint: newField.apiEndpoint.trim(),
      options: newField.optionsSource === "static" ? [...optionList] : [],
      saveInColumn: newField.saveInColumn,
    };

    setSections((prevSections) =>
      prevSections.map((section) => {
        if (String(section.id) === selectedSectionId) {
          return { ...section, fields: [...section.fields, finalField] };
        }
        return section;
      })
    );

    handleCloseDrawer();
  };

  const handleUpdateExistingField = () => {
    if (!editingSectionId || !editingFieldId) {
      alert("Error: missing editing IDs");
      return;
    }

    const updatedField = {
      id: editingFieldId,
      label: newField.label,
      type: newField.type,
      required: newField.required,
      hideFiled:newField.hideFiled,
      source: drawerMode,
      dbcoloumName: newField.dbcoloumName,
      optionsSource: newField.optionsSource,
      apiEndpoint: newField.apiEndpoint.trim(),
      options: newField.optionsSource === "static" ? [...optionList] : [],
      error: "",
      value: ["checkbox", "multiselect"].includes(newField.type) ? [] : "",
      saveInColumn: newField.saveInColumn,
    };

    setSections((prevSections) => {
      if (Number(selectedSectionId) !== editingSectionId) {
        return prevSections.map((section) => {
          if (section.id === editingSectionId) {
            const newFields = section.fields.filter((f) => f.id !== editingFieldId);
            return { ...section, fields: newFields };
          } else if (String(section.id) === selectedSectionId) {
            return {
              ...section,
              fields: [...section.fields, updatedField],
            };
          }
          return section;
        });
      }

      return prevSections.map((section) => {
        if (section.id !== editingSectionId) return section;

        const updatedFields = section.fields.map((field) => {
          if (field.id !== editingFieldId) return field;
          return { ...updatedField, value: field.value || updatedField.value };
        });
        return { ...section, fields: updatedFields };
      });
    });

    handleCloseDrawer();
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setIsEditing(false);
    setEditingFieldId(null);
    setEditingSectionId(null);
    setSelectedSectionId("");
    setDrawerMode("core");
    setNewField({
      label: "",
      type: "text",
      required: false,
      optionsSource: "static",
      apiEndpoint: "",
      hideFiled:false,
      dbcoloumName: "",
      saveInColumn: false,
    });
    setOptionInput("");
    setOptionList([]);
  };

  const handleDeleteField = (sectionId, fieldId) => {
    if (!window.confirm("Are you sure you want to delete this field?")) return;

    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          fields: section.fields.filter((f) => f.id !== fieldId),
        };
      })
    );
  };

  const handleMoveFieldUp = (sectionId, fieldIndex) => {
    if (fieldIndex === 0) return;
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id !== sectionId) return section;
        const newFields = [...section.fields];
        const temp = newFields[fieldIndex];
        newFields[fieldIndex] = newFields[fieldIndex - 1];
        newFields[fieldIndex - 1] = temp;
        return { ...section, fields: newFields };
      })
    );
  };

  const handleMoveFieldDown = (sectionId, fieldIndex) => {
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id !== sectionId) return section;
        const newFields = [...section.fields];
        if (fieldIndex === newFields.length - 1) return section;
        const temp = newFields[fieldIndex];
        newFields[fieldIndex] = newFields[fieldIndex + 1];
        newFields[fieldIndex + 1] = temp;
        return { ...section, fields: newFields };
      })
    );
  };

  const handleAddOption = () => {
    if (optionInput.trim()) {
      setOptionList((prev) => [...prev, optionInput.trim()]);
      setOptionInput("");
    }
  };

  const handleRemoveOption = (index) => {
    setOptionList((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    let isValid = true;
    const updatedSections = sections.map((section) => {
      const updatedFields = section.fields.map((field) => {
        if (field.required) {
          if (Array.isArray(field.value) && field.value.length === 0) {
            isValid = false;
            return { ...field, error: `${field.label} is required.` };
          } else if (
            !Array.isArray(field.value) &&
            !field.value?.toString().trim()
          ) {
            isValid = false;
            return { ...field, error: `${field.label} is required.` };
          }
        }
        return { ...field, error: "" };
      });
      return { ...section, fields: updatedFields };
    });
    setSections(updatedSections);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fields = sections.map((section) => {
      return {
        ...section,
        fields: section.fields.map((f) => {
          const { value, ...fieldSkeleton } = f;
          return fieldSkeleton;
        }),
      };
    });

    const payload = {
      objectID: masterid,
      objectName: FormName ? FormName : "test",
      objectFields: JSON.stringify({ fields }),
      createdBy: "0",
      status: toggleStatus ? 1 : 0,
    };

    try {
      const response = await axios.post(
        `${API_URL}/CustomObject/AddObject`,
        payload
      );
      console.log("Saved form:", response.data);
      alert("Form saved successfully!");
    } catch (err) {
      console.error("Error saving form:", err);
      alert("Error saving form. See console for details.");
    }
  };

  const handleFieldChange = (sectionId, fieldId, newValue, isChecked = false) => {
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          fields: section.fields.map((field) => {
            if (field.id !== fieldId) return field;

            if (field.type === "checkbox") {
              const arrVal = Array.isArray(field.value) ? [...field.value] : [];
              if (isChecked) {
                if (!arrVal.includes(newValue)) arrVal.push(newValue);
              } else {
                const idx = arrVal.indexOf(newValue);
                if (idx >= 0) arrVal.splice(idx, 1);
              }
              return { ...field, value: arrVal, error: "" };
            }

            if (field.type === "multiselect") {
              return { ...field, value: newValue, error: "" };
            }

            if (field.type === "radio") {
              return { ...field, value: newValue, error: "" };
            }

            if (field.type === "select" || field.type === "select2") {
              return { ...field, value: newValue, error: "" };
            }

            return { ...field, value: newValue, error: "" };
          }),
        };
      })
    );
  };

  const renderField = (field, sectionId) => {
    const { id, label, type, value, options } = field;

    const renderBasicInput = () => (
      <input
        type={type}
        value={value}
        onChange={(e) => handleFieldChange(sectionId, id, e.target.value)}
        placeholder={`Enter ${label}`}
        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    );

    const renderSingleSelect = () => (
      <select
        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={(e) => handleFieldChange(sectionId, id, e.target.value)}
      >
        <option value="">-- Select an option --</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );

    const renderMultiSelect = () => (
      <select
        multiple
        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={Array.isArray(value) ? value : []}
        onChange={(e) => {
          const selectedValues = Array.from(e.target.selectedOptions).map(
            (o) => o.value
          );
          handleFieldChange(sectionId, id, selectedValues);
        }}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );

    const renderCheckboxOrRadio = () => (
      <div className="flex flex-col space-y-2">
        {options.map((opt) => {
          const isChecked = Array.isArray(value)
            ? value.includes(opt)
            : value === opt;
          return (
            <label key={opt} className="inline-flex items-center">
              <input
                type={type}
                value={opt}
                checked={isChecked}
                onChange={(e) =>
                  handleFieldChange(sectionId, id, opt, e.target.checked)
                }
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-gray-700">{opt}</span>
            </label>
          );
        })}
      </div>
    );

    switch (type) {
      case "select":
      case "select2":
        return renderSingleSelect();
      case "multiselect":
        return renderMultiSelect();
      case "checkbox":
      case "radio":
        return renderCheckboxOrRadio();
      case "textarea":
        return (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(sectionId, id, e.target.value)}
            placeholder={`Enter ${label}`}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        );
      case "timeDuration":
        return (
          <input
            type="time"
            value={value}
            onChange={(e) => handleFieldChange(sectionId, id, e.target.value)}
            placeholder={`Enter ${label}`}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
      case "phone":
        return (
          <input
            type="tel"
            value={value}
            onChange={(e) => handleFieldChange(sectionId, id, e.target.value)}
            placeholder={`Enter ${label}`}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
      case "time":
        return (
          <input
            type="time"
            value={value}
            onChange={(e) => handleFieldChange(sectionId, id, e.target.value)}
            placeholder={`Enter ${label}`}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
      default:
        return renderBasicInput();
    }
    
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Toggle Switch at the top */}
     

      {/* Header */}
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          {FormName ? FormName : "Dynamic Form Builder"}
        </h1>
        <div className="flex align-center space-x-4">
          <div className="">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={toggleStatus}
                onChange={handleToggleChange}
                className="sr-only"
              />
              <div className={`w-11 h-6 rounded-full transition-colors duration-200 ${toggleStatus ? "bg-green-500" : "bg-gray-300"}`}></div>
              <div
                className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 transform ${toggleStatus ? "translate-x-5" : ""}`}
              ></div>
            </label>
          </div>
          <button
            type="button"
            onClick={handleAddSection}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
          >
            Add Section
          </button>
          <button
            type="button"
            onClick={handleOpenAddDrawer}
            className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-700 transition"
          >
            Add Field
          </button>
        </div>
      </header>

      {/* Sections */}
      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {sections.map((section) => (
          <section
            key={section.id}
            className={`border-l-8 ${section.color} bg-white p-6 rounded-lg shadow`}
          >
            <input
              type="text"
              className="w-full text-2xl font-semibold mb-4 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent"
              value={section.name}
              onChange={(e) => handleSectionNameChange(section.id, e.target.value)}
            />
            {section.fields.length === 0 ? (
              <p className="italic text-gray-600">
                No fields added yet. Click "Add Field" to add some.
              </p>
            ) : (
              section.fields.map((field, index) => (
                <div key={field.id} className="mb-5 border-b border-gray-200 pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-700 font-medium">
                        {field.label}
                        {field.required && <span className="text-red-500"> *</span>}
                      </span>
                      {field.source === "core" ? (
                        <span className="badge badge-success badge-outline">Core</span>
                      ) : (
                        <span className="badge badge-primary badge-outline">Default</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => handleMoveFieldUp(section.id, index)}
                          className="bg-gray-200 p-2 rounded hover:bg-gray-300"
                          aria-label="Move up"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="w-5 h-5 text-gray-600"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                      )}
                      {index < section.fields.length - 1 && (
                        <button
                          type="button"
                          onClick={() => handleMoveFieldDown(section.id, index)}
                          className="bg-gray-200 p-2 rounded hover:bg-gray-300"
                          aria-label="Move down"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="w-5 h-5 text-gray-600"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleOpenEditDrawer(section.id, field)}
                        className="bg-yellow-500 p-2 rounded hover:bg-yellow-600"
                        aria-label="Edit Field"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="w-5 h-5 text-white"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 3.487c.39-.39.938-.61 1.506-.61 1.178 0 2.132.954 2.132 2.132 0 .568-.22 1.115-.61 1.506L7.13 19.884a3 3 0 01-1.414.79l-2.99.747a.75.75 0 01-.908-.908l.747-2.99a3 3 0 01.79-1.414L16.862 3.487z"
                          />
                        </svg>
                      </button>
                     
                  {field.hideFiled&& <button
                        type="button"
                        onClick={() => handleDeleteField(section.id, field.id)}
                        className="bg-red-600 p-2 rounded hover:bg-red-700"
                        aria-label="Delete Field"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="w-5 h-5 text-white"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.125 6.75h3.75M3.75 6.75h16.5M19.5 6.75l-.563 12.111a2.25 2.25 0 01-2.244 2.139H7.307a2.25 2.25 0 01-2.244-2.139L4.5 6.75h15z"
                          />
                        </svg>
                      </button>}
                    </div>
                  </div>
                  {renderField(field, section.id)}
                  <div className="mt-2 text-gray-500 text-sm flex items-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 10c.552 0 1 .448 1 1v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6c0-.552.448-1 1-1"
                      />
                    </svg>
                    
                  </div>
                  {field.error && (
                    <p className="text-red-500 text-sm mt-2">{field.error}</p>
                  )}
                </div>
              ))
            )}
          </section>
        ))}
      </main>

      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto mt-10">
        <button
          type="submit"
          className="w-full py-3 bg-green-700 text-white font-semibold rounded-lg shadow hover:bg-green-800 transition"
        >
          Submit Form
        </button>
      </form>

      {/* Drawer */}
      {isDrawerOpen && (
        <>
          <div className="fixed inset-0 flex justify-end z-50">
            <div className="bg-white w-96 p-6 shadow-xl h-full overflow-auto">
              <h2 className="text-2xl font-semibold mb-6">
                {isEditing ? "Edit Field" : "Add Field"}
              </h2>
              {!isEditing && (
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Select Section
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedSectionId}
                    onChange={(e) => setSelectedSectionId(e.target.value)}
                  >
                    <option value="">-- Select Section --</option>
                    {sections.map((sec) => (
                      <option key={sec.id} value={sec.id}>
                        {sec.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {isEditing && (
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Move Field to Section
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedSectionId}
                    onChange={(e) => setSelectedSectionId(e.target.value)}
                  >
                    {sections.map((sec) => (
                      <option key={sec.id} value={sec.id}>
                        {sec.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex mb-4 space-x-4">
                <button
                  type="button"
                  onClick={() => setDrawerMode("core")}
                  className={`py-2 p-2 rounded-lg ${
                    drawerMode === "core"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  Core Field
                </button>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  {drawerMode === "core"
                    ? "Core Field Label"
                    : "Default Field Label"}
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Enter ${drawerMode} field label`}
                  value={newField.label}
                  onChange={(e) =>
                    setNewField({ ...newField, label: e.target.value })
                  }
                />
                <label className="block text-gray-700 font-medium mb-2">
                  Column Name
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter column name"
                  value={newField.dbcoloumName}
                  onChange={(e) =>
                    setNewField({ ...newField, dbcoloumName: e.target.value })
                  }
                />
                <label className="block text-gray-700 font-medium mb-2">
                  {drawerMode === "core"
                    ? "Core Field Type"
                    : "Default Field Type"}
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newField.type}
                  onChange={(e) =>
                    setNewField({ ...newField, type: e.target.value })
                  }
                >
                  {FIELD_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {["select", "checkbox", "radio", "multiselect", "select2"].includes(
                  newField.type
                ) && (
                  <>
                    <label className="block text-gray-700 font-medium mb-2">
                      Options Source
                    </label>
                    <div className="flex items-center space-x-4 mb-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="optionsSource"
                          value="static"
                          checked={newField.optionsSource === "static"}
                          onChange={() =>
                            setNewField((prev) => ({
                              ...prev,
                              optionsSource: "static",
                            }))
                          }
                          className="mr-2"
                        />
                        Static
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="optionsSource"
                          value="dynamic"
                          checked={newField.optionsSource === "dynamic"}
                          onChange={() =>
                            setNewField((prev) => ({
                              ...prev,
                              optionsSource: "dynamic",
                            }))
                          }
                          className="mr-2"
                        />
                        Dynamic
                      </label>
                    </div>
                    {newField.optionsSource === "static" && (
                      <>
                        <label className="block text-gray-700 font-medium mb-2">
                          Add Options
                        </label>
                        <div className="flex items-center mb-2">
                          <input
                            type="text"
                            className="flex-1 border border-gray-300 rounded-l-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Option text"
                            value={optionInput}
                            onChange={(e) => setOptionInput(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={handleAddOption}
                            className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition"
                          >
                            Add
                          </button>
                        </div>
                        {optionList.length > 0 && (
                          <ul className="mb-4 border border-gray-200 rounded-lg p-2">
                            {optionList.map((opt, idx) => (
                              <li
                                key={idx}
                                className="flex justify-between items-center py-1 px-2 hover:bg-gray-100 rounded"
                              >
                                <span>{opt}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setOptionList((prev) =>
                                      prev.filter((_, i) => i !== idx)
                                    )
                                  }
                                  className="text-red-600 hover:underline"
                                >
                                  Remove
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    )}
                    {newField.optionsSource === "dynamic" && (
                      <>
                        <label className="block text-gray-700 font-medium mb-2">
                          ApiEndPoint Url
                        </label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter your API endpoint"
                          value={newField.apiEndpoint}
                          onChange={(e) =>
                            setNewField((prev) => ({
                              ...prev,
                              apiEndpoint: e.target.value,
                            }))
                          }
                        />
                      </>
                    )}
                  </>
                )}
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    checked={newField.required}
                    onChange={(e) =>
                      setNewField({ ...newField, required: e.target.checked })
                    }
                    className="mr-2"
                  />
                  <span className="text-gray-700 font-medium">Required?</span>
                </div>
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    checked={newField.hideFiled}
                    onChange={(e) =>
                      setNewField({ ...newField, hideFiled: e.target.checked })
                    }
                    className="mr-2"
                  />
                  <span className="text-gray-700 font-medium">Can we hide?</span>
                </div>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleSaveFieldFromDrawer}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                >
                  {isEditing ? "Save Changes" : "Add Field"}
                </button>
                <button
                  type="button"
                  onClick={handleCloseDrawer}
                  className="px-5 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
          <div
            className="fixed inset-0 bg-black opacity-40"
            onClick={handleCloseDrawer}
          ></div>
        </>
      )}
    </div>
  );
};

export default FormBuilder;
