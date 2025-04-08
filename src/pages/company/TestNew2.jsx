import { Alert, KeenIcon, Menu, MenuItem, MenuToggle } from '@/components';
import { useLanguage } from '@/i18n';
import { DropdownCard1 } from '@/partials/dropdowns/general';
import clsx from 'clsx';
import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import axios from 'axios';
const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
const companyId = 1; // Replace with the dynamic company ID

const companySchema = Yup.object().shape({
  address: Yup.string().nullable(),
  city: Yup.string().nullable(),
  zipCode: Yup.string().required('Zip code is required'),
  state: Yup.string().required('State is required'),
  country: Yup.string().nullable(),
  timeZone: Yup.string().required('Timezone is required'),
});

const CompanyAddress = (props) => {
  const [initialValues, setInitialValues] = useState({
    // address: '1234 Main St',
    // city: 'San Francisco',
    // zipCode: '94111',
    // state: 'CA',
    // country: 'USA',
    // timeZone: 'PST',  
      ...(props.settings ?? {}),
  });
  const [loading, setLoading] = useState(false);
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);
  const {
    isRTL
  } = useLanguage();

  const handleSave = async (values, props) => {
    // props.setSubmitting(true);
       console.log('Company Data:', values);

const queryParams = new URLSearchParams({
  ...props.settings,
  ...values
});
    const response = await axios.put(`${API_URL}/Company/update-address?${queryParams.toString()}`);
    console.log('put response', response.data);

    /**
     * props.setStatus('The login details are incorrect');
     */

    props.setSubmitting(false);
  };

  const formik = useFormik({
    initialValues,
    validationSchema: companySchema,
    onSubmit: handleSave,
  });

  console.log('errors', formik.errors);

  return (
    <div className="card min-w-full">
      <form onSubmit={(e) => {
        e.preventDefault();
        setIsSubmitClicked(true);
        formik.handleSubmit();
      }} noValidate>
        <div className="card-header">
          <h3 className="card-title">Company Data</h3>
          {formik.status && <Alert variant="danger">{formik.status}</Alert>}

          <Menu className="items-stretch">
            <MenuItem toggle="dropdown" trigger="click" dropdownProps={{
            placement: isRTL() ? 'bottom-start' : 'bottom-end',
            modifiers: [{
              name: 'offset',
              options: {
                offset: [0, 10] // [skid, distance]
              }
            }]
          }}>
            <MenuToggle className="btn btn-sm btn-icon btn-light btn-clear">
              <KeenIcon icon="dots-vertical" />
            </MenuToggle>
            {DropdownCard1()}
            </MenuItem>
          </Menu>
        </div>

        <div className="card-body flex flex-col gap-5 lg:py-7.5">

          <div className="flex flex-col gap-1">
            <label className="form-label text-gray-900">Address</label>
            <label className="input">
              <input
                placeholder="Enter address"
                value={formik.values.address}
                autoComplete="off"
                {...formik?.getFieldProps('address')}
                className={clsx('form-control', {
                  'is-invalid':
                    formik?.errors.address &&
                    (formik.touched.address || isSubmitClicked),
                })}
              />
            </label>
            {formik?.errors.address &&
              (formik.touched.address || isSubmitClicked) && (
                <span role="alert" className="text-danger text-xs mt-1">
                  {formik?.errors.address}
                </span>
              )}
          </div>

          <div className='grid grid-cols-[2fr_1fr] gap-4'>
            <div className="flex flex-col gap-1">
              <label className="form-label text-gray-900">City</label>
              <label className="input">
                <input
                  placeholder="Enter city"
                  value={formik.values.city}
                  autoComplete="off"
                  {...formik?.getFieldProps('city')}
                  className={clsx('form-control', {
                    'is-invalid':
                      formik?.errors.city &&
                      (formik.touched.city || isSubmitClicked),
                  })}
                />
              </label>
              {formik?.errors.city &&
                (formik.touched.city || isSubmitClicked) && (
                  <span role="alert" className="text-danger text-xs mt-1">
                    {formik?.errors.city}
                  </span>
                )}
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="form-label text-gray-900">Zip Code</label>
              <label className="input">
                <input
                  placeholder="Enter zip code"
                  value={formik.values.zipCode}
                  autoComplete="off"
                  {...formik?.getFieldProps('zipCode')}
                  className={clsx('form-control', {
                    'is-invalid':
                      formik?.errors.zipCode &&
                      (formik.touched.zipCode || isSubmitClicked),
                  })}
                />
              </label>
              {formik?.errors.zipCode &&
                (formik.touched.zipCode || isSubmitClicked) && (
                  <span role="alert" className="text-danger text-xs mt-1">
                    {formik?.errors.zipCode}
                  </span>
                )}
            </div>
          </div>
          

          {/* <div className="flex flex-col gap-1">
            <label className="form-label text-gray-900">
              State / Prov / Region
            </label>
            <Select
              value={formik.values.state}
              onValueChange={(value) => formik.setFieldValue('state', value)}
              {...formik?.getFieldProps('state')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Enter state" />
              </SelectTrigger>
              <SelectContent>
                {[
                  { value: 'tech', label: 'Technology' },
                  { value: 'finance', label: 'Finance' },
                  { value: 'health', label: 'Health' },
                  { value: 'retail', label: 'Retail' },
                ].map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik?.errors.state &&
              (formik.touched.state || isSubmitClicked) && (
                <span role="alert" className="text-danger text-xs mt-1">
                  {formik?.errors.state}
                </span>
              )}
          </div> */}

          <div className="flex flex-col gap-1">
            <label className="form-label text-gray-900">State / Prov / Region</label>
            <label className="input">
              <input
                placeholder="Enter state / prov / region"
                value={formik.values.state}
                autoComplete="off"
                {...formik?.getFieldProps('state')}
                className={clsx('form-control', {
                  'is-invalid':
                    formik?.errors.state &&
                    (formik.touched.state || isSubmitClicked),
                })}
              />
            </label>
            {formik?.errors.state &&
              (formik.touched.state || isSubmitClicked) && (
                <span role="alert" className="text-danger text-xs mt-1">
                  {formik?.errors.state}
                </span>
              )}
          </div>
          
          <div className='grid grid-cols-[2fr_1fr] gap-4'>
            {/* <div className="flex flex-col gap-1">
              <label className="form-label text-gray-900">
                Country
              </label>
              <Select
                value={formik.values.country}
                onValueChange={(value) => formik.setFieldValue('country', value)}
                {...formik?.getFieldProps('country')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Enter country" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    { value: 'tech', label: 'Technology' },
                    { value: 'finance', label: 'Finance' },
                    { value: 'health', label: 'Health' },
                    { value: 'retail', label: 'Retail' },
                  ].map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik?.errors.country &&
                (formik.touched.country || isSubmitClicked) && (
                  <span role="alert" className="text-danger text-xs mt-1">
                    {formik?.errors.country}
                  </span>
                )}
            </div> */}
            
            <div className="flex flex-col gap-1">
              <label className="form-label text-gray-900">Country</label>
              <label className="input">
                <input
                  placeholder="Enter country"
                  value={formik.values.country}
                  autoComplete="off"
                  {...formik?.getFieldProps('country')}
                  className={clsx('form-control', {
                    'is-invalid':
                      formik?.errors.country &&
                      (formik.touched.country || isSubmitClicked),
                  })}
                />
              </label>
              {formik?.errors.country &&
                (formik.touched.country || isSubmitClicked) && (
                  <span role="alert" className="text-danger text-xs mt-1">
                    {formik?.errors.country}
                  </span>
                )}
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="form-label text-gray-900">Time Zone</label>
              <label className="input">
                <input
                  placeholder="Enter time zone"
                  value={formik.values.timeZone}
                  autoComplete="off"
                  {...formik?.getFieldProps('timezone')}
                  className={clsx('form-control', {
                    'is-invalid':
                      formik?.errors.timeZone &&
                      (formik.touched.timeZone || isSubmitClicked),
                  })}
                />
              </label>
              {formik?.errors.timeZone &&
                (formik.touched.timeZone || isSubmitClicked) && (
                  <span role="alert" className="text-danger text-xs mt-1">
                    {formik?.errors.timeZone}
                  </span>
                )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary flex justify-center"
              disabled={loading || formik.isSubmitting}
            >
              {loading ? 'Please wait...' : 'Update Address'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CompanyAddress;
