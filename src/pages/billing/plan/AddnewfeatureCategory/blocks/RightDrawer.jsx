import React, { useState, useEffect } from "react";
import "./RightDrawer.css";
import { KeenIcon } from "@/components";
import { Autocomplete, Chip, TextField, MenuItem, Select, Button, Switch, FormControlLabel } from "@mui/material";
import axios from "axios";
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const RightDrawer = ({ isDrawerOpen, onClose, fetchTableData, selectedItem, companyId, userId }) => {
    const [formValues, setFormValues] = useState({
        
        featureCategory: ""
    });
   // const {companyId,userId}  = useSelector(state => state.AuthReducerKey);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (selectedItem) {
            console.log('selectedItem:', JSON.stringify(selectedItem));
            setFormValues({
                featureCategory: selectedItem.featureCategory || "",
            
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

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Validation for required fields
        if (
            !formValues.featureCategory 
        ) {
            setError("Please fill the required field.");
            return;
        }
        const requestPayload = {
            id: selectedItem ? selectedItem.id : undefined,          
            featureCategoryName: formValues.featureCategory,
            createdBy:userId,
            modifiedBy:userId
        };
    
        try {
            if (selectedItem) {
                const response = await axios.put(`${API_URL}/Feature/UpdateFeatureCategory/${selectedItem.id}`, requestPayload);
                if (response.status === 201) {
                    // alert("Feature updated successfully!");
                    toast.success('Feature updated successfully!');
                } else {
                    setError("Failed to update feature. Please try again.");
                }
            } else {
                const response = await axios.post(`${API_URL}/Feature/AddFeatureCategory`, requestPayload);
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
            console.error("Error submitting feature category:", error);
            setError("An error occurred while submitting. Please try again later.");
        }
    };
    

    const handleDrawerClose = () => {
        setFormValues({           
            featureCategory: "",
        });
        setError(null);
        onClose();
    };

    return (
        <div className={`right-drawer ${isDrawerOpen ? "open" : ""}`}>
            <div className="drawer-header flex justify-between items-center p-4 bg-gray-100 border-b">
                <h2 className="text-lg font-bold text-gray-900">Add New Feature Category</h2>
                <button onClick={handleDrawerClose} className="btn btn-icon text-gray-500 hover:text-red-500">
                    <KeenIcon icon="cross" />
                </button>
            </div>
            <div className="drawer-body p-4">
                <form className="space-y-4" onSubmit={handleSubmit}>
                     <TextField
                        label="Feature Category"
                        variant="outlined"
                        type="text" 
                        fullWidth
                        name="featureCategory"
                        value={formValues.featureCategory}
                        onChange={handleInputChange}
                        required
                    />
                       
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
