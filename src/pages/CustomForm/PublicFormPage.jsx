import React, { useState, useEffect, Fragment } from "react";
import { useParams, useNavigate } from "react-router-dom"; // For redirection
import axios from "axios";
import Select from "react-select";
import { toast } from "sonner";

// Replace with your API base URL (make sure it's set in your environment)
const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const generateRandomId = () => Math.floor(Math.random() * 1000000);

// --------------------------
// Helper Functions
// --------------------------
const isTextBasedField = (type) => {
  const textTypes = ["text", "textarea", "password", "email", "tel", "date"];
  return textTypes.includes(type);
};

const countWords = (str) => {
  if (!str) return 0;
  return str
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
};

const countChars = (str) => {
  if (!str) return 0;
  return str.length;
};

const validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

const isEmpty = (value, type) => {
  if (type === "checkbox") {
    return !Array.isArray(value) || value.length === 0;
  }
  if (type === "select2") {
    if (value === undefined || value === null) return true;
    if (Array.isArray(value)) return value.length === 0;
    return value === "";
  }
  return value === undefined || value === "" || value === null;
};

// --------------------------
// BMI Calculation Helper
// --------------------------
const calculateBMI = (height, weight) => {
  const h = parseFloat(height);
  const w = parseFloat(weight);
  if (!h || !w) return "";
  // Convert height from centimeters to meters
  const bmi = w / ((h / 100) * (h / 100));
  return bmi.toFixed(2);
};

// --------------------------
// Helper to render an editable field input
// --------------------------
const renderFieldInput = (field, responses, handleChange, errors) => {
  // Render table fields
  if (field.type === "table") {
    return (
      <div className="mb-4">
        <div className="font-semibold mb-2">{field.label}</div>
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr>
                {field.colNames &&
                  field.colNames.map((col, i) => (
                    <th key={i} className="border px-2 py-1">
                      {col}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: field.rows }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {field.colNames &&
                    field.colNames.map((col, i) => (
                      <td key={i} className="border px-2 py-1">
                        Data
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (field.type === "section") {
    return (
      <div key={field.id} className="mb-4">
        <div className="p-2 bg-gray-100 border border-gray-300 rounded">
          <div className="font-semibold mb-2">{field.label}</div>
          {field.fields && field.fields.length > 0 ? (
            <div
              className={`grid gap-4 ${
                field.fields.length === 1
                  ? "grid-cols-1"
                  : field.fields.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-3"
              }`}
            >
              {field.fields.map((innerField) => (
                <div key={innerField.id}>
                  {renderFieldInput(innerField, responses, handleChange, errors)}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">
              No fields in this section.
            </p>
          )}
        </div>
      </div>
    );
  }

  if (field.type === "title") {
    return (
      <div className="bg-gray-100 text-gray-800 font-semibold rounded p-2 my-2">
        {field.label}
      </div>
    );
  }

  // Render BMI calculator field
  if (field.type === "bmi") {
    return (
      <div key={field.id} className="mb-4">
        <label className="block font-medium text-gray-800 mb-2" htmlFor={field.id}>
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="flex space-x-2">
          <input
            id={`${field.id}-height`}
            type="number"
            value={responses[`${field.id}-height`] || ""}
            onChange={(e) => handleChange(`${field.id}-height`, e.target.value)}
            required={field.required}
            className="w-full border p-2 rounded bg-white"
            placeholder="Height (cm)"
          />
          <input
            id={`${field.id}-weight`}
            type="number"
            value={responses[`${field.id}-weight`] || ""}
            onChange={(e) => handleChange(`${field.id}-weight`, e.target.value)}
            required={field.required}
            className="w-full border p-2 rounded bg-white"
            placeholder="Weight (kg)"
          />
        </div>
        {responses[`${field.id}-height`] &&
          responses[`${field.id}-weight`] && (
            <p className="mt-2 text-sm text-gray-500">
              BMI:{" "}
              {calculateBMI(
                responses[`${field.id}-height`],
                responses[`${field.id}-weight`]
              )}
            </p>
          )}
        {errors && errors[field.id] && (
          <p className="text-red-500 text-sm mt-1" id={`${field.id}-error`}>
            {errors[field.id]}
          </p>
        )}
      </div>
    );
  }

  // Default case for text-based fields and others
  switch (field.type) {
    case "text":
    case "email":
    case "password":
    case "tel":
    case "date":
      return (
        <div className="mb-4">
          {isTextBasedField(field.type) && (
            <input
              id={field.id}
              type={field.type === "textarea" ? "text" : field.type}
              value={responses[field.id] || ""}
              onChange={(e) => handleChange(field.id, e.target.value)}
              required={field.required}
              className="w-full border p-2 rounded bg-white"
              placeholder={`(Max ${field.maxWords || "∞"} words)`}
            />
          )}
        </div>
      );
    case "textarea":
      return (
        <div className="mb-4">
          <textarea
            id={field.id}
            rows="4"
            value={responses[field.id] || ""}
            onChange={(e) => handleChange(field.id, e.target.value)}
            required={field.required}
            className="w-full border p-2 rounded bg-white"
            placeholder={`(Max ${field.maxWords || "∞"} words)`}
          />
        </div>
      );
    case "checkbox":
      return (
        <div className="mb-4">
          {field.options.map((option, idx) => (
            <label key={idx} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={
                  responses[field.id]
                    ? responses[field.id].includes(option.label)
                    : false
                }
                onChange={(e) => {
                  let newValue = responses[field.id] || [];
                  if (e.target.checked) {
                    newValue = [...newValue, option.label];
                  } else {
                    newValue = newValue.filter((val) => val !== option.label);
                  }
                  handleChange(field.id, newValue);
                }}
                required={field.required}
                className="h-4 w-4 text-blue-600"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      );
    case "radio":
      return (
        <div className="mb-4">
          <label className="block font-medium text-gray-800 mb-2" htmlFor={field.id}>
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
          {field.options.map((option, idx) => (
            <label key={idx} className="flex items-center space-x-2">
              <input
                type="radio"
                name={`radio-${field.id}`}
                value={option.label}
                checked={responses[field.id] === option.label}
                onChange={(e) => handleChange(field.id, e.target.value)}
                required={field.required}
                className="h-4 w-4 text-blue-600"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      );
    case "select":
      return (
        <div className="mb-4">
          <select
            id={field.id}
            value={responses[field.id] || ""}
            onChange={(e) => handleChange(field.id, e.target.value)}
            required={field.required}
            className="w-full border p-2 rounded bg-white"
          >
            <option value="">Select an option</option>
            {field.options.map((option, idx) => (
              <option key={idx} value={option.label}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );
    case "select2":
      return (
        <div className="mb-4">
          {field.searchable ? (
            <Select
              id={field.id}
              value={responses[field.id] || null}
              onChange={(selected) => handleChange(field.id, selected)}
              options={field.options.map((opt) => ({
                label: opt.label,
                value: opt.label,
              }))}
              isMulti={field.multiSelect}
              required={field.required}
              className="basic-multi-select"
              classNamePrefix="select"
            />
          ) : (
            <select
              id={field.id}
              value={responses[field.id] || ""}
              onChange={(e) => handleChange(field.id, e.target.value)}
              required={field.required}
              className="w-full border p-2 rounded bg-white"
            >
              <option value="">Select an option</option>
              {field.options.map((option, idx) => (
                <option key={idx} value={option.label}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </div>
      );
    case "file-upload":
      return (
        <div className="mb-4">
          <input
            id={field.id}
            type="file"
            onChange={(e) => handleChange(field.id, e.target.files[0])}
            required={field.required}
            className="w-full border p-2 rounded bg-white"
          />
        </div>
      );
    default:
      return null;
  }
};

// --------------------------
// PublicFormPage Component
// --------------------------
export default function PublicFormPage() {
  const { formId } = useParams();
  const navigate = useNavigate();

  // Form state
  const [formName, setFormName] = useState("");
  const [header, setHeader] = useState(null); // New state for header HTML
  const [pages, setPages] = useState([]);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Stepper state
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // User responses and errors
  const [responses, setResponses] = useState({});
  const [errors, setErrors] = useState({});

  // Fetch form data on mount
  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/CustomForm/GetCustomFormByID/0?linkId=${formId}`
        );
        const form = response.data[0];
        if (!form) throw new Error("Form not found.");

        setFormData(form);
        const { formName, otherJSON } = form;
        setFormName(formName || "Untitled Form");

        // Parse the JSON (otherJSON) and extract header and pages.
        // We assume otherJSON is an object that can include a header property.
        const parsed = JSON.parse(otherJSON) || {};
        if (parsed.header) {
          setHeader(parsed.header);
        }
        if (parsed.pages && Array.isArray(parsed.pages)) {
          setPages(parsed.pages);
        } else if (Array.isArray(parsed)) {
          setPages(parsed);
        } else {
          console.error("Unexpected JSON format:", parsed);
          setPages([]);
        }
        // Optionally show a toast on successful load
        toast.success("Form loaded successfully!");
      } catch (error) {
        console.error("Error fetching form:", error);
        toast.error("Failed to load the form. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [formId]);

  // Handle input change and inline validation
  const handleChange = (fieldId, value) => {
    setResponses((prev) => ({ ...prev, [fieldId]: value }));
    const field = getFieldById(fieldId);
    if (field) {
      let fieldErrors = {};
      if (field.required && isEmpty(value, field.type)) {
        fieldErrors[fieldId] = "This field is required.";
      }
      if (isTextBasedField(field.type)) {
        const wordCount = countWords(value);
        if (field.minWords && wordCount < field.minWords) {
          fieldErrors[fieldId] = `Enter at least ${field.minWords} words. (${wordCount} entered)`;
        }
        if (field.maxWords && wordCount > field.maxWords) {
          fieldErrors[fieldId] = `No more than ${field.maxWords} words allowed. (${wordCount} entered)`;
        }
      }
      if (isTextBasedField(field.type)) {
        const charCount = countChars(value);
        if (field.minChars && charCount < field.minChars) {
          fieldErrors[fieldId] = `Enter at least ${field.minChars} characters. (${charCount} entered)`;
        }
        if (field.maxChars && charCount > field.maxChars) {
          fieldErrors[fieldId] = `No more than ${field.maxChars} characters allowed. (${charCount} entered)`;
        }
      }
      if (field.type === "email" && value && !validateEmail(value)) {
        fieldErrors[fieldId] = "Enter a valid email address.";
      }
      if (Object.keys(fieldErrors).length > 0) {
        setErrors((prev) => ({ ...prev, ...fieldErrors }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldId];
          return newErrors;
        });
      }
    }
  };

  // Helper to get field definition by ID
  const getFieldById = (fieldId) => {
    for (const page of pages) {
      const field = page.fields.find((f) => f.id === fieldId);
      if (field) return field;
    }
    return null;
  };

  // Construct enhanced responses with field labels
  const constructEnhancedResponses = () => {
    const enhancedResponses = [];
    pages.forEach((page) => {
      page.fields.forEach((field) => {
        let value = responses[field.id];
        // For BMI fields, combine height and weight responses
        if (field.type === "bmi") {
          const height = responses[`${field.id}-height`];
          const weight = responses[`${field.id}-weight`];
          value = { height, weight, bmi: calculateBMI(height, weight) };
        }
        enhancedResponses.push({
          fieldId: field.id,
          label: field.label,
          value: sanitizeFieldValue(field, value),
        });
      });
    });
    return enhancedResponses;
  };

  const sanitizeFieldValue = (field, value) => {
    if (field.type === "file-upload" && value instanceof File) {
      return value.name;
    }
    if (field.type === "select2") {
      if (Array.isArray(value)) {
        return value.map((option) => option.value || option).join(", ");
      }
      return value || "";
    }
    if (field.type === "bmi" && value && typeof value === "object") {
      return `Height: ${value.height || ""} cm, Weight: ${value.weight || ""} kg, BMI: ${value.bmi || ""}`;
    }
    return value;
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {};
    pages.forEach((page) => {
      page.fields.forEach((field) => {
        let value = responses[field.id];
        if (field.type === "bmi") {
          // Check for both height and weight inputs
          const height = responses[`${field.id}-height`];
          const weight = responses[`${field.id}-weight`];
          if (
            field.required &&
            (isEmpty(height, "number") || isEmpty(weight, "number"))
          ) {
            newErrors[field.id] = "Both height and weight are required.";
          }
          return;
        }
        if (field.required && isEmpty(value, field.type)) {
          newErrors[field.id] = "This field is required.";
          return;
        }
        if (isTextBasedField(field.type)) {
          const wordCount = countWords(value);
          if (field.minWords && wordCount < field.minWords) {
            newErrors[field.id] = `Enter at least ${field.minWords} words. (${wordCount} entered)`;
          }
          if (field.maxWords && wordCount > field.maxWords) {
            newErrors[field.id] = `No more than ${field.maxWords} words allowed. (${wordCount} entered)`;
          }
        }
        if (isTextBasedField(field.type)) {
          const charCount = countChars(value);
          if (field.minChars && charCount < field.minChars) {
            newErrors[field.id] = `Enter at least ${field.minChars} characters. (${charCount} entered)`;
          }
          if (field.maxChars && charCount > field.maxChars) {
            newErrors[field.id] = `No more than ${field.maxChars} characters allowed. (${charCount} entered)`;
          }
        }
        if (field.type === "email" && value && !validateEmail(value)) {
          newErrors[field.id] = "Enter a valid email address.";
        }
      });
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate current page
  const validateCurrentPage = () => {
    const currentPage = pages[currentPageIndex];
    const newErrors = {};
    currentPage.fields.forEach((field) => {
      let value = responses[field.id];
      if (field.type === "bmi") {
        const height = responses[`${field.id}-height`];
        const weight = responses[`${field.id}-weight`];
        if (
          field.required &&
          (isEmpty(height, "number") || isEmpty(weight, "number"))
        ) {
          newErrors[field.id] = "Both height and weight are required.";
        }
        return;
      }
      if (field.required && isEmpty(value, field.type)) {
        newErrors[field.id] = "This field is required.";
        return;
      }
      if (isTextBasedField(field.type)) {
        const wordCount = countWords(value);
        if (field.minWords && wordCount < field.minWords) {
          newErrors[field.id] = `Enter at least ${field.minWords} words. (${wordCount} entered)`;
        }
        if (field.maxWords && wordCount > field.maxWords) {
          newErrors[field.id] = `No more than ${field.maxWords} words allowed. (${wordCount} entered)`;
        }
      }
      if (isTextBasedField(field.type)) {
        const charCount = countChars(value);
        if (field.minChars && charCount < field.minChars) {
          newErrors[field.id] = `Enter at least ${field.minChars} characters. (${charCount} entered)`;
        }
        if (field.maxChars && charCount > field.maxChars) {
          newErrors[field.id] = `No more than ${field.maxChars} characters allowed. (${charCount} entered)`;
        }
      }
      if (field.type === "email" && value && !validateEmail(value)) {
        newErrors[field.id] = "Enter a valid email address.";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting.");
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        formId: formId,
        responseID: 0,
        companyID: 0,
        userID: 0,
        response: JSON.stringify(constructEnhancedResponses()),
        createdBy: JSON.stringify(constructEnhancedResponses()),
      };
      console.log("Submitting payload:", payload);
      await axios.post(`${API_URL}/CustomForm/CreateCustomFormResponse`, payload);
      toast.success("Form submitted successfully!");
      // navigate("/thank-you");
      navigate('/formLisitng')
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error submitting form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigation for stepper
  const handleNext = () => {
    if (validateCurrentPage()) {
      setCurrentPageIndex((prev) => prev + 1);
    } else {
      toast.error("Fix errors on the current page before proceeding.");
    }
  };

  const handlePrevious = () => {
    setCurrentPageIndex((prev) => prev - 1);
  };

  // If loading or form not found
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-600 animate-pulse">Loading form...</p>
      </div>
    );
  }
  if (!formData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-red-600">Form not found.</p>
      </div>
    );
  }

  const isLastPage = currentPageIndex === pages.length - 1;

  return (
    <Fragment>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <form
          className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 md:p-8"
          onSubmit={handleSubmit}
          noValidate
        >
          {/* Render header HTML from otherJSON if available */}
          {header && header.type === "html" && (
            <div className="mb-6" dangerouslySetInnerHTML={{ __html: header.content }} />
          )}

          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            {formName}
          </h1>

          {/* Professional Stepper Navigation */}
          <div className="mb-8">
            <div className="relative">
              {/* Horizontal line */}
              <div className="absolute top-5 left-0 right-0 border-t-2 border-gray-300"></div>
              <ul className="relative flex justify-between">
                {pages.map((page, index) => (
                  <li key={page.id} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full 
                        ${currentPageIndex >= index ? "bg-blue-600 text-white" : "bg-white text-gray-600 border-2 border-gray-300"}`}
                    >
                      {currentPageIndex > index ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 00-1.415 1.415l4.829 4.829a1 1 0 001.414 0l9-9a1 1 0 00-1.414-1.414L8.414 13.172 6.121 10.879a1 1 0 00-1.415-1.415l-2.828 2.828a3 3 0 004.242 4.242l2.828-2.828a1 1 0 011.414 0l8.486 8.486a1 1 0 01-1.414 1.414l-9-9z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </div>
                    <p className="mt-2 text-center text-sm">{page.name}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Current Page Fields */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              {pages[currentPageIndex].name}
            </h2>
            {pages[currentPageIndex].fields.map((field) => (
              <div key={field.id} className="mb-5">
                {field.type !== "title" && (
                  <label className="block mb-2 font-medium text-gray-800" htmlFor={field.id}>
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                )}
                {renderFieldInput(field, responses, handleChange, errors)}
                {isTextBasedField(field.type) &&
                  (field.minWords || field.maxWords) && (
                    <p className="text-sm text-gray-500 mt-1">
                      {field.minWords && <span>Minimum words: {field.minWords}. </span>}
                      {field.maxWords && <span>Maximum words: {field.maxWords}. </span>}
                      {responses[field.id] ? (
                        <span>Current word count: {countWords(responses[field.id])}.</span>
                      ) : (
                        <span>Current word count: 0.</span>
                      )}
                    </p>
                  )}
                {isTextBasedField(field.type) &&
                  (field.minChars || field.maxChars) && (
                    <p className="text-sm text-gray-500 mt-1">
                      {field.minChars && <span>Minimum characters: {field.minChars}. </span>}
                      {field.maxChars && <span>Maximum characters: {field.maxChars}. </span>}
                      {responses[field.id] ? (
                        <span>Current character count: {countChars(responses[field.id])}.</span>
                      ) : (
                        <span>Current character count: 0.</span>
                      )}
                    </p>
                  )}
                {errors[field.id] && (
                  <p className="text-red-500 text-sm mt-1" id={`${field.id}-error`}>
                    {errors[field.id]}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            {currentPageIndex > 0 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="px-4 py-2 font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
              >
                Previous
              </button>
            )}
            <div className="ml-auto">
              {!isLastPage ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2 font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Submit Form"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </Fragment>
  );
}
