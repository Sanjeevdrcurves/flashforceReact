import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import { useParams, useNavigate } from 'react-router';  // <-- useNavigate to go back
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { toast } from 'react-toastify';  // <-- Toastify for notifications
import LoadObjectForm from './LoadObjectForm';

// Simple navbar and toolbar components for layout
const PageNavbar = () => (
  <div style={{ backgroundColor: '#eee', padding: 8 }}>Page Navbar Placeholder</div>
);

const Toolbar = ({ children }) => (
  <div style={{ borderBottom: '1px solid #ccc', margin: '16px 0' }}>{children}</div>
);

const ToolbarHeading = ({ children }) => (
  <div style={{ padding: '8px 0' }}>{children}</div>
);

const API_URL = import.meta.env?.VITE_FLASHFORCE_API_URL || 'https://example.com';



const EditActivity = () => {
  const navigate = useNavigate();  // <-- We'll use this to go back
  const { companyId } = useSelector((state) => state.AuthReducerKey || { companyId: 123 });
  const { activityId, name, objecttypeid, objectid } = useParams() || { activityId: 1001 };
  debugger
  const [objectTypes, setObjectTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [formConfig, setFormConfig] = useState(null);
  const [serverActivityRecord, setServerActivityRecord] = useState(null);
  const [initialValues, setInitialValues] = useState({});

  // --- FETCH OBJECT TYPES ---
  useEffect(() => {
    const fetchObjectTypes = async () => {
      try {
        const response = await axios.get(`${API_URL}/CustomObject/GetObjectDetails?objectId=15`);
        const types = JSON.parse(response.data[0].types);
        setObjectTypes(types);
        if (types.length > 0) setSelectedType(types[0]);
      } catch (error) {
        console.error('Error fetching object types:', error);
      }
    };
    fetchObjectTypes();
  }, []);

  // --- FETCH THE ACTIVITY RECORD ---
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const url = `${API_URL}/CustomObject/GetActivities?activityId=${activityId}&companyId=${companyId}&customObjectTypeId=0`;
        const response = await axios.get(url);
        const record = response.data[0];
        console.log('ServerActivityRecord:', record);
        setServerActivityRecord(record);

        if (record?.types) {
          const parsedTypes = JSON.parse(record.types);
          setObjectTypes(parsedTypes);
          if (parsedTypes.length > 0) setSelectedType(parsedTypes[0]);
        }
      } catch (error) {
        console.error('Error fetching activity:', error);
      }
    };
    fetchActivity();
  }, [activityId, companyId, name, objecttypeid, objectid]);

  // --- FETCH DYNAMIC FORM CONFIG FOR SELECTED TYPE ---
  useEffect(() => {
    if (!selectedType) return;
    const fetchCustomFields = async () => {
      try {
        const url = `${API_URL}/CustomObject/GetObjectCustomFields?objectCustomTypeId=0&objectTypeId=${objecttypeid}&objectId=${objectid}&companyId=${companyId}`;
        const response = await axios.get(url);
        const [item] = response.data;
        if (item && item.objectTypeFields) {
          let parsedConfig = JSON.parse(item.objectTypeFields);
          if (Array.isArray(parsedConfig.fields)) {
            parsedConfig.fields = parsedConfig.fields.map((section) => {
              if (Array.isArray(section.fields)) {
                section.fields = section.fields.map((field) => {
                  if (field.source === 'core' && field.dbcoloumName) {
                    return { ...field, id: field.dbcoloumName, name: field.dbcoloumName };
                  }
                  if (field.source === 'default') {
                    let newId = field.id;
                    if (!newId || !newId.toString().startsWith('default_')) {
                      newId = field.id ? `default_${field.id}` : `default_${Date.now()}`;
                    }
                    return { ...field, id: newId, name: newId };
                  }
                  return { ...field, name: field.id };
                });
              }
              return section;
            });
          }
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

  // --- BUILD INITIAL VALUES FOR THE FORM ---
  useEffect(() => {
    if (!formConfig || !serverActivityRecord) return;
    setInitialValues((prevValues) => {
      // Only build once if prevValues is empty
      if (Object.keys(prevValues).length > 0) return prevValues;

      let defaultFieldArray = [];
      if (serverActivityRecord.CustomFieldData) {
        try {
          defaultFieldArray = JSON.parse(serverActivityRecord.CustomFieldData);
        } catch (err) {
          console.error('Failed to parse CustomFieldData:', err);
        }
      }
      const newInitialValues = {};
      if (Array.isArray(formConfig.fields)) {
        formConfig.fields.forEach((section) => {
          if (Array.isArray(section.fields)) {
            section.fields.forEach((field) => {
              if (field.source === 'core' && field.dbcoloumName) {
                let value = serverActivityRecord[field.dbcoloumName];
                // If it's a select, force it to string
                if (field.type === 'select' && value !== undefined && value !== null) {
                  value = value.toString();
                }
                newInitialValues[field.name] = value ?? '';
              }
            });
          }
        });
      }
      // Map default fields
      defaultFieldArray.forEach((cf) => {
        const fieldInConfig = formConfig.fields
          .flatMap((section) => section.fields)
          .find((field) => field.id === cf.fieldId);
        if (fieldInConfig) {
          newInitialValues[fieldInConfig.name] = cf.value ?? '';
        }
      });
      return newInitialValues;
    });
  }, [formConfig, serverActivityRecord]);

  // --- SUBMIT HANDLER ---
  const handleFormSubmit = async (values) => {
    console.log('Formik submitted values:', values);
    try {
      if (!formConfig || !Array.isArray(formConfig.fields)) {
        console.error('Invalid formConfig.fields');
        return;
      }
      const updatedCoreProps = {};
      const defaultFields = [];

      // Build the updated props from form values
      formConfig.fields.forEach((section) => {
        if (Array.isArray(section.fields)) {
          section.fields.forEach((field) => {
            if (field.source === 'core' && field.dbcoloumName) {
              updatedCoreProps[field.dbcoloumName] = values[field.name] || '';
            } else if (field.source === 'default') {
              defaultFields.push({
                fieldId: field.id,
                value: values[field.name] || '',
              });
            }
          });
        }
      });

      const updatedRecord = {
        ActivityId: serverActivityRecord.ActivityId,
        ...updatedCoreProps,
        CustomFieldData: defaultFields,
      };

      const payload = {
        operationType: 'Update',
        companyId,
        customObjectTypeId: objecttypeid,
        activityId: serverActivityRecord.ActivityId,
        activityData: JSON.stringify(updatedRecord),
      };

      console.log('Submitting payload:', payload);
      const response = await axios.post(`${API_URL}/CustomObject/ManageActivity`, payload);
      console.log('Saved result:', response);

      // ---------- NEW: Show toast & navigate back ----------
      toast.success('Data saved to the API!', { autoClose: 1500 }); // 1.5s for example
      navigate(-1); // navigate back to previous page
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error('Failed to save data.');
    }
  };

  return (
    <div>
      <PageNavbar />
      <div className="container-fixed">
        <Toolbar>
          <ToolbarHeading>
            <h1 className="text-xl font-medium leading-none text-gray-900">{name}</h1>
          </ToolbarHeading>
        </Toolbar>

        <div className="mt-4">
          {formConfig ? (
            <LoadObjectForm
              formConfig={formConfig}
              initialValues={initialValues}
              onSubmit={handleFormSubmit}
            />
          ) : (
            <p>Loading form configuration...</p>
          )}
        </div>

        <pre>ServerActivityRecord: {JSON.stringify(serverActivityRecord, null, 2)}</pre>
        <pre>FormConfig: {JSON.stringify(formConfig, null, 2)}</pre>
        <pre>InitialValues: {JSON.stringify(initialValues, null, 2)}</pre>
      </div>
    </div>
  );
};

export default EditActivity;
