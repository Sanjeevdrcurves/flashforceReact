import { KeenIcon, Menu, MenuItem, MenuToggle } from '@/components';
import { useLanguage } from '@/i18n';
import { DropdownCard2 } from '@/partials/dropdowns/general';
import { CommonHexagonBadge } from '@/partials/common';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { useState } from 'react';

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const AuthTwoFactor = () => {
  const dispatch = useDispatch();
  const { userId, fullName,enableSMSOTP: smsOtpEnabled, enableTOTP: totpEnabled  } = useSelector((state) => state.AuthReducerKey);
  const { isRTL } = useLanguage();

  const [enableSMSOTP, setEnableSMSOTP] = useState(smsOtpEnabled || false);
  const [enableTOTP, setEnableTOTP] = useState(totpEnabled || false);
  const [password, setPassword] = useState('');

  const items = [
    {
      icon: 'message-text-2',
      title: 'Text Message (SMS)',
      description: 'Instant codes for secure account verification.',
      checkbox: enableSMSOTP,
      onChange: (checked) => setEnableSMSOTP(checked),
    },
    {
      icon: 'shield-tick',
      title: 'Authenticator App (TOTP)',
      description: 'Elevate protection with an authenticator app for two-factor authentication.',
      checkbox: enableTOTP,
      onChange: (checked) => setEnableTOTP(checked),
    },
  ];

  const handleSaveSettings = async () => {
    if (!userId || !password) {
      toast.error('Please fill login password.');
      return;
    }
  
    try {
      const response = await axios.post(
        `${API_URL}/User/UpdateTwoFA`,
        null, // No body, as the API expects query parameters
        {
          params: {
            userId, 
            enableSMSOTP, 
            enableTOTP, 
            modifiedBy: userId, 
            password,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      dispatch({
        type: 'UPDATE_TWOFA',
        payload: {
          enableSMSOTP: enableSMSOTP,
          enableTOTP:enableTOTP
        },
      });
      toast.success(response.data.message);
    } catch (error) {
      console.error('Error updating 2FA:', error.response?.data || error.message);
      toast.error(error.response?.data || 'Failed to update Two-Factor Authentication settings.');
    }
  };
  
  const renderItem = (item, index) => {
    return (
      <div
        key={index}
        className="flex items-center justify-between flex-wrap border border-gray-200 rounded-xl gap-2 px-3.5 py-2.5"
      >
        <div className="flex items-center flex-wrap gap-3.5">
          <div className="flex items-center">
            <CommonHexagonBadge
              stroke="stroke-gray-300"
              fill="fill-gray-100"
              size="size-[50px]"
              badge={<KeenIcon icon={item.icon} className="text-xl text-gray-500" />}
            />
          </div>

          <div className="flex flex-col gap-px">
            <a href="#" className="text-sm font-medium text-gray-900 hover:text-primary-active">
              {item.title}
            </a>
            <span className="text-2sm font-medium text-gray-700">{item.description}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 lg:gap-6">
          <label className="switch switch-sm">
            <input
              type="checkbox"
              checked={item.checkbox}
              onChange={(e) => item.onChange(e.target.checked)}
            />
          </label>
        </div>
      </div>
    );
  };

  return (
    <div className="card">
      <div className="card-header" id="auth_two_factor">
        <h3 className="card-title">Two-Factor Authentication (2FA)</h3>

        <Menu className="items-stretch">
          <MenuItem
            toggle="dropdown"
            trigger="click"
            dropdownProps={{
              placement: isRTL() ? 'bottom-start' : 'bottom-end',
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: isRTL() ? [0, -10] : [0, 10], // [skid, distance]
                  },
                },
              ],
            }}
          >
            <MenuToggle className="btn btn-sm btn-icon btn-light btn-clear">
              <KeenIcon icon="dots-vertical" />
            </MenuToggle>
            {DropdownCard2()}
          </MenuItem>
        </Menu>
      </div>

      <div className="card-body">
        <div className="grid gap-5 mb-7">
          {items.map((item, index) => renderItem(item, index))}
        </div>

        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 mb-7">
            <label className="form-label max-w-56">Password</label>

            <div className="flex flex-col items-start grow gap-3 w-full">
              <input
                className="input"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="form-info gray-800 font-normal">
                Enter your password to set up Two-Factor Authentication
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2.5">
          <button className="btn btn-primary" onClick={handleSaveSettings}>
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export { AuthTwoFactor };
