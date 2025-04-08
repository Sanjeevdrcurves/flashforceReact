import { Alert } from '@/components';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CrudAvatarUpload } from '@/partials/crud';
import clsx from 'clsx';
import { useFormik } from 'formik';
import { useEffect, useState, useRef } from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import { sendNotification } from '@/utils/notificationapi';

import CustomFieldBuilder from '../../company/CustomFileds/block/CustomFieldBuilder';

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const companySchema = Yup.object().shape({
  companyName: Yup.string()
    .min(3, 'Minimum 1 characters')
    .max(50, 'Maximum 200 characters')
    .required('Company Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phoneNumber: Yup.string().required('Phone is required'),
  webSite: Yup.string().nullable(),
  // Add additional field validations if needed...
});

const CompanyData = (props) => {
  const [initialValues] = useState({
    // You can set default values here or use props.settings
    ...(props.settings ?? {}),
  });
  const [customFieldValues, setCustomFieldValues] = useState(
    props.settings?.customFieldData
      ? JSON.parse(props.settings.customFieldData)
      : {}
  );
  // State for managing custom fields errors
  const [errors, setErrors] = useState({});
  // Optional state if you need to pass customFields down (if your CustomFieldBuilder supports it)
  const [customFields, setCustomFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);

  // Create a ref to access custom field validation methods from CustomFieldBuilder
  const customFieldRef = useRef(null);

  // Update Formik status with custom field errors (if any)
  useEffect(() => {
    if (Object.values(errors).filter(Boolean).length > 0) {
      formik.setStatus(
        "Please fix the following custom field errors: " +
          Object.values(errors).filter(Boolean).join(", ")
      );
    } else {
      formik.setStatus("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors]);

  const handleSave = async (values, formikHelpers) => {
    // Validate all custom fields via ref before submission
    const customFieldErrors = customFieldRef.current.validateAllFields();
    if (Object.keys(customFieldErrors).length > 0) {
      formikHelpers.setStatus(
        "Please fix the following custom field errors: " +
          Object.values(customFieldErrors).join(", ")
      );
      formikHelpers.setSubmitting(false);
      return;
    }

    // Merge form values and custom field values into the payload
    const payload = {
      ...props.settings,
      ...values,
      customFieldData: JSON.stringify(customFieldValues),
    };

    setLoading(true);
    try {
      const response = await axios.put(
        `${API_URL}/Company/update-details`,
        payload
      );
      console.log('PUT response:', response.data);
      toast.success('Company details updated successfully!');
      // Optionally, do additional tasks (like updating state) here.
    } catch (error) {
      console.error('Error updating company details:', error);
      toast.error('Error updating company details');
    } finally {
      formikHelpers.setSubmitting(false);
      setLoading(false);
    }



// Send Notification
await sendNotification(
  String(userid),
   61, // Assuming 61 is the notification setting ID
   'Company profile details updated',
   'Company profile details updation Successful',
   '9',
 ''
 );
 


    props.setSubmitting(false);
  };

  const formik = useFormik({
    initialValues,
    validationSchema: companySchema,
    onSubmit: handleSave,
  });

  return (
    <div className="card min-w-full">
      <div className="card-header">
        <h3 className="card-title">Company Data</h3>
        {formik.status && <Alert variant="danger">{formik.status}</Alert>}
      </div>

      <div className="card-body flex flex-col gap-5 lg:py-7.5 border-b border-b-gray-200 dark:lg:border-b-gray-100">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <label className="form-label text-gray-900">Company Logo</label>
            <div className="flex justify-center items-center">
              <CrudAvatarUpload
                onChange={(avatar) => formik.setFieldValue('avatar', avatar)}
              />
            </div>
          </div>
          {formik.errors.avatar &&
            (formik.touched.avatar || isSubmitClicked) && (
              <span role="alert" className="text-danger text-xs mt-1">
                {formik.errors.avatar}
              </span>
            )}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setIsSubmitClicked(true);
          formik.handleSubmit();
        }}
        noValidate
      >
        <div className="card-body flex flex-col gap-5 lg:py-7.5">
          <div className="flex flex-col gap-1">
            <label className="form-label text-gray-900">Company Name</label>
            <label className="input">
              <input
                placeholder="Enter company name"
                value={formik.values.companyName}
                autoComplete="off"
                {...formik.getFieldProps('companyName')}
                className={clsx('form-control', {
                  'is-invalid':
                    formik.errors.companyName &&
                    (formik.touched.companyName || isSubmitClicked),
                })}
              />
            </label>
            {formik.errors.companyName &&
              (formik.touched.companyName || isSubmitClicked) && (
                <span role="alert" className="text-danger text-xs mt-1">
                  {formik.errors.companyName}
                </span>
              )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="form-label text-gray-900">Company Email</label>
            <label className="input">
              <input
                placeholder="Enter company email"
                value={formik.values.email}
                autoComplete="off"
                {...formik.getFieldProps('email')}
                className={clsx('form-control', {
                  'is-invalid':
                    formik.errors.email &&
                    (formik.touched.email || isSubmitClicked),
                })}
              />
            </label>
            {formik.errors.email &&
              (formik.touched.email || isSubmitClicked) && (
                <span role="alert" className="text-danger text-xs mt-1">
                  {formik.errors.email}
                </span>
              )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="form-label text-gray-900">Company Phone</label>
            <label className="input">
              <input
                placeholder="Enter company phone"
                value={formik.values.phoneNumber}
                autoComplete="off"
                {...formik.getFieldProps('phoneNumber')}
                className={clsx('form-control', {
                  'is-invalid':
                    formik.errors.phoneNumber &&
                    (formik.touched.phoneNumber || isSubmitClicked),
                })}
              />
            </label>
            {formik.errors.phoneNumber &&
              (formik.touched.phoneNumber || isSubmitClicked) && (
                <span role="alert" className="text-danger text-xs mt-1">
                  {formik.errors.phoneNumber}
                </span>
              )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="form-label text-gray-900">Company Website</label>
            <label className="input">
              <input
                placeholder="Enter company website"
                value={formik.values.webSite}
                autoComplete="off"
                {...formik.getFieldProps('webSite')}
                className={clsx('form-control', {
                  'is-invalid':
                    formik.errors.webSite &&
                    (formik.touched.webSite || isSubmitClicked),
                })}
              />
            </label>
            {formik.errors.webSite &&
              (formik.touched.webSite || isSubmitClicked) && (
                <span role="alert" className="text-danger text-xs mt-1">
                  {formik.errors.webSite}
                </span>
              )}
          </div>

          {/* Custom Field Builder Section */}
          <CustomFieldBuilder
            ref={customFieldRef}
            formId={17}
            isSubmitClicked={isSubmitClicked}
            customFieldValues={customFieldValues}
            setCustomFieldValues={(updatedValues) => {
              if (updatedValues) {
                setCustomFieldValues(updatedValues);
              }
            }}
            errors={errors}
            setErrors={setErrors}
          />
                  {/* Custom Field Builder Section */}
                  <CustomFieldBuilder
                      ref={customFieldRef}
                      formId={23}
                      isSubmitClicked={isSubmitClicked}
                      customFieldValues={customFieldValues}
                      setCustomFieldValues={(updatedValues) => {
                          if (updatedValues) {
                              setCustomFieldValues(updatedValues);
                          }
                      }}
                      errors={errors}
                      setErrors={setErrors}
                  />
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary flex justify-center"
              disabled={loading || formik.isSubmitting}
            >
              {loading ? 'Please wait...' : 'Update Company'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CompanyData;
