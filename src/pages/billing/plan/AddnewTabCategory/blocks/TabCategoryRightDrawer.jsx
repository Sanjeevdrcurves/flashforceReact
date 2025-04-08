import  { useState, useEffect } from "react";
import "./RightDrawer.css";
import { KeenIcon } from "@/components";
import {   TextField, MenuItem, Select, Button, Switch, FormControlLabel } from "@mui/material";
import axios from "axios";
import { toast } from 'sonner';
import { sendNotification } from '@/utils/notificationapi';
const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const TabCategoryRightDrawer = ({ isDrawerOpen, onClose, fetchTableData, selectedItem, companyId, userId }) => {
    const [formValues, setFormValues] = useState({

        tagCategoryName: "",
        isActive: true,
    });

    const [error, setError] = useState(null);



    useEffect(() => {
        if (selectedItem) {
            console.log('selectedItem:', JSON.stringify(selectedItem));
            setFormValues({
                tagCategoryName: selectedItem.tagCategoryName || "",
                isActive: selectedItem.isActive === "Yes" || selectedItem.isActive === true,
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
            !formValues.tagCategoryName //||
            //formValues.parentID === "Select Parent Menu" ||
           // formValues.featureName === "Select Feature Name" ||
            
          //  !formValues.isActive
        ) {
            setError("Please fill out all required fields.");
            return;
        }


       
        const id= selectedItem ? selectedItem.id : undefined;
        const  tagCategoryName=  formValues.tagCategoryName;
         const createdBy=  userId;
        // const createdDate=  new Date().toISOString();
        const  modifiedBy=  userId;
        // const modifiedDate=  new Date().toISOString();
                   
        const isActive=  formValues.isActive;
        try {
            if (selectedItem) {
                const response = await axios.put(`${API_URL}/TagCategory/UpdateTagCategory?id=${id}&tagCategory=${tagCategoryName}&isActive=${isActive}&modifiedBy=${modifiedBy}`);
             //   alert(JSON.stringify(response));
                if (response.message ==="TagCategory updated successfully") {
                    

                    toast.success('Tag Category updated successfully!');
                    
// Send Notification
// await sendNotification(
//     userId,
//      44, // Assuming 44 is the notification setting ID for the menu uupdate
//      'Menu update notification',
//      'Menu updation Successful',
//      '30',
//      formValues.menuName
//    );
                } else {
                    setError("Failed to update tag category. Please try again.");
                }
            } else {
const response = await axios.post(`${API_URL}/TagCategory/InsertTagCategory?tagCategory=${tagCategoryName}&companyId=${companyId}&createdBy=${createdBy}`);
                if (response.message === "Tag Category created successfully") {
                    // alert("Feature added successfully!");

            // Send Notification
            // await sendNotification(
            //     userId,
            //     45, // Assuming 45 is the notification setting ID for the menu created
            //     'Menu insert notification',
            //     'Menu insertion Successful',
            //     '29',
            //     formValues.menuName
            // );

                    toast.success('Tag Category added successfully!');
                } else {
                    setError("Failed to add Tag Category. Please try again.");
                }
            }

            HandleDrawerClose();
            fetchTableData();
        } catch (error) {
            console.error("Error submitting Tag Category:", error);
            setError("An error occurred while submitting. Please try again later.");
        }
    };


    const HandleDrawerClose = () => {
        setFormValues({
            tagCategoryName: "",           
            isActive: false
        });
        setError(null);
        onClose();
    };

    return (
        <div className={`right-drawer ${isDrawerOpen ? "open" : ""}`}>
            <div className="drawer-header flex justify-between items-center p-4 bg-gray-100 border-b">
                <h2 className="text-lg font-bold text-gray-900">   {selectedItem ? "Update Tag Category" : "Add Tag Category"}</h2>
 
                <button onClick={HandleDrawerClose} className="btn btn-icon text-gray-500 hover:text-red-500">
                    <KeenIcon icon="cross" />
                </button>
            </div>
            <div className="drawer-body p-4">
                <form className="space-y-4" onSubmit={HandleSubmit}>
                  



                    <TextField
                        label="Tag Category Name"
                        variant="outlined"
                        fullWidth
                        name="tagCategoryName"
                        value={formValues.tagCategoryName}
                        onChange={HandleInputChange}
                        required
                    />
                 
                    <FormControlLabel
                        control={<Switch checked={formValues.isActive} onChange={HandleToggleChange("isActive")} />}
                        label="Is Active"
                    />
                  
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button variant="contained" color="primary" fullWidth type="submit">
                        {selectedItem ? "Update Tag Category" : "Add Tag Category"}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export { TabCategoryRightDrawer };
