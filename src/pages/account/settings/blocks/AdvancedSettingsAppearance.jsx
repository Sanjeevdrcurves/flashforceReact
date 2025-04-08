import React, { useState } from 'react';
import { KeenIcon } from '@/components';
import { toAbsoluteUrl } from '@/utils/Assets';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { useSettings } from '@/providers/SettingsProvider';


const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const AdvancedSettingsAppearance = ({ title }) => {
  const {userId, companyId} = useSelector(state => state.AuthReducerKey);
  const dispatch = useDispatch();
  const {
    settings,
    storeSettings
  } = useSettings();
  const user = useSelector((state) => state.AuthReducerKey);

  const [selectedTheme, setSelectedTheme] = useState(user.theme);
  const [enableTransparentSideBar, setEnableTransparentSideBar] = useState(
    user.enableTransparentSideBar
  );

  const items = [
    { image: '28.jpg', logo: 'azure.svg', label: 'dark' },
    { image: '32.jpg', logo: 'google.svg', label: 'light' },
    { image: '30.jpg', logo: 'openid.svg', label: 'system' },
  ];

  const handleSaveChanges = async () => {
    try {
      const userId = user.userId;
      const modifiedBy = user.fullName;

      const response = await axios.post(
        `${API_URL}/User/UpdateUserTheme`,
        null,
        {
          params: {
            userId,
            theme: selectedTheme,
            enableTransparentSideBar,
          },
        }
      );

      // Update the Redux state on successful API call
      dispatch({
        type: 'UPDATE_THEME_SETTINGS',
        payload: {
          theme: selectedTheme,
          enableTransparentSideBar,
        },
      });
      storeSettings({
        themeMode:selectedTheme
      })

      toast.success(response.data || 'Theme updated successfully!');
    } catch (error) {
      console.error('Error updating theme:', error);
      toast.error('Failed to update theme. Please try again.');
    }
  };

  const renderItem = (item, index) => (
    <div key={index}>
      <label
        className="flex items-end border bg-no-repeat bg-cover border-gray-300 rounded-xl h-[170px] mb-0.5"
        style={{
          backgroundImage: `url(${toAbsoluteUrl(
            `/media/images/600x400/${item.image}`
          )})`,
        }}
      >
        <input
          className="appearance-none"
          type="radio"
          name="appearance_option"
          checked={selectedTheme === item.label}
          onChange={() => setSelectedTheme(item.label)}
        />
        <KeenIcon
          icon="check-circle"
          className={`ms-5 mb-5 text-xl ${
            selectedTheme === item.label ? 'text-success' : 'hidden'
          }`}
          style="solid"
        />
      </label>
      <span className="text-sm font-medium text-gray-900">{item.label}</span>
    </div>
  );

  return (
    <div className="card">
      <div className="card-header" id="advanced_settings_appearance">
        <h3 className="card-title">{title || 'Appearance'}</h3>
      </div>

      <div className="card-body lg:py-7.5">
        <div className="mb-5">
          <h3 className="text-md font-medium text-gray-900">Theme mode</h3>
          <span className="text-2sm text-gray-700">
            Select or customize your UI theme
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-7.5">
          {items.map((item, index) => renderItem(item, index))}
        </div>

        <div className="border-t border-gray-200 mt-7 mb-8"></div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 mb-8">
          <label className="form-label max-w-48 text-gray-800 font-normal">
            Transparent sidebar
          </label>
          <div className="flex items-center gap-7.5 grow">
            <label className="switch">
              <span className="switch-label text-700 font-semibold">Active</span>
              <input
                type="checkbox"
                checked={enableTransparentSideBar}
                onChange={(e) => setEnableTransparentSideBar(e.target.checked)}
              />
            </label>

            <span className="form-info text-gray-800 font-normal">
              Toggle the transparent sidebar for a sleek interface. Switch it
              on for transparency or off for a solid background.
            </span>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="btn btn-primary" onClick={handleSaveChanges}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export { AdvancedSettingsAppearance };
