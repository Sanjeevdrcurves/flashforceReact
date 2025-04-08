import React, { useState } from "react";
import axios from "axios";
import { useSelector } from 'react-redux';
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
const DataPreventionModule = () => {
    const {userId, companyId} = useSelector(state => state.AuthReducerKey);
 
    const [formValues, setFormValues] = useState({

        policyName: "",
        policyType: "",
        description: "",
        appliesTo: "",
        excludedUsersGroups: "",
        dataTypes: "",
        fileTypes: "",
        tagsLabelsToMonitor: "",
        conditions: "",
        triggerAction :   "" ,
        matchType:"",
        escalationActions: "",
        retentionPeriod:"",
        notificationDeliveryMethod : "",
        notificationRecipients:"",
        logDetailsToCapture :  "" ,
        actionsForPolicyViolation : "",
    //     deliveryMethod: formValues.deliveryMethod.join(", "),
         notificationMessageTemplate : "",
        startDate: "",
        endDate: "",
        activationStatus: "", policyActions: []


    //     policyName: "",
    //     policyType: "",
    //     policyDescription: "",
    //     appliesTo: "",
    //     excludedUsersGroups: "",
    //     fileTypes: "",
    //     tagsToMonitor: "",
    //     triggerAction: "",
    //     matchType: "",
    //     escalationActions: "",
    //     retentionPeriod: "",
    //     notificationRecipients: "",
    //    // deliveryMethod: [],
    //     notificationMessageTemplate: "",
    //     startDate: "",
    //     endDate: "",
    //     activationStatus: "",
    //     policyActions: []
    });
    const validateForm = () => {
        const requiredFields = ['policyName', 'policyType', 'startDate', 'endDate'];
        for (const field of requiredFields) {
            if (!formValues[field]) {
                alert(`${field} is required`);
                return false;
            }
        }
        return true;
    };
    
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            if (checked) {
                setFormValues({
                    ...formValues,
                    [name]: [...formValues[name], value]
                });
            } else {
                setFormValues({
                    ...formValues,
                    [name]: formValues[name].filter((item) => item !== value)
                });
            }
        } else {
            setFormValues({
                ...formValues,
                [name]: value
            });
        }
    };
    const [loading, setLoading] = useState(false);

   
    
    const handleSubmit = async (e) => {
        e.preventDefault();


        if (!validateForm()) return;
    
        setLoading(true);
        
         const payload = {
            policyName: formValues.policyName,
            policyType: formValues.policyType,
            description: formValues.policyDescription,
            appliesTo: formValues.appliesTo,
            excludedUsersGroups: formValues.excludedUsersGroups,
            dataTypes: formValues.policyActions.join(", "),
            fileTypes: formValues.fileTypes,
            tagsLabelsToMonitor: formValues.tagsToMonitor,
            conditions: formValues.conditions,
            triggerAction :   formValues.triggerAction ,
            matchType: formValues.matchType,
            escalationActions: formValues.escalationActions,
            retentionPeriod: formValues.retentionPeriod,
            notificationDeliveryMethod :   formValues.notificationDeliveryMethod.join(", "),
            notificationRecipients: formValues.notificationRecipients,
            logDetailsToCapture :   formValues.logDetailsToCapture.join(", "),
            actionsForPolicyViolation :   formValues.actionsForPolicyViolation.join(", ") ,
        //     deliveryMethod: formValues.deliveryMethod.join(", "),
             notificationMessageTemplate : formValues.notificationDescription,
            startDate: formValues.startDate,
            endDate: formValues.endDate,
            activationStatus: formValues.activationStatus,
            createdBy : String(userId),
            companyId : companyId
         };
//alert(JSON.stringify(payload));
        
        // const payload ={
        //     policyName :  "test1" ,
        //     policyType :   "test1" ,
        //     description :   "test1" ,
        //     appliesTo :   "test1" ,
        //     excludedUsersGroups :   "test1" ,
        //     dataTypes :   "test1" ,
        //     fileTypes :   "test1" ,
        //     tagsLabelsToMonitor :   "test1" ,
        //     conditions :   "test1" ,
        //     triggerAction :   "test1" ,
        //     matchType :   "test1" ,
        //     escalationActions :   "test1" ,
        //     notificationRecipients :   "test1" ,
        //     notificationDeliveryMethod :   "test1" ,
        //     retentionPeriod :   "test1" ,
        //     logDetailsToCapture :   "test1" ,
        //     actionsForPolicyViolation :   "test1" ,
        //     notificationMessageTemplate :   "test1" ,
        //     startDate :  "2025-01-01T18:53:43.619Z" ,
        //     endDate :  "2025-01-03T18:53:43.620Z" ,
        //     activationStatus :  "active",
        //     createdDate :  "2025-01-03T18:53:43.620Z",
        //     createdBy :  "hitesh" ,
        //     companyId : 90
        //  };
        try {
            const response = await axios.post(
                 `${API_URL}/PolicyAssignment/InsertDataLossPolicy`,
                payload
            );
            toast("Policy saved successfully", response.data);
            // handle success (maybe show a success message)
        } catch (error) {
            console.error("Error saving policy", error);
            // handle error (maybe show an error message)
        }
        finally {
            setLoading(false);
        }
    };

    // Static Values for Dropdown Lists
    const policyTypes = [
        { value: "Data Loss Prevention", label: "Data Loss Prevention" },
        { value: "Access Control", label: "Access Control" },
        { value: "Compliance", label: "Compliance" }
    ];
    const conditions = [
        "Condition 1",
        "Condition 2",
        "Condition 3",
      ];
      const escalationActions = [
        "Escalation Action 1",
        "Escalation Action 2",
        "Escalation Action 3",
      ];
        
      const retentionPeriods = [
        "30 days",
        "60 days",
        "90 days",
      ];    
    const appliesToOptions = [
        { value: "Employees", label: "Employees" },
        { value: "Contractors", label: "Contractors" },
        { value: "Both", label: "Both" }
    ];

    const fileTypesOptions = [
        { value: "PDF", label: "PDF" },
        { value: "Word", label: "Word" },
        { value: "Excel", label: "Excel" },
        { value: "Image", label: "Image" }
    ];

    const triggerActions = [
        { value: "Notify", label: "Notify" },
        { value: "Block", label: "Block" },
        { value: "Encrypt", label: "Encrypt" }
    ];

    const matchTypes = [
        { value: "All Conditions", label: "All Conditions" },
        { value: "Any Condition", label: "Any Condition" }
    ];

    const activationStatuses = [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" }
    ];

    const policyActionsOptions = [
        { value: "Block Action", label: "Block Action" },
        { value: "Notify User", label: "Notify User" },
        { value: "Encrypt", label: "Encrypt" }
    ];

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="bg-white shadow rounded-lg p-8">
                <h1 className="text-2xl font-bold leading-none text-gray-900 mb-6">
                    Create a New Policy
                </h1>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                    {/* Policy Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Policy Name</label>
                        <input
                            type="text"
                            name="policyName"
                            className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            value={formValues.policyName}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Policy Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Policy Type</label>
                        <select
                            name="policyType"
                            className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            value={formValues.policyType}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Policy Type</option>
                            {policyTypes.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Policy Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Policy Description</label>
                        <textarea
                            name="policyDescription"
                            className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            rows="8"
                            value={formValues.policyDescription}
                            onChange={handleInputChange}
                        ></textarea>
                    </div>

                    {/* Applies To */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Applies To</label>
                        <select
                            name="appliesTo"
                            className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            value={formValues.appliesTo}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Applies To</option>
                            {appliesToOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Excluded Users/Groups */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Excluded Users/Groups</label>
                        <select
                            name="excludedUsersGroups"
                            className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            value={formValues.excludedUsersGroups}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Excluded Users/Groups</option>
                            {/* Add your options here */}

                                <option value="GroupA">Group A</option>
                                <option value="GroupB">Group B</option>
                                <option value="GroupC">Group C</option>
                                <option value="GroupD">Group D</option>
                                <option value="GroupE">Group E</option>
                        </select>
                    </div>

                    {/* File Types */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">File Types</label>
                        <select
                            name="fileTypes"
                            className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            value={formValues.fileTypes}
                            onChange={handleInputChange}
                        >
                            <option value="">Select File Types</option>
                            {fileTypesOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Tags/Labels to Monitor */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tags/Labels to Monitor</label>
                        <input
                            type="text"
                            name="tagsToMonitor"
                            className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            value={formValues.tagsToMonitor}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Data Types */}
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700">Data Types</label>
                        <div className="flex flex-wrap gap-4 mt-1 w-full">
                            {policyActionsOptions.map((action, index) => (
                                <label key={index} className="flex items-center gap-2 whitespace-nowrap">
                                    <input
                                        type="checkbox"
                                        name="policyActions"
                                        value={action.value}
                                        className="form-checkbox rounded text-indigo-600 checkbox"
                                        checked={formValues.policyActions.includes(action.value)}
                                        onChange={handleInputChange}
                                    />
                                    <span className="text-xs text-gray-700">{action.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Match Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Match Type</label>
                        <div className="flex items-center gap-4 mt-2">
                            {matchTypes.map((matchType, index) => (
                                <label key={index} className="flex items-center gap-2 whitespace-nowrap">
                                    <input
                                        type="radio"
                                        name="matchType"
                                        value={matchType.value}
                                        className="form-radio text-indigo-600 radio"
                                        checked={formValues.matchType === matchType.value}
                                        onChange={handleInputChange}
                                    />
                                    <span className="ml-2 text-sm text-gray-700">{matchType.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Trigger Action */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Trigger Action</label>
                        <select
                            name="triggerAction"
                            className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            value={formValues.triggerAction}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Trigger Action</option>
                            {triggerActions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
        <label className="block text-sm font-medium text-gray-700">Conditions</label>
        <select
          name="conditions"
          className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          value={formValues.conditions}
          onChange={handleInputChange}
        >
          <option value="">Select conditions</option>
          {conditions.map((condition, index) => (
            <option key={index} value={condition}>
              {condition}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Escalation Actions</label>
        <select
          name="escalationActions"
          className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          value={formValues.escalationActions}
          onChange={handleInputChange}
        >
          <option value="">Select Escalation Action</option>
          {escalationActions.map((action, index) => (
            <option key={index} value={action}>
              {action}
            </option>
          ))}
        </select>
      </div>
                    {/* Actions for Policy Violation */}
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700">Actions for Policy Violation</label>
                        <div className="flex flex-wrap gap-4 mt-2">
                            {[
                                "Block Action Immediately",
                                "Notify User with Warning Message",
                            ].map((action, index) => (
                                <label key={index} className="flex items-center gap-2 whitespace-nowrap">
                                    <input
                                        type="checkbox"
                                        name="actionsForPolicyViolation"
                                        value={action}
                                        className="form-checkbox rounded text-indigo-600 checkbox"
                                        onChange={handleInputChange}
                                    />
                                    <span className="ml-2 text-sm text-gray-700">{action}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    

                  {/* Retention Period */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Retention Period</label>
        <select
          name="retentionPeriod"
          className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          value={formValues.retentionPeriod}
          onChange={handleInputChange}
        >
          <option value="">Select Retention Period</option>
          {retentionPeriods.map((period, index) => (
            <option key={index} value={period}>
              {period}
            </option>
          ))}
        </select>
      </div>
                    {/* Notification Recipients */}
                   
                  
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Notification Recipients</label>
                        <input
                            type="text"
                            name="notificationRecipients"
                            className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            onChange={handleInputChange}
                        />
                          <div className="col-span-1 mt-5">
                        <label className="block text-sm font-medium text-gray-700">Delivery Method</label>
                        <div className="flex items-center gap-2 whitespace-nowrap">
                            {[
                                "Email",
                                "SMS",
                                "In-App Notification",
                            ].map((method, index) => (
                                <label key={index} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="notificationDeliveryMethod"
                                        value={method}
                                        className="form-checkbox rounded text-indigo-600 checkbox"
                                        onChange={handleInputChange}
                                    />
                                    <span className="ml-2 text-sm text-gray-700">{method}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Notification Description</label>
                        <textarea
                            name="notificationDescription"
                            className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            rows="8"
                            onChange={handleInputChange}
                        ></textarea>
                    </div>

                    

                    {/* Start and End Dates */}
                    <div className="col-span-2 md:flex md:gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700">Start Date</label>
                            <input
                                type="date"
                                name="startDate"
                                className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                value={formValues.startDate}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700">End Date</label>
                            <input
                                type="date"
                                name="endDate"
                                className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                value={formValues.endDate}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                  
                    <div className="col-span-1 mt-5">
                        <label className="block text-sm font-medium text-gray-700">Log Details to Capture</label>
                        <div className="flex items-center gap-2 whitespace-nowrap">
                            {[
                                "Username",
                                "Timestamp",
                                "File Name",
                                "File Location",
                                "Attempted Recipient",
                                "Action Taken",
                            ].map((method, index) => (
                                <label key={index} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="logDetailsToCapture"
                                        value={method}
                                        className="form-checkbox rounded text-indigo-600 checkbox"
                                        onChange={handleInputChange}
                                    />
                                    <span className="ml-2 text-sm text-gray-700">{method}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    {/* Activation Status */}
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Activation Status</label>
                        <select
                            name="activationStatus"
                            className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            value={formValues.activationStatus}
                            onChange={handleInputChange}
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>

                    <div className="flex-1 ">
    <button
                            type="button"
                            className="py-2 w-full px-4 bg-red-500 text-white font-medium rounded-md hover:bg-red-600 focus:ring focus:ring-red-400"
                        >
                            Preview Policy
                        </button>
    </div>

 
    <div className="flex-1">
    
    <button
                            type="submit"
                            className={`py-2 w-full px-4 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 focus:ring focus:ring-green-400 ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                        >
                            {loading ? 'Saving...' : 'Save Policy'}
                        </button>
    </div>
                </form>
            </div>
        </div>
    );
};

export default DataPreventionModule;
