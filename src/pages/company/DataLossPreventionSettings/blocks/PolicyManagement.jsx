import { useEffect, useState } from 'react';
import axios from 'axios';
import { KeenIcon } from '@/components';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CommonHexagonBadge } from '@/partials/common';
import { useSelector } from 'react-redux';
const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const PolicyManagement = () => {
  const { userId, companyId } = useSelector((state) => state.AuthReducerKey);
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPolicySettings = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/PolicyAssignment/GetDLPSettingsByCompanyId/${companyId}/${userId}`
        );
        setSettings(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch policy settings');
        setLoading(false);
      }
    };

    fetchPolicySettings();
  }, [companyId, userId]);

  const updateSetting = async (updatedSetting) => {
    try {
      const response = await axios.put(`${API_URL}/PolicyAssignment/UpdateDLPSettings`, updatedSetting);
      setSettings((prevSettings) =>
        prevSettings.map((setting) =>
          setting.settingID === updatedSetting.settingID ? { ...setting, ...updatedSetting } : setting
        )
      );
      console.log('Updated successfully:', response.data);
    } catch (err) {
      console.error('Failed to update policy setting', err);
    }
  };

  const handlePolicyTemplatesChange = (value) => {
    const updatedSetting = {
      settingID: settings[0]?.settingID,
      policyTemplates: value,
      policyStatus: settings[0]?.policyStatus,
      modifiedBy: userId,
      companyID: companyId,
    };
    updateSetting(updatedSetting);
  };

  const handlePolicyStatusChange = (value) => {
    const updatedSetting = {
      settingID: settings[0]?.settingID,
      policyTemplates: settings[0]?.policyTemplates,
      policyStatus: value,
      modifiedBy: userId,
      companyID: companyId,
    };
    updateSetting(updatedSetting);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="card min-w-full p-6 bg-white shadow-sm rounded-md mt-10">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Policy Settings</h3>
      </div>

      <div className="flex flex-col divide-y divide-gray-200">
        {/* Policy Templates */}
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <CommonHexagonBadge
              stroke="stroke-brand-clarity"
              fill="fill-brand-light"
              size="size-[50px]"
              badge={<KeenIcon icon="folder" className="text-xl text-brand" />}
            />
            <div>
              <h4 className="text-sm font-medium text-gray-900">Policy Templates</h4>
              <p className="text-xs text-gray-600">{settings[0]?.policyTemplates}</p>
            </div>
          </div>
          <div className="w-1/4">
            <Select
              value={settings[0]?.policyTemplates || 'Inactive'}
              onValueChange={handlePolicyTemplatesChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Policy Status */}
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <CommonHexagonBadge
              stroke="stroke-brand-clarity"
              fill="fill-brand-light"
              size="size-[50px]"
              badge={<KeenIcon icon="folder" className="text-xl text-brand" />}
            />
            <div>
              <h4 className="text-sm font-medium text-gray-900">Policy Status</h4>
              <p className="text-xs text-gray-600">{settings[0]?.policyStatus}</p>
            </div>
          </div>
          <div className="w-1/4">
            <Select
              value={settings[0]?.policyStatus || 'Sensitive Data Policy'}
              onValueChange={handlePolicyStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sensitive Data Policy">Sensitive Data Policy</SelectItem>
                <SelectItem value="Compliance Policy">Compliance Policy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export { PolicyManagement };
