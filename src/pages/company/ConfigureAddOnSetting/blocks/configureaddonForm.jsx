import React from "react";
import { useState, useEffect, Fragment } from 'react';
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const ConfigureaddonForm = () => {
  const {userId,companyId}=useSelector(state=>state.AuthReducerKey);
  const [features, setFeatures] = useState([]);
  const [platformCount, setPlatformCount] = useState('');
  const formik = useFormik({
    initialValues: {
      addOnName: "",
      description: "",
      price: "",
      module: "",
      submodule: "",
      numberOfUsers: "",
      feature: "",
      //selectedFeatures: ["Advanced Search", "Add Graphs", "Dynamic View"],
      selectedFeatures: [],
    },
    validateOnChange:false, // Disable validation on change
    validateOnBlur:false, // Disable validation on blur
    validationSchema: Yup.object({
      addOnName: Yup.string().required("Add-On Name is required"),
      description: Yup.string().required("Description is required"),
      price: Yup.number().required("Price is required").positive(),
      //module: Yup.string().required("Module is required"),
      //submodule: Yup.string().required("Submodule is required"),
      numberOfUsers: Yup.number()
      .typeError("Only numbers are allowed")
      .integer("Only whole numbers are allowed")
      .positive("Number must be positive")
      .required("This field is required"),
      feature: Yup.string(),
    }),
    onSubmit: async (values) => {
      console.log("Form Submitted", values);
      //values.selectedFeatures;
      var selectedFeatureIds = values.selectedFeatures.map(item => item.id).join(",");
      if(!selectedFeatureIds)
        selectedFeatureIds = null;
      try {
        const response = await axios.post(`${API_URL}/AddOn`,
          {
            name: values.addOnName,
            description: values.description,
            pricePerMonth: values.price,
            createdBy: userId,
            userCount: values.numberOfUsers,
            features: selectedFeatureIds
          }
        );
        console.log(response.data);
        toast.success("Add-on created successfully");
        formik.handleReset();
      } catch (error) {
        console.error("Error creating add-on: "+error);
        toast.error("Error creating add-on");
      } finally {
      }
    },
  });

  const removeFeature = (id) => {
    formik.setFieldValue(
      "selectedFeatures",
      formik.values.selectedFeatures.filter((feature) => feature.id !== id)
    );
  };

  const addFeature = (value) => {
    //console.log("Feature Added", formik.values.feature);
    //formik.values.selectedFeatures.push(value);
    const featureObj = features.filter((f) => f.id == value)[0]; //get feature complere object
    if(!formik.values.selectedFeatures.includes(featureObj)){
      formik.values.selectedFeatures.push(featureObj);
    }
    formik.setFieldValue('feature', value);
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    
    try {
      const response = await axios.get(`${API_URL}/Feature/GetAllFeatures`);

      // Format the API response to match tableData structure
      const formattedData = response?.data?.map((item) => ({
        // id: item.id,
        // featureName: item.name,
        // description: item.description,
        // status: item.isDeleted ? 'Inactive' : 'Active',
        // plans: item?.planNames?.split(',').map((plan) => plan.trim()), // Split and trim plan names
        // planId:item?.planId?.split(','),
        // featureCategoryName: item.featureCategoryName || 'Uncategorized',
        // featureCategoryId:item.featureCategoryId,
        // isMenuShow: item.isMenuShow ? 'Yes' : 'No',
        // path:item.path,
        // icon:item.icon,
        // featureType:item.featureType,
        // isTooltip: item.isTooltip ? 'Yes' : 'No',
        // tooltip: item.tooltip || 'N/A',
      }));
      //console.log(JSON.stringify(response.data));
      if(response.data)
        setFeatures(response.data);
    } catch (error) {
      console.error('Error fetching table data:', error);
    } finally {
      
    }
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-8 p-6">
      {/* First Row */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="addOnName" className="block text-sm font-medium mb-2">
            Add-On Name
          </label>
          <input
            id="addOnName"
            name="addOnName"
            type="text"
            placeholder="Add on Name"
            className="w-full border border-gray-300 rounded-lg p-2 text-gray-500 bg-gray-50"
            onChange={formik.handleChange}
            value={formik.values.addOnName}
          />
          {formik.errors.addOnName && (
            <p className="text-red-600 text-sm">{formik.errors.addOnName}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Description
          </label>
          <input
            id="description"
            name="description"
            type="text"
            placeholder="Description"
            className="w-full border border-gray-300 rounded-lg p-2 text-gray-500 bg-gray-50"
            onChange={formik.handleChange}
            value={formik.values.description}
          />
          {formik.errors.description && (
            <p className="text-red-600 text-sm">{formik.errors.description}</p>
          )}
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium mb-2">
            Price
          </label>
          <input
            id="price"
            name="price"
            type="number"
            placeholder="Price"
            className="w-full border border-gray-300 rounded-lg p-2 text-gray-500 bg-gray-50"
            onChange={formik.handleChange}
            value={formik.values.price}
          />
          {formik.errors.price && (
            <p className="text-red-600 text-sm">{formik.errors.price}</p>
          )}
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="module" className="block text-sm font-medium mb-2">
            Module
          </label>
          <Select value={formik.values.module} onValueChange={(value) => formik.setFieldValue('module', value)} >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Module" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Employee Target">Employee Target</SelectItem>
              <SelectItem value="Customer Relations">Customer Relations</SelectItem>
            </SelectContent>
          </Select>
          {/* {formik.errors.module && (
            <p className="text-red-600 text-sm">{formik.errors.module}</p>
          )} */}
        </div>

        <div>
          <label htmlFor="submodule" className="block text-sm font-medium mb-2">
            Submodule
          </label>
          <Select
            defaultValue=""
            onValueChange={(value) => formik.setFieldValue('submodule', value)}
            value={formik.values.submodule}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Submodule" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Submodule A">Submodule A</SelectItem>
              <SelectItem value="Submodule B">Submodule B</SelectItem>
            </SelectContent>
          </Select>
          {/* {formik.errors.submodule && (
            <p className="text-red-600 text-sm">{formik.errors.submodule}</p>
          )} */}
        </div>

        <div>
          <label htmlFor="numberOfUsers" className="block text-sm font-medium mb-2">
            Number of Users
          </label>
          <input
            id="numberOfUsers"
            name="numberOfUsers"
            type="number"
            placeholder="Enter Maximum Users"
            className="w-full border border-gray-300 rounded-lg p-2 text-gray-500 bg-gray-50"
            onChange={formik.handleChange}
            value={formik.values.numberOfUsers}
          />
          {formik.errors.numberOfUsers && (
            <p className="text-red-600 text-sm">{formik.errors.numberOfUsers}</p>
          )}
        </div>
      </div>

      {/* Third Row */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="feature" className="block text-sm font-medium mb-2">
            Feature
          </label>
          <Select
            defaultValue=""
            onValueChange={(value) => addFeature(value)}
            value={formik.values.feature}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Feature" />
            </SelectTrigger>
            <SelectContent >
              {/* <SelectItem value="Feature 1">Feature 1</SelectItem>
              <SelectItem value="Feature 2">Feature 2</SelectItem> */}
              {features.map((item) => (
                <SelectItem key={""+item.id} value={""+item.id} >
                  {item.name} 
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Selected Features</label>
          {formik.values.selectedFeatures && (
            <div className="flex gap-2 flex-wrap">
              {formik.values.selectedFeatures.map((feature) => (
                <span
                  key={feature.id}
                  className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-2"
                >
                  {feature.name}
                  <button
                    type="button"
                    onClick={() => removeFeature(feature.id)}
                    className="text-red-600"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
          
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          type="submit"
          className="btn btn-primary btn-sm text-center flex justify-center"
        >
          Save Add-On
        </button>
        <button
          type="button"
          className="btn btn-light btn-sm text-center flex justify-center"
          onClick={formik.handleReset}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ConfigureaddonForm;
