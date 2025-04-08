import React, { useState, useEffect } from 'react';
import './RightDrawer.css'; // Ensure your CSS is properly linked
import clsx from 'clsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from 'react-redux';
import axios from 'axios';


const RightDrawerEntity = ({ isDrawerOpen, onClose, onItemSaved, toast }) => {
  const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
  const {userId,companyId}=useSelector(state=>state.AuthReducerKey);
  const [selectedHierarchy, setSelectedHierarchy] = useState('');
  const [selectedPCompany, setSelectedPCompany] = useState('0');
  const [childHierarchies, setChildHierarchies] = useState([]);
  const [parentCompanies, setParentCompanies] = useState([]);
  // const [formValues, setFormValues] = useState({
  //   companyName: '',
  //   type: '',
  //   parentCompany: '',
  //   subAccountAttributes: '',
  //   location: '',
  //   franchise: '',
  // });

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormValues({
  //     ...formValues,
  //     [name]: value,
  //   });
  // };

  useEffect(() => {
    fetchChildHierarchies();
  }, []);

  useEffect(() => {
    fetchParentCompaniesByHierarchy();
  }, [selectedHierarchy]);

  const fetchChildHierarchies = async () => {
    try {
      const response = await axios.get(`${API_URL}/Hierarchy/ChildHierarchies/${userId}`);
      console.log('ChildHierarchies Response:', response.data);
      setChildHierarchies(response.data);
    } catch (error) {
      console.error('Error ChildHierarchies:', error);
    }
  };

  const fetchParentCompaniesByHierarchy = async () => {
    setSelectedPCompany('0');
    if(selectedHierarchy){
      try {
        const response = await axios.get(`${API_URL}/Company/ParentCompaniesByHierarchy`, 
          {
            params:{
              hierarchyId: selectedHierarchy,
              userId: userId
            }
          });
        console.log('ParentCompaniesByHierarchy Response:', response.data);
        setParentCompanies(response.data);
        
      } catch (error) {
        console.error('Error ParentCompaniesByHierarchy:', error);
      }
    }
    
  };

  const formik = useFormik({
    initialValues: {
      entityName: "",
      email:"",
      type: "",
      entityRelationshipType: "",
      parentCompany: "0",
    },
    validationSchema: Yup.object({
      entityName: Yup.string().required("Company/Entity Name is required"),
      //email: Yup.string().required("Email is required"),
      email: Yup.string().email('Wrong email format').min(3, 'Minimum 3 symbols').max(50, 'Maximum 50 symbols').required('Email is required'),
      type: Yup.string().required("Type is required"),
    }),
    validateOnChange:false, // Disable validation on change
    validateOnBlur:false, // Disable validation on blur
    onSubmit: async (values) => {
      console.log("Form Submitted", values);
      try {
        const response = await axios.post(
          `${API_URL}/Company/ChildCompanyUserSignUpWithHierarchy`,
          null,
          {
            params: {
              companyName: values.entityName,
              fullName: values.entityName,
              email: values.email,
              phoneNo: '0000000000',
              hierarchyId :values.type,
              isAnnual: null,
              entityRelationshipType: values.entityRelationshipType,
              parentCompanyId:values.parentCompany,
              userId: userId
            },
          }
        );
        console.log(response.data);
        if(response.data.message.endsWith("Email already exists in the system."))
        {
          //setStatus('Email already exists in the system');
          toast.error("Email already exists in the system");
        }
        else{
          onItemSaved(); // Notify parent to refresh the list
          toast.success("Company created successfully");
          formik.handleReset();
          setTimeout(function(){ onClose(); }, 3000);
          
        }
      } catch (error) {
        console.error(error);
        //setStatus('Error submitting the form. Please try again.');
      } finally {
        //setLoading(false);
        //setSubmitting(false);
      }
    },
  });

  function RelTypeSelectItem(props) {
    
    const entityType = props.entityType;
    if (entityType == 2) {
      return <SelectItem value="sub-account" >Sub Account</SelectItem>;
    }
    return ;
  }

  return (
    <div className={`right-drawer ${isDrawerOpen ? 'open' : ''}`}>
      {/* Drawer Header */}
      <div className="drawer-header">
      <label className="form-label text-gray-900">Add Entity</label>
        <button className="btn-close" onClick={onClose}>
          &times;
        </button>
      </div>

      {/* Drawer Body */}
      <div className="drawer-body">
        <form onSubmit={formik.handleSubmit} className="form flex flex-col gap-5">
          {/* Company Name */}
          <div>
          <label htmlFor="entityName" className="block text-sm font-medium mb-2">
            Company/Entity Name
          </label>
          <input
            id="entityName"
            name="entityName"
            type="text"
            placeholder="Company/Entity Name"
            className="w-full border border-gray-300 rounded-lg p-2 text-gray-500 bg-gray-50"
            onChange={formik.handleChange}
            value={formik.values.entityName}
          />
          {formik.errors.entityName && (
            <p className="text-red-600 text-sm mt-1">{formik.errors.entityName}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Admin Email
          </label>
          <input
            id="email"
            name="email"
            type="text"
            placeholder="email@email.com"
            autoComplete="off"
            className="w-full border border-gray-300 rounded-lg p-2 text-gray-500 bg-gray-50"
            onChange={formik.handleChange}
            value={formik.values.email}
          />
          {formik.errors.email && (
            <p className="text-red-600 text-sm mt-1">{formik.errors.email}</p>
          )}
        </div>

          {/* Type */}
          <div>
          <label htmlFor="entityName" className="block text-sm font-medium mb-2">
            Type
          </label>
            {/* <Select defaultValue="active">
                        <SelectTrigger className="w-full" size="sm">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                          <SelectItem value="active">Plastic Surgery</SelectItem>
                          <SelectItem value="disabled">1</SelectItem>
                          <SelectItem value="pending">2</SelectItem>
                        </SelectContent>
                      </Select> */}
            <Select value={formik.values.type} onValueChange={(value) => 
              {
                formik.setFieldValue('type', value);
                setSelectedHierarchy(value);
                formik.setFieldValue('parentCompany', '0');
                formik.setFieldValue('entityRelationshipType', '');
              }}
            >
              <SelectTrigger className="w-full" size="sm">
                <SelectValue placeholder="Select" >

                </SelectValue>
              </SelectTrigger>
              <SelectContent className="w-full select-content">
              
              {childHierarchies.map((item) => (
                <SelectItem key={""+item.hierarchyId} value={""+item.hierarchyId} >
                  {item.name} 
                </SelectItem>
              ))}
              </SelectContent>
            </Select>
            {formik.errors.type && (
              <p className="text-red-600 text-sm mt-1">{formik.errors.type}</p>
            )}
          </div>

          {/* Entity Relationship Type */}
          <div>
            <label htmlFor="entityRelationshipType" className="block text-sm font-medium mb-2">
              Entity Relationship Type
            </label>
            <Select defaultValue="" value={formik.values.entityRelationshipType} onValueChange={(value) => 
              {
                formik.setFieldValue('entityRelationshipType', value);
              }}
            >
              <SelectTrigger className="w-full" size="sm">
                <SelectValue placeholder="Select" >

                </SelectValue>
              </SelectTrigger>
              <SelectContent className="w-full select-content">
                {/* <SelectItem value="linked-account" >Linked Account</SelectItem> */}
                {/* <SelectItem value="">No Relationship</SelectItem> */}
                <RelTypeSelectItem entityType={selectedHierarchy} />
              </SelectContent>
            </Select>
          </div>

          {/* Parent Company */}
          <div className="flex flex-col ">
            <label className="form-label text-gray-900">Parent Company</label>
          </div>
            {/* <Select defaultValue="active">
                      <SelectTrigger className="w-full" size="sm">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="w-full select-content">
                        <SelectItem value="active">Plastic Surgery</SelectItem>
                        <SelectItem value="disabled">1</SelectItem>
                        <SelectItem value="pending">2</SelectItem>
                      </SelectContent>
                    </Select> */}
            <Select defaultValue="0" value={formik.values.parentCompany} onValueChange={(value) => 
              {
                formik.setFieldValue('parentCompany', value);
                setSelectedPCompany(value);
              }}
            >
              <SelectTrigger className="w-full" size="sm">
                <SelectValue placeholder="Select" >

                </SelectValue>
              </SelectTrigger>
              <SelectContent className="w-full select-content">
              <SelectItem value="0">No Parent</SelectItem>
              {parentCompanies.map((item) => (
                <SelectItem key={""+item.companyId} value={""+item.companyId} >
                  {item.companyName} 
                </SelectItem>
              ))}
              </SelectContent>
            </Select>

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

export { RightDrawerEntity };
