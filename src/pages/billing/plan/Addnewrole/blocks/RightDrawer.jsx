import React, { useState, useEffect } from "react";
import "./RightDrawer.css";
import { KeenIcon } from "@/components";
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Switch } from "@mui/material";
import axios from "axios";
import { toast } from 'sonner';
import { sendNotification } from '@/utils/notificationapi';

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const RightDrawer = ({ isDrawerOpen, onClose, fetchTableData, selectedItem, companyId, userId }) => {
    const [formValues, setFormValues] = useState({
        roleName: "",
    });
    const [menus, setMenus] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [error, setError] = useState(null);
 // Fetch menus for the role
 const fetchMenus = async () => {
    try {
        const roleIdParam = selectedItem && selectedItem.roleID ? `&roleId=${selectedItem.roleID}` : '';

        const response = await axios.get(`${API_URL}/Role/GetMenuByUser?userId=${userId}${roleIdParam}`);
        if (response.status === 200) {
            setMenus(response.data);
            setPermissions(response.data.map(menu => ({
                menuId: menu.menuId,
                canView: menu.canView,
                canEdit: menu.canEdit,
                canDelete: menu.canDelete
            })));
        } else {
            setError("Failed to fetch menus. Please try again.");
        }
    } catch (error) {
        console.error("Error fetching menus:", error);
        setError("An error occurred while fetching menus.");
    }
};

    useEffect(() => {
        if (selectedItem) {
            setFormValues({
                roleName: selectedItem.roleName || "",
            });
        }
        // for testing
        //const userId = 1;
       
        fetchMenus();
    }, [selectedItem, userId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const handlePermissionChange = (menuId, permissionType) => {
        const updatedPermissions = permissions.map(permission =>
            permission.menuId === menuId
                ? { ...permission, [permissionType]: !permission[permissionType] }
                : permission
        );
        setPermissions(updatedPermissions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(formValues.roleName.toLowerCase().trim()=='admin'){
                toast.error('Admin Role cannot be altered.');
                return;
        }
        if (!formValues.roleName) {
           // setError("Please fill the required field.");
            toast.error('Role name is required.');
            return;
        }

        const requestPayload = {
            roleID: selectedItem ? selectedItem.roleID : null,  // Use null instead of 0
            roleName: formValues.roleName,
            modifiedBy: userId,
            createdBy: userId,
            isDelete: false,
            companyId:companyId,
            permissions: permissions.map(permission => ({
                menuId: permission.menuId,
                canView: permission.canView,
                canEdit: permission.canEdit,
                canDelete: permission.canDelete
            }))
        };

        try {
            const response = await axios.post(`${API_URL}/Role/SaveRoleWithPermissions`, requestPayload);
            if (response.status === 201 || response.status === 200) {
               
                const rrol=selectedItem ? selectedItem.roleID : null;
if(rrol==null){
                // Send Notification
await sendNotification(
    userId,
     48, // Assuming 48 is the notification setting ID for the Role insertion
     'Role insert notification',
     'Role insertion Successful',
     '11',
     formValues.roleName
   );
}
else{
    // Send Notification
await sendNotification(
    userId,
     49, // Assuming 49 is the notification setting ID for the role updation
     'Role update notification',
     'Role updation Successful',
     '12',
     formValues.roleName
   );
}
                toast.success(selectedItem ? 'Role updated successfully!' : 'Role added successfully!');
            } else {
                toast.error("Failed to save role with permissions. Please try again.");
            }

            handleDrawerClose();
            fetchTableData();
        } catch (error) {
            console.error("Error submitting role with permissions:", error);
            toast.error("An error occurred while submitting. Please try again later.");
        }
    };

    const handleDrawerClose = () => {
        setFormValues({
            roleName: "",
        });
        setPermissions([]);
        setError(null);
        onClose();
        fetchMenus();
    };

    return (
        <div className={`right-drawer ${isDrawerOpen ? "open" : ""}`}>
            <div className="drawer-header flex justify-between items-center p-4 bg-gray-100 border-b">
                <h2 className="text-lg font-bold text-gray-900">{selectedItem ? "Update Role" : "Add New Role"}</h2>
                <button onClick={handleDrawerClose} className="btn btn-icon text-gray-500 hover:text-red-500">
                    <KeenIcon icon="cross" />
                </button>
            </div>
            <div className="drawer-body p-4">
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <TextField
                        label="Role Name"
                        variant="outlined"
                        fullWidth
                        name="roleName"
                        value={formValues.roleName}
                        onChange={handleInputChange}
                        required
                    />

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    {/* Menu Permissions Table */}
                    <TableContainer  style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Menu Name</TableCell>
                                    <TableCell>Can View</TableCell>
                                    <TableCell>Can Edit</TableCell>
                                    <TableCell>Can Delete</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {menus.map(menu => (
                                    <TableRow key={menu.menuId}>
                                        <TableCell>{menu.menuName}</TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={permissions.find(p => p.menuId === menu.menuId)?.canView || false}
                                                onChange={() => handlePermissionChange(menu.menuId, 'canView')}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={permissions.find(p => p.menuId === menu.menuId)?.canEdit || false}
                                                onChange={() => handlePermissionChange(menu.menuId, 'canEdit')}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={permissions.find(p => p.menuId === menu.menuId)?.canDelete || false}
                                                onChange={() => handlePermissionChange(menu.menuId, 'canDelete')}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Button variant="contained" color="primary" fullWidth type="submit">
                        {selectedItem ? "Update Role" : "Add Role"}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export { RightDrawer };
