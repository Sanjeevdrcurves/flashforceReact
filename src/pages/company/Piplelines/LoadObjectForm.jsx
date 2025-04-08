import React, { useState } from 'react';
import Select from 'react-select';

/**
 * A reusable dynamic form component.
 *
 * @param {Object} props
 * @param {Object} props.formConfig - The parsed JSON object describing form groups/fields.
 * @param {Function} props.onSubmit - Callback invoked when the form is submitted and passes validation.
 * @param {Object} [props.initialValues={}] - Optional initial values for the form.
 */
const LoadObjectForm = ({ formConfig, onSubmit, initialValues = {} }) => {
  const [formValues, setFormValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  /**
   * Validate a single field's value, returning an error string or undefined if valid.
   */
  const validateSingleField = (field, value) => {
    // 1) Required
    if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
      return 'This field is required.';
    }

    // 2) Email
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Invalid email format.';
      }
    }

    // 3) Number
    if (field.type === 'number' && value) {
      if (isNaN(value)) {
        return 'Please enter a numeric value.';
      }
    }

    // 4) Phone (tel/phone)
    if ((field.type === 'tel' || field.type === 'phone') && value) {
      const phoneRegex = /^[0-9]{6,}$/; // at least 6 digits
      if (!phoneRegex.test(value)) {
        return 'Please enter a valid phone number.';
      }
    }

    // ...Add any other custom validation checks if needed.

    // If everything's good, return nothing.
    return undefined;
  };

  /**
   * Validate all fields in the form before submission.
   */
  const validateFields = () => {
    const newErrors = {};

    formConfig.fields.forEach((group) => {
      group.fields.forEach((field) => {
        const value = formValues[field.id];
        const error = validateSingleField(field, value);
        if (error) {
          newErrors[field.id] = error;
        }
      });
    });
    return newErrors;
  };

  /**
   * Handler for when a field's value changes. We update the formValues
   * and re-check validity for that single field (removing or adding an error).
   */
  const handleChange = (fieldId, newValue) => {
    setFormValues((prev) => ({ ...prev, [fieldId]: newValue }));

    // Find the matching field from formConfig so we know whether it's required, etc.
    let currentField = null;
    for (const group of formConfig.fields) {
      currentField = group.fields.find((f) => f.id === fieldId);
      if (currentField) break;
    }
    if (!currentField) return; // If somehow not found, just ignore.

    // Validate this single field
    const fieldError = validateSingleField(currentField, newValue);

    // Update errors state: remove error if now valid, or set new error
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      if (fieldError) {
        updatedErrors[fieldId] = fieldError;
      } else {
        delete updatedErrors[fieldId];
      }
      return updatedErrors;
    });
  };

  /**
   * Handler for form submission: final check of all fields.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateFields();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      onSubmit(formValues);
    }
  };

  /**
   * Renders a single form field based on type.
   */
  const renderField = (field) => {
    const value = formValues[field.id] || '';

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'date':
      case 'tel':
        return (
          <input
            id={field.id}
            name={field.id}
            type={field.type}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case 'select':
        return (
          <select
            id={field.id}
            name={field.id}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select an option</option>
            {(field.options || []).map((option, idx) => (
              <option key={idx} value={option.value || option}>
                {option.label || option}
              </option>
            ))}
          </select>
        );

      case 'multiselect':
      case 'select2': {
        const options = (field.options || []).map((option) => ({
          value: option.value || option,
          label: option.label || option,
        }));
        const selectedOptions = Array.isArray(value)
          ? value.map((v) => {
              const found = options.find((opt) => opt.value === v);
              return { value: v, label: found ? found.label : v };
            })
          : [];

        return (
          <Select
            id={field.id}
            name={field.id}
            isMulti
            options={options}
            value={selectedOptions}
            onChange={(selected) => {
              const newValue = selected ? selected.map((opt) => opt.value) : [];
              handleChange(field.id, newValue);
            }}
            className="mt-1"
          />
        );
      }

      case 'checkbox':
        return (
          <div>
            {(field.options || []).map((option, idx) => {
              const checkboxValue = option.value || option;
              const isChecked = Array.isArray(value) && value.includes(checkboxValue);
              return (
                <label key={idx} className="inline-flex items-center mr-4">
                  <input
                    type="checkbox"
                    name={field.id}
                    checked={isChecked}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleChange(field.id, [...(value || []), checkboxValue]);
                      } else {
                        handleChange(
                          field.id,
                          value.filter((val) => val !== checkboxValue)
                        );
                      }
                    }}
                  />
                  <span className="ml-1">{option.label || option}</span>
                </label>
              );
            })}
          </div>
        );

      case 'radio':
        return (
          <div>
            {(field.options || []).map((option, idx) => {
              const radioValue = option.value || option;
              return (
                <label key={idx} className="inline-flex items-center mr-4">
                  <input
                    type="radio"
                    name={field.id}
                    value={radioValue}
                    checked={value === radioValue}
                    onChange={() => handleChange(field.id, radioValue)}
                  />
                  <span className="ml-1">{option.label || option}</span>
                </label>
              );
            })}
          </div>
        );

      case 'textarea':
        return (
          <textarea
            id={field.id}
            name={field.id}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            placeholder={`Enter ${field.label}`}
            className="mt-1 block w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        );

      case 'phone':
        return (
          <input
            id={field.id}
            name={field.id}
            type="tel"
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            placeholder={`Enter ${field.label}`}
            inputMode="numeric"
            className="mt-1 block w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case 'time':
        return (
          <input
            id={field.id}
            name={field.id}
            type="time"
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case 'timeDuration':
        // Use the same native time input, but handle it as a 'duration' concept in your business logic.
        return (
          <input
            id={field.id}
            name={field.name} // Use the field's 'name' property
        type="datetime-local"
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      default:
        // Default to text input if type is unknown
        return (
          <input
            id={field.id}
            name={field.id}
            type="text"
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
    }
  };

  return (
    // 'noValidate' so the browser won't show default required messages.
    <form onSubmit={handleSubmit} noValidate>
      {formConfig.fields.map((group) => (
        <div key={group.id} className="mb-6">
          {group.name && <h3 className="text-lg font-semibold mb-2">{group.name}</h3>}
          {group.fields.map((field) => (
            <div key={field.id} className="mb-4">
              <label className="block text-gray-700 font-medium mb-1" htmlFor={field.id}>
                {field.label}
              </label>
              {renderField(field)}
              {errors[field.id] && (
                <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>
              )}
            </div>
          ))}
        </div>
      ))}
      <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
        Submit
      </button>
    </form>
  );
};

export default LoadObjectForm;
