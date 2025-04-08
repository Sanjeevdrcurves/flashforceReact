import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toAbsoluteUrl } from "@/utils";
import { KeenIcon } from "@/components";
import axios from "axios";
import { useDispatch } from "react-redux";
import { Authhandler } from "../../../redux/actions";
import { fetchMenu } from "../../../config/menu.config"; // Import the fetchMenu function

const UserTwoFactorAuth = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract email and userId from state or provide defaults
  const email = location.state?.email || "example@example.com";
  const userId = location.state?.userid || 1;


  const [codeInputs, setCodeInputs] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const intervalRef = useRef(null);
const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
const dispatch=useDispatch();


  // Timer countdown logic
  useEffect(() => {
    if (timer > 0) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [timer]);

  const handleResendOtp = async () => {
    try {
      console.log("Resending OTP...");
      
      

      // API call to resend OTP
      // const response = await axios.post(`${API_URL}/Company/ResendVerifyCode`, {
      //   userId
      // });

      const response = await axios.post(
        `${API_URL}/Company/ResendVerifyCode`,
        null,
        {
          params: {
            userId: userId
          },
        }
      );


      if (response.status === 200) {setCanResend(false);
        setTimer(60);
        console.log("OTP Resent Successfully");
      } else {
        alert(response.data.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      alert("An error occurred while resending OTP.");
    }
  };

  const handleInputChange = (index, value) => {
    if (value.length > 1) return;
    const updatedInputs = [...codeInputs];
    updatedInputs[index] = value;
    setCodeInputs(updatedInputs);

    // Move to the next input
    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !codeInputs[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  const verifyUser = async (event) => {
    event.preventDefault();
    const code = codeInputs.join(""); // Combine OTP inputs into a single code
    if (code.length !== 6) {
      alert("Please enter a valid 6-digit code.");
      return;
    }

    setIsLoading(true);

    try {
     
         const res = await axios.post(
                `${API_URL}/Company/VerifyCode`,
                null,
                {
                  params: {
                    userId: userId,
                    code: code,
                  
                  },
                }
              );
      debugger
      if (res.data.message== "Code is valid" ) {
        let tkn= localStorage.getItem("token");
        res.data.token=tkn;
        dispatch(Authhandler(res.data));
                       // Fetch the menu dynamically after login
                       await fetchMenu(); localStorage.removeItem("token");
                       navigate('/', { replace: true }); 
                      }
                        else {
        alert(res.data.message || "Verification failed");
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      alert(error.response?.data?.message || "An error occurred while verifying the code.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatEmail = (email) => {
    const [localPart, domain] = email.split("@");
    const visiblePart = localPart.slice(0, 2);
    return `${visiblePart}***@${domain}`;
  };

  return (
    <div className="card max-w-[380px] w-full">
      <form className="card-body flex flex-col gap-5 p-10" onSubmit={verifyUser}>
        <img src={toAbsoluteUrl("/media/illustrations/34.svg")} className="dark:hidden h-20 mb-2" alt="" />
        <img src={toAbsoluteUrl("/media/illustrations/34-dark.svg")} className="light:hidden h-20 mb-2" alt="" />

        <div className="text-center mb-2">
          <h3 className="text-lg font-medium text-gray-900 mb-5">Verify your email</h3>
          <div className="flex flex-col">
            <span className="text-2sm text-gray-700 mb-1.5">Enter the verification code we sent to</span>
            <a href="#" className="text-sm font-medium text-gray-900">
              {formatEmail(email)}
            </a>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2.5">
          {codeInputs.map((value, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              maxLength={1}
              className="input focus:border-primary-clarity focus:ring focus:ring-primary-clarity size-10 shrink-0 px-0 text-center"
              value={value}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
            />
          ))}
        </div>

        <div className="flex items-center justify-center mb-2">
          <span className="text-xs text-gray-700 me-1.5">
            {canResend ? (
              <span className="text-primary cursor-pointer" onClick={handleResendOtp}>
                Resend
              </span>
            ) : (
              `Didn’t receive a code? (${timer}s)`
            )}
          </span>
        </div>

        <button className="btn btn-primary flex justify-center grow" disabled={isLoading}>
          {isLoading ? "Verifying..." : "Continue"}
        </button>

        {/* <Link to="/auth/login" className="flex items-center justify-center text-sm gap-2 text-gray-700 hover:text-primary">
          <KeenIcon icon="black-left" />
          Back to Login
        </Link> */}
      </form>
    </div>
  );
};

export { UserTwoFactorAuth };
