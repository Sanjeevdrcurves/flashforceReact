import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Alert, KeenIcon } from '@/components';
import { useState } from 'react';
import clsx from 'clsx';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const passwordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your new password'),
});

const SetNewPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState(undefined);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordConfirmation, setShowNewPasswordConfirmation] = useState(false);
  const [searchParams] = useSearchParams();
  const { token } = useParams(); // Get token from URL

  if (!token) {
    return <Alert variant="danger">Invalid or missing token.</Alert>;
  }

  const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: passwordSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      setHasErrors(undefined);
      try {
        const response = await axios.post(`${API_URL}/auth/SetNewPassword`, null, {
          params: { token, newPassword: values.newPassword },
        });
        const resMessage = response.data.message;
        if (resMessage === 'Password updated successfully') {
          toast.success('Password updated successfully!');
          // Uncomment below to navigate after success if desired.
           navigate('/PasswordResetSuccess');
        } else {
          toast.error(resMessage);
        }
      } catch (error) {
        setHasErrors(true);
        setStatus(error.response?.data?.message || 'Password update failed. Please try again.');
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  return (
    <div style={{ width: '100%' }} className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-200">
      <div className="max-w-md w-full text-center p-6 shadow-2xl rounded-2xl bg-white">
        <form className="flex flex-col gap-5 p-10" onSubmit={formik.handleSubmit} noValidate>
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900">Set New Password</h3>
            <span className="text-sm text-gray-700">Choose a strong password</span>
          </div>

          {hasErrors && <Alert variant="danger">{formik.status}</Alert>}

          <div className="flex flex-col gap-1">
            <label className="form-label text-gray-900">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Enter a new password"
                autoComplete="off"
                {...formik.getFieldProps('newPassword')}
                className={clsx('w-full px-4 py-2 border rounded bg-transparent', {
                  'border-red-500': formik.touched.newPassword && formik.errors.newPassword,
                  'border-green-500': formik.touched.newPassword && !formik.errors.newPassword,
                })}
              />
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={(e) => {
                  e.preventDefault();
                  setShowNewPassword(!showNewPassword);
                }}
              >
                <KeenIcon icon={showNewPassword ? 'eye-slash' : 'eye'} />
              </button>
            </div>
            {formik.touched.newPassword && formik.errors.newPassword && (
              <span role="alert" className="text-red-500 text-xs mt-1">
                {formik.errors.newPassword}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="form-label text-gray-900">Confirm New Password</label>
            <div className="relative">
              <input
                type={showNewPasswordConfirmation ? 'text' : 'password'}
                placeholder="Re-enter new password"
                autoComplete="off"
                {...formik.getFieldProps('confirmPassword')}
                className={clsx('w-full px-4 py-2 border rounded bg-transparent', {
                  'border-red-500': formik.touched.confirmPassword && formik.errors.confirmPassword,
                  'border-green-500': formik.touched.confirmPassword && !formik.errors.confirmPassword,
                })}
              />
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={(e) => {
                  e.preventDefault();
                  setShowNewPasswordConfirmation(!showNewPasswordConfirmation);
                }}
              >
                <KeenIcon icon={showNewPasswordConfirmation ? 'eye-slash' : 'eye'} />
              </button>
            </div>
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <span role="alert" className="text-red-500 text-xs mt-1">
                {formik.errors.confirmPassword}
              </span>
            )}
          </div>

          <button type="submit" className="btn btn-primary flex justify-center items-center" disabled={loading}>
            {loading ? 'Please wait...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export { SetNewPassword };
