import React, { useState, useEffect } from 'react';
import { Container } from '@/components/container';
import { PageNavbar } from '@/pages/account';
import { toast } from 'sonner';
import {
  Toolbar,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/toolbar';

import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useLocation } from 'react-router';

import { updatImageUser } from '../../redux/actions';
import { toAbsoluteUrl } from '../../utils/Assets';
import { CrudAvatarUpload } from '@/partials/crud';
import { sendNotification } from '@/utils/notificationapi'; // Import the function
import CustomFieldPage from '../company/CustomFileds/block/CustomField';
import CustomFieldBuilder from '../company/CustomFileds/block/CustomFieldBuilder';

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

export default function PersonalInformation(props) {
  const dispatch = useDispatch();
  const { userId, companyId } = useSelector((state) => state.AuthReducerKey);
  const location = useLocation();

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [customFieldValues, setCustomFieldValues] = useState({});
  const [errors, setErrors] = useState({});
  const [customFields, setCustomFields] = useState([]);
  const user = useSelector((state) => state.AuthReducerKey);

  const [userData, setUserData] = useState({
    userID: null,
    companyId: null,
    userName: '',
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    dateOfBirth: '',
    customFieldData: ''
  });

  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);

  // Fetch user data and parse customFieldData for CustomFieldBuilder
  const fetchData = async () => {
    try {
      if (userId !== 0) {
        const response = await axios.get(`${API_URL}/User/${userId}`);
        const fetchedUser = { ...response.data };

        // Format dateOfBirth if available
        if (fetchedUser.dateOfBirth) {
          fetchedUser.dateOfBirth = new Date(fetchedUser.dateOfBirth)
            .toISOString()
            .split('T')[0];
        }

        // Parse customFieldData from API
        if (fetchedUser.customFieldData) {
          try {
            const parsedCustomFields = JSON.parse(fetchedUser.customFieldData);
            setCustomFieldValues(parsedCustomFields);
          } catch (error) {
            console.error('Error parsing customFieldData:', error);
          }
        }

        setUserData(fetchedUser);
        dispatch(updatImageUser(fetchedUser));
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      toast.error('Failed to fetch data.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle file upload validations for profile image
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const isImage = file.type.startsWith('image/');
      const maxSizeInMB = 3;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

      if (!isImage) {
        toast.error('Please upload an image file only.');
        return;
      }

      if (file.size > maxSizeInBytes) {
        toast.error(`File size should not exceed ${maxSizeInMB}MB.`);
        return;
      }
      setFile(file);
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    handleUpdateUserInfo();
  };
  // Update user information and handle validations
  const handleUpdateUserInfo = async () => {
    try {
      const validationErrors = {};

      // Validate required fields
      if (!userData.firstName?.trim()) {
        validationErrors.firstName = 'First Name is required.';
      }
      if (!userData.lastName?.trim()) {
        validationErrors.lastName = 'Last Name is required.';
      }
      if (!userData.email?.trim()) {
        validationErrors.email = 'Email is required.';
      } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
        validationErrors.email = 'Please enter a valid email address.';
      }
      if (!userData.address?.trim()) {
        validationErrors.address = 'Address is required.';
      }
      if (!userData.dateOfBirth) {
        validationErrors.dateOfBirth = 'Date of Birth is required.';
      } else {
        const today = new Date();
        const birthDate = new Date(userData.dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        if (age < 15) {
          validationErrors.dateOfBirth = 'You must be at least 15 years old.';
        }
      }

      if (Object.keys(validationErrors).length > 0) {
        Object.values(validationErrors).forEach((message) => {
          toast.error(message);
        });
        return;
      }
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('companyId', companyId);
      formData.append('firstName', userData.firstName);
      formData.append('lastName', userData.lastName);
      formData.append('email', userData.email);
      formData.append('dateOfBirth', userData.dateOfBirth);
      formData.append('address', userData.address || '');
      formData.append('modifiedBy', userId);
      formData.append('logoImage', file);
      formData.append('password', 'Test@123');
      formData.append('imageName', '');
      formData.append('imageUrl', '');
      formData.append('customFieldData', JSON.stringify(customFieldValues));

      const response = await axios.post(`${API_URL}/User/UpdateUserProfile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Returned UserId:', response);
      toast.success('User information updated successfully!');
      fetchData();
    } catch (error) {
      toast.error('Failed to update user information. Please try again.');
      console.error('Error updating user information:', error);
    }
  };

  //     const [loading, setLoading] = useState(true);  


//       const handleUpdateUserInfo = async () => {
//         try {
//           // Initialize an object to hold validation errors
//           const errors = {};
    
//           // Validate each required field
//           if (!userData.firstName?.trim()) {
//             errors.firstName = 'First Name is required.';
//           }
//           if (!userData.lastName?.trim()) {
//             errors.lastName = 'Last Name is required.';
//           }
        
//           if (!userData.email?.trim()) {
//             errors.email = 'Email is required.';
//           } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
//             errors.email = 'Please enter a valid email address.';
//           }
//           if (!userData.address?.trim()) {
//             errors.address = 'Address is required.';
//           }
//           if (!userData.dateOfBirth) {
//             errors.dateOfBirth = 'Date of Birth is required.';
//           } else {
//             // Check if the user is at least 15 years old
//             const today = new Date();
//             const birthDate = new Date(userData.dateOfBirth);
//             const age = today.getFullYear() - birthDate.getFullYear();
//             const monthDifference = today.getMonth() - birthDate.getMonth();
      
//             // if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
//             //   age--; // Adjust age if the birthday hasn't occurred yet this year
//             // }
      
//             if (age < 15) {
//               errors.dateOfBirth = 'You must be at least 15 years old.';
//             }
//           }
  
//           // If there are validation errors, display them and stop execution
//           if (Object.keys(errors).length > 0) {
//             Object.values(errors).forEach((message) => {
//               toast.error(message);
//             });
//             return; // Stop function execution if validation fails
//           }
      
//           // If validation passes, proceed with the API call
//           // const params = new URLSearchParams({
//           //   userId: userId,
//           //   companyId: companyId,
//           //   firstName: userData.firstName,
//           //   lastName: userData.lastName,
//           //   email: userData.email,
//           //   dateOfBirth: userData.dateOfBirth,
//           //   address: userData.address,
//           //   modifiedBy: userId,
//           // });
      
//           // const response = await axios.put(`${API_URL}/User/UpdateUserProfile?${params.toString()}`);


//  const formData = new FormData();

//             // Append all parameters
//             formData.append("userId", userId);
//             formData.append("companyId", companyId);
//             formData.append("firstName", userData.firstName);
//             formData.append("lastName", userData.lastName);
//             formData.append("email", userData.email);
//             formData.append("dateOfBirth", userData.dateOfBirth);
//             formData.append("address", userData.address || "");
//             formData.append("modifiedBy", userId);
//             formData.append("logoImage", file);
//             formData.append("password", "Test@123");
//             formData.append("imageName", "");
//             formData.append("imageUrl", "");
           
          
//               const response = await axios.post(`${API_URL}/User/UpdateUserProfile`, formData, {
//                 headers: {
//                   "Content-Type": "multipart/form-data", // Ensure proper Content-Type
//                 },
//               });



//           console.log('Returned UserId:', response);
      
//           // Show success message
//           toast.success('User information updated successfully!');
       
//           // Send Notification
//           await sendNotification(
//             userId,
//             64, // Assuming 21 is the notification setting ID for the update
//             'Contact notification',
//             'Contact Successfully Updated',
//             '47',
//             userData.firstName+' : '+userData.lastName
//           );


//            fetchData();
//          //  dispacth(updatImageUser(user))
//         } catch (error) {
//           toast.error('Failed to update user information. Please try again.');
//           console.error('Error updating user information:', error);
//         }
//       };
      
        
      if (loading) {
        return <div>Loading...</div>;
      }
    

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="col-span-1">
      <div className="card min-w-full">
        <div className="card-header">
          <h3 className="card-title">{props.title}</h3>
        </div>
        <div className="card-table scrollable-x-auto pb-3">
          <form onSubmit={handleSubmit}>
            <table className="table align-middle text-sm text-gray-500">
              <tbody>
                {[
                  { key: 'email', label: 'Email', maxLength: 50 },
                  { key: 'firstName', label: 'First Name', maxLength: 30, pattern: /^[A-Za-z\s-]+$/ },
                  { key: 'lastName', label: 'Last Name', maxLength: 30, pattern: /^[A-Za-z\s-]+$/ },
                  { key: 'address', label: 'Address', maxLength: 100 },
                  { key: 'dateOfBirth', label: 'Date of Birth', maxLength: null },
                ].map(({ key, label, maxLength, pattern }) => (
                  <tr key={key}>
                    <td className="py-2 text-gray-600 font-normal"><label className="py-2 text-gray-600 font-normal">{label}</label>
                      <input
                        type={key === 'dateOfBirth' ? 'date' : 'text'}
                        name={key}
                        value={userData[key] || ''}
                        onChange={(e) => {
                          const { value } = e.target;
                          if (!pattern || pattern.test(value) || value === '') {
                            setUserData({ ...userData, [key]: value });
                          }
                        }}
                        maxLength={maxLength || undefined}
                        className="input input-bordered w-full"
                      />
                    </td>
                  </tr>
                ))}

                <tr>
                  <td className="py-2 text-gray-600 font-normal">Profile Image
                    <div className="mb-4">
                      <img
                        src={toAbsoluteUrl(`/media/avatars/${user.imageName}`)}
                        alt="User Logo"
                        className="w-32 h-32 object-cover"
                      />
                    </div>
                    <input
                      type="file"
                      name="logoImage"
                      className="input input-bordered w-full"
                      onChange={handleFileChange}
                    />
                  </td>
                </tr>
             <tr>
              <td>
            {/* Optional: Display the raw customFieldData */}
            <CustomFieldBuilder
              formId={18}
              customFields={customFields}
              customFieldValues={customFieldValues}
              setCustomFieldValues={(updatedValues) => {
                if (updatedValues) {
                  setCustomFieldValues(updatedValues);
                  setUserData((prevUserData) => ({
                    ...prevUserData,
                    customFieldData: JSON.stringify(updatedValues),
                  }));
                }
              }}
              errors={errors}
              setErrors={setErrors}
            />
            </td></tr>
            </tbody>
            </table>
            <div className="flex items-center justify-end mt-4 mr-8">
              <button type="submit" className="btn btn-primary">
                {userId !== 0 ? 'Update Information' : 'Add User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
