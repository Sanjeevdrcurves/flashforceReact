import  { useState, useEffect } from "react";
import "./RightDrawer.css";
import { KeenIcon } from "@/components";
import {   TextField, MenuItem, Select, Button, Switch, FormControlLabel } from "@mui/material";
import axios from "axios";
import { toast } from 'sonner';
import { sendNotification } from '@/utils/notificationapi';
const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const TagRightDrawer = ({ isDrawerOpen, onClose, fetchTableData, selectedItem, companyId, userId }) => {
    const [formValues, setFormValues] = useState({
        tagName:"",
        tagCategoryId: "Select Tag Category",
        description:""
    });
 const [tagCategory, settagCategory] = useState([]);
    const [error, setError] = useState(null);

 useEffect(() => {
        
        const FetchTagCategory = async () => {

            try {
                const response = await axios.get(`${API_URL}/TagCategory/GetTagCategoryByCompanyId/${companyId}`);
                if (response.data) {
                    //alert(JSON.stringify(formValues.featureName ));
                    const filteredMenus = response.data.filter(
                        (menu) =>
                            menu.id == formValues.tagCategoryId 
                    );
                    settagCategory(response.data);
                }
              
                console.log(JSON.stringify(response.data));
            } catch (error) {
                console.error('Error fetching Tag Categories:', error);
            }
        };

        // Trigger fetch when featureName changes
        if (formValues.tagCategoryId && formValues.tagCategoryId !== "Select Tag Category") {
            FetchTagCategory();
        }
        FetchTagCategory();
    }, [formValues.tagCategoryId]);

    useEffect(() => {
        if (selectedItem) {
            console.log('selectedItem:', JSON.stringify(selectedItem));
            setFormValues({tagName: selectedItem.tagName || "",
                tagCategoryId: selectedItem.tagCategoryId || "Select Tag Category"
                ,description:selectedItem.description||""
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
        if ( !formValues.tagName ||
            formValues.tagCategoryId=== "Select Tag Category"||
            //formValues.parentID === "Select Parent Menu" ||
           // formValues.featureName === "Select Feature Name" ||
            
          !formValues.description
        ) {
            setError("Please fill out all required fields.");
            return;
        }


       
        const id= selectedItem ? selectedItem.id : undefined;
        const  tagName=  formValues.tagName;
        const  description=  formValues.description;
        const  tagCategoryId=  formValues.tagCategoryId;
         const createdBy=  userId;
        // const createdDate=  new Date().toISOString();
        const  modifiedBy=  userId;
        // const modifiedDate=  new Date().toISOString();
                   
        try {
            if (selectedItem) {
                const response = await axios.post(`${API_URL}/Tag/UpdateTag?tagId=${id}&tagName=${tagName}&tagCategoryId=${tagCategoryId}&description=${description}&modifiedBy=${modifiedBy}`);
             //   alert(JSON.stringify(response));
                if (response.message ==="Tag updated successfully") {                  

                    toast.success('Tag  updated successfully!');
                    
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
                    setError("Failed to update tag. Please try again.");
                }
            } else {
const response = await axios.post(`${API_URL}/Tag/InsertTag?tagName=${tagName}&tagCategoryId=${tagCategoryId}&description=${description}&createdBy=${createdBy}`);
                if (response.message === "Tag created successfully") {
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

                    toast.success('Tag added successfully!');
                } else {
                    setError("Failed to add Tag. Please try again.");
                }
            }

            HandleDrawerClose();
            fetchTableData();
        } catch (error) {
            console.error("Error submitting Tag:", error);
            setError("An error occurred while submitting. Please try again later.");
        }
    };


    const HandleDrawerClose = () => {
        setFormValues({
            tagCategoryId: "Select Tag Category",  
            tagName:"",   
            description:""      
        });
        setError(null);
        onClose();
    };

    return (
        <div className={`right-drawer ${isDrawerOpen ? "open" : ""}`}>
            <div className="drawer-header flex justify-between items-center p-4 bg-gray-100 border-b">
                <h2 className="text-lg font-bold text-gray-900">   {selectedItem ? "Update Tag" : "Add Tag"}</h2>
 
                <button onClick={HandleDrawerClose} className="btn btn-icon text-gray-500 hover:text-red-500">
                    <KeenIcon icon="cross" />
                </button>
            </div>
            <div className="drawer-body p-4">
                <form className="space-y-4" onSubmit={HandleSubmit}>
                  
                        <Select
                        fullWidth
                        name="tagCategoryId"
                        value={formValues.tagCategoryId || ""}
                        onChange={HandleInputChange}
                    >
                        <MenuItem value="Select Tag Category">Select Tag Category</MenuItem>
                        {tagCategory.map((category) => (
                            <MenuItem key={category.id} value={String(category.id)}>
                                {category.tagCategoryName}
                            </MenuItem>
                        ))}
                    </Select>


                    <TextField
                        label="Tag Name"
                        variant="outlined"
                        fullWidth
                        name="tagName"
                        value={formValues.tagName}
                        onChange={HandleInputChange}
                        required
                    />
                  <TextField
                        label="Tag Description"
                        variant="outlined"
                        fullWidth
                        name="description"
                        value={formValues.description}
                        onChange={HandleInputChange}
                        required
                    />
                    {/* <FormControlLabel
                        control={<Switch checked={formValues.isActive} onChange={HandleToggleChange("isActive")} />}
                        label="Is Active"
                    /> */}
                  
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button variant="contained" color="primary" fullWidth type="submit">
                        {selectedItem ? "Update Tag" : "Add Tag"}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export { TagRightDrawer };
