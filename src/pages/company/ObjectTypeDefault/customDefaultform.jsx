import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

// Updated FIELD_TYPES with additional field types
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
  "textarea",
  "timeDuration",
  "tags",
  "comment",
  "upload",
  "templateUpload",
];

const DEFAULT_FIELDS = [
  {
    id: "name",
    label: "Name",
    type: "text",
    required: true,
    value: "",
    error: "",
    options: [],
    saveInColumn: false,
  },
  {
    id: "email",
    label: "Email",
    type: "email",
    required: true,
    value: "",
    error: "",
    options: [],
    saveInColumn: false,
  },
];

const AVAILABLE_COLORS = [
  "border-red-500",
  "border-green-500",
  "border-blue-500",
  "border-yellow-500",
  "border-purple-500",
];

const CustomDefaultform = () => {
  const { objectid, objecttypeid, formname } = useParams();
  const { companyId } = useSelector((state) => state.AuthReducerKey);
  const [objectCustomFieldsId, setobjectCustomFieldsId] = useState(0);
  const [defaultFiled, setDefaultFiled] = useState("");
  const [FormId, setFormId] = useState(0);
  const [FormName, setFormName] = useState("");

  const [sections, setSections] = useState([
    {
      id: Date.now(),
      name: "Section 1",
      color: AVAILABLE_COLORS[0],
      fields: [...DEFAULT_FIELDS],
    },
  ]);

  // State to hold default fields data loaded from API.
  const [defaultFieldsData, setDefaultFieldsData] = useState(null);
  // State to determine which mode is active in the drawer.
  const [isDefaultFieldsMode, setIsDefaultFieldsMode] = useState(false);

  // For demo, hardcode companyId and masterCustomFormFieldId.
  const masterCustomFormFieldId = 27;

  // State for new field drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState("default"); // "core" | "default"
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
    saveInColumn: false,
  });
  const [optionInput, setOptionInput] = useState("");
  const [optionList, setOptionList] = useState([]);

  // New states for tag fields
  const [tagOptions, setTagOptions] = useState([]);
  const [tagSelectValue, setTagSelectValue] = useState("");

  // Fetch tag categories for 'tags' field type
  useEffect(() => {
    axios
      .get(`${API_URL}/TagCategory/GetTagCategoryByCompanyId/0`)
      .then((response) => {
        setTagOptions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tag categories:", error);
      });
  }, []);

  // Fetch the last-saved form on mount.
  useEffect(() => {
    const fetchLastSavedForm = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/CustomObject/GetObjectCustomFields?objectCustomTypeId=0&objectTypeId=${objecttypeid}&objectId=${objectid}&companyId=${companyId}`
        );
        console.log("API response:", response.data);
        setFormId(response.data[0].objectId);
        setobjectCustomFieldsId(response.data[0].objectCustomFieldsId);
        setFormName(response.data[0].objectTypeName);
        if (Array.isArray(response.data) && response.data.length > 0) {
          const lastForm = response.data[0].objectTypeFields;
          console.log("Last form record:", lastForm);
          if (lastForm) {
            const parsed = JSON.parse(lastForm);
            console.log("Parsed JSON:", parsed);
            if (parsed.fields && Array.isArray(parsed.fields)) {
              setSections(parsed.fields);
            } else {
              console.error("Parsed JSON does not contain a 'fields' array.");
            }
          } else {
            console.error("No 'otherJSON' found in the form record.");
          }
        } else {
          console.error("API response is empty or not an array.");
        }
      } catch (error) {
        console.error("Error fetching last saved form:", error);
      }
    };
    fetchLastSavedForm();
  }, [objectid, objecttypeid, companyId]);

  useEffect(() => {
    const fetchDefaultfileds = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/CustomObject/GetObjectTypes?objectTypeId=0&objectId=${objectid}`
        );
        const fileds = JSON.parse(response.data[0].objectTypeFields);
        setDefaultFiled(fileds.fields[0]);
      } catch (error) {
        console.error("Error fetching default fields:", error);
      }
    };
    fetchDefaultfileds();
  }, [objectid]);

  // Function to load default fields via API when "Default Fields" button is clicked.
  const handleLoadDefaultFields = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/CustomObject/GetObjectTypes?objectTypeId=${objecttypeid}&objectId=${objectid}`
      );
      if (Array.isArray(response.data) && response.data.length > 0) {
        const parsed = JSON.parse(response.data[0].objectTypeFields);
        setDefaultFieldsData(parsed);
        setIsDefaultFieldsMode(true);
      } else {
        console.error("Default fields API response is empty or not an array.");
      }
    } catch (error) {
      console.error("Error loading default fields:", error);
    }
  };

  // When switching back to custom mode.
  const handleCustomFieldMode = () => {
    setIsDefaultFieldsMode(false);
    setDefaultFieldsData(null);
  };

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
    setDrawerMode("default");
    setNewField({
      label: "",
      type: "text",
      required: false,
      optionsSource: "static",
      apiEndpoint: "",
      saveInColumn: false,
    });
    setOptionInput("");
    setOptionList([]);
    setDefaultFieldsData(null);
    setIsDefaultFieldsMode(false);
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
      optionsSource: field.optionsSource || "static",
      apiEndpoint: field.apiEndpoint || "",
      saveInColumn: field.saveInColumn || false,
    });
    if (
      ["select", "checkbox", "radio", "multiselect", "select2"].includes(field.type) &&
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
    const prefix = drawerMode === "default" ? "custom" : drawerMode;
    const finalField = {
      id: `${prefix}_${Date.now()}`,
      label: newField.label,
      type: newField.type,
      required: newField.required,
      value: ["checkbox", "multiselect"].includes(newField.type) ? [] : "",
      error: "",
      source: prefix,
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
      source: drawerMode === "default" ? "custom" : drawerMode,
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
      saveInColumn: false,
    });
    setOptionInput("");
    setOptionList([]);
    setDefaultFieldsData(null);
    setIsDefaultFieldsMode(false);
  };

  const handleDeleteField = (sectionId, fieldId) => {
    if (!window.confirm("Are you sure you want to delete this field?")) return;
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id !== sectionId) return section;
        const updatedFields = section.fields.filter((f) => f.id !== fieldId);
        return { ...section, fields: updatedFields };
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
          } else if (!Array.isArray(field.value) && !field.value?.toString().trim()) {
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
      objectID: objectid,
      objectTypeId: objecttypeid,
      objectTypeName: FormName ? FormName : formname,
      objectTypeFields: JSON.stringify({ fields }),
      createdBy: "0",
      status: 1,
      objectCustomFieldsId: objectCustomFieldsId,
      companyId: companyId,
    };
    try {
      const response = await axios.post(
        `${API_URL}/CustomObject/AddObjectCustomFields`,
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
          const isChecked = Array.isArray(value) ? value.includes(opt) : value === opt;
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
            rows={4}
          />
        );
      case "timeDuration":
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(sectionId, id, e.target.value)}
            placeholder={`Duration for ${label} (e.g. 2h 30m)`}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
      case "tags":
        return (
          <select
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={value}
            onChange={(e) => {
              const selectedCategoryId = e.target.value;
              setTagSelectValue(selectedCategoryId);
              handleFieldChange(sectionId, id, selectedCategoryId);
            }}
          >
            <option value="">-- Select a tag Category --</option>
            {tagOptions.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.tagCategoryName}
              </option>
            ))}
          </select>
        );
      case "comment":
        return (
          <div className="max-w-3xl mx-auto p-2">
            <div
              className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors bg-gray-100 border-blue-400`}
            >
              Comment section is here
            </div>
          </div>
        );
      case "upload":
        return (
          <div className="max-w-3xl mx-auto p-2">
            <div
              className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors bg-gray-100 border-blue-400`}
            >
              Upload section is here
            </div>
          </div>
        );
      case "templateUpload":
        return (
          <div className="max-w-3xl mx-auto p-2">
            <div
              className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors bg-gray-100 border-blue-400`}
            >
              Template Upload section is here
            </div>
          </div>
        );
      default:
        return renderBasicInput();
    }
  };

  // Combine default fields from API response.
  let combinedDefaultFields = [];
  if (defaultFieldsData && Array.isArray(defaultFieldsData.fields)) {
    defaultFieldsData.fields.forEach((section) => {
      if (section.fields && section.fields.length > 0) {
        const defaults = section.fields.filter((f) => f.source === "default");
        combinedDefaultFields = [...combinedDefaultFields, ...defaults];
      }
    });
    // Compute which default field ids are already present in the left panel.
    const leftDefaultFieldIds = sections
      .flatMap((section) =>
        section.fields.filter((f) => f.source === "default").map((f) => f.id)
      );
    combinedDefaultFields = combinedDefaultFields.filter(
      (f) => !leftDefaultFieldIds.includes(f.id)
    );
  }

  // Function to add a default field from the drawer into a selected section.
  const handleAddDefaultField = (defaultField) => {
    if (!selectedSectionId) {
      alert("Please select a section to add the field.");
      return;
    }
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (String(section.id) === selectedSectionId) {
          return {
            ...section,
            fields: [...section.fields, defaultField],
          };
        }
        return section;
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          {FormName ? FormName : formname}
        </h1>
        <div className="space-x-4">
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
            {section?.fields?.length === 0 ? (
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
                      ) : field.source === "default" ? (
                        <span className="badge badge-info badge-outline">Default</span>
                      ) : (
                        <span className="badge badge-primary badge-outline">Custom</span>
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
                      {field.source !== "core" && (
                        <button
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
                        </button>
                      )}
                    </div>
                  </div>
                  {renderField(field, section.id)}
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
              {/* Section selection */}
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
              {/* Field type buttons */}
              <div className="flex mb-4 space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setDrawerMode("default");
                    handleCustomFieldMode();
                  }}
                  className={`p-2 rounded-lg ${
                    !isDefaultFieldsMode
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  Custom Field
                </button>
                <button
                  type="button"
                  onClick={handleLoadDefaultFields}
                  className="p-2 rounded-lg bg-gray-200 text-gray-800"
                >
                  Default Fields
                </button>
              </div>
              {/* Default Fields Section */}
              {isDefaultFieldsMode ? (
                combinedDefaultFields.length > 0 ? (
                  <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Default Fields</h3>
                    {combinedDefaultFields.map((field) => (
                      <div
                        key={field.id}
                        className="mb-2 flex justify-between items-center p-2 border rounded"
                      >
                        <p>
                          <span className="font-bold">{field.label}</span>{" "}
                          <span className="text-gray-500">({field.type})</span>{" "}
                          {field.source === "default" && (
                            <span className="ml-2 text-sm font-medium text-blue-600 border border-blue-600 px-2 rounded">
                              Default
                            </span>
                          )}
                        </p>
                        <button
                          type="button"
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                          onClick={() => handleAddDefaultField(field)}
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Default Fields</h3>
                    <p>No default fields available.</p>
                  </div>
                )
              ) : (
                <>
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                      {drawerMode === "core" ? "Core Field Label" : "Custom Field Label"}
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Enter ${drawerMode} field label`}
                      value={newField.label}
                      onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                    />
                    <label className="block text-gray-700 font-medium mb-2">
                      {drawerMode === "core" ? "Core Field Type" : "Custom Field Type"}
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newField.type}
                      onChange={(e) => setNewField({ ...newField, type: e.target.value })}
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
                                setNewField((prev) => ({ ...prev, optionsSource: "static" }))
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
                                setNewField((prev) => ({ ...prev, optionsSource: "dynamic" }))
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
                                        setOptionList((prev) => prev.filter((_, i) => i !== idx))
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
                  </div>
                </>
              )}
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
      <div className="max-w-6xl mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Form JSON Preview</h2>
        <pre className="bg-white p-4 rounded-lg shadow overflow-x-auto text-sm border border-gray-300">
          {JSON.stringify(sections, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default CustomDefaultform;
