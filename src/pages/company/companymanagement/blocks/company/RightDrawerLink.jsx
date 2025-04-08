import React, { useState, useEffect } from 'react';
import './RightDrawer.css'; // Ensure your CSS is properly linked
import clsx from 'clsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from 'react-redux';
import axios from 'axios';


const RightDrawerLink = ({ isDrawerOpen, onClose, onItemSaved, toast }) => {
  const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
  const {userId,companyId}=useSelector(state=>state.AuthReducerKey);
  
  useEffect(() => {
    //fetchChildHierarchies();
  }, []);


  const formik = useFormik({
    initialValues: {
      relationshipNo: "",
      entityRelationshipType: "linked-account"
    },
    validationSchema: Yup.object({
      relationshipNo: Yup.string().required("Relationship Number is required"),
    }),
    validateOnChange:false, // Disable validation on change
    validateOnBlur:false, // Disable validation on blur
    onSubmit: async (values) => {
      console.log("Form Submitted", values);
      try {
        const response = await axios.post(
          `${API_URL}/Company/LinkCompanyWithRelationshipNo`,
          null,
          {
            params: {
              relationshipNo: values.relationshipNo,
              entityRelationshipType: values.entityRelationshipType,
              userId: userId
            },
          }
        );
        console.log(response.data);
        if(response.data.message.endsWith("Relationship does not exist."))
        {
          //setStatus('Email already exists in the system');
          toast.error("Relationship does not exist");
        }
        else{
          onItemSaved(); // Notify parent to refresh the list
          toast.success("Relationship is linked successfully");
          formik.handleReset();
          setTimeout(function(){ onClose(); }, 3000);
          
        }
      } catch (error) {
        console.error(error);
        if (error.response) {
          // Server responded with a status other than 2xx
          //toast.error("Error Status:"+ error.response.status);
          toast.error("Error Data:"+ error.response.data);
          //toast.error("Error Headers:"+ error.response.headers);
        } else if (error.request) {
          // Request was made but no response received
          toast.error("No Response Received:"+ error.request);
        } else {
          // Something else happened in setting up the request
          toast.error("Error Message:"+ error.message);
        }
      } finally {
        //setLoading(false);
        //setSubmitting(false);
      }
    },
  });

  return (
    <div className={`right-drawer ${isDrawerOpen ? 'open' : ''}`}>
      {/* Drawer Header */}
      <div className="drawer-header">
      <label className="form-label text-gray-900">Link Entity</label>
        <button className="btn-close" onClick={onClose}>
          &times;
        </button>
      </div>

      {/* Drawer Body */}
      <div className="drawer-body">
        <form onSubmit={formik.handleSubmit} className="form flex flex-col gap-5">
          {/* relationshipNo */}
          <div>
            <label htmlFor="relationshipNo" className="block text-sm font-medium mb-2">
              Relationship ID
            </label>
            <input
              id="relationshipNo"
              name="relationshipNo"
              type="text"
              placeholder="Company/Entity Relationship ID"
              className="w-full border border-gray-300 rounded-lg p-2 text-gray-500 bg-gray-50"
              onChange={formik.handleChange}
              value={formik.values.relationshipNo}
            />
            {formik.errors.relationshipNo && (
              <p className="text-red-600 text-sm mt-1">{formik.errors.relationshipNo}</p>
            )}
          </div>
          {/* Entity Relationship Type */}
          <div>
            <label htmlFor="entityRelationshipType" className="block text-sm font-medium mb-2">
              Entity Relationship Type
            </label>
              <Select defaultValue="linked-account" value={formik.values.entityRelationshipType} onValueChange={(value) => 
                {
                  formik.setFieldValue('entityRelationshipType', value);
                }}
              >
                <SelectTrigger className="w-full" size="sm">
                  <SelectValue placeholder="Select" >

                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="w-full select-content">
                  <SelectItem value="linked-account" >Linked Account</SelectItem>
                  {/* <SelectItem value="sub-account" >Sub Account</SelectItem> */}
                </SelectContent>
              </Select>
            </div>

          {/* Action Buttons */}
          <div className="form-actions flex justify-between gap-4">
            <button type="submit" className="btn btn-primary grow justify-center">
              Save
            </button>
            <button type="button" className="btn btn-danger grow justify-center" onClick={formik.handleReset}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { RightDrawerLink };
