import { Container } from '@/components/container';
import { PageNavbar } from '@/pages/account';
import { toast } from 'sonner';
import Select from 'react-select';
import { Toolbar, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { CrudAvatarUpload } from '@/partials/crud';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { json, useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Checkbox, Table, TableBody, TableCell, TableHead, TableRow, Button, Paper, Switch } from '@mui/material';
import { updatImageUser } from '../../redux/actions';
import { toAbsoluteUrl } from '../../utils/Assets';
import { sendNotification } from '@/utils/notificationapi';

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
const RoleManagement = () => {
    const [roles, setRoles] = useState([]); // State to hold roles fetched from API
    const [selectedRoles, setSelectedRoles] = useState([]); // State for selected roles
    const { userId, companyId } = useSelector(state => state.AuthReducerKey);
    const loguser = useSelector(state => state.AuthReducerKey);
    console.log(loguser, 'sss');
    const location = useLocation();
    const [permissions, setPermissions] = useState([]);
    const [menus, setMenus] = useState([]);
    const dispacth = useDispatch();
    // I have passed user id from previous page need to manage this if api not send data then we need to make the add new user
    const [usersId, setuserId] = useState(location.state?.userId ? location.state?.userId : 0);

    console.log('Userid', location.state?.userId);
    // Fetch menus and permissions
    const fetchMenus = async (roleID) => {
        try {
            const roleIdParam = roleID ? `&roleId=${roleID}` : '';
            const response = await axios.get(
                `${API_URL}/Role/GetMenuByUserRoles?userId=${usersId}${roleIdParam}`
            );

            if (response.status === 200) {
                setMenus(response.data);
                setPermissions(
                    response.data.map((menu) => ({
                        menuId: menu.menuId,
                        canView: menu.canView,
                        canEdit: menu.canEdit,
                        canDelete: menu.canDelete,
                    }))
                );
            } else {
                setError('Failed to fetch menus. Please try again.');
            }
        } catch (error) {
            console.error('Error fetching menus:', error);
            setError('An error occurred while fetching menus.');
        }
    };

    const handlePermissionToggle = (menuId, permissionType) => {
        setPermissions((prev) =>
            prev.map((perm) =>
                perm.menuId === menuId
                    ? { ...perm, [permissionType]: !perm[permissionType] }
                    : perm
            )
        );
    };

    const requestPayload = {
        userId: usersId,
        modifiedBy: userId,
        createdBy: userId,
        isDelete: false,
        permissions: permissions.map(permission => ({
            menuId: permission.menuId,
            canView: permission.canView,
            canEdit: permission.canEdit,
            canDelete: permission.canDelete
        }))
    };

    const savePermissions = async () => {
        try {
            const response = await axios.post(`${API_URL}/Role/SaveMenuWithPermissions`, requestPayload);
            if (response.data.success === true) {
                toast.success('Role updated successfully!');
            } else {
                setError("Failed to save menu with permissions. Please try again.");
            }
            fetchData();
        } catch (error) {
            console.error('Error saving permissions:', error);
        }
    };

    const [userData, setUserData] = useState({
        userID: null,
        companyId: null,
        imageName: null,
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        dateOfBirth: '',
    });

    // Fetch roles from the API
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get(`${API_URL}/Role/GetAllRoles/${companyId}`);
                const formattedRoles = response.data.map((role) => ({
                    value: role.roleID,
                    label: role.roleName,
                }));
                setRoles(formattedRoles);
            } catch (error) {
                toast.error('Failed to fetch roles. Please try again.');
                console.error('Error fetching roles:', error);
            }
        };

        fetchRoles();
    }, []);

    const [featureData, setFeatureData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    
    // Define fetchData as a reusable function
    const fetchData = async () => {
        try {
            setLoading(true); // Show loading state during fetch

            if (usersId !== 0) {
                // Fetch user data
                const userResponse = await axios.get(`${API_URL}/User/${usersId}`);
                console.log('User Data Response:', userResponse.data);

                const user = { ...userResponse.data };
                if (user.dateOfBirth) {
                    user.dateOfBirth = new Date(user.dateOfBirth).toISOString().split('T')[0];
                }
                setUserData(user);
                if(user.userID === loguser?.userId){
                    console.log('inside' + loguser.imageName);
                    dispacth(updatImageUser(user));
                }

                // Handle roleIds and roleNames
                if (user.roleIds && user.roleNames) {
                    const roleIds = user.roleIds.split(',');
                    const roleNames = user.roleNames.split(',');

                    const selectedRoles = roleIds.map((roleId, index) => ({
                        value: roleId,
                        label: roleNames[index],
                    }));

                    setSelectedRoles(selectedRoles);
                    fetchMenus(user.roleIds); // Call fetchMenus with roleIds
                }
            }

            // Fetch feature data
            const featureResponse = await axios.get(`${API_URL}/FeaturePermission/${companyId}/${usersId}`);
            console.log('Feature Data Response:', featureResponse.data);
            setFeatureData(featureResponse.data);
        } catch (err) {
            console.error('Error fetching data:', err);
            toast.error('Failed to fetch data.');
        } finally {
            setLoading(false); // Hide loading state after fetch
        }
    };

    // Call fetchData on component mount
    useEffect(() => {
        fetchData();
    }, [usersId]);

    // File upload and preview states
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];  // Get the first file from the input
        if (file) {
            // Check if the file is an image
            const isImage = file.type.startsWith('image/');
            // Check if the file size is greater than 3MB
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

            // If all validations pass, save the file to state and create a preview URL
            setFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    // Cleanup the preview URL when component unmounts or when a new file is selected
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleUpdateUserInfo = async () => {
        try {
            let errors = {};
            if (!userData.firstName.trim()) {
                errors.firstName = 'First Name is required.';
            }
            if (!userData.lastName.trim()) {
                errors.lastName = 'Last Name is required.';
            }          
            if (!userData.email.trim()) {
                errors.email = 'Email is required.';
            } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
                errors.email = 'Please enter a valid email address.';
            }
            if (!userData.dateOfBirth) {
                errors.dateOfBirth = 'Date of Birth is required.';
            }
            if (!userData.address) {
                errors.address = 'Address is required.';
            }
            if (!userData.dateOfBirth) {
                errors.dateOfBirth = 'Date of Birth is required.';
            } else {
                const today = new Date();
                const birthDate = new Date(userData.dateOfBirth);
                const age = today.getFullYear() - birthDate.getFullYear();
                if (age < 15) {
                    errors.dateOfBirth = 'You must be at least 15 years old.';
                }
            }
            if (Object.keys(errors).length > 0) {
                Object.values(errors).forEach(errorMessage => {
                    toast.error(errorMessage);
                });
                return;
            }
            const roles = selectedRoles.map((role) => role.value).join(','); 
            if (!roles) {
                errors.roles = 'roles is required.';
            } 
            const formData = new FormData();
            debugger;
            formData.append("userId", usersId === 0 ? 0 : userData.userID);
            formData.append("companyId", companyId);
            formData.append("firstName", userData.firstName);
            formData.append("lastName", userData.lastName);
            formData.append("email", userData.email);
            formData.append("dateOfBirth", userData.dateOfBirth);
            formData.append("address", userData.address || "");
            formData.append("roles", roles);
            formData.append("modifiedBy", userId);
            formData.append("logoImage", file);
            formData.append("password", "Test@123");
            formData.append("imageName", "");
            formData.append("imageUrl", "");
            formData.append("customField", "");
            formData.append("webSiteUrl", window.location.origin+"/metronic/tailwind/react");

            const response = await axios.post(`${API_URL}/User/UpdateUserDetail`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log('Returned UserId:', response);
            toast.success('User information updated successfully!');

            if (usersId === 0) {
                await sendNotification(
                    userId,
                    47,
                    'user creation notification',
                    'user created Successful',
                    '27',
                    userData.email
                );

                await sendNotification(
                    userId,
                    58,
                    'user with roles updated notification',
                    'user with roles updation Successful',
                    '13',
                    userData.email + '#' + roles
                );
            } else {
                await sendNotification(
                    userId,
                    58,
                    'user with roles updated notification',
                    'user with roles updation Successful',
                    '13',
                    userData.email + '#' + roles
                );
            }
            setuserId(response?.data);
            fetchData();
            setSuccessMessage('');
        } catch (error) {
            toast.error('Failed to update user information. Please try again.');
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
                        <ToolbarPageTitle text="User Management" />
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
                                            {[
                                                { key: 'email', label: 'Email' },
                                                { key: 'firstName', label: 'First Name' },
                                                { key: 'lastName', label: 'Last Name' },
                                                { key: 'address', label: 'Address' },
                                                { key: 'dateOfBirth', label: 'Date of Birth' },
                                            ].map(({ key, label }) => (
                                                <tr key={key}>
                                                    <td className="py-2 text-gray-600 font-normal capitalize">{label}</td>
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
                                            ))}
                                            <tr>
                                                <td className="py-2 text-gray-600 font-normal">Profile Image</td>
                                                <td className="py-2 text-gray-800 font-normal">
                                                    {/* If a new file is selected, show its preview; otherwise, show the existing image if available */}
                                                    {previewUrl ? (
                                                        <div className="mb-4">
                                                            <img 
                                                                src={previewUrl}
                                                                alt="Preview" 
                                                                className="w-32 h-32 object-cover"
                                                            />
                                                        </div>
                                                    ) : (
                                                        usersId !== 0 && userData.imageName && (
                                                            <div className="mb-4">
                                                                <img 
                                                                    src={toAbsoluteUrl(`/media/avatars/${userData.imageName}`)}
                                                                    alt="User Logo" 
                                                                    className="w-32 h-32 object-cover"
                                                                />
                                                            </div>
                                                        )
                                                    )}
                                                    <input 
                                                        type="file" 
                                                        name="logoImage"  
                                                        className="input input-bordered w-full" 
                                                        onChange={handleFileChange} 
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="py-2 text-gray-600 font-normal">Roles</td>
                                                <td className="py-2 text-gray-800 font-normal">
                                                    <Select
                                                        isMulti
                                                        options={roles}
                                                        value={selectedRoles}
                                                        onChange={setSelectedRoles}
                                                        placeholder="Select roles..."
                                                        className="w-full"
                                                    />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className="flex items-center justify-end mt-4">
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={handleUpdateUserInfo}
                                        >
                                            {usersId !== 0 ? 'Update Information' : 'Add User'}
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
                                <h3 className="card-title">Menu Permissions</h3>
                            </div>
                            <div className="card-table scrollable-x-auto pb-3" style={{ maxHeight: '600px', overflow: 'scroll' }}>
                                <Box>
                                    <Typography variant="h5" gutterBottom />
                                    {error && <Typography color="error">{error}</Typography>}
                                    <Paper>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Menu</TableCell>
                                                    <TableCell align="center">Can View</TableCell>
                                                    <TableCell align="center">Can Edit</TableCell>
                                                    <TableCell align="center">Can Delete</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {menus.map((menu) => (
                                                    <TableRow key={menu.menuId}>
                                                        <TableCell>{menu.menuName}</TableCell>
                                                        <TableCell align="center">
                                                            <Switch
                                                                checked={
                                                                    permissions.find((perm) => perm.menuId === menu.menuId)
                                                                        ?.canView || false
                                                                }
                                                                onChange={() => handlePermissionToggle(menu.menuId, 'canView')}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Switch
                                                                checked={
                                                                    permissions.find((perm) => perm.menuId === menu.menuId)
                                                                        ?.canEdit || false
                                                                }
                                                                onChange={() => handlePermissionToggle(menu.menuId, 'canEdit')}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Switch
                                                                checked={
                                                                    permissions.find((perm) => perm.menuId === menu.menuId)
                                                                        ?.canDelete || false
                                                                }
                                                                onChange={() => handlePermissionToggle(menu.menuId, 'canDelete')}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </Paper>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={savePermissions}
                                        sx={{ mt: 2 }}
                                    >
                                        Save Permissions
                                    </Button>
                                </Box>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </>
    );
};

export default RoleManagement;
