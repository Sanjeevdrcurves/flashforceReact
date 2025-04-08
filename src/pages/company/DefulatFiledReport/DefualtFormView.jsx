import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const DefaultFormView = () => {
  const [sections, setSections] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  // Replace with your actual companyID if needed; here we use -1 as in your sample response.
  const companyId = -1;

  // Fetch the saved form definition when the component mounts.
  useEffect(() => {
    const fetchSavedForm = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_URL}/CustomForm/GetCustomFormFieldById/0/${companyId}`
        );
        // Example response is an array; we choose the first (or last) item.
        if (Array.isArray(response.data) && response.data.length > 0) {
          // Here we select the first saved form.
          const formRecord = response.data[0];
          if (formRecord.otherJSON) {
            // Parse the JSON. Note that the new structure uses "fields" at the top level.
            const parsed = JSON.parse(formRecord.otherJSON);
            if (parsed.fields && Array.isArray(parsed.fields)) {
              setSections(parsed.fields);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching saved form:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedForm();
  }, [companyId]);

  // Handle changes to a field value.
  const handleFieldChange = (sectionId, fieldId, type, newValue, isChecked = false) => {
    setFormData((prevData) => {
      const prevSectionData = prevData[sectionId] || {};

      if (type === "checkbox") {
        const arrVal = Array.isArray(prevSectionData[fieldId])
          ? [...prevSectionData[fieldId]]
          : [];
        if (isChecked) {
          if (!arrVal.includes(newValue)) arrVal.push(newValue);
        } else {
          const idx = arrVal.indexOf(newValue);
          if (idx >= 0) arrVal.splice(idx, 1);
        }
        return {
          ...prevData,
          [sectionId]: { ...prevSectionData, [fieldId]: arrVal },
        };
      }

      // For multiselect, radio, select, or other types.
      return {
        ...prevData,
        [sectionId]: { ...prevSectionData, [fieldId]: newValue },
      };
    });
  };

  // Render a field based on its type.
  const renderField = (field, sectionId) => {
    const { id, label, type, options } = field;
    const valueInState = formData[sectionId]?.[id] ?? "";

    const renderBasicInput = () => (
      <input
        type={type}
        value={valueInState}
        onChange={(e) => handleFieldChange(sectionId, id, type, e.target.value)}
        placeholder={`Enter ${label}`}
        className="w-full border border-gray-300 rounded-lg p-2"
      />
    );

    const renderSingleSelect = () => (
      <select
        className="w-full border border-gray-300 rounded-lg p-2"
        value={valueInState}
        onChange={(e) => handleFieldChange(sectionId, id, type, e.target.value)}
      >
        <option value="">-- Select --</option>
        {options && options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );

    const renderMultiSelect = () => (
      <select
        multiple
        className="w-full border border-gray-300 rounded-lg p-2"
        value={Array.isArray(valueInState) ? valueInState : []}
        onChange={(e) => {
          const selectedValues = Array.from(e.target.selectedOptions).map((o) => o.value);
          handleFieldChange(sectionId, id, type, selectedValues);
        }}
      >
        {options && options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );

    const renderCheckboxOrRadio = () => (
      <div className="flex flex-col space-y-2">
        {options && options.map((opt) => {
          const isChecked =
            type === "checkbox"
              ? Array.isArray(valueInState) && valueInState.includes(opt)
              : valueInState === opt;
          return (
            <label key={opt} className="inline-flex items-center">
              <input
                type={type}
                value={opt}
                checked={isChecked}
                onChange={(e) =>
                  handleFieldChange(sectionId, id, type, opt, e.target.checked)
                }
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2">{opt}</span>
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
      default:
        return renderBasicInput();
    }
  };

  // Handle final form submission.
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User-entered form data:", formData);
    // Here you could send the filled form data to an API endpoint.
    alert("Form submission logged to console!");
  };

  if (loading) {
    return <div className="p-4">Loading form...</div>;
  }

  if (!sections.length) {
    return <div className="p-4">No form definition found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Fill the Form</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {sections.map((section) => (
          <div key={section.id} className={`border-l-8 ${section.color} bg-white p-4 rounded shadow`}>
            <h2 className="text-xl font-semibold mb-4">{section.name}</h2>
            {section.fields && section.fields.length > 0 ? (
              section.fields.map((field) => (
                <div key={field.id} className="mb-4">
                  <label className="block font-medium mb-1">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {renderField(field, section.id)}
                </div>
              ))
            ) : (
              <p className="text-gray-600 italic">No fields in this section.</p>
            )}
          </div>
        ))}
        <button type="submit" className="w-full py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700">
          Submit Form
        </button>
      </form>

      {/* Debug output */}
      <div className="mt-8 p-4 bg-gray-200">
        <h3 className="font-semibold mb-2">Debug: Form Data</h3>
        <pre className="bg-white p-2 rounded text-sm">
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default DefaultFormView;
