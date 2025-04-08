import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import CommentComponent from '../../Calendar/Comment';
import { useSelector } from 'react-redux';
import TagSelector from './TagSelector'; // Adjust the path if needed
import ImageUploadComponent from '../../../components/imageupload/ImageUpload';

// Replace with your real API URL.
const API_URL = import.meta.env?.VITE_FLASHFORCE_API_URL || 'https://example.com';

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
  const [customTags, setCustomTags] = useState([]);
  const { userId, companyId } = useSelector((state) => state.AuthReducerKey);

  // Load custom tags from API when the component mounts.
  // (You can add your API call here if needed.)

  const validateSingleField = (field, value) => {
    if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
      return 'This field is required.';
    }
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Invalid email format.';
      }
    }
    if (field.type === 'number' && value) {
      if (isNaN(value)) {
        return 'Please enter a numeric value.';
      }
    }
    if ((field.type === 'tel' || field.type === 'phone') && value) {
      const phoneRegex = /^[0-9]{6,}$/;
      if (!phoneRegex.test(value)) {
        return 'Please enter a valid phone number.';
      }
    }
    return undefined;
  };

  const validateFields = () => {
    const newErrors = {};
    formConfig.fields.forEach(group => {
      group.fields.forEach(field => {
        const value = formValues[field.id];
        const error = validateSingleField(field, value);
        if (error) {
          newErrors[field.id] = error;
        }
      });
    });
    return newErrors;
  };

  const handleChange = (fieldId, newValue) => {
    setFormValues(prev => ({ ...prev, [fieldId]: newValue }));
    let currentField = null;
    for (const group of formConfig.fields) {
      currentField = group.fields.find(f => f.id === fieldId);
      if (currentField) break;
    }
    if (!currentField) return;
    const fieldError = validateSingleField(currentField, newValue);
    setErrors(prev => {
      const updated = { ...prev };
      if (fieldError) {
        updated[fieldId] = fieldError;
      } else {
        delete updated[fieldId];
      }
      return updated;
    });
  };

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

  const createNewTag = async (newTagName) => {
    try {
      const response = await axios.post(
        `${API_URL}/Tag/InsertTag?tagCategoryId=7?tagName=${newTagName}`,
        {
          tagName: newTagName,
          companyId,
          tagCategoryId: 1,
          userId,
          description: 'User Created this tag',
          createdBy: '7'
        }
      );
      const { tagID, tagName } = response.data;
      return { value: tagID, label: tagName };
    } catch (error) {
      console.error('Error creating tag:', error);
      return null;
    }
  };

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
        const options = (field.options || []).map(option => ({
          value: option.value || option,
          label: option.label || option,
        }));
        const selectedOptions = Array.isArray(value)
          ? value.map(val => {
              const found = options.find(opt => opt.value === val);
              return found || { value: val, label: val };
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
              const newValue = selected ? selected.map(opt => opt.value) : [];
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
                        handleChange(field.id, value.filter(val => val !== checkboxValue));
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
          />
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
        return (
          <input
            id={field.id}
            name={field.id}
            type="datetime-local"
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
      case 'comment':
        return <CommentComponent />;
      case 'tags': {
        const currentValue = Array.isArray(value) ? value : [];
        const handleTagSelect = (tag) => {
          if (!currentValue.some(t => t.value === tag.value)) {
            const newTags = [...currentValue, tag];
            handleChange(field.id, newTags);
          }
        };

        return (
          <div className="mt-1">
            <TagSelector
              id={field.value}
              companyId={companyId}
              tags={customTags}  // Passed from parent state.
              categories={field.categories || []}
              onTagSelect={handleTagSelect}
              onAddTag={async (newTagName) => {
                const createdTag = await createNewTag(newTagName);
                return createdTag;
              }}
              placeholder="Select or create a tag..."
            />
          </div>
        );
      }
      // New: Render a file input for basic uploads.
      case 'upload':
        return (
          <ImageUploadComponent
            id={field.id}
            value={value}
            onChange={(val) => handleChange(field.id, val)}
          />
        );
      // New: Render using the ImageUploadComponent for template uploads.
      case 'templateUpload':
        return (
          <ImageUploadComponent
            id={field.id}
            value={value}
            onChange={(val) => handleChange(field.id, val)}
          />
        );
      default:
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
    <form onSubmit={handleSubmit} noValidate>
      {formConfig.fields.map(group => (
        <div key={group.id} className="mb-6">
          {group.name && <h3 className="text-lg font-semibold mb-2">{group.name}</h3>}
          {group.fields.map(field => (
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
