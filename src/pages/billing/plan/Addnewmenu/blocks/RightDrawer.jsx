import React, { useState, useEffect } from "react";
import "./RightDrawer.css";
import { KeenIcon } from "@/components";
import { Autocomplete, Chip, TextField, MenuItem, Select, Button, Switch, FormControlLabel } from "@mui/material";
import axios from "axios";
import { toast } from 'sonner';
import { sendNotification } from '@/utils/notificationapi';
const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const RightDrawer = ({ isDrawerOpen, onClose, fetchTableData, selectedItem, companyId, userId }) => {
    const [formValues, setFormValues] = useState({

        menuName: "",
        parentID: "Select Parent Menu",
        isDefault: false,
        url: "",
        icon: "",
        featureName: "Select Feature Name",
        isHorizontalVisible: false,
        orderBy: ""
    });

    const [plansOptions, setPlansOptions] = useState([]);
    const [parentMenu, setParentMenu] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const FetchPlans = async () => {
            try {
                const response = await axios.get(`${API_URL}/Feature/GetAllFeaturesByCompany/${companyId}`);
                if (response.data) {
                    setPlansOptions(response.data);
                }
            } catch (error) {
                console.error("Error fetching features:", error);
            }
        };


        const FetchParentMenus = async () => {

            try {
                const response = await axios.get(`${API_URL}/Menu/GetMenuByCompanyId/${companyId}/${userId}`);
                if (response.data) {
                    //alert(JSON.stringify(formValues.featureName ));
                    const filteredMenus = response.data.filter(
                        (menu) =>
                            menu.featureID == formValues.featureName || (!menu.parentID || menu.parentID == null||(menu.parentID==null&&menu.featureName==null))
                    );
                    setParentMenu(filteredMenus);
                }
                //   // Format the API response to match tableData structure
                //   const formattedData = response?.data?.map((item) => ({
                //     menuId: item.menuId,
                //     menuName: item.menuName,
                //     parentID: item.parentID,
                //     isDefault: item.isDefault ? 'Yes' : 'No',
                //     url: item.url,
                //     featureName: item.featureName || 'Uncategorized',
                //     featureID:item.featureID,
                //     isHorizontalVisible: item.isHorizontalVisible ? 'Yes' : 'No',
                //     companyId:item.companyId,
                //     orderBy:item.orderBy
                //   }));
                console.log(JSON.stringify(response.data));
            } catch (error) {
                console.error('Error fetching Parent menus:', error);
            }
        };

        // Trigger fetch when featureName changes
        if (formValues.featureName && formValues.featureName !== "Select Feature Name") {
            FetchParentMenus();
        }
        FetchPlans();
        FetchParentMenus();
    }, [formValues.featureName]);

    useEffect(() => {
        if (selectedItem) {
            console.log('selectedItem:', JSON.stringify(selectedItem));
            setFormValues({
                menuName: selectedItem.menuName || "",
                parentID: selectedItem.parentID || "Select Parent Menu",
                url: selectedItem.url || "", icon: selectedItem.icon || "",
                isHorizontalVisible: selectedItem.isHorizontalVisible === "Yes" || selectedItem.isHorizontalVisible === true,
                isDefault: selectedItem.isDefault === "Yes" || selectedItem.isDefault === true,
                orderBy: selectedItem.orderBy || "",
                featureName: selectedItem.featureID || "Select Feature Name",
            });
        }

    }, [selectedItem]);

    const HandleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const HandleToggleChange = (name) => (e) => {
        setFormValues({
            ...formValues,
            [name]: e.target.checked,
        });
    };



    const HandleSubmit = async (e) => {
        e.preventDefault();

        // Validation for required fields
        if (
            !formValues.menuName ||
            //formValues.parentID === "Select Parent Menu" ||
           // formValues.featureName === "Select Feature Name" ||
            
            !formValues.orderBy
        ) {
            setError("Please fill out all required fields and make valid selections.");
            return;
        }


        const requestPayload = {
            menuId: selectedItem ? selectedItem.menuId : undefined,
            menuName: formValues.menuName,
            parentID: formValues.parentID === "Select Parent Menu"  ? null:formValues.parentID ,
            createdBy: userId,
            createdDate: new Date().toISOString(),
            modifiedBy: userId,
            modifiedDate: new Date().toISOString(),
            companyId,
            isHorizontalVisible: formValues.isHorizontalVisible,
            url: formValues.url,
            icon: formValues.icon,
            orderBy: formValues.orderBy,
            featureID: formValues.featureName === "Select Feature Name" ?null:formValues.featureName,
            featureName: "feature",
            isDefault: formValues.isDefault
        };

        try {
            if (selectedItem) {
                const response = await axios.put(`${API_URL}/Menu/UpdateMenu/`, requestPayload);
             //   alert(JSON.stringify(response));
                if (response.status ===200) {
                    

                    toast.success('Menu updated successfully!');
                    
// Send Notification
await sendNotification(
    userId,
     44, // Assuming 44 is the notification setting ID for the menu uupdate
     'Menu update notification',
     'Menu updation Successful',
     '30',
     formValues.menuName
   );
                } else {
                    setError("Failed to update menu. Please try again.");
                }
            } else {
                const response = await axios.post(`${API_URL}/Menu/InsertMenu`, requestPayload);
                if (response.status === 200) {
                    // alert("Feature added successfully!");

            // Send Notification
            await sendNotification(
                userId,
                45, // Assuming 45 is the notification setting ID for the menu created
                'Menu insert notification',
                'Menu insertion Successful',
                '29',
                formValues.menuName
            );

                    toast.success('Menu added successfully!');
                } else {
                    setError("Failed to add menu. Please try again.");
                }
            }

            HandleDrawerClose();
            fetchTableData();
        } catch (error) {
            console.error("Error submitting feature:", error);
            setError("An error occurred while submitting. Please try again later.");
        }
    };


    const HandleDrawerClose = () => {
        setFormValues({
            menuName: "",
            parentID: "Select Parent Menu",
            isDefault: false,
            url: "",
            icon: "",
            featureName: "Select Feature Name",
            isHorizontalVisible: false,
            orderBy: ""
        });
        setError(null);
        onClose();
    };

    return (
        <div className={`right-drawer ${isDrawerOpen ? "open" : ""}`}>
            <div className="drawer-header flex justify-between items-center p-4 bg-gray-100 border-b">
                <h2 className="text-lg font-bold text-gray-900">   {selectedItem ? "Update Menu" : "Add Menu"}</h2>
 
                <button onClick={HandleDrawerClose} className="btn btn-icon text-gray-500 hover:text-red-500">
                    <KeenIcon icon="cross" />
                </button>
            </div>
            <div className="drawer-body p-4">
                <form className="space-y-4" onSubmit={HandleSubmit}>
                    <Select
                        fullWidth
                        name="featureName"
                        value={formValues.featureName || ""}
                        onChange={HandleInputChange}
                    >
                        <MenuItem value="Select Feature Name">Select Feature Name</MenuItem>
                        {plansOptions.map((category) => (
                            <MenuItem key={category.id} value={String(category.id)}>
                                {category.name}
                            </MenuItem>
                        ))}
                    </Select>
                    {/* {formValues.featureName === "Select Feature Name" && error && (
                        <p className="text-red-500 text-sm">Please select a valid feature Name.</p>
                    )} */}



                    <Select
                        fullWidth
                        name="parentID"
                        value={formValues.parentID || ""}
                        onChange={HandleInputChange}
                    >
                        <MenuItem value="Select Parent Menu">Select Parent Menu</MenuItem>
                        {parentMenu.map((category) => (
                            <MenuItem key={category.menuId} value={String(category.menuId)}>
                                {category.menuName}
                            </MenuItem>
                        ))}
                    </Select>
                    {/* {formValues.parentID === "Select Parent Menu" && error && (
                        <p className="text-red-500 text-sm">Please select a valid Parent Menu.</p>
                    )} */}
                    <TextField
                        label="Menu Name"
                        variant="outlined"
                        fullWidth
                        name="menuName"
                        value={formValues.menuName}
                        onChange={HandleInputChange}
                        required
                    />
                    <TextField
                        label="URL"
                        variant="outlined"
                        fullWidth
                        name="url"
                        value={formValues.url}
                        onChange={HandleInputChange}
                    />
                    <TextField
                        label="icon"
                        variant="outlined"
                        fullWidth
                        name="icon"
                        value={formValues.icon}
                        onChange={HandleInputChange}
                    />
                    <TextField
                        label="Order By"
                        variant="outlined"
                        fullWidth
                        name="orderBy"
                        value={formValues.orderBy}
                        onChange={HandleInputChange}
                    />

                    <FormControlLabel
                        control={<Switch checked={formValues.isDefault} onChange={HandleToggleChange("isDefault")} />}
                        label="Is Default"
                    />
                    <FormControlLabel
                        control={<Switch checked={formValues.isHorizontalVisible} onChange={HandleToggleChange("isHorizontalVisible")} />}
                        label="Is Horizontal Visible"
                    />

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button variant="contained" color="primary" fullWidth type="submit">
                        {selectedItem ? "Update Menu" : "Add Menu"}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export { RightDrawer };
