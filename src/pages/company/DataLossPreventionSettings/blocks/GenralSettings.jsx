import { useState, useEffect } from 'react';
import axios from 'axios';
import { KeenIcon } from '@/components';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CommonHexagonBadge } from '@/partials/common';
import { useSelector } from 'react-redux';
const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const GeneralSettings = () => {
  const { userId, companyId } = useSelector(state => state.AuthReducerKey);
  const [dlpSettings, setDlpSettings] = useState(null);

  useEffect(() => {
    // Fetch DLP settings from API
    const fetchDlpSettings = async () => {
      try {
        const response = await axios.get(`${API_URL}/PolicyAssignment/GetDLPSettingsByCompanyId/${companyId}/${userId}`);
        if (response.data && response.data.length > 0) {
          setDlpSettings(response.data[0]); // Assuming you're dealing with one setting object
        }
      } catch (error) {
        console.error('Error fetching DLP settings:', error);
      }
    };

    fetchDlpSettings();
  }, [companyId, userId]);

  const updateSettings = async (updatedSettings) => {
    try {
      const response = await axios.put(`${API_URL}/PolicyAssignment/UpdateDLPSettings`, {
        settingID: updatedSettings.settingID,
        enableDLPSystem: updatedSettings.enableDLPSystem,
        dataClassification: updatedSettings.dataClassification,
        retentionPeriod: updatedSettings.retentionPeriod,
        incidentReviewWorkflow: updatedSettings.incidentReviewWorkflow,
        alertThreshold: updatedSettings.alertThreshold,
        modifiedBy: userId,
        companyID: companyId
      });
      if (response.status === 200) {
        console.log('Settings updated successfully!');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  // If DLP settings are not yet loaded, return a loading state
  if (!dlpSettings) {
    return <div>Loading...</div>;
  }

  // Handle changes in settings
  const handleCheckboxChange = () => {
    const updatedSettings = { ...dlpSettings, enableDLPSystem: dlpSettings.enableDLPSystem === 1 ? 0 : 1 };
    setDlpSettings(updatedSettings);
    updateSettings(updatedSettings); // Immediately update on change
  };

  const handleSelectChange = (field, value) => {
    const updatedSettings = { ...dlpSettings, [field]: value };
    setDlpSettings(updatedSettings);
    updateSettings(updatedSettings); // Immediately update on change
  };

  return (
    <div className="card min-w-full p-6 bg-white shadow-sm rounded-md">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">General Settings</h3>
      </div>

      <div className="flex flex-col divide-y divide-gray-200">
        {/* Enable/Disable DLP System */}
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <CommonHexagonBadge
              stroke="stroke-brand-clarity"
              fill="fill-brand-light"
              size="size-[50px]"
              badge={<KeenIcon icon="folder" className="text-xl text-brand" />}
            />
            <div>
              <h4 className="text-sm font-medium text-gray-900">Enable/Disable DLP System</h4>
              <p className="text-xs text-gray-600">Enable modifier keys for quick keyboard shortcuts.</p>
            </div>
          </div>
          <label className="switch switch-sm">
            <input
              type="checkbox"
              value="1"
              name="check"
              checked={dlpSettings.enableDLPSystem === 1}
              onChange={handleCheckboxChange}
            />
          </label>
        </div>

        {/* Data Classification */}
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <CommonHexagonBadge
              stroke="stroke-brand-clarity"
              fill="fill-brand-light"
              size="size-[50px]"
              badge={<KeenIcon icon="folder" className="text-xl text-brand" />}
            />
            <div>
              <h4 className="text-sm font-medium text-gray-900">Data Classification</h4>
              <p className="text-xs text-gray-600">Choose preferences for automatic video playback.</p>
            </div>
          </div>
          <div className="w-1/4">
            <Select
              value={dlpSettings.dataClassification}
              onValueChange={(value) => handleSelectChange('dataClassification', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Public">Public</SelectItem>
                <SelectItem value="Confidential">Confidential</SelectItem>
                <SelectItem value="Internal">Internal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Default Retention Period for Logs */}
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <CommonHexagonBadge
              stroke="stroke-brand-clarity"
              fill="fill-brand-light"
              size="size-[50px]"
              badge={<KeenIcon icon="folder" className="text-xl text-brand" />}
            />
            <div>
              <h4 className="text-sm font-medium text-gray-900">Default Retention Period for Logs</h4>
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
                checked={dlpSettings.retentionPeriod === '30 days'}
                onChange={() => handleSelectChange('retentionPeriod', '30 days')}
              />
              <span className="radio-label radio-label-sm">30 days</span>
            </label>
            <label className="radio-group">
              <input
                className="radio"
                name="desktop_notification"
                type="radio"
                value="2"
                checked={dlpSettings.retentionPeriod === '6 months'}
                onChange={() => handleSelectChange('retentionPeriod', '6 months')}
              />
              <span className="radio-label radio-label-sm">6 months</span>
            </label>
            <label className="radio-group">
              <input
                className="radio"
                name="desktop_notification"
                type="radio"
                value="3"
                checked={dlpSettings.retentionPeriod === '1 year'}
                onChange={() => handleSelectChange('retentionPeriod', '1 year')}
              />
              <span className="radio-label radio-label-sm">1 year</span>
            </label>
          </div>
        </div>

        {/* Incident Review Workflow */}
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <CommonHexagonBadge
              stroke="stroke-brand-clarity"
              fill="fill-brand-light"
              size="size-[50px]"
              badge={<KeenIcon icon="folder" className="text-xl text-brand" />}
            />
            <div>
              <h4 className="text-sm font-medium text-gray-900">Incident Review Workflow</h4>
              <p className="text-xs text-gray-600">Choose preferences for automatic video playback.</p>
            </div>
          </div>
          <div className="w-1/4">
            <Select
              value={dlpSettings.incidentReviewWorkflow}
              onValueChange={(value) => handleSelectChange('incidentReviewWorkflow', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Custom Workflow">Custom Workflow</SelectItem>
                <SelectItem value="Default Workflow">Default Workflow</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Alert Thresholds */}
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <CommonHexagonBadge
              stroke="stroke-brand-clarity"
              fill="fill-brand-light"
              size="size-[50px]"
              badge={<KeenIcon icon="folder" className="text-xl text-brand" />}
            />
            <div>
              <h4 className="text-sm font-medium text-gray-900">Alert Thresholds</h4>
              <p className="text-xs text-gray-600">Choose preferences for automatic video playback.</p>
            </div>
          </div>
          <div className="w-1/4">
            <Select
              value={dlpSettings.alertThreshold}
              onValueChange={(value) => handleSelectChange('alertThreshold', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High: 80%">High: 80%</SelectItem>
                <SelectItem value="Medium: 60%">Medium: 60%</SelectItem>
                <SelectItem value="Low: 40%">Low: 40%</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export { GeneralSettings };
