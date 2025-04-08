import clsx from 'clsx';
import { useFormik } from 'formik';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import axios from 'axios';
import { Alert, KeenIcon } from '@/components';
import { useLayout } from '@/providers';
const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
const initialValues = {
  email: ''
};

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email format')
    .min(3, 'Minimum 3 characters')
    .max(50, 'Maximum 50 characters')
    .required('Email is required')
});

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState(undefined);
  const { currentLayout } = useLayout();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues,
    validationSchema: ForgotPasswordSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      setHasErrors(undefined);

      try {
              const response = await axios.post(
                    `${API_URL}/Company/ForgotPasswordOTP`,
                    null, // No body is sent for query params
                    {
                        params: {
                            email: values.email
                        },
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                ); 
        // If API call is successful
        setHasErrors(false);
        setLoading(false);

        // Redirect to the OTP entry screen
        navigate({
          pathname: currentLayout?.name === 'auth-branded' 
            ? '/auth/reset-password/enter-otp' 
            : '/auth/classic/reset-password/enter-otp',
          search: `email=${encodeURIComponent(values.email)}`
        });

      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setStatus(error.response.data.message);
        } else {
          setStatus('Password reset request failed. Please try again.');
        }
        setHasErrors(true);
        setLoading(false);
        setSubmitting(false);
      }
    }
  });

  return (
    <div className="card max-w-[370px] w-full">
      <form 
        className="card-body flex flex-col gap-5 p-10" 
        noValidate 
        onSubmit={formik.handleSubmit}
      >
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">Your Email</h3>
          <span className="text-2sm text-gray-600 font-medium">
            Enter your email to receive an OTP for password reset
          </span>
        </div>

        {hasErrors && <Alert variant="danger">{formik.status}</Alert>}
        {hasErrors === false && <Alert variant="success">
          OTP sent successfully. Please check your email.
        </Alert>}

        <div className="flex flex-col gap-1">
          <label className="form-label text-gray-900">Email</label>
          <label className="input">
            <input
              type="email"
              placeholder="email@example.com"
              autoComplete="off"
              {...formik.getFieldProps('email')}
              className={clsx(
                'form-control bg-transparent',
                { 'is-invalid': formik.touched.email && formik.errors.email },
                { 'is-valid': formik.touched.email && !formik.errors.email }
              )}
            />
          </label>
          {formik.touched.email && formik.errors.email && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.email}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-5 items-stretch">
          <button
            type="submit"
            className="btn btn-primary flex justify-center grow"
            disabled={loading || formik.isSubmitting}
          >
            {loading ? 'Please wait...' : 'Continue'}
          </button>

          <Link
            to={currentLayout?.name === 'auth-branded' 
              ? '/auth/login' 
              : '/auth/classic/login'}
            className="flex items-center justify-center text-sm gap-2 text-gray-700 hover:text-primary"
          >
            <KeenIcon icon="black-left" />
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export { ResetPassword };
