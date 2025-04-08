import React, { useState, useEffect } from "react";
//import "./RightDrawer.css";
import { KeenIcon } from "@/components";
import { TextField, Button, Switch, FormControlLabel, MenuItem, Select } from "@mui/material";
import axios from "axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const RightDrawer = ({ isDrawerOpen, onClose, fetchTableData, selectedItem, companyId, userId }) => {
    const [formValues, setFormValues] = useState({
        twilioAccountSid: "",
        twilioAuthToken: "",
        isActive: false,
        selectedCompanyId: companyId || "",
    });
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await axios.get(`${API_URL}/Company/CompaniesByAdminUser?userId=${userId}`);
                setCompanies(response.data || []);
            } catch (error) {
                console.error("Error fetching companies:", error);
            }
        };
        fetchCompanies();
    }, []);

    useEffect(() => {
        if (selectedItem) {
            setFormValues({
                twilioAccountSid: selectedItem.twilioAccountSid || "",
                twilioAuthToken: selectedItem.twilioAuthToken || "",
                isActive: selectedItem.isActive === true,
                selectedCompanyId: selectedItem.companyId ||companyId|| "",
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

    const handleToggleChange = (e) => {
        setFormValues({
            ...formValues,
            isActive: e.target.checked,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formValues.selectedCompanyId) {
            toast.error("Company selection is required.");
            return;
        }
        try {
            const requestPayload = {
                id: selectedItem ? selectedItem.id : undefined,
                twilioAccountSid: formValues.twilioAccountSid,
                twilioAuthToken: formValues.twilioAuthToken,
                isActive: formValues.isActive,
                createdBy: userId,
                companyId: formValues.selectedCompanyId,
            };

            if (selectedItem) {
                await axios.put(`${API_URL}/TwilioUser/Update`, requestPayload);
                toast.success("Twilio Account updated successfully!");
            } else {
                await axios.post(`${API_URL}/TwilioUser/Insert`, requestPayload);
                toast.success("Twilio Account added successfully!");
            }

            handleDrawerClose();
            fetchTableData();
        } catch (error) {
            console.error("Error submitting Twilio Account:", error);
            toast.error("An error occurred while submitting. Please try again later.");
        }
    };

    const handleDrawerClose = () => {
        setFormValues({
            twilioAccountSid: "",
            twilioAuthToken: "",
            isActive: true,
            selectedCompanyId: "",
        });
        onClose();
    };

    return (
        <div className={`right-drawer ${isDrawerOpen ? "open" : ""}`}>
            <div className="drawer-header flex justify-between items-center p-4 bg-gray-100 border-b">
                <h2 className="text-lg font-bold text-gray-900">{selectedItem ? "Edit Twilio Account" : "Add Twilio Account"}</h2>
                <button onClick={handleDrawerClose} className="btn btn-icon text-gray-500 hover:text-red-500">
                    <KeenIcon icon="cross" />
                </button>
            </div>
            <div className="drawer-body p-4">
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <Select
                        fullWidth
                        name="selectedCompanyId"
                        value={formValues.selectedCompanyId}
                        onChange={handleInputChange}
                        required
                    >
                        <MenuItem value="">Select Company</MenuItem>
                        {companies.map((company) => (
                            <MenuItem key={company.companyId} value={company.companyId}>{company.companyName}</MenuItem>
                        ))}
                    </Select>
                    <TextField
                        label="Twilio Account SID"
                        variant="outlined"
                        fullWidth
                        name="twilioAccountSid"
                        value={formValues.twilioAccountSid}
                        onChange={handleInputChange}
                        required
                    />
                    <TextField
                        label="Twilio Auth Token"
                        variant="outlined"
                        fullWidth
                        name="twilioAuthToken"
                        value={formValues.twilioAuthToken}
                        onChange={handleInputChange}
                        required
                    />
                    <FormControlLabel
                        control={<Switch checked={formValues.isActive} onChange={handleToggleChange} />}
                        label="Active"
                    />
                    <Button variant="contained" color="primary" fullWidth type="submit">
                        {selectedItem ? "Update Twilio Account" : "Add Twilio Account"}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export { RightDrawer };
