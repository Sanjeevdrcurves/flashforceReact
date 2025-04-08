import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import axios from 'axios';

const GoogleProviderLoginCallback = () => {
  const { userId, companyId } = useSelector(state => state.AuthReducerKey);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");

  // Use ref to prevent double execution
  const hasExecuted = useRef(false);

  useEffect(() => {
    if (code && !hasExecuted.current) {
      hasExecuted.current = true; // Mark as executed
      exchangeCodeForToken(code);
    }
  }, [code]);

  const exchangeCodeForToken = async (code) => {
    try {
      await axios.post(`${import.meta.env.VITE_FLASHFORCE_API_URL}/email/exchange-google-token`, { code, userId });
      navigate("/email/googleuseremail", { replace: true });
    } catch (error) {
      navigate("/", { replace: true });
    }
  };

  return <div>Processing Google Authentication...</div>;
};

export default GoogleProviderLoginCallback;
