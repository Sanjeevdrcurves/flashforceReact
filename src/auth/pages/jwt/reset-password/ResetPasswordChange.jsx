import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Alert, KeenIcon } from '@/components';
import { useAuthContext } from '@/auth';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLayout } from '@/providers';
import axios from 'axios';
const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
const passwordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your new password'),
});

const ResetPasswordChange = () => {
  const { currentLayout } = useLayout();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState(undefined);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordConfirmation, setShowNewPasswordConfirmation] = useState(false);
  const [searchParams] = useSearchParams();
  
  const email = searchParams.get('email') || '';
  

  useEffect(() => {
    if (!email ) {
      setHasErrors(true);
    }
  }, [email]);

  const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: passwordSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      debugger;
      setLoading(true);
      setHasErrors(undefined);

      if (!email) {
        setHasErrors(true);
        setStatus('Email is required.');
        setLoading(false);
        setSubmitting(false);
        return;
      }

      try {
        const response = await axios.post(
          `${API_URL}/auth/ChangeUserPassword?email=${encodeURIComponent(email)}&newPassword=${encodeURIComponent(values.newPassword)}`
        );
debugger;
       
          setHasErrors(false);
          navigate(
            currentLayout?.name === 'auth-branded'
              ? '/auth/reset-password/changed'
              : '/auth/classic/reset-password/changed'
          );
       
      } catch (error) {
        setHasErrors(true);
        setStatus(error.response?.data?.message || 'Password reset failed. Please try again.');
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="card max-w-[370px] w-full">
      <form className="card-body flex flex-col gap-5 p-10" onSubmit={formik.handleSubmit} noValidate>
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Reset Password</h3>
          <span className="text-2sm text-gray-700">Enter your new password</span>
        </div>

        {hasErrors && <Alert variant="danger">{formik.status}</Alert>}

        <div className="flex flex-col gap-1">
          <label className="form-label text-gray-900">New Password</label>
          <label className="input">
            <input
              type={showNewPassword ? 'text' : 'password'}
              placeholder="Enter a new password"
              autoComplete="off"
              {...formik.getFieldProps('newPassword')}
              className={clsx('form-control bg-transparent', {
                'is-invalid': formik.touched.newPassword && formik.errors.newPassword,
                'is-valid': formik.touched.newPassword && !formik.errors.newPassword,
              })}
            />
            <button
              className="btn btn-icon"
              onClick={(e) => {
                e.preventDefault();
                setShowNewPassword(!showNewPassword);
              }}
            >
              <KeenIcon icon={showNewPassword ? "eye-slash" : "eye"} className="text-gray-500" />
            </button>
          </label>
          {formik.touched.newPassword && formik.errors.newPassword && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.newPassword}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="form-label font-normal text-gray-900">Confirm New Password</label>
          <label className="input">
            <input
              type={showNewPasswordConfirmation ? 'text' : 'password'}
              placeholder="Re-enter new Password"
              autoComplete="off"
              {...formik.getFieldProps('confirmPassword')}
              className={clsx('form-control bg-transparent', {
                'is-invalid': formik.touched.confirmPassword && formik.errors.confirmPassword,
                'is-valid': formik.touched.confirmPassword && !formik.errors.confirmPassword,
              })}
            />
            <button
              className="btn btn-icon"
              onClick={(e) => {
                e.preventDefault();
                setShowNewPasswordConfirmation(!showNewPasswordConfirmation);
              }}
            >
              <KeenIcon icon={showNewPasswordConfirmation ? "eye-slash" : "eye"} className="text-gray-500" />
            </button>
          </label>
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.confirmPassword}
            </span>
          )}
        </div>

        <button type="submit" className="btn btn-primary flex justify-center grow" disabled={loading}>
          {loading ? 'Please wait...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export { ResetPasswordChange };
