import  { useState, useEffect } from 'react';
import axios from 'axios';
import { Toolbar, ToolbarHeading } from '@/partials/toolbar';
import { useSelector } from 'react-redux';
import LoadObjectForm from './LoadObjectForm';

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const Notes = () => {
  const { userId, companyId } = useSelector((state) => state.AuthReducerKey);
  const [objectTypes, setObjectTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [formConfig, setFormConfig] = useState(null);
  const [errors, setErrors] = useState({}); // state for inline validation errors

  // 1. Fetch object types
  useEffect(() => {
    const fetchObjectTypes = async () => {
      try {
        const response = await axios.get(`${API_URL}/CustomObject/GetObjectDetails?objectId=27`);
        const types = JSON.parse(response.data[0].types);
        setObjectTypes(types);

        // Automatically select the first type if available
        if (types && types.length > 0) {
          setSelectedType(types[0]);
        }
      } catch (error) {
        console.error('Error fetching object types:', error);
      }
    };
    fetchObjectTypes();
  }, []);

  // 2. Fetch custom fields for the selected type
  useEffect(() => {
    if (!selectedType) return;

    const fetchCustomFields = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/CustomObject/GetObjectCustomFields?objectCustomTypeId=0&objectTypeId=${selectedType.ObjectTypeID}&objectId=${selectedType.ObjectID}&companyId=${companyId}`
        );

        // For simplicity, assume response.data is an array, and we only care about the first item
        const [item] = response.data;
        if (item && item.objectTypeFields) {
          // Parse the JSON string from the API
          const parsedConfig = JSON.parse(item.objectTypeFields);
          setFormConfig(parsedConfig);
        } else {
          setFormConfig(null);
        }
      } catch (error) {
        console.error('Error fetching custom fields:', error);
      }
    };
    fetchCustomFields();
  }, [selectedType, companyId]);

  // Inline validation function: checks if required fields have a value
  const validateForm = (values) => {
    let newErrors = {};
    if (formConfig && Array.isArray(formConfig.fields)) {
      formConfig.fields.forEach((section) => {
        if (Array.isArray(section.fields)) {
          section.fields.forEach((field) => {
            // Check for required fields – assumes each field has a "required" boolean property
            if (field.required && !values[field.id]) {
              newErrors[field.id] = `${field.label || field.id} is required`;
            }
          });
        }
      });
    }
    return newErrors;
  };

  // 3. Handle form submission with inline validation
  const handleFormSubmit = async (values) => {
    // Run inline validation
    const validationErrors = validateForm(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Abort submission if there are validation errors
    }
    // Clear any previous errors if validation passes
    setErrors({});

    try {
      const coreData = {};
      const defaultFields = [];
  
      // 1) formConfig.fields must be an array
      if (
        !formConfig ||
        !Array.isArray(formConfig.fields) ||
        formConfig.fields.length === 0
      ) {
        console.error("formConfig.fields is not a valid array. Check your API response.");
        return;
      }
  
      // 2) Loop over each section in formConfig.fields (these are the top-level "sections")
      formConfig.fields.map((section) => {
        // 3) Each section has its own `fields` array
        if (Array.isArray(section.fields)) {
          // Loop over each field in the current section
          section.fields.map((field) => {
            // If it's a "core" field and has dbcoloumName, map to coreData
            if (field.source === "core" && field.dbcoloumName) {
              coreData[field.dbcoloumName] = values[field.id] || "";
            }
            // If it's a "default" field, collect it in defaultFields
            else if (field.source === "default") {
              defaultFields.push({
                fieldId: field.id,
                value: values[field.id] || "",
              });
            }
            return null; // no need to use the return of map here
          });
        }
  
        return null; // likewise, no need to return anything from this map
      });
  
      // 4) Combine core fields + default fields into one object
      const coreArray = [
        {
          ...coreData,
          JsonData: JSON.stringify(defaultFields),
        },
      ];
  
      // 5) Build the payload and send it to your API
      const payload = {
        operationType: "Add",
        noteData: JSON.stringify(coreArray[0]),
        companyId, // assume available from Redux or similar
        customObjectTypeId: selectedType.ObjectTypeID,
      };
  
      const response = await axios.post(`${API_URL}/CustomObject/ManageNotes`, payload);
      console.log("Saved result:", response);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <div>
      {/* <PageNavbar /> */}
      <div className="container-fixed">
        <Toolbar>
          <ToolbarHeading>
            <h1 className="text-xl font-medium leading-none text-gray-900">
              Notes
            </h1>
          </ToolbarHeading>
        </Toolbar>

        {/* Object types as buttons */}
        <div className="flex space-x-4 mt-4">
          {objectTypes.map((type, index) => (
            <button
              key={index}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 border rounded ${
                selectedType && selectedType.ObjectTypeID === type.ObjectTypeID
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-black'
              }`}
            >
              {type.ObjectTypeName}
            </button>
          ))}
        </div>

        {/* Render the DynamicForm if we have a valid config */}
        <div className="mt-4">
          {formConfig ? (
            <LoadObjectForm
              formConfig={formConfig}
              onSubmit={handleFormSubmit}
              errors={errors} // Pass inline errors to the form component (to display them inline)
            />
          ) : (
            <p>Loading form configuration...</p>
          )}
        </div>

        {/* Debug: show the raw form config */}
        {/* {JSON.stringify(formConfig)} */}
      </div>
    </div>
  );
};

export default Notes;
