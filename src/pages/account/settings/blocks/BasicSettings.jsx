import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { KeenIcon } from "@/components";
import { toAbsoluteUrl } from "@/utils/Assets";
import axios from 'axios';
import { toast } from 'sonner';


const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
const MAIN_URL = import.meta.env.VITE_FLASHFORCE_URL;

const BasicSettings = ({ title }) => {
  const dispatch = useDispatch();
  const { userId, email, referralCode, fullName,user2FA } = useSelector((state) => state.AuthReducerKey);
debugger;
  // State to manage the referral link and its code
  const [referralCodeState, setReferralCode] = useState(referralCode || ""); // Default to empty string if null
  const [referralLink, setReferralLink] = useState(
    referralCode ? `${MAIN_URL}/Referral/${referralCode}` : ""
  );

  // 2FA State
  const [is2FAEnabled, setIs2FAEnabled] = useState(user2FA); // Enable/Disable Toggle
// Toggle 2FA Enable/Disable
const handleToggle2FA = () => {
  setIs2FAEnabled((prev) => !prev);
};

  const generateReferralCode = () => {
    // Generate a random 6-character alphanumeric code
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setReferralCode(newCode);
    setReferralLink(`${MAIN_URL}/Referral/${newCode}`);
  };

  const handleSaveChanges = async () => {
    debugger;
    if (!userId ||  !fullName) {
      toast.error("All fields (User ID, Referral Code, and Modified By) must be provided.");
      return;
    }
    if (!referralCodeState) {
      toast.error("Please Generate Referral Link.");
      return;
    }
  
    try {
      const response = await axios.post(
        `${API_URL}/User/UpdateReferralCode`,
        {}, // Send an empty body if the API doesn't expect a request body
        {
          params: {
            userId, // Ensure this is a valid integer
            referralCode: referralCodeState, // Ensure this is a valid string
            modifiedBy:userId, // Ensure this is a valid string
            is2FAEnabled 
          },
        }
      );
      if (response.status === 200) {
        // Update the Redux state on successful API call
      dispatch({
        type: 'UPDATE_REFERRAL_CODE',
        payload: {
          referralCode: referralCodeState,
          user2FA:is2FAEnabled
        },
      });
        toast.success("Referral code updated successfully!");
      } else {
        toast.error(`Unexpected response: ${response.statusText}`);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("Bad Request: Please check the provided data.");
      } else {
        toast.error("Failed to update referral code. Please try again.");
      }
      console.error("Error updating referral code:", error);
    }
  };
  

  const handleCopyToClipboard = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink).then(() => {
        toast.success("Referral link copied to clipboard!");
      }).catch((error) => {
        console.error("Error copying to clipboard:", error);
        toast.error("Failed to copy referral link.");
      });
    }
  };

  return (
    <div className="card min-w-full">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
        <div className="flex items-center gap-2">
          <label className="switch switch-sm">
            <span className="switch-label">Public Profile</span>
            <input type="checkbox" value="1" name="check" defaultChecked readOnly />
          </label>
        </div>
      </div>
      <div className="card-table scrollable-x-auto pb-4">
        <table className="table align-middle text-sm text-gray-500">
          <tbody>
            <tr>
              <td className="py-2 min-w-36 text-gray-600 font-normal">Email</td>
              <td className="py-2 min-w-60">
                <a href="#" className="text-gray-800 font-normal text-sm hover:text-primary-active">
                  {email}
                </a>
              </td>
              <td className="py-2 max-w-16 text-end">
                <a href="#" className="btn btn-sm btn-icon btn-clear btn-primary">
                  <KeenIcon icon="notepad-edit" />
                </a>
              </td>
            </tr>
            <tr>
              <td className="py-2 text-gray-600 font-normal">Password</td>
              <td className="py-2 text-gray-700 font-normal">Changed 2 months ago</td>
              <td className="py-2 text-end">
                <a href="#" className="btn btn-sm btn-icon btn-clear btn-primary">
                  <KeenIcon icon="notepad-edit" />
                </a>
              </td>
            </tr>
            <tr>
              <td className="py-3.5 text-gray-600 font-normal">2FA</td>
              <td className="py-3.5 text-gray-700 font-normal">
                {is2FAEnabled ? "Enabled" : "Disabled"}
              </td>
              <td className="py-3 text-end">
                <button className="btn btn-link btn-sm" onClick={handleToggle2FA}>
                  {is2FAEnabled ? "Disable" : "Enable"}
                </button>
              </td>
            </tr>
            <tr>
              <td className="py-2 text-gray-600 font-normal">Sign-in with</td>
              <td className="py-0.5">
                <div className="flex items-center gap-2.5">
                  <a href="#" className="flex items-center justify-center size-8 bg-light rounded-full border border-gray-300">
                    <img src={toAbsoluteUrl("/media/brand-logos/google.svg")} className="size-4" alt="" />
                  </a>
                  <a href="#" className="flex items-center justify-center size-8 bg-light rounded-full border border-gray-300">
                    <img src={toAbsoluteUrl("/media/brand-logos/facebook.svg")} className="size-4" alt="" />
                  </a>
                  <a href="#" className="flex items-center justify-center size-8 bg-light rounded-full border border-gray-300">
                    <img src={toAbsoluteUrl("/media/brand-logos/apple-black.svg")} className="dark:hidden h-4" alt="product logo" />
                    <img src={toAbsoluteUrl("/media/brand-logos/apple-white.svg")} className="light:hidden h-4" alt="product logo" />
                  </a>
                </div>
              </td>
              <td className="py-2 text-end">
                <a href="#" className="btn btn-sm btn-icon btn-clear btn-primary">
                  <KeenIcon icon="notepad-edit" />
                </a>
              </td>
            </tr>
            <tr>
              <td className="py-3 text-gray-600 text-sm font-normal">Referral Link</td>
              <td className="py-3 text-gray-700 text-2sm font-normal">
                {referralCodeState ? (
                  <div className="flex items-center gap-0.5">
                    <a href={referralLink} className="text-gray-800 text-sm hover:text-primary-active">
                      {referralLink}
                    </a>
                    <button
                      className="btn btn-xs btn-light btn-clear btn-icon"
                      onClick={handleCopyToClipboard}
                    >
                      <KeenIcon icon="copy" className="text-gray-500 text-sm" />
                    </button>
                  </div>
                ) : (
                  <span className="text-gray-500">No referral code available. Generate one below.</span>
                )}
              </td>
              <td className="py-3 text-end">
                <button className="btn btn-link btn-sm" onClick={generateReferralCode}>
                  {referralCodeState ? "Re-create" : "Generate"}
                </button>
              </td>
            </tr>
            <tr>
              <td colSpan="3">
                <div className="flex justify-end">
                  <button className="btn btn-primary" onClick={handleSaveChanges}>
                    Save Changes
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { BasicSettings };
