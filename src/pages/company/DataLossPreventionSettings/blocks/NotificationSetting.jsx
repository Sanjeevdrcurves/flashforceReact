import React, { useState, useEffect } from 'react';
import { KeenIcon } from '@/components';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CommonHexagonBadge } from '@/partials/common';
import { useSelector } from 'react-redux';
import axios from 'axios'; // Import axios

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const NotificationSetting = () => {
  const { userId, companyId } = useSelector(state => state.AuthReducerKey);

  // State to store the fetched notification settings
  const [settings, setSettings] = useState(null);

  // Fetch data from the API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${API_URL}/PolicyAssignment/GetDLPSettingsByCompanyId/${companyId}/${userId}`);
        const data = response.data;
        if (data && data.length > 0) {
          setSettings(data[0]); // Assuming you have one object in the response array
        }
      } catch (error) {
        console.error('Error fetching notification settings:', error);
      }
    };
    fetchSettings();
  }, [companyId, userId]); // Add companyId and userId as dependencies

  const updateSetting = async (updatedSettings) => {
    try {
      const payload = {
        settingID: updatedSettings.settingID,
        emailNotification: updatedSettings.emailNotification,
        smsNotification: updatedSettings.smsNotification,
        inAppNotification: updatedSettings.inAppNotification,
        notificationFrequency: updatedSettings.notificationFrequency,
        escalationGroups: updatedSettings.escalationGroups,
        customNotificationTemplate: updatedSettings.customNotificationTemplate,
        createdBy: updatedSettings.createdBy,
        modifiedBy: updatedSettings.modifiedBy,
        companyID: companyId, // Using the companyId from the redux store
      };

      const response = await axios.put(`${API_URL}/PolicyAssignment/UpdateDLPSettings`, payload);
      if (response.status === 200) {
        setSettings(updatedSettings); // Update the settings after a successful update
        console.log('Settings updated successfully!');
      }
    } catch (error) {
      console.error('Error updating notification settings:', error);
    }
  };

  if (!settings) {
    return <div>Loading...</div>; // Show loading until the settings are fetched
  }

  return (
    <div className="card min-w-full p-6 bg-white shadow-sm rounded-md mt-10">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Notification</h3>
      </div>

      <div className="flex flex-col divide-y divide-gray-200">
        {/* Alert Notification Preferences */}
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <CommonHexagonBadge
              stroke="stroke-brand-clarity"
              fill="fill-brand-light"
              size="size-[50px]"
              badge={<KeenIcon icon="folder" className="text-xl text-brand" />}
            />
            <div>
              <h4 className="text-sm font-medium text-gray-900">Alert Notification Preferences</h4>
              <p className="text-xs text-gray-600">Enable modifier keys for quick keyboard shortcuts.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="deliveryMethod"
                value="Email Notifications"
                className="form-checkbox rounded text-indigo-600 checkbox"
                checked={settings.emailNotification === 1}
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    emailNotification: e.target.checked ? 1 : 0,
                  });
                  updateSetting({ ...settings, emailNotification: e.target.checked ? 1 : 0 });
                }}
              />
              <span className="ml-2 text-sm text-gray-700">Email Notifications</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="deliveryMethod"
                value="SMS Notifications"
                className="form-checkbox rounded text-indigo-600 checkbox"
                checked={settings.smsNotification === 1}
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    smsNotification: e.target.checked ? 1 : 0,
                  });
                  updateSetting({ ...settings, smsNotification: e.target.checked ? 1 : 0 });
                }}
              />
              <span className="ml-2 text-sm text-gray-700">SMS Notifications</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="deliveryMethod"
                value="In-App Alert"
                className="form-checkbox rounded text-indigo-600 checkbox"
                checked={settings.inAppNotification === 1}
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    inAppNotification: e.target.checked ? 1 : 0,
                  });
                  updateSetting({ ...settings, inAppNotification: e.target.checked ? 1 : 0 });
                }}
              />
              <span className="ml-2 text-sm text-gray-700">In-App Alert</span>
            </label>
          </div>
        </div>

        {/* Frequency Settings */}
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <CommonHexagonBadge
              stroke="stroke-brand-clarity"
              fill="fill-brand-light"
              size="size-[50px]"
              badge={<KeenIcon icon="folder" className="text-xl text-brand" />}
            />
            <div>
              <h4 className="text-sm font-medium text-gray-900">Frequency Settings</h4>
              <p className="text-xs text-gray-600">Choose preferences for automatic video playback.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <label className="radio-group">
              <input
                className="radio"
                name="desktop_notification"
                type="radio"
                value="1"
                checked={settings.notificationFrequency === 'Immediate'}
                onChange={() => {
                  setSettings({
                    ...settings,
                    notificationFrequency: 'Immediate',
                  });
                  updateSetting({ ...settings, notificationFrequency: 'Immediate' });
                }}
              />
              <span className="radio-label radio-label-sm">Immediate</span>
            </label>
            <label className="radio-group">
              <input
                className="radio"
                name="desktop_notification"
                type="radio"
                value="2"
                checked={settings.notificationFrequency === 'Hourly'}
                onChange={() => {
                  setSettings({
                    ...settings,
                    notificationFrequency: 'Hourly',
                  });
                  updateSetting({ ...settings, notificationFrequency: 'Hourly' });
                }}
              />
              <span className="radio-label radio-label-sm">Hourly</span>
            </label>
            <label className="radio-group">
              <input
                className="radio"
                name="desktop_notification"
                type="radio"
                value="3"
                checked={settings.notificationFrequency === 'Daily Summary'}
                onChange={() => {
                  setSettings({
                    ...settings,
                    notificationFrequency: 'Daily Summary',
                  });
                  updateSetting({ ...settings, notificationFrequency: 'Daily Summary' });
                }}
              />
              <span className="radio-label radio-label-sm">Daily Summary</span>
            </label>
          </div>
        </div>

        {/* Escalation Alerts */}
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <CommonHexagonBadge
              stroke="stroke-brand-clarity"
              fill="fill-brand-light"
              size="size-[50px]"
              badge={<KeenIcon icon="folder" className="text-xl text-brand" />}
            />
            <div>
              <h4 className="text-sm font-medium text-gray-900">Escalation Alerts</h4>
              <p className="text-xs text-gray-600">Choose preferences for automatic video playback.</p>
            </div>
          </div>
          <div className="w-1/4">
            <Select
              value={settings.escalationGroups}
              onChange={(value) => {
                setSettings({
                  ...settings,
                  escalationGroups: value,
                });
                updateSetting({ ...settings, escalationGroups: value });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Groups">Groups</SelectItem>
                <SelectItem value="Default Group">Default Group</SelectItem>
                <SelectItem value="Escalation Group 2">Escalation Group 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Custom Notification Templates */}
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <CommonHexagonBadge
              stroke="stroke-brand-clarity"
              fill="fill-brand-light"
              size="size-[50px]"
              badge={<KeenIcon icon="folder" className="text-xl text-brand" />}
            />
            <div>
              <h4 className="text-sm font-medium text-gray-900">Custom Notification Templates</h4>
              <p className="text-xs text-gray-600">{settings.customNotificationTemplate}</p>
            </div>
          </div>
          <div className="w-1/4"></div>
        </div>
      </div>
    </div>
  );
};

export { NotificationSetting };
