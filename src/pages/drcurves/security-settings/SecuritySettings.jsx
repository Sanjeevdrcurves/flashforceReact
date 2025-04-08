import React, { useEffect, useState } from "react";
import axios from "axios";
import { SessionUser } from "./SessionUser";
import { TrustedDevices } from "./TrustedDevices";
import { toast } from 'sonner';
import { sendNotification } from '@/utils/notificationapi';

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
 
import { useSelector } from 'react-redux';
const SecuritySettings = () => {


    const {userId, companyId} = useSelector(state => state.AuthReducerKey);


  const [formData, setFormData] = useState({
    companyId: companyId,
    minLength: 8,
    maxPasswordAge: "",
    passwordHistoryRestriction: "",
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: false,
    requireSpecialChars: true,
    notificationMessage: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    enableAuditLogging: true,
    createBy:  String(userId),
    enforceTwoStepVerification: false,
    enableTOTP: false,
    enableSMSOTP: false,
    enableEmailOTP: false,
    enableSecurityKeys: false,
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    (async () => {
      try {
        // Make both API calls concurrently
        const [authResponse, secondApiResponse] = await Promise.all([
          axios.get(`${API_URL}/AuthenticationSettings/GetAuthenticationSettingsByID/${companyId}`),
          axios.get(`${API_URL}/SecuritySetting/GetAllSecuritySetting/${companyId}`),
        ]);

        // Validate responses
        const authData = authResponse?.data ?? {};
        const secondApiData = Array.isArray(secondApiResponse?.data) && secondApiResponse?.data.length > 0
          ? secondApiResponse.data[0] // Use the first element if the response is an array
          : secondApiResponse?.data || {}; // Use as-is if it's an object

        // Combine data from both responses
        const combinedData = {
          ...formData, // Preserve the default structure
          ...authData, // Merge data from AuthenticationSettings
          ...secondApiData, // Merge data from SecuritySetting
        };

        console.log("Combined Data:", combinedData);

        // Update state
        setFormData(combinedData);
      } catch (error) {
        //console.error("Error fetching data from APIs:", error);
        toast.error('Error fetching data from APIs:'+error);
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAuthSettingChange = async (e) => {
    const { id, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: checked,
    }));

    const updatedData = {
      companyID: String(companyId), 
      [id]:checked
    
    };

    try {
      setLoading(true);
      const response = await axios.put(
        `${API_URL}/AuthenticationSettings/UpdateAuthenticationSettings`,
        updatedData
      );

      if (response.status === 200) {
        //setSuccessMessage("Authentication settings updated successfully!");
         toast.success('Authentication settings updated successfully!');

                  // Send Notification
        await sendNotification(
          userId,
          54, // Assuming 54 is the notification setting ID for the new plan updation
          'Encryption settings update notification',
          'Encryption settings updation Successful',
          '26',
          'Encryption'
        ); 
        setErrorMessage("");
      } else {
        throw new Error("Failed to update settings");
      }
    } catch (error) {
      //setErrorMessage("An error occurred while updating the settings.");
      toast.error('An error occurred while updating the settings.');
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await axios.post(
        `${API_URL}/SecuritySetting/InsertSecuritySetting`,
        formData
      );
      if (response.status === 200) {
       // setSuccessMessage("Settings updated successfully!");
        toast.success('Settings updated successfully!');

          // Send Notification
          await sendNotification(
            userId,
            54, // Assuming 54 is the notification setting ID for the new plan updation
            'Encryption settings update notification',
            'Encryption settings updation Successful',
            '26',
          'Encryption'
          ); 

      } else {
       // setErrorMessage("Failed to update settings. Please try again.");
        toast.error('Failed to update settings. Please try again.');
      }
    } catch (error) {
      //setErrorMessage("An error occurred: " + error.message);
      toast.error('An error occurred: '+ error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-md" id="SecuritySettings">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-800">
          Set Password Complexity & Multi-Factor Authentication (MFA)
        </h1>
        <p className="text-sm text-gray-500">
          Customize security settings for your account
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-md shadow-sm">
            <h2 className="text-lg font-medium text-gray-700 mb-4">
              Password Settings
            </h2>
            <div className="mb-4">
              <label htmlFor="minLength" className="block text-sm font-medium text-gray-600">
                Minimum Length
              </label>
              <input
                type="number"
                id="minLength"
                className="mt-2 w-full px-3 py-2 border rounded-md"
                value={formData.minLength}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="maxPasswordAge" className="block text-sm font-medium text-gray-600">
                Maximum Password Age (days)
              </label>
              <input
                type="number"
                id="maxPasswordAge"
                className="mt-2 w-full px-3 py-2 border rounded-md"
                value={formData.maxPasswordAge}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="passwordHistoryRestriction" className="block text-sm font-medium text-gray-600">
                Password History Restriction
              </label>
              <select
                id="passwordHistoryRestriction"
                className="mt-2 w-full px-3 py-2 border rounded-md"
                value={formData.passwordHistoryRestriction}
                onChange={handleChange}
              >
                <option value="">Select Restriction</option>
                <option value="norestriction">No Restriction</option>
                <option value="last5">Last 5 Passwords</option>
              </select>
            </div>
            <div className="mb-4">
  <label className="block text-sm font-medium text-gray-600">
    Password Requirements
  </label>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
    <label className="flex items-center space-x-2">
      <input
        type="checkbox"
        id="requireUppercase"
        checked={formData.requireUppercase}
        onChange={handleChange}
        className="w-4 h-4"
      />
      <span className="text-gray-800">Require Uppercase Letters</span>
    </label>
    <label className="flex items-center space-x-2">
      <input
        type="checkbox"
        id="requireLowercase"
        checked={formData.requireLowercase}
        onChange={handleChange}
        className="w-4 h-4"
      />
      <span className="text-gray-800">Require Lowercase Letters</span>
    </label>
    <label className="flex items-center space-x-2">
      <input
        type="checkbox"
        id="requireNumbers"
        checked={formData.requireNumbers}
        onChange={handleChange}
        className="w-4 h-4"
      />
      <span className="text-gray-800">Require Numbers</span>
    </label>
    <label className="flex items-center space-x-2">
      <input
        type="checkbox"
        id="requireSpecialChars"
        checked={formData.requireSpecialChars}
        onChange={handleChange}
        className="w-4 h-4"
      />
      <span className="text-gray-800">
        Require Special Characters (!, @, #, etc.)
      </span>
    </label>
  </div>
</div>

            <div className="mb-4">
              <label htmlFor="notificationMessage" className="block text-sm font-medium text-gray-600">
                Preview Notification Message
              </label>
              <textarea
                id="notificationMessage"
                rows="3"
                className="mt-2 w-full px-3 py-2 border rounded-md"
                value={formData.notificationMessage}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="mb-4">
  <label className="block text-sm font-medium text-gray-600">
    Audit Logging
  </label>
  <div className="flex items-center space-x-2 mt-2">
    <input
      type="checkbox"
      id="enableAuditLogging"
      checked={formData.enableAuditLogging}
      onChange={handleChange}
      className="w-4 h-4"
    />
    <span className="text-gray-800">
      Enable Audit Logging for Policy Changes
    </span>
  </div>
</div>

          </div>

          <div className="bg-gray-50 p-4 rounded-md shadow-sm">
            <h2 className="text-lg font-medium text-gray-700 mb-4">Authentication</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Password</span>
                <span className="text-gray-500 text-sm">Last changed 2 months ago</span>
              </div>

              <div className="flex items-center justify-between">
                <label className="form-label">2FA</label>
                <div className="grow">
                  <label className="switch">
                    <input
                      type="checkbox"
                      id="enforceTwoStepVerification"
                      checked={formData.enforceTwoStepVerification}
                      onChange={handleAuthSettingChange}
                    />
                  </label>
                </div>
              </div>

              {/* <div className="flex justify-between items-center">
                <span>Sign-in with</span>
                <div className="flex space-x-2">
                  <img
                    src="/path/to/google-icon.png"
                    alt="Google"
                    className="w-6 h-6 border border-gray-300 rounded-full"
                  />
                  <img
                    src="/path/to/apple-icon.png"
                    alt="Apple"
                    className="w-6 h-6 border border-gray-300 rounded-full"
                  />
                </div>
              </div> */}
            </div>
            <hr className="my-4" />

            <div className="flex items-center justify-between mt-5">
              <label className="form-label">Enable Time-Based One-Time Password (TOTP)</label>
              <div className="grow">
                <label className="switch">
                  <input
                    type="checkbox"
                    id="enableTOTP"
                    checked={formData.enableTOTP}
                    onChange={handleAuthSettingChange}
                  />
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between mt-5">
              <label className="form-label">Enable SMS OTP</label>
              <div className="grow">
                <label className="switch">
                  <input
                    type="checkbox"
                    id="enableSMSOTP"
                    checked={formData.enableSMSOTP}
                    onChange={handleAuthSettingChange}
                  />
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between mt-5">
              <label className="form-label">Enable Email OTP</label>
              <div className="grow">
                <label className="switch">
                  <input
                    type="checkbox"
                    id="enableEmailOTP"
                    checked={formData.enableEmailOTP}
                    onChange={handleAuthSettingChange}
                  />
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between mt-5">
              <label className="form-label">Enable Security Keys</label>
              <div className="grow">
                <label className="switch">
                  <input
                    type="checkbox"
                    id="enableSecurityKeys"
                    checked={formData.enableSecurityKeys}
                    onChange={handleAuthSettingChange}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
        {successMessage && (
          <div className="mt-4 text-green-600">{successMessage}</div>
        )}
        {errorMessage && (
          <div className="mt-4 text-red-600">{errorMessage}</div>
        )}
        <div className="mt-6 flex justify-between">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Settings"}
          </button>
        </div>
        {/* <div className="mt-5">
          <SessionUser url="#" />
        </div>
        <div className="mt-5">
          <TrustedDevices url="#" />
        </div> */}

      
      </form>
    </div>
  );
};

export default SecuritySettings;
