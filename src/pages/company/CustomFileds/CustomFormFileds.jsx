import { useState, useEffect } from "react";
import axios from "axios";
import CustomFieldBuilder from "./block/CustomFieldBuilder";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const CustomFormFields = () => {
  const { filedid, responseid } = useParams();
  const { companyId } = useSelector((state) => state.AuthReducerKey);

  // Static form data (core fields override name, phoneNumber, email).
  const [staticFormData, setStaticFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    action: "insert",
  });

  // State for custom fields fetched from the API.
  const [customFields, setCustomFields] = useState([]);
  // Dynamic custom field values.
  const [customFieldValues, setCustomFieldValues] = useState({});
  // Validation errors.
  const [errors, setErrors] = useState({});
  // Loading state.
  const [isLoading, setIsLoading] = useState(true);

  // Fetch custom fields from API when the component mounts.
  useEffect(() => {
    const fetchCustomFields = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/CustomForm/GetCustomFormFieldById/${filedid}/-1`
        );
        if (
          !response.data ||
          response.data.length === 0 ||
          !response.data[0].otherJSON
        ) {
          throw new Error("Invalid response format or empty data.");
        }
        let fields;
        try {
          debugger
          fields = JSON.parse(response.data[0].otherJSON);
        } catch (parseError) {
          console.error("Error parsing JSON:", parseError);
          toast.error("Error processing form fields.");
          return;
        }
        if (!Array.isArray(fields.fields)) {
          console.error("Expected an array but got:", fields);
          toast.error("Invalid form field data received.");
          return;
        }
        setCustomFields(fields.fields);
        // Initialize customFieldValues for each field.
        const initialValues = {};
        fields.forEach((field) => {
          initialValues[field.id] = "";
        });
        setCustomFieldValues(initialValues);
        toast.success("Custom fields loaded successfully!");
      } catch (error) {
        console.error("Error fetching custom fields:", error);
        toast.error("Failed to fetch form fields.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomFields();
  }, [filedid, companyId]);

  // If there is a responseid, fetch the previously submitted response data.
  useEffect(() => {
    if (responseid) {
      const fetchResponseData = async () => {
        try {
          const res = await axios.get(
            `${API_URL}/CustomForm/GetCustomFieldDemo/${responseid}`
          );
          if (res.data && res.data.length > 0) {
            const data = res.data[0];

            // Populate static form data.
            setStaticFormData((prev) => ({
              ...prev,
              name: data.name || "",
              phoneNumber: data.phoneNumber || "",
              email: data.email || "",
              action: data.action || "update",
            }));

            // Parse saved custom field data.
            let parsedCustomFields = {};
            try {
              parsedCustomFields = JSON.parse(data.customFieldData);
            } catch (parseError) {
              console.error("Error parsing customFieldData:", parseError);
              toast.error("Error processing saved custom field data.");
            }
            setCustomFieldValues(parsedCustomFields);
            toast.success("Response data loaded successfully!");
          } else {
            toast.error("No response data found for the provided ID.");
          }
        } catch (error) {
          console.error("Error fetching response data:", error);
          toast.error("Failed to fetch response data.");
        }
      };

      fetchResponseData();
    }
  }, [responseid]);

  // Validate required custom fields.
  const validateCustomFields = () => {
    if (!Array.isArray(customFields)) {
      console.error("customFields is not an array:", customFields);
      toast.error("Form fields are not loaded correctly.");
      return false;
    }

    const validationErrors = {};
    customFields.forEach((field) => {
      if (field.required) {
        const value = (customFieldValues[field.id] || "").trim();
        if (value === "") {
          validationErrors[field.id] = `${field.label} is required.`;
        } else {
          validationErrors[field.id] = "";
        }
      }
    });

    setErrors(validationErrors);
    return !Object.values(validationErrors).some((errMsg) => errMsg !== "");
  };

  // Check for any validation errors.
  const hasErrors = () =>
    Object.values(errors).some(
      (errorMsg) => errorMsg && errorMsg.trim() !== ""
    );

  // Handle form submission.
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateCustomFields();
    if (!isValid || hasErrors()) {
      toast.error("Please fix the custom field errors before submitting.");
      return;
    }

    // Core field IDs.
    const nameFieldId = "core_1741090808850";
    const phoneNumberFieldId = "core_1741004537983"; 
    const emailFieldId = "core_1741004523898";

    // Build the customFieldData array by filtering out fields that are not saved in a column
    // and excluding those with source "core".
    const customFieldDataArray = customFields.flatMap(section => {
      // 'section.fields' is the array of subfields in each top-level item
      return section.fields
        .filter(field => field.saveInColumn === false)
        .map(field => ({
          id: field.id,
          label: field.label,
          value: customFieldValues[field.id] || "",
        }));
    });
debugger
    // Construct the final submission object.

    const finalSubmission = {
      id: responseid ? responseid : 0,
      name: customFieldValues[nameFieldId] || "",
      phoneNumber: customFieldValues[phoneNumberFieldId] || "",
      email: customFieldValues[emailFieldId] || "",
      customFieldData: JSON.stringify(customFieldDataArray),
      action: staticFormData.action,
    };

    console.log("Final Submission Data:", finalSubmission);
    submitData(finalSubmission);
  };

  // API call to submit the data.
  const submitData = async (data) => {
    try {
      const response = await axios.post(
        `${API_URL}/CustomForm/CreateCustomFormDemo`,
        data,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Form submitted successfully!");
        resetForm();
      } else {
        toast.error(response.data.message || "Submission failed.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(
        error.response?.data?.message || "Error submitting the form."
      );
    }
  };

  // Reset the form after successful submission.
  const resetForm = () => {
    setCustomFieldValues(
      customFields.reduce((acc, field) => {
        acc[field.id] = "";
        return acc;
      }, {})
    );
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
            <h2 className="text-2xl text-white font-bold">Demo Activity Form</h2>
            <p className="mt-1 text-blue-200">
              Please fill out the form below to submit your information.
            </p>
          </div>
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            {isLoading ? (
              <div className="text-center py-4">
                <span className="text-blue-500">Loading form fields...</span>
              </div>
            ) : (
              <CustomFieldBuilder
                formId={27}
                customFields={customFields}
                customFieldValues={customFieldValues}
                setCustomFieldValues={setCustomFieldValues}
                errors={errors}
                setErrors={setErrors}
              />
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md mt-4 transition duration-150"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomFormFields;
