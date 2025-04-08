import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import axios from "axios";
import Select from "react-select"; // For select2
import { useSelector } from "react-redux";

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

// Helper: Calculate BMI given weight (kg) and height (m)
const calculateBMI = (weight, height) => {
  const w = parseFloat(weight);
  const h = parseFloat(height);
  if (!w || !h || h <= 0) return "";
  return (w / (h * h)).toFixed(2);
};

const CustomFieldBuilder = forwardRef(
  (
    {
      formId,
      customFieldValues,
      setCustomFieldValues,
      errors,
      setErrors,
      isSubmitClicked, // for live validation if needed
    },
    ref
  ) => {
    const [customFields, setCustomFields] = useState([]);
    const { userId, companyId } = useSelector(
      (state) => state.AuthReducerKey
    );

    // (1) Validate a field (required, max words, email, etc.)
    const validateField = (field, rawValue) => {
      if (field.type && field.type.toLowerCase() === "bmi") {
        const weight = customFieldValues[`${field.id}_weight`] || "";
        const height = customFieldValues[`${field.id}_height`] || "";
        const errorMessages = [];
        if (field.required && (!weight || !height)) {
          errorMessages.push(
            `${field.label || field.name} is required (both weight and height).`
          );
        }
        return errorMessages.join(" ");
      }
      const value = Array.isArray(rawValue)
        ? rawValue.join(" ")
        : (rawValue || "").toString().trim();
      const errorMessages = [];
      if (
        field.required &&
        (!rawValue || (Array.isArray(rawValue) && rawValue.length === 0))
      ) {
        errorMessages.push(`${field.label || field.name} is required.`);
      }
      if (
        field.maxWords !== null &&
        typeof field.maxWords === "number" &&
        field.maxWords > 0
      ) {
        const wordCount = value.split(/\s+/).filter(Boolean).length;
        if (wordCount > field.maxWords) {
          errorMessages.push(
            `${field.label || field.name} should not exceed ${field.maxWords} words (currently ${wordCount} words).`
          );
        }
      }
      if (field.type && field.type.toLowerCase() === "email" && value) {
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        if (!emailRegex.test(value)) {
          errorMessages.push("Invalid email format.");
        }
      }
      return errorMessages.join(" ");
    };

    // (2) Recursively gather all fields (including nested ones)
    const gatherAllFields = (fieldsArray) => {
      let all = [];
      for (const f of fieldsArray) {
        all.push(f);
        if (f.fields && Array.isArray(f.fields)) {
          all = all.concat(gatherAllFields(f.fields));
        }
      }
      return all;
    };

    // (3) Helper: Find a field by its ID (even if nested)
    const findFieldById = (fieldsArray, id) => {
      for (const f of fieldsArray) {
        if (f.id === id) return f;
        if (f.fields && Array.isArray(f.fields)) {
          const sub = findFieldById(f.fields, id);
          if (sub) return sub;
        }
      }
      return null;
    };

    // (4) Helper: Recursively update fields with dynamic options.
    // For any field with "optionsSource": "dynamic", it will call the given apiEndpoint
    // and assign the returned array (assumed to have objects with value and label) to field.options.
    const updateDynamicOptions = async (fieldsArray) => {
      return Promise.all(
        fieldsArray.map(async (field) => {
          let updatedField = { ...field };
          if (
            field.optionsSource &&
            field.optionsSource.toLowerCase() === "dynamic" &&
            field.apiEndpoint
          ) {
            try {
              const res = await axios.get(field.apiEndpoint);
              // Assume the API returns an array of options objects
              updatedField.options = res.data;
            } catch (error) {
              console.error(
                `Error fetching dynamic options for field ${field.id}:`,
                error
              );
            }
          }
          if (field.fields && Array.isArray(field.fields)) {
            updatedField.fields = await updateDynamicOptions(field.fields);
          }
          return updatedField;
        })
      );
    };

    // (5) Fetch the custom form definition from the server
    useEffect(() => {
      const fetchCustomFields = async () => {
        try {
          const response = await axios.get(
            `${API_URL}/CustomForm/GetCustomFormFieldById/${formId}/-1`
          );
          const form = response.data[0];
          if (form && form.otherJSON) {
            const parsedOtherJSON = JSON.parse(form.otherJSON);
            // We now expect the JSON to have a top-level "fields" property.
            const fields = parsedOtherJSON.fields || [];
            // Update fields if any of them have dynamic options.
            const updatedFields = await updateDynamicOptions(fields);
            setCustomFields(updatedFields);

            // Initialize values for each field (including nested ones)
            const allFields = gatherAllFields(updatedFields);
            const initialValues = {};
            allFields.forEach((field) => {
              if (!(field.id in customFieldValues)) {
                if (
                  (field.type &&
                    field.type.toLowerCase() === "select2" &&
                    field.multiple) ||
                  (field.type &&
                    field.type.toLowerCase() === "file-upload" &&
                    field.multiple)
                ) {
                  initialValues[field.id] = [];
                } else {
                  initialValues[field.id] = "";
                }
                if (field.type && field.type.toLowerCase() === "bmi") {
                  initialValues[`${field.id}_weight`] = "";
                  initialValues[`${field.id}_height`] = "";
                }
              }
            });
            setCustomFieldValues((prev) => ({ ...initialValues, ...prev }));
          }
        } catch (error) {
          console.error("Error fetching custom fields:", error);
        }
      };

      if (formId) {
        fetchCustomFields();
      }
    }, [formId, companyId]);

    // (6) Expose a function to validate all fields to the parent via ref
    const validateAllFields = () => {
      const allFields = gatherAllFields(customFields);
      const newErrors = {};
      allFields.forEach((field) => {
        const errorMessage = validateField(
          field,
          customFieldValues[field.id]
        );
        if (errorMessage) {
          newErrors[field.id] = errorMessage;
        }
      });
      setErrors(newErrors);
      return newErrors;
    };

    useImperativeHandle(ref, () => ({
      validateAllFields,
    }));

    // (7) Handle changes and blur events for standard input types
    const handleCustomFieldChange = (e) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === "checkbox" ? checked : value;
      setCustomFieldValues((prev) => ({ ...prev, [name]: newValue }));
      const field = findFieldById(customFields, name);
      if (field) {
        const errorMessage = validateField(field, newValue);
        setErrors((prev) => ({ ...prev, [name]: errorMessage }));
      }
    };

    const handleCustomFieldBlur = (e) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === "checkbox" ? checked : value;
      const field = findFieldById(customFields, name);
      if (field) {
        const errorMessage = validateField(field, newValue);
        setErrors((prev) => ({ ...prev, [name]: errorMessage }));
      }
    };

    // (8) Render a single input based on field type (including BMI)
    const renderFieldInput = (field) => {
      const value = customFieldValues[field.id] ?? "";
      const fieldType = (field.type || "text").toLowerCase();
      switch (fieldType) {
        case "textarea":
          return (
            <textarea
              name={field.id}
              id={field.id}
              placeholder={field.label || field.name}
              value={value}
              onChange={handleCustomFieldChange}
              onBlur={handleCustomFieldBlur}
              required={field.required}
              className={`border rounded w-full py-2 px-3 mt-1 ${
                errors[field.id] ? "border-red-500" : ""
              }`}
            />
          );
        case "select":
          return (
            <select
              name={field.id}
              id={field.id}
              value={value}
              onChange={handleCustomFieldChange}
              onBlur={handleCustomFieldBlur}
              required={field.required}
              className={`border rounded w-full py-2 px-3 mt-1 ${
                errors[field.id] ? "border-red-500" : ""
              }`}
            >
              <option value="">
                Select {field.title || field.name}...
              </option>
              {field.options?.map((opt, idx) => (
                <option key={idx} value={opt.value || opt.title}>
                  {opt.title}
                </option>
              ))}
            </select>
          );
        case "select2": {
          const options = (field.options || []).map((opt) => ({
            value: opt.id || opt.title,
            label: opt.title,
          }));
          const selectValue = field.multiple
            ? options.filter((option) =>
                (customFieldValues[field.id] || []).includes(option.value)
              )
            : options.find(
                (option) => option.value === customFieldValues[field.id]
              ) || null;
          const handleSelectChange = (selectedOption) => {
            if (field.multiple) {
              const newValue = selectedOption
                ? selectedOption.map((opt) => opt.value)
                : [];
              setCustomFieldValues((prev) => ({ ...prev, [field.id]: newValue }));
              const errorMessage = validateField(field, newValue);
              setErrors((prev) => ({ ...prev, [field.id]: errorMessage }));
            } else {
              const newValue = selectedOption ? selectedOption.value : "";
              setCustomFieldValues((prev) => ({ ...prev, [field.id]: newValue }));
              const errorMessage = validateField(field, newValue);
              setErrors((prev) => ({ ...prev, [field.id]: errorMessage }));
            }
          };
          return (
            <Select
              name={field.id}
              id={field.id}
              value={selectValue}
              onChange={handleSelectChange}
              onBlur={() => {
                const errorMessage = validateField(
                  field,
                  customFieldValues[field.id]
                );
                setErrors((prev) => ({ ...prev, [field.id]: errorMessage }));
              }}
              options={options}
              isMulti={field.multiple}
              placeholder={`Select ${field.label || field.name}...`}
              classNamePrefix="react-select"
            />
          );
        }
        case "radio":
          return (
            <div className="mt-1">
              {field.options?.map((opt, idx) => (
                <label key={idx} className="mr-4 inline-flex items-center">
                  <input
                    type="radio"
                    name={field.id}
                    value={opt.value || opt.title}
                    checked={value === (opt.value || opt.title)}
                    onChange={handleCustomFieldChange}
                    onBlur={handleCustomFieldBlur}
                    required={field.required}
                    className="mr-1 radio"
                  />
                  {opt}
                </label>
              ))}
            </div>
          );
        case "checkbox":
          return (
            <input
              type="checkbox"
              name={field.id}
              id={field.id}
              checked={!!value}
              onChange={handleCustomFieldChange}
              onBlur={handleCustomFieldBlur}
              required={field.required}
              className={`border rounded mt-1 ${
                errors[field.id] ? "border-red-500" : ""
              }`}
            />
          );
        case "date":
          return (
            <input
              type="date"
              name={field.id}
              id={field.id}
              value={value}
              onChange={handleCustomFieldChange}
              onBlur={handleCustomFieldBlur}
              required={field.required}
              className={`border rounded w-full py-2 px-3 mt-1 ${
                errors[field.id] ? "border-red-500" : ""
              }`}
            />
          );
        case "password":
          return (
            <input
              type="password"
              name={field.id}
              id={field.id}
              placeholder={field.label || field.name}
              value={value}
              onChange={handleCustomFieldChange}
              onBlur={handleCustomFieldBlur}
              required={field.required}
              className={`border rounded w-full py-2 px-3 mt-1 ${
                errors[field.id] ? "border-red-500" : ""
              }`}
            />
          );
        case "file-upload":
          return (
            <div className="mb-4">
              <label
                htmlFor={field.id}
                className={`cursor-pointer block border-dashed border-2 p-4 rounded text-center transition-colors duration-200 ${
                  errors[field.id]
                    ? "border-red-500"
                    : "border-gray-300 hover:border-blue-400"
                }`}
              >
                {customFieldValues[field.id]
                  ? field.multiple
                    ? `${customFieldValues[field.id].length} file(s) selected`
                    : customFieldValues[field.id].name
                  : `Drag & drop or click to upload ${field.label || field.name}`}
              </label>
              <input
                id={field.id}
                name={field.id}
                type="file"
                style={{ display: "none" }}
                onChange={(e) => {
                  const { name, files } = e.target;
                  const newValue = field.multiple
                    ? Array.from(files)
                    : files[0];
                  setCustomFieldValues((prev) => ({ ...prev, [name]: newValue }));
                  const errorMessage = validateField(field, newValue);
                  setErrors((prev) => ({ ...prev, [name]: errorMessage }));
                }}
                onBlur={(e) => {
                  const { name } = e.target;
                  const errorMessage = validateField(
                    field,
                    customFieldValues[name]
                  );
                  setErrors((prev) => ({ ...prev, [name]: errorMessage }));
                }}
                required={field.required}
                {...(field.multiple ? { multiple: true } : {})}
              />
              {errors[field.id] && (
                <p className="text-red-500 text-xs mt-1">{errors[field.id]}</p>
              )}
            </div>
          );
        case "bmi":
          return (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="number"
                  name={`${field.id}_weight`}
                  id={`${field.id}_weight`}
                  placeholder="Weight (kg)"
                  value={customFieldValues[`${field.id}_weight`] || ""}
                  onChange={(e) => {
                    const newWeight = e.target.value;
                    setCustomFieldValues((prev) => ({
                      ...prev,
                      [`${field.id}_weight`]: newWeight,
                      [field.id]: calculateBMI(
                        newWeight,
                        customFieldValues[`${field.id}_height`] || ""
                      ),
                    }));
                  }}
                  onBlur={handleCustomFieldBlur}
                  required={field.required}
                  className="border rounded py-2 px-3"
                />
                <input
                  type="number"
                  name={`${field.id}_height`}
                  id={`${field.id}_height`}
                  placeholder="Height (m)"
                  value={customFieldValues[`${field.id}_height`] || ""}
                  onChange={(e) => {
                    const newHeight = e.target.value;
                    setCustomFieldValues((prev) => ({
                      ...prev,
                      [`${field.id}_height`]: newHeight,
                      [field.id]: calculateBMI(
                        customFieldValues[`${field.id}_weight`] || "",
                        newHeight
                      ),
                    }));
                  }}
                  onBlur={handleCustomFieldBlur}
                  required={field.required}
                  className="border rounded py-2 px-3"
                />
              </div>
              <div>
                <span className="font-bold">BMI: </span>
                <span>{customFieldValues[field.id] || "N/A"}</span>
              </div>
            </div>
          );
        default:
          return (
            <input
              type={field.type || "text"}
              name={field.id}
              id={field.id}
              placeholder={field.label || field.name}
              value={value}
              onChange={handleCustomFieldChange}
              onBlur={handleCustomFieldBlur}
              required={field.required}
              className={`border rounded w-full py-2 px-3 mt-1 ${
                errors[field.id] ? "border-red-500" : ""
              }`}
            />
          );
      }
    };

    // (9) Render fields including containers for nested children.
    // If a field has children, we treat it as a container and do not render its own input.
    const renderFields = (fieldsArray) => {
      return fieldsArray.map((field) => {
        if (field.fields && field.fields.length > 0) {
          // Render as a container.
          return (
            <div key={field.id} className="mb-6 border rounded p-3 bg-gray-50">
              <h3 className="text-lg font-semibold mb-2">
                {field.label || field.name}
              </h3>
              <div className="pl-4 border-l ml-2">
                {renderFields(field.fields)}
              </div>
            </div>
          );
        } else {
          // Render a normal field.
          return (
            <div key={field.id} className="mb-4">
              <label htmlFor={field.id} className="py-2 text-gray-600 font-normal">
                {field.label || field.name}
              </label>
              {renderFieldInput(field)}
              {errors[field.id] && (
                <p className="text-red-500 text-xs mt-1">{errors[field.id]}</p>
              )}
            </div>
          );
        }
      });
    };

    // (10) Final render: Render all top-level custom fields
    return <>{renderFields(customFields)}</>;
  }
);

export default CustomFieldBuilder;
