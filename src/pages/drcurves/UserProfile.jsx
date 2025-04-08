import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';

import { Container } from '@/components/container';
import { PageNavbar } from '@/pages/account';
import { KeenIcon } from '@/components';
import {
  Toolbar,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/toolbar';
import clsx from 'clsx';
import PersonalInformation from './PersonalInformation';
import CustomFieldBuilder from '../company/CustomFileds/block/CustomFieldBuilder';
import { sendNotification } from '@/utils/notificationapi';

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const UserProfile = () => {
  const { userId, companyId } = useSelector((state) => state.AuthReducerKey);
  
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    modifiedBy: 'System',
  });

  const [loading, setLoading] = useState(false);
  const [authSettings, setAuthSettings] = useState({});
  const [securitySettings, setSecuritySettings] = useState({});
 

  // Fetch Authentication & Security Settings on mount
  useEffect(() => {
    (async () => {
      try {
        const [authResponse, securityResponse] = await Promise.all([
          axios.get(`${API_URL}/AuthenticationSettings/GetAuthenticationSettingsByID/${companyId}`),
          axios.get(`${API_URL}/SecuritySetting/GetAllSecuritySetting/${companyId}`),
        ]);

        setAuthSettings(authResponse?.data || {});
        setSecuritySettings(Array.isArray(securityResponse?.data) ? securityResponse.data[0] : securityResponse?.data || {});
      } catch (error) {
        console.error("Error fetching authentication/security settings:", error);
      }
    })();
  }, [companyId]);




  const togglePassword = (event) => {
    event.preventDefault();
    setShowPassword(!showPassword);
};
 const handleUpdatePassword = async () => {
  const { oldPassword, newPassword, confirmPassword } = passwordData;

  // Validation
  if (oldPassword == newPassword ) {
    toast.error('New password cannot be same as old password.');
    return;
  }
  // Validation
  if (!oldPassword || !newPassword || !confirmPassword) {
    toast.error('All fields are required.');
    return;
  }
  if (newPassword !== confirmPassword) {
    toast.error('New password and confirm password do not match.');
    return;
  }

  // Security Policy Enforcement
  const minLength = securitySettings?.minLength ;
  const requireUppercase = securitySettings?.requireUppercase;
  const requireLowercase = securitySettings?.requireLowercase;
  const requireNumbers = securitySettings?.requireNumbers;
  const requireSpecialChars = securitySettings?.requireSpecialChars;
  const passwordHistoryRestriction = securitySettings?.passwordHistoryRestriction || 'norestriction';

   
  console.log("Security Settings:");
  console.log("Min Length:", minLength);
  console.log("Require Uppercase:", requireUppercase);
  console.log("Require Lowercase:", requireLowercase);
  console.log("Require Numbers:", requireNumbers);
  console.log("Require Special Characters:", requireSpecialChars);
  console.log("Password History Restriction:", passwordHistoryRestriction);
  if (newPassword.length < minLength) {
    toast.error(`Password must be at least ${minLength} characters long.`);
    return;
  }
  if (requireUppercase && !/[A-Z]/.test(newPassword)) {
    toast.error('Password must contain at least one uppercase letter.');
    return;
  }
  if (requireLowercase && !/[a-z]/.test(newPassword)) {
    toast.error('Password must contain at least one lowercase letter.');
    return;
  }
  if (requireNumbers && !/[0-9]/.test(newPassword)) {
    toast.error('Password must contain at least one number.');
    return;
  }
  if (requireSpecialChars && !/[!@#$%^&*]/.test(newPassword)) {
    toast.error('Password must contain at least one special character.');
    return;
  }

  try {
    setLoading(true);

    // **Step 1: Check Password History Restriction (only if not "norestriction")**
    if (passwordHistoryRestriction !== 'norestriction') {
      const historyCheckRequest = {
        UserId: userId,
        NewPasswordHash: newPassword,
      };

      const historyCheckResponse = await axios.post(
        `${API_URL}/Auth/CheckPasswordHistory`,
        historyCheckRequest // Send as JSON body
      );
console.log(historyCheckResponse);
       // Check if the password was used before based on the 'message' property
      if (historyCheckResponse.data.message === "True") {
        toast.error(`You cannot use your last ${passwordHistoryRestriction.replace('last', '')} passwords.`);
        setLoading(false);
        return;
      }
    }

    // **Step 2: Proceed with Password Update**
    const response = await axios.post(
      `${API_URL}/Auth/ChangePassword`,
      null,
      {
        params: {
          userId,
          oldPassword,
          newPassword,
          modifiedBy: userId,
        },
      }
    );

    const resMessage = response.data.message;
    if (resMessage === 'Password updated successfully') {
      toast.success('Password updated successfully!');

      // Send Notification
                await sendNotification(
                  userId,
                  65, // Assuming 21 is the notification setting ID for the update
                  'password notification',
                  'password Successfully Updated',
                  '48',
                 ''
                );
      
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      toast.error(resMessage);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to update password. Try again.');
    console.error('Error updating password:', error);
  } finally {
    setLoading(false);
  }
};


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  return (
    <>
      <PageNavbar />
      <Container>
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle text="User Profile" />
            <ToolbarDescription />
          </ToolbarHeading>
        </Toolbar>
      </Container>

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-7.5">
          <PersonalInformation title="User Info" />

          <div className="col-span-1">
            <div className="card min-w-full">
              <div className="card-header">
                <h3 className="card-title">Update Password</h3>
              </div>
              <div className="card-table scrollable-x-auto pb-3">
                <form>
                  <table className="table align-middle text-sm text-gray-500">
                    <tr>
                      <td className="py-2 text-gray-600 font-normal capitalize">Old Password</td>
                      <td className="py-2 text-gray-800 font-normal">

                     
                        <input
                          type="password"
                          name="oldPassword"
                          value={passwordData.oldPassword}
                          onChange={handleInputChange}
                          className="input input-bordered w-full"
                        />
                        
                        
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-gray-600 font-normal capitalize">New Password</td>
                      <td className="py-2 text-gray-800 font-normal">
                      <label className="input">
                        <input
                           type={showPassword ? 'text' : 'password'}
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handleInputChange}
                          className={clsx('form-control')}
                        />
                         <button className="btn btn-icon" onClick={togglePassword}>
                            <KeenIcon
                                icon="eye"
                                className={clsx('text-gray-500', {
                                    hidden: showPassword,
                                })}
                            />
                            <KeenIcon
                                icon="eye-slash"
                                className={clsx('text-gray-500', {
                                    hidden: !showPassword,
                                })}
                            />
                        </button>
                        </label>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-gray-600 font-normal capitalize">Confirm Password</td>
                      <td className="py-2 text-gray-800 font-normal">
                      <label className="input">
                        <input
                        type={showPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handleInputChange}
                          className={clsx('form-control')}
                        />
                               <button className="btn btn-icon" onClick={togglePassword}>
                            <KeenIcon
                                icon="eye"
                                className={clsx('text-gray-500', {
                                    hidden: showPassword,
                                })}
                            />
                            <KeenIcon
                                icon="eye-slash"
                                className={clsx('text-gray-500', {
                                    hidden: !showPassword,
                                })}
                            />
                        </button>
 
                        {/* <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter Password"
                            autoComplete="off"
                            {...formik.getFieldProps('password')}
                            className={clsx('form-control', {
                                'is-invalid': formik.touched.password && formik.errors.password,
                            })}
                        /> */}
                 
                    </label>











                      </td>
                    </tr>
                  </table>
         

                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleUpdatePassword}
                      disabled={loading}
                    >
                      {loading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default UserProfile;
