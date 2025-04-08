import React, { useState, useEffect } from "react";
import "./RightDrawer.css";
import { KeenIcon } from "@/components";
import { Autocomplete, Chip, TextField, MenuItem, Select, Button, Switch, FormControlLabel } from "@mui/material";
import axios from "axios";
import { toast } from 'sonner';
import { useLocation } from "react-router";
import { sendNotification } from '@/utils/notificationapi';

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const RightDrawer = ({ isDrawerOpen, onClose, fetchTableData, selectedItem, companyId, userId }) => {
    
    
    const [formValues, setFormValues] = useState({
        featuresName: "",
        description: "",
        // numberOfUsers: "",
        status: "Select Status",
        plans: [],
        additionalInfo: "",
        isMenuShow: false,
        path: "",
        icon: "",
        featureType: "Select Feature Type",
        isTooltip: false,
        tooltip: "",
        featureCategory: "Select Feature Category"
    });

    const [plansOptions, setPlansOptions] = useState([]);
    const [featureCategories, setFeatureCategories] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await axios.get(`${API_URL}/PlanConfiguration/GetAllPlansByCompanyId/${companyId}`);
                if (response.data) {
                    setPlansOptions(response.data.map(plan => ({ label: plan.planName, id: plan.planID })));
                }
            } catch (error) {
                console.error("Error fetching plans:", error);
            }
        };

        const fetchFeatureCategories = async () => {
            try {
                const response = await axios.get(`${API_URL}/Feature/GetFeatureCategories`);
                if (response.data) {
                    setFeatureCategories(response.data);
                }
            } catch (error) {
                console.error("Error fetching feature categories:", error);
            }
        };

        fetchPlans();
        fetchFeatureCategories();
    }, []);

    useEffect(() => {
        if (selectedItem) {
            
            console.log('selectedItem:', JSON.stringify(selectedItem));
            setFormValues({
                featuresName: selectedItem.featureName || "",
                description: selectedItem.description || "",
                status: selectedItem.status || "",
                // plans: selectedItem.planId
                // ? selectedItem.planId.map((planId) => {
                //       // Match the planId with plansOptions to find the correct label
                //       const matchedPlan = plansOptions.find(plan => plan.id === planId);
                //       return matchedPlan ? matchedPlan : { id: planId, label: "" };
                //   })
                // : [],
                // plans: selectedItem.planId
                //     ? selectedItem.planId.map(planId => ({
                //           label: selectedItem.plans.find(name => name),
                //           id: "",
                //       }))
                //     : [],
                     plans : selectedItem.planId
  ? selectedItem.planId.map((planId, index) => ({
    label: selectedItem.plans[index], // Map each plan name
    id: planId,                      // Map each plan ID
  }))
  : [],
                additionalInfo: selectedItem.additionalInfo || "",
                // isToggle: 
                //     selectedItem.isToggle === "Yes" || selectedItem.isToggle === true,

                  //  isMenuShow: selectedItem.isMenuShow==="Yes" || selectedItem.isMenuShow === true,
                    path: selectedItem.path || "",
                    icon: selectedItem.icon || "",
                    featureType: selectedItem.featureType || "Select Feature Type",
               // isTooltip: 
                 //   selectedItem.isTooltip === "Yes" || selectedItem.isTooltip === true,
              //  tooltip: selectedItem.tooltip || "",
                featureCategory: selectedItem.featureCategoryId || "",
            });
        }
        
    }, [selectedItem]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const handleToggleChange = (name) => (e) => {
        setFormValues({
            ...formValues,
            [name]: e.target.checked,
        });
    };

    const handlePlansChange = (event, value) => {
        setFormValues({ ...formValues, plans: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Validation for required fields
        if (
            !formValues.featuresName || 
            !formValues.description || 
            formValues.status === "Select Status" ||
            formValues.featureCategory === "Select Feature Category" ||
            formValues.featureType === "Select Feature Type"
        ) {
            setError("Please fill out all required fields and make valid selections.");
            return;
        }
    
        // if (formValues.plans.length === 0) {
        //     setError("Please select at least one plan.");
        //     return;
        // }
    
        const planIds = formValues.plans.map(plan => plan.id).join(",");
    
        const requestPayload = {
            id: selectedItem ? selectedItem.id : undefined,
            name: formValues.featuresName,
            description: formValues.description,
            isActive: formValues.status === "Active",
            createdBy: userId,
            createdDate: new Date().toISOString(),
            modifiedBy: userId,
            modifiedDate: new Date().toISOString(),
            planId: planIds,
            companyId,
            additionalInfo: formValues.additionalInfo || undefined,
          //  isMenuShow: formValues.isMenuShow,
          isMenuShow:false,
            path: formValues.path,
            icon: formValues.icon,
            featureType: formValues.featureType,
           // isToggle: formValues.isToggle,
           // isTooltip: formValues.isTooltip,
           isTooltip:false,
          //  tooltip: formValues.tooltip,
          tooltip: "",
            featureCategoryId: formValues.featureCategory,
        };
    
        try {
            if (selectedItem) {
                const response = await axios.put(`${API_URL}/Feature/UpdateFeature/${selectedItem.id}`, requestPayload);
                if (response.status === 204) {
                    // alert("Feature updated successfully!");
//alert(formValues.status);

if( formValues.status === "Active"){
                    // Send Notification
await sendNotification(
    userId,
     50, // Assuming 44 is the notification setting ID for the menu uupdate
     'Feature activate notification',
     'feature activation Successful',
     '35',
     formValues.featuresName
   );
}
else{
                     // Send Notification
await sendNotification(
    userId,
     51, // Assuming 44 is the notification setting ID for the menu uupdate
     'Feature deactivate notification',
     'feature deactivation Successful',
     '36',
     formValues.featuresName
   );
}
                    toast.success('Feature updated successfully!');
                    fetchTableData();
                } else {
                    setError("Failed to update feature. Please try again.");
                }
            } else {
                const response = await axios.post(`${API_URL}/Feature/InsertFeature`, requestPayload);
                if (response.status === 201) {
                   // alert("Feature added successfully!");
                    toast.success('Feature added successfully!');
                } else {
                    setError("Failed to add feature. Please try again.");
                }
            }
    
            handleDrawerClose();
            fetchTableData();
        } catch (error) {
            console.error("Error submitting feature:", error);
            setError("An error occurred while submitting. Please try again later.");
        }
    };
    

    const handleDrawerClose = () => {
        setFormValues({
            featuresName: "",
            description: "",
            //numberOfUsers: "",
            status: "Select Status",
            plans: [],
            additionalInfo: "",
            isMenuShow: false,
            path: "",
            icon: "",
            featureType: "Select Feature Type",
            //isToggle: false,
            isTooltip: false,
            tooltip: "",
            featureCategory: "Select Feature Category",
        });
        setError(null);
        onClose();
    };

    return (
        <div className={`right-drawer ${isDrawerOpen ? "open" : ""}`}>
            <div className="drawer-header flex justify-between items-center p-4 bg-gray-100 border-b">
                <h2 className="text-lg font-bold text-gray-900">Add New Feature</h2>
                <button onClick={handleDrawerClose} className="btn btn-icon text-gray-500 hover:text-red-500">
                    <KeenIcon icon="cross" />
                </button>
            </div>
            <div className="drawer-body p-4">
                <form className="space-y-4" onSubmit={handleSubmit}>
                <Select
                        fullWidth
                        name="featureType"
                        value={formValues.featureType || ""}
                        onChange={handleInputChange}
                        required
                    >
                        <MenuItem value="Select Feature Type">Select Feature Type</MenuItem>
                        <MenuItem value="Checkbox">Check box</MenuItem>
                        <MenuItem value="addon">add on</MenuItem>
                        <MenuItem value="usage">usage</MenuItem>
                    </Select>
                    {formValues.featureType === "Select Feature Type" && error && (
                        <p className="text-red-500 text-sm">Please select a valid feature type.</p>
                    )}

                <Select
    fullWidth
    name="featureCategory"
    value={formValues.featureCategory || ""}
    onChange={handleInputChange}
>
    <MenuItem value="Select Feature Category">Select Feature Category</MenuItem>
    {featureCategories.map((category) => (
          <MenuItem key={category.id} value={String(category.id)}>
            {category.featureCategory}
        </MenuItem>
    ))}
</Select>
{formValues.featureCategory === "Select Feature Category" && error && (
    <p className="text-red-500 text-sm">Please select a valid feature category.</p>
)}

                    <TextField
                        label="Feature Name"
                        variant="outlined"
                        fullWidth
                        name="featuresName"
                        value={formValues.featuresName}
                        onChange={handleInputChange}
                        className="input input-bordered w-full"
                        required
                    />
                    <TextField
                        label="Description"
                        variant="outlined"
                        fullWidth
                        name="description"
                        value={formValues.description}
                        onChange={handleInputChange}
                        
                        required
                    />
                    {/* <TextField
                        label="Number of Users"
                        variant="outlined"
                        fullWidth
                        name="numberOfUsers"
                        value={formValues.numberOfUsers}
                        onChange={handleInputChange}
                        type="number"
                        required
                    /> */}
                   <Select
    fullWidth
    name="status"
    value={formValues.status}
    onChange={handleInputChange}
    required
>
    <MenuItem value="Select Status">Select Status</MenuItem>
    <MenuItem value="Active">Active</MenuItem>
    <MenuItem value="Inactive">Inactive</MenuItem>
</Select>
{formValues.status === "Select Status" && error && (
    <p className="text-red-500 text-sm">Please select a valid status.</p>
)}
<Autocomplete
    multiple
    options={plansOptions}
    getOptionLabel={(option) => option.label || ""}
    value={formValues.plans}
    onChange={(event, newValue) => {
        // Map the new selected value to include both planId and planName
        const updatedPlans = newValue.map((plan) => ({
            id: plan.id,
            label: plan.label, // plan name
        }));

        // Update the plans in the form values
        setFormValues((prevState) => ({
            ...prevState,
            plans: updatedPlans,
        }));
    }}
    renderTags={(value, getTagProps) =>
        value.map((option, index) => (
            <Chip
                key={option.id}
                variant="outlined"
                label={option.label}
                {...getTagProps({ index })}
            />
        ))
    }
    renderInput={(params) => <TextField {...params} variant="outlined" placeholder="Select Plans" />}
/>


                    <TextField
                        label="Additional Info"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        name="additionalInfo"
                        value={formValues.additionalInfo}
                        onChange={handleInputChange}
                    />
                    <TextField
    label="Feature Path"
    variant="outlined"
    fullWidth
    name="path"
    value={formValues.path}
    onChange={handleInputChange}
/>

<TextField
    label="Feature Icon"
    variant="outlined"
    fullWidth
    name="icon"
    value={formValues.icon}
    onChange={handleInputChange}
/>
                    {/* <FormControlLabel
                        control={<Switch checked={formValues.isMenuShow} onChange={handleToggleChange("isMenuShow")} />}
                        label="Is Menu Show"
                    />
                    <FormControlLabel
                        control={<Switch checked={formValues.isTooltip} onChange={handleToggleChange("isTooltip")} />}
                        label="Is Tooltip"
                    /> */}
                    {/* {formValues.isTooltip && (
                        <TextField
                            label="Tooltip"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={2}
                            name="tooltip"
                            value={formValues.tooltip}
                            onChange={handleInputChange}
                        />
                    )} */}
                    
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button variant="contained" color="primary" fullWidth type="submit">
                        {selectedItem ? "Update Feature" : "Add Feature"}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export { RightDrawer };
