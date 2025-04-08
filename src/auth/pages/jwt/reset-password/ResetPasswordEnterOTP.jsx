import clsx from 'clsx';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useLayout } from '@/providers';
import { Alert, KeenIcon } from '@/components';

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
console.log("API_URL:", API_URL); // Debugging: Check if API URL is set

const formatEmail = (email) => {
  if (!email.includes("@")) return email;
  const [localPart, domain] = email.split("@");
  return `${localPart.slice(0, 2)}***@${domain}`;
};

const ResetPasswordEnterOTP = () => {
  const [loading, setLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState('');
  const [codeInputs, setCodeInputs] = useState(['', '', '', '', '', '']);
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const { currentLayout } = useLayout();
  const navigate = useNavigate();

  const handleInputChange = (index, value) => {
    if (/^[0-9]$/.test(value)) { // Only allow numbers
      const newCodeInputs = [...codeInputs];
      newCodeInputs[index] = value;
      setCodeInputs(newCodeInputs);
  
      // Move to next input field if not the last input
      if (index < codeInputs.length - 1) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };
  
  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace') {
      const newCodeInputs = [...codeInputs];
  
      if (newCodeInputs[index]) {
        newCodeInputs[index] = ''; // Clear the current input
      } else if (index > 0) {
        newCodeInputs[index - 1] = ''; // Clear previous input
        document.getElementById(`otp-${index - 1}`).focus(); // Move cursor back
      }
  
      setCodeInputs(newCodeInputs);
    }
  };
  
  // Handle paste event
  const handlePaste = (event) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData('text').trim(); // Get pasted text
    if (/^\d{6}$/.test(pastedData)) { // Ensure exactly 6 digits
      setCodeInputs(pastedData.split('')); // Distribute digits across inputs
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setHasErrors('');

    const otpCode = codeInputs.join('');
    console.log("Submitting OTP:", otpCode); // Debugging

    try {
      const response = await axios.post(`${API_URL}/Company/ForgotPasswordVerifyOTP?email=${email}&code=${otpCode}`);
      console.log("API Response:", response.data); // Debugging

      if (response.data.message === "OTP Verified") {
        setHasErrors('');
        navigate(`/auth/reset-password/change?email=${email}`);
      } else {
        setHasErrors('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error("API Error:", error); // Debugging
      setHasErrors('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card max-w-[370px] w-full">
      <form className="card-body flex flex-col gap-5 p-10" noValidate onSubmit={handleSubmit}>
        <div className="text-center mb-2">
          <h3 className="text-lg font-medium text-gray-900 mb-5">Verify your email</h3>
          <div className="flex flex-col">
            <span className="text-2sm text-gray-700 mb-1.5">Enter the verification code we sent to</span>
            <a href="#" className="text-sm font-medium text-gray-900">{formatEmail(email)}</a>
          </div>
        </div>

        {hasErrors && <div className="text-red-500 text-sm">{hasErrors}</div>} {/* Debugging: Replaced Alert */}

        <div className="flex flex-wrap justify-center gap-2">
        {codeInputs.map((value, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              className="input focus:border-primary-clarity focus:ring focus:ring-primary-clarity size-10 shrink-0 px-0 text-center"
              value={value}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste} // Allow pasting full OTP
            />
          ))}

        </div>

        <div className="flex flex-col gap-5 items-stretch">
          <button type="submit" className="btn btn-primary flex justify-center grow" disabled={loading}>
            {loading ? 'Verifying...' : 'Continue'}
          </button>
          <Link
            to={currentLayout?.name === 'auth-branded' ? '/auth/login' : '/auth/classic/login'}
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

export { ResetPasswordEnterOTP };
