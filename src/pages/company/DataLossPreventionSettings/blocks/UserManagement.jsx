import { useEffect, useState } from 'react';
import axios from 'axios';
import { KeenIcon } from '@/components';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CommonHexagonBadge } from '@/partials/common';
import { useSelector } from 'react-redux';

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const UserManagement = () => {
  const { userId, companyId } = useSelector((state) => state.AuthReducerKey);
  
  const [userRole, setUserRole] = useState('');
  const [permissions, setPermissions] = useState({
    canViewAlerts: false,
    canManagePolicies: false,
    canResolveIncidents: false,
    canViewLogs: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserRoleAndPermissions = async () => {
      try {
        const response = await axios.get(`${API_URL}/PolicyAssignment/GetDLPSettingsByCompanyId/${companyId}/${userId}`);
        const data = response.data[0]; // Assuming data is in the first object of the array
        setUserRole(data.userRole);
        setPermissions({
          canViewAlerts: data.canViewAlerts === 1,
          canManagePolicies: data.canManagePolicies === 1,
          canResolveIncidents: data.canResolveIncidents === 1,
          canViewLogs: data.canViewLogs === 1,
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch user role and permissions');
        setLoading(false);
      }
    };

    fetchUserRoleAndPermissions();
  }, [companyId, userId]);

  const handlePermissionChange = async (permissionKey, value) => {
    try {
      const updatedPermissions = { ...permissions, [permissionKey]: value };
      setPermissions(updatedPermissions);

      const payload = {
        settingID: 0, // Update this with the actual setting ID if available
        userRole: userRole, // Add user role here
        canViewAlerts: updatedPermissions.canViewAlerts ? 1 : 0,
        canManagePolicies: updatedPermissions.canManagePolicies ? 1 : 0,
        canResolveIncidents: updatedPermissions.canResolveIncidents ? 1 : 0,
        canViewLogs: updatedPermissions.canViewLogs ? 1 : 0,
        modifiedBy: userId, // Assuming the userId is the one modifying the settings
        companyID: companyId,
      };

      await axios.put(`${API_URL}/PolicyAssignment/UpdateDLPSettings`, payload);
    } catch (err) {
      console.error('Failed to update permission:', err);
    }
  };

  const handleRoleChange = async (newRole) => {
    try {
      setUserRole(newRole); // Update userRole state immediately
  
      const payload = {
        settingID: 0, // Update this with the actual setting ID if available
        userRole: newRole, // Use the newRole value here
        canViewAlerts: permissions.canViewAlerts ? 1 : 0,
        canManagePolicies: permissions.canManagePolicies ? 1 : 0,
        canResolveIncidents: permissions.canResolveIncidents ? 1 : 0,
        canViewLogs: permissions.canViewLogs ? 1 : 0,
        modifiedBy: userId,
        companyID: companyId,
      };
  
      await axios.put(`${API_URL}/PolicyAssignment/UpdateDLPSettings`, payload);
    } catch (err) {
      console.error('Failed to update user role:', err);
    }
  };
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="card min-w-full p-6 bg-white shadow-sm rounded-md mt-10">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
      </div>

      <div className="flex flex-col divide-y divide-gray-200">
        {/* User Roles */}
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <CommonHexagonBadge
              stroke="stroke-brand-clarity"
              fill="fill-brand-light"
              size="size-[50px]"
              badge={<KeenIcon icon="user" className="text-xl text-brand" />}
            />
            <div>
              <h4 className="text-sm font-medium text-gray-900">User Roles</h4>
              <p className="text-xs text-gray-600">Choose preferences for automatic video playback.</p>
            </div>
          </div>
          <div className="w-1/4">
            <Select value={userRole} onValueChange={handleRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Custom Role">Custom Role</SelectItem>
                <SelectItem value="Viewer Role">Viewer Role</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Assign Permissions */}
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <CommonHexagonBadge
              stroke="stroke-brand-clarity"
              fill="fill-brand-light"
              size="size-[50px]"
              badge={<KeenIcon icon="folder" className="text-xl text-brand" />}
            />
            <div>
              <h4 className="text-sm font-medium text-gray-900">Assign Permissions</h4>
              <p className="text-xs text-gray-600">Choose preferences for automatic video playback.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="col-span-1 mt-5">
              <div className="flex items-center gap-2 whitespace-nowrap">
                {[
                  { label: 'View Alert', permission: 'canViewAlerts' },
                  { label: 'Manage Policies', permission: 'canManagePolicies' },
                  { label: 'Resolve Incident', permission: 'canResolveIncidents' },
                  { label: 'View Logs', permission: 'canViewLogs' },
                ].map((method, index) => (
                  <label key={index} className="flex items-center">
                    <input
                      type="checkbox"
                      name={method.permission}
                      value={method.label}
                      checked={permissions[method.permission]}
                      className="form-checkbox rounded text-indigo-600 checkbox"
                      onChange={() => handlePermissionChange(method.permission, !permissions[method.permission])}
                    />
                    <span className="ml-2 text-sm text-gray-700">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { UserManagement };
