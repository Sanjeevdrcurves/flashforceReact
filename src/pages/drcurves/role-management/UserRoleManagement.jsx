import { Container } from '@/components/container';
import { PageNavbar } from '@/pages/account';

import {
  Toolbar,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/toolbar';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
const RoleManagement = () => {
  const {userId,companyId}=useSelector(state=>state.AuthReducerKey)
  const [userData, setUserData] = useState({
    userID: null,
    userName: '',
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    dateOfBirth: '',
  });
  const [featureData, setFeatureData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch user and feature data
  useEffect(() => {
    const fetchData = async () => {
      try {

        const userResponse = await axios.get(`${API_URL}/User/${userId}`);
        console.log('User Data Response:', userResponse.data);
        // Convert dateOfBirth to YYYY-MM-DD format if it's not already
        const user = { ...userResponse.data };
        if (user.dateOfBirth) {
          user.dateOfBirth = new Date(user.dateOfBirth).toISOString().split('T')[0];
        }
        setUserData(user);
        const featureResponse = await axios.get(`${API_URL}/FeaturePermission/${companyId}/${userId}`);
        console.log('Feature Data Response:', featureResponse.data);
        setFeatureData(featureResponse.data);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePermissionChange = (index, permissionType) => {
    const updatedFeatureData = [...featureData];
    updatedFeatureData[index] = {
      ...updatedFeatureData[index],
      [permissionType]: !updatedFeatureData[index][permissionType],
    };
    setFeatureData(updatedFeatureData);
  };

  const handleAssignRoles = async () => {
    try {
      const promises = featureData.map((feature) => {
        const payload = {
          id: feature.id,
          canView: feature.canView,
          canEdit: feature.canEdit,
          canDelete: feature.canDelete,
        };
        return axios.put(`${API_URL}/FeaturePermission/${feature.id}`, payload);
      });

      await Promise.all(promises);
      setSuccessMessage('Roles assigned successfully!');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Failed to assign roles. Please try again.');
      console.error('Error during role assignment:', error);
      setSuccessMessage('');
    }
  };

  const handleUpdateUserInfo = async () => {
    try {
      const params = new URLSearchParams({
        userId: userData.userID, // Include userId in the query string
        firstName: userData.firstName,
        lastName: userData.lastName,
        userName: userData.userName,
        email: userData.email,
        dateOfBirth: userData.dateOfBirth,
        address: userData.address,
        modifiedBy: userId, // Assuming the modifier is a fixed value
      });
  
      await axios.put(`${API_URL}/User/UpdateUserDetail?${params.toString()}`);
      setSuccessMessage('User information updated successfully!');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Failed to update user information. Please try again.');
      console.error('Error updating user information:', error);
      setSuccessMessage('');
    }
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      {successMessage && (
        <div className="alert alert-success mb-4">{successMessage}</div>
      )}
      {errorMessage && (
        <div className="alert alert-error mb-4">{errorMessage}</div>
      )}
      <PageNavbar />
      <Container>
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle text="Role Management" />
            <ToolbarDescription />
          </ToolbarHeading>
        </Toolbar>
      </Container>

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-7.5">
          {/* Left Panel: User Info */}
          <div className="col-span-1">
            <div className="card min-w-full">
              <div className="card-header">
                <h3 className="card-title">User Info</h3>
              </div>
              <div className="card-table scrollable-x-auto pb-3">
                <form>
                  <table className="table align-middle text-sm text-gray-500">
                    <tbody>
                      {['userName', 'email', 'firstName', 'lastName', 'address', 'dateOfBirth'].map(
                        (key) => (
                          <tr key={key}>
                            <td className="py-2 text-gray-600 font-normal capitalize">{key}</td>
                            <td className="py-2 text-gray-800 font-normal">
                              <input
                                type={key === 'dateOfBirth' ? 'date' : 'text'}
                                name={key}
                                value={userData[key] || ''}
                                onChange={(e) => setUserData({ ...userData, [key]: e.target.value })}
                                className="input input-bordered w-full"
                              />
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                  <div className="flex items-center justify-end mt-4">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleUpdateUserInfo}
                    >
                      Update Information
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Right Panel: Assign Roles */}
          <div className="col-span-1">
            <div className="card min-w-full">
              <div className="card-header">
                <h3 className="card-title">Assign Roles</h3>
              </div>
              <div className="card-table scrollable-x-auto pb-3">
                <table className="table-auto w-full">
                  <thead>
                    <tr>
                      <th className="text-sm text-gray-600 pb-3 pe-4 lg:pe-10 py-3">Module Name</th>
                      <th className="text-sm text-gray-600 pb-3 pe-4 lg:pe-10 py-3">Permissions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {featureData.length > 0 ? (
                      featureData.map((feature, index) => (
                        <tr key={feature.featureId}>
                          <td className="py-2 text-gray-800 font-normal text-sm">{feature.featureName}</td>
                          <td className="text-sm text-gray-900 pb-3">
                            <div className="flex gap-4">
                              <label className="switch">
                                <input
                                  type="checkbox"
                                  checked={feature.canView}
                                  onChange={() => handlePermissionChange(index, 'canView')}
                                />
                                <span className="switch-label">View</span>
                              </label>
                              <label className="switch">
                                <input
                                  type="checkbox"
                                  checked={feature.canEdit}
                                  onChange={() => handlePermissionChange(index, 'canEdit')}
                                />
                                <span className="switch-label">Edit</span>
                              </label>
                              <label className="switch">
                                <input
                                  type="checkbox"
                                  checked={feature.canDelete}
                                  onChange={() => handlePermissionChange(index, 'canDelete')}
                                />
                                <span className="switch-label">Delete</span>
                              </label>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2" className="text-center">
                          No features available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className="flex items-center justify-end mt-4">
                  <button className="btn btn-primary" onClick={handleAssignRoles}>
                    Assign Roles
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default RoleManagement;

