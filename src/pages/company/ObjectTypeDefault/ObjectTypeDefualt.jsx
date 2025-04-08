import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import CommentComponent from "../../Calendar/Comment";
import ImageUploadComponent from "../../../components/imageupload/ImageUpload";
 // New import for image uploads

// Define your field types including two new ones: "upload" and "templateUpload"
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
  "upload",         // New: simple file upload
  "templateUpload", // New: uses ImageUploadComponent
];

// Optional colors for new sections
const AVAILABLE_COLORS = [
  "border-red-500",
  "border-green-500",
  "border-blue-500",
  "border-yellow-500",
  "border-purple-500",
];

const ObjectTypeDefualt = () => {
  const { objectid, objecttypeid, name } = useParams();
  const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

  // Main form states
  const [FormId, setFormId] = useState(0);
  const [FormName, setFormName] = useState("");
  const [sections, setSections] = useState([]);
  const [enabled, setEnabled] = useState(false);

  // Core fields
  const [coreFields, setCoreFields] = useState([]);

  // Default (accordion) data
  const [defaultAcordian, setDefaultAcordian] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0); // which accordion is open?

  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState("default");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editingFieldId, setEditingFieldId] = useState(null);

  // The new/edited field; note the added maxLength property for text-based types
  const [newField, setNewField] = useState({
    label: "",
    type: "text",
    required: false,
    maxLength: 255, // default max length for applicable types
    optionsSource: "static",
    apiEndpoint: "",
    defaultValue: "",
    saveInColumn: false,
    hideFiled: false,
  });

  // For multi-option fields
  const [optionInput, setOptionInput] = useState("");
  const [optionList, setOptionList] = useState([]);

  // Tag categories
  const [tagOptions, settagOptions] = useState([]);
  const [tagSelectValue, settagSelectValue] = useState("");

  // For searching fields inside the accordion
  const [accordionSearchTerm, setAccordionSearchTerm] = useState("");

  //--------------------------------------------------------------------------- 
  // 1) Load the existing form 
  //--------------------------------------------------------------------------- 
  useEffect(() => {
    const fetchLastSavedForm = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/CustomObject/GetObjectTypes?objectTypeId=${objecttypeid}&objectId=${objectid}`
        );
        if (response.data && response.data[0]) {
          setEnabled(response.data[0].status ? true : false);
          setFormId(response.data[0].objectId);
          setFormName(name);

          if (response.data[0].objectTypeFields) {
            const parsed = JSON.parse(response.data[0].objectTypeFields);
            if (parsed.fields?.fields && Array.isArray(parsed.fields.fields)) {
              setSections(parsed.fields.fields);
            } else if (Array.isArray(parsed.fields)) {
              setSections(parsed.fields);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching last saved form:", error);
      }
    };
    fetchLastSavedForm();
  }, [API_URL, name, objectid, objecttypeid]);

  //--------------------------------------------------------------------------- 
  // 2) Load core fields, ignoring ones that start with "core_" 
  //--------------------------------------------------------------------------- 
  useEffect(() => {
    const fetchCoreFields = async () => {
      try {
        const response = await axios.get(`${API_URL}/CustomObject/GetObjects/${objectid}`);
        const data = JSON.parse(response.data[0].objectFields);
        let core = data.fields?.[0]?.fields || [];
        // Filter out any ID that starts with "core_"
        core = core.filter((item) => !item.id.startsWith("core_"));
        setCoreFields(core);
      } catch (error) {
        console.error("Error fetching core fields:", error);
      }
    };
    fetchCoreFields();
  }, [API_URL, objectid]);

  //--------------------------------------------------------------------------- 
  // 3) Load default “accordion” items 
  //--------------------------------------------------------------------------- 
  useEffect(() => {
    const fetchDefaultAcordian = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/CustomObject/GetObjectTypes?objectTypeId=0&objectId=${objectid}`
        );
        setDefaultAcordian(response.data);
      } catch (error) {
        console.error("Error fetching defaultAcordian data:", error);
      }
    };
    fetchDefaultAcordian();
  }, [API_URL, objectid, isDrawerOpen]);

  //--------------------------------------------------------------------------- 
  // 4) Load tag categories 
  //--------------------------------------------------------------------------- 
  useEffect(() => {
    axios
      .get(`${API_URL}/TagCategory/GetTagCategoryByCompanyId/0`)
      .then((response) => {
        settagOptions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tag categories:", error);
      });
  }, [newField]);

  //--------------------------------------------------------------------------- 
  // Helper functions for multi-option fields 
  //--------------------------------------------------------------------------- 
  const handleAddOption = () => {
    if (optionInput.trim() === "") return;
    setOptionList([...optionList, optionInput.trim()]);
    setOptionInput("");
  };

  const handleRemoveOption = (index) => {
    setOptionList(optionList.filter((_, i) => i !== index));
  };

  //--------------------------------------------------------------------------- 
  // Toggle the accordion open/closed 
  //--------------------------------------------------------------------------- 
  const toggleAccordion = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  //--------------------------------------------------------------------------- 
  // --------------- MAIN FORM: SECTIONS --------------- 
  //--------------------------------------------------------------------------- 
  // Add a new section
  const handleAddSection = () => {
    const newSection = {
      id: Date.now(),
      name: `Section ${sections.length + 1}`,
      color: AVAILABLE_COLORS[sections.length % AVAILABLE_COLORS.length],
      fields: [],
    };
    setSections((prev) => [...prev, newSection]);
  };

  // Remove a section from the main form (only if empty)
  const handleRemoveSection = (sectionId) => {
    setSections((prevSections) => prevSections.filter((s) => s.id !== sectionId));
  };

  const handleSectionNameChange = (sectionId, newName) => {
    setSections((prevSections) =>
      prevSections.map((sec) => (sec.id === sectionId ? { ...sec, name: newName } : sec))
    );
  };

  //--------------------------------------------------------------------------- 
  // --------------- MAIN FORM: FIELDS --------------- 
  //--------------------------------------------------------------------------- 
  // Move field up/down
  const handleMoveFieldUp = (sectionId, fieldIndex) => {
    if (fieldIndex === 0) return;
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id !== sectionId) return section;
        const newFields = [...section.fields];
        [newFields[fieldIndex - 1], newFields[fieldIndex]] = [
          newFields[fieldIndex],
          newFields[fieldIndex - 1],
        ];
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
        [newFields[fieldIndex + 1], newFields[fieldIndex]] = [
          newFields[fieldIndex],
          newFields[fieldIndex + 1],
        ];
        return { ...section, fields: newFields };
      })
    );
  };

  // Delete a field from a section
  const handleDeleteField = (sectionId, fieldId) => {
    if (!window.confirm("Are you sure you want to delete this field?")) return;
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              fields: section.fields.filter((f) => f.id !== fieldId),
            }
          : section
      )
    );
  };

  // Update the "value" of a field in the main form (for user input)
  const handleFieldChange = (sectionId, fieldId, newValue, isChecked = false) => {
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id !== sectionId) return section;

        return {
          ...section,
          fields: section.fields.map((field) => {
            if (field.id !== fieldId) return field;

            // checkbox logic
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

            // multiselect
            if (field.type === "multiselect") {
              return { ...field, value: newValue, error: "" };
            }

            // radio
            if (field.type === "radio") {
              return { ...field, value: newValue, error: "" };
            }

            // select
            if (field.type === "select" || field.type === "select2") {
              return { ...field, value: newValue, error: "" };
            }

            // textarea
            if (field.type === "textarea") {
              return { ...field, value: newValue, error: "" };
            }

            // timeDuration
            if (field.type === "timeDuration") {
              return { ...field, value: newValue, error: "" };
            }

            // tags
            if (field.type === "tags") {
              return { ...field, value: newValue, error: "" };
            }

            // comment
            if (field.type === "comment") {
              return { ...field, value: newValue, error: "" };
            }

            // For file uploads (upload, templateUpload) and default text input
            return { ...field, value: newValue, error: "" };
          }),
        };
      })
    );
  };

  // Render a single field in the main form
  const renderField = (field, sectionId) => {
    
    const { id, label, type, value, options } = field;
    const fieldElement = (() => {
      switch (type) {
        case "select":
        case "select2":
          return (
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

        case "multiselect":
          return (
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

        case "checkbox":
        case "radio":
          return (
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

        case "textarea":
          return (
            <textarea
              value={value}
              maxLength={field.maxLength || undefined}
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
                  settagSelectValue(selectedCategoryId);  // Save the selected tag category ID
                  handleFieldChange(sectionId, id, selectedCategoryId);  // Set the selected category ID
                }}
              >
                <option value="">-- Select a tag Category --</option>
                {tagOptions?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.tagCategoryName}
                  </option>
                ))}
              </select>
            );
          

        case "comment":
          return (
            // <CommentComponent
            //   value={value}
            //   onChange={(val) => handleFieldChange(sectionId, id, val)}
            // />
            <div className="max-w-3xl mx-auto p-2">
            {/* Drag & Drop Area */}
            <div
             
              className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors 
                ${true ? 'bg-gray-100 border-blue-400' : 'bg-gray-50 border-blue-300'}`}
            >
              Comment section is here
              </div>
              </div>
          );

        // New: simple file upload using a file input
        case "upload":
          // return (
          //   <ImageUploadComponent
          //   value={value}
          //   onChange={(val) => handleFieldChange(sectionId, id, val)}
          // />
          // );
          <div className="max-w-3xl mx-auto p-2">
          {/* Drag & Drop Area */}
          <div
           
            className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors 
              ${true ? 'bg-gray-100 border-blue-400' : 'bg-gray-50 border-blue-300'}`}
          >
            Upload section is here
            </div>
            </div>


        // New: template upload using the ImageUploadComponent
        case "templateUpload":
          return (
            <div className="max-w-3xl mx-auto p-2">
            {/* Drag & Drop Area */}
            <div
             
              className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors 
                ${true ? 'bg-gray-100 border-blue-400' : 'bg-gray-50 border-blue-300'}`}
            >Teamplate Upload section is here</div></div>
          );

        default:
          // For text, email, number, date, tel, etc.
          return (
            <input
              type={type}
              value={value}
              maxLength={field.maxLength || undefined}
              onChange={(e) => handleFieldChange(sectionId, id, e.target.value)}
              placeholder={`Enter ${label}`}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          );
      }
    })();

    return (
      <div>
        {fieldElement}
        <div className="mt-2 text-sm text-gray-500">ID: {id}</div>
      </div>
    );
  };

  //--------------------------------------------------------------------------- 
  // --------------- DRAWER (Add/Edit Field) --------------- 
  //--------------------------------------------------------------------------- 
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
      maxLength: 255,
      optionsSource: "static",
      apiEndpoint: "",
      defaultValue: "",
      saveInColumn: false,
      hideFiled: false,
    });
    setOptionInput("");
    setOptionList([]);
    setAccordionSearchTerm("");
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setIsEditing(false);
    setEditingFieldId(null);
    setEditingSectionId(null);
    setSelectedSectionId("");
    setDrawerMode("default");
    setNewField({
      label: "",
      type: "text",
      required: false,
      maxLength: 255,
      optionsSource: "static",
      apiEndpoint: "",
      defaultValue: "",
      saveInColumn: false,
      hideFiled: false,
    });
    setOptionInput("");
    setOptionList([]);
    setAccordionSearchTerm("");
  };

  const handleOpenEditDrawer = (sectionId, field) => {
    setIsDrawerOpen(true);
    setIsEditing(true);
    setEditingSectionId(sectionId);
    setEditingFieldId(field.id);
    setDrawerMode(field.source || "default");

    setNewField({
      label: field.label,
      type: field.type,
      required: field.required,
      maxLength: field.maxLength || 255,
      optionsSource: field.optionsSource || "static",
      apiEndpoint: field.apiEndpoint || "",
      defaultValue: field.value || "",
      saveInColumn: field.saveInColumn || false,
      dbcoloumName: field.dbcoloumName,
      hideFiled: field.hideFiled || false,
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

  // Create or Update field
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
    const uniqueId = `default_${Date.now()}`;
    const finalField = {
      id: uniqueId,
      label: newField.label,
      type: newField.type,
      required: newField.required,
      maxLength: ["text", "email", "number", "tel", "textarea"].includes(newField.type)
        ? newField.maxLength
        : undefined,
      tagCategory: newField.type === "tags" ? newField.defaultValue : undefined,
      value:
        newField.type === "tags"
          ? newField.defaultValue || ""
          : ["checkbox", "multiselect"].includes(newField.type)
          ? []
          : "",
      error: "",
      source: "default",
      optionsSource: newField.optionsSource,
      apiEndpoint: newField.apiEndpoint.trim(),
      options: newField.optionsSource === "static" ? [...optionList] : [],
      saveInColumn: newField.saveInColumn,
      hideFiled: newField.hideFiled || false,
    };

    setSections((prevSections) =>
      prevSections.map((section) =>
        String(section.id) === selectedSectionId
          ? { ...section, fields: [...section.fields, finalField] }
          : section
      )
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
      maxLength: ["text", "email", "number", "tel", "textarea"].includes(newField.type)
        ? newField.maxLength
        : undefined,
      source: drawerMode,
      dbcoloumName: newField.dbcoloumName,
      tagCategory: newField.type === "tags" ? newField.defaultValue : undefined,
      optionsSource: newField.optionsSource,
      apiEndpoint: newField.apiEndpoint.trim(),
      options: newField.optionsSource === "static" ? [...optionList] : [],
      error: "",
      value: ["checkbox", "multiselect"].includes(newField.type) ? [] : "",
      saveInColumn: newField.saveInColumn,
      hideFiled: newField.hideFiled || false,
    };

    setSections((prevSections) => {
      // Move to new section?
      if (Number(selectedSectionId) !== editingSectionId) {
        return prevSections.map((section) => {
          if (section.id === editingSectionId) {
            const newFields = section.fields.filter((f) => f.id !== editingFieldId);
            return { ...section, fields: newFields };
          } else if (String(section.id) === selectedSectionId) {
            return { ...section, fields: [...section.fields, updatedField] };
          }
          return section;
        });
      }
      // Otherwise update in place
      return prevSections.map((section) => {
        if (section.id !== editingSectionId) return section;
        const updatedFields = section.fields.map((fld) => {
          if (fld.id !== editingFieldId) return fld;
          return { ...updatedField, value: fld.value || updatedField.value };
        });
        return { ...section, fields: updatedFields };
      });
    });
    handleCloseDrawer();
  };

  //--------------------------------------------------------------------------- 
  // --------------- CORE FIELDS --------------- 
  //--------------------------------------------------------------------------- 
  const filteredCoreFields = coreFields.filter((item) => !item.id.startsWith("core_"));

  const handleSelectCoreField = (coreField) => {
    if (!selectedSectionId) {
      alert("Please select a section.");
      return;
    }
    // remove from the array
    setCoreFields((prev) => prev.filter((f) => f.id !== coreField.id));

    const finalField = {
      id: coreField.id,
      label: coreField.label,
      dbcoloumName: coreField.dbcoloumName,
      type: coreField.type,
      required: coreField.required,
      maxLength: ["text", "email", "number", "tel", "textarea"].includes(coreField.type)
        ? coreField.maxLength || 255
        : undefined,
      value: ["checkbox", "multiselect"].includes(coreField.type) ? [] : "",
      error: "",
      source: "core",
      optionsSource: coreField.optionsSource || "static",
      apiEndpoint: coreField.apiEndpoint || "",
      options: coreField.options || [],
      saveInColumn: coreField.saveInColumn || false,
      hideFiled: coreField.hideFiled || false,
    };

    setSections((prevSections) =>
      prevSections.map((section) =>
        String(section.id) === selectedSectionId
          ? { ...section, fields: [...section.fields, finalField] }
          : section
      )
    );
    handleCloseDrawer();
  };

  //--------------------------------------------------------------------------- 
  // --------------- ACCORDION FIELDS --------------- 
  //--------------------------------------------------------------------------- 
  // Check if a field is in the main form
  const isAccordionFieldUsed = (fieldId) => {
    return sections.some((sec) => sec.fields.some((fld) => fld.id === fieldId));
  };

  // Add a field from the accordion
  const handleAddAccordionField = (fld) => {
    if (!selectedSectionId) {
      alert("Please select a section.");
      return;
    }
    const finalField = {
      id: fld.id,
      label: fld.label,
      dbcoloumName: fld.dbcoloumName,
      type: fld.type,
      required: fld.required,
      maxLength: ["text", "email", "number", "tel", "textarea"].includes(fld.type)
        ? fld.maxLength || 255
        : undefined,
      value: ["checkbox", "multiselect"].includes(fld.type) ? [] : "",
      error: "",
      source: fld.source || "default",
      optionsSource: fld.optionsSource || "static",
      apiEndpoint: fld.apiEndpoint || "",
      options: fld.options || [],
      saveInColumn: fld.saveInColumn || false,
      hideFiled: fld.hideFiled || false,
    };

    setSections((prevSections) =>
      prevSections.map((sec) => {
        if (String(sec.id) === selectedSectionId) {
          return { ...sec, fields: [...sec.fields, finalField] };
        }
        return sec;
      })
    );
    handleCloseDrawer();
  };

  // Remove a field from the main form
  const handleRemoveAccordionField = (fieldId) => {
    setSections((prevSections) =>
      prevSections.map((sec) => ({
        ...sec,
        fields: sec.fields.filter((f) => f.id !== fieldId),
      }))
    );
  };

  //--------------------------------------------------------------------------- 
  // --------------- Remove Section from the Accordion JSON --------------- 
  //--------------------------------------------------------------------------- 
  const handleRemoveSectionInAccordion = (objectTypeId, sectionId) => {
    // We physically remove that entire empty section from defaultAcordian
    setDefaultAcordian((prev) =>
      prev.map((item) => {
        if (item.objectTypeId !== objectTypeId) return item;

        let parsed;
        try {
          parsed = JSON.parse(item.objectTypeFields);
        } catch (err) {
          console.warn("Error parsing objectTypeFields:", err);
          return item;
        }

        if (!Array.isArray(parsed.fields)) {
          console.warn("No 'fields' array found in item:", parsed);
          return item;
        }

        // Filter out the section
        const updatedSections = parsed.fields.filter((sec) => sec.id !== sectionId);

        // Save it back
        parsed.fields = updatedSections;
        return {
          ...item,
          objectTypeFields: JSON.stringify(parsed),
        };
      })
    );
  };

  //--------------------------------------------------------------------------- 
  // Submit the entire form 
  //--------------------------------------------------------------------------- 
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fields = sections.map((section) => ({
      ...section,
      fields: section.fields.map((f) => {
        if (f.type === "tags") {
          return f;
        }
        const { value, ...rest } = f;
        return rest;
      }),
    }));

    const payload = {
      objectID: objectid,
      objectTypeId: objecttypeid,
      objectTypeName: FormName || "test",
      objectTypeFields: JSON.stringify({ fields }),
      createdBy: "0",
      status: enabled ? 1 : 0,
      tagSelection: tagSelectValue,
    };

    try {
      const response = await axios.post(`${API_URL}/CustomObject/AddObjectType`, payload);
      console.log("Saved form:", response.data);
      alert("Form saved successfully!");
    } catch (err) {
      console.error("Error saving form:", err);
      alert("Error saving form. See console for details.");
    }
  };

  //--------------------------------------------------------------------------- 
  // RENDER 
  //--------------------------------------------------------------------------- 
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      {/* HEADER */}
      <header className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          {FormName || "Dynamic Form Builder"}
        </h1>
        <div className="flex items-center space-x-4">
          {/* Toggle Active */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setEnabled(!enabled)}
              className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                enabled
                  ? "bg-green-500 focus:ring-green-300"
                  : "bg-gray-300 focus:ring-gray-200"
              }`}
            >
              <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                  enabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className="text-sm font-medium">
              {enabled ? "Active" : "Inactive"}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddSection}
            className="px-4 py-2 font-medium text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Section
          </button>

          <button
            type="button"
            onClick={handleOpenAddDrawer}
            className="px-4 py-2 font-medium text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Add Field
          </button>

          {sections.length > 0 && (
            <form onSubmit={handleSubmit}>
              <button
                type="submit"
                className="px-4 py-2 font-medium text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {objectid && objecttypeid ? "Update Form" : "Submit Form"}
              </button>
            </form>
          )}
        </div>
      </header>

      {/* MAIN SECTIONS */}
      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => (
          <section
            key={section.id}
            className={`border-l-8 ${section.color} bg-white p-4 md:p-6 rounded-lg shadow`}
          >
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                className="w-full mr-2 text-xl font-semibold border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent"
                value={section.name}
                onChange={(e) => handleSectionNameChange(section.id, e.target.value)}
              />
              {/* Remove the entire empty section in the main form */}
              {section.fields.length === 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveSection(section.id)}
                  className="text-sm font-medium px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
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
            {section.fields.length === 0 ? (
              <p className="italic text-gray-600">
                No fields yet. (Remove this section if not needed.)
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
                      {field.source === "core" && (
                        <span className="badge badge-success badge-outline">Core</span>
                      )}
                      {field.source === "default" && (
                        <span className="badge badge-primary badge-outline">Default</span>
                      )}
                      {field.source === "accordion" && (
                        <span className="badge badge-accent badge-outline">Accordion</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {/* Move Up */}
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
                      {/* Move Down */}
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
                      {/* Edit Field */}
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
                      {/* Delete Field */}
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
                    </div>
                  </div>
                  {/* RENDER THE FIELD */}
                  {renderField(field, section.id)}
                </div>
              ))
            )}
          </section>
        ))}
      </main>

      {/* DRAWER (SIDE PANEL) */}
      {isDrawerOpen && (
        <>
          <div className="fixed inset-0 flex justify-end z-50">
            <div className="bg-white w-full sm:w-96 p-6 shadow-xl h-full overflow-auto">
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

              {/* Drawer Tabs */}
              <div className="flex mb-4 space-x-2">
                <button
                  type="button"
                  onClick={() => setDrawerMode("default")}
                  className={`px-3 py-2 rounded-lg text-sm ${
                    drawerMode === "default"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  Default Field
                </button>
                <button
                  type="button"
                  onClick={() => setDrawerMode("core")}
                  className={`px-3 py-2 rounded-lg text-sm ${
                    drawerMode === "core"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  Core Fields
                </button>
                <button
                  type="button"
                  onClick={() => setDrawerMode("accordian")}
                  className={`px-3 py-2 rounded-lg text-sm ${
                    drawerMode === "accordian"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  Default Fields
                </button>
              </div>

              {/* DEFAULT FIELD TAB */}
              {drawerMode === "default" && (
                <>
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                      Field Label
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter field label"
                      value={newField.label}
                      onChange={(e) =>
                        setNewField({ ...newField, label: e.target.value })
                      }
                    />

                    <label className="block text-gray-700 font-medium mb-2">
                      Field Type
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

                    {/* Show maxLength input for text-based types */}
                    {["text", "email", "number", "tel", "textarea"].includes(
                      newField.type
                    ) && (
                      <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">
                          Max Length
                        </label>
                        <input
                          type="number"
                          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter maximum number of characters"
                          value={newField.maxLength}
                          onChange={(e) =>
                            setNewField({ ...newField, maxLength: e.target.value })
                          }
                        />
                      </div>
                    )}

                    {newField.type === "tags" && (
                      <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">
                          Tag Category
                        </label>
                        <select
                          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={newField.defaultValue}
                          onChange={(e) =>
                            setNewField({ ...newField, defaultValue: e.target.value })
                          }
                        >
                          <option value="">-- Select a tag Category --</option>
                          {tagOptions?.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.tagCategoryName}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* multi-option */}
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
                                      onClick={() => handleRemoveOption(idx)}
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
                              API Endpoint
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

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={handleSaveFieldFromDrawer}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
                    >
                      {isEditing ? "Save Changes" : "Add Field"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseDrawer}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}

              {/* CORE FIELD TAB */}
              {drawerMode === "core" && (
                <>
                  <h3 className="text-xl font-semibold mb-4">Available Core Fields</h3>
                  {filteredCoreFields.length === 0 ? (
                    <p className="text-sm text-gray-600">No available core fields.</p>
                  ) : (
                    <ul>
                      {filteredCoreFields.map((field) => (
                        <li
                          key={field.id}
                          className="mb-4 p-3 border rounded flex flex-col sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="mb-2 sm:mb-0">
                            <strong>{field.label}</strong>{" "}
                            <span className="text-sm text-gray-500">
                              ({field.type})
                            </span>
                          </div>
                          <button
                            onClick={() => handleSelectCoreField(field)}
                            type="button"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                          >
                            Add Field
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex justify-end mt-4">
                    <button
                      type="button"
                      onClick={handleCloseDrawer}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}

              {/* ACCORDION (Default Fields) TAB */}
              {drawerMode === "accordian" && (
                <div className="max-w-full">
                  <h3 className="text-xl font-semibold mb-2">Available Default Fields</h3>

                  {/* SEARCH BAR */}
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-1">
                      Search by Field Name
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Type to filter..."
                      value={accordionSearchTerm}
                      onChange={(e) => setAccordionSearchTerm(e.target.value)}
                    />
                  </div>

                  {defaultAcordian.length === 0 && (
                    <p className="text-sm text-gray-600">No data available.</p>
                  )}

                  {defaultAcordian.map((res, index) => {
                    let parsedSections = [];
                    try {
                      const parsed = JSON.parse(res.objectTypeFields);
                      if (Array.isArray(parsed.fields)) {
                        parsedSections = parsed.fields;
                      }
                    } catch (err) {
                      console.warn("Error parsing item fields:", err);
                    }

                    return (
                      <div
                        key={res.objectTypeId}
                        className={`rounded-md overflow-hidden my-2 border ${
                          activeIndex === index ? "bg-white shadow-lg" : "bg-gray-50"
                        }`}
                      >
                        {/* Accordion Header */}
                        <div
                          className="cursor-pointer hover:bg-gray-100 p-3 font-semibold text-gray-700 border-b flex justify-between items-center"
                          onClick={() => toggleAccordion(index)}
                        >
                          <span>{res.objectTypeName}</span>
                          <span>
                            {activeIndex === index ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            )}
                          </span>
                        </div>

                        {/* Accordion Content */}
                        {activeIndex === index && (
                          <div className="p-4">
                            {parsedSections.length === 0 ? (
                              <p className="text-sm text-gray-500 italic">
                                No sections/fields in this default item.
                              </p>
                            ) : (
                              parsedSections.map((sectionItem) => (
                                <div
                                  key={sectionItem.id}
                                  className="mb-4 border p-3 rounded"
                                >
                                  <div className="flex justify-between items-center mb-2">
                                    <div className="font-medium text-base md:text-lg">
                                      {sectionItem.name}
                                    </div>

                                    {/* If this section is empty, show Remove Section button */}
                                    {sectionItem.fields && sectionItem.fields.length === 0 && (
                                      <button
                                        onClick={() =>
                                          handleRemoveSectionInAccordion(
                                            res.objectTypeId,
                                            sectionItem.id
                                          )
                                        }
                                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                      >
                                        Remove Section
                                      </button>
                                    )}
                                  </div>

                                  {sectionItem.fields && sectionItem.fields.length > 0 ? (
                                    sectionItem.fields
                                      // Exclude fields that start with "core_"
                                      .filter((f) => !f.id.startsWith("core_"))
                                      // Filter by label search (case-insensitive)
                                      .filter((fld) =>
                                        fld.label
                                          ?.toLowerCase()
                                          .includes(accordionSearchTerm.toLowerCase())
                                      )
                                      .map((fld) => {
                                        const used = isAccordionFieldUsed(fld.id);
                                        return (
                                          <div
                                            key={fld.id}
                                            className="flex justify-between items-center py-2 border-b last:border-b-0"
                                          >
                                            <div>
                                              <strong>{fld.label}</strong>{" "}
                                              <span className="text-sm text-gray-500">
                                                ({fld.type})
                                              </span>
                                            </div>
                                            {used ? (
                                              <button
                                                onClick={() =>
                                                  handleRemoveAccordionField(fld.id)
                                                }
                                                type="button"
                                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                              >
                                                Remove Field
                                              </button>
                                            ) : (
                                              <button
                                                onClick={() => handleAddAccordionField(fld)}
                                                type="button"
                                                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                              >
                                                Add Field
                                              </button>
                                            )}
                                          </div>
                                        );
                                      })
                                  ) : (
                                    <p className="text-sm text-gray-500 italic">
                                      No fields in this section.
                                    </p>
                                  )}
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <div className="flex justify-end mt-4">
                    <button
                      type="button"
                      onClick={handleCloseDrawer}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* BACKDROP */}
          <div className="fixed inset-0 bg-black opacity-40" onClick={handleCloseDrawer} />
        </>
      )}
    </div>
  );
};

export default ObjectTypeDefualt;
