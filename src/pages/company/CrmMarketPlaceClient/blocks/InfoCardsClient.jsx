import React from 'react';
import { Switch } from '@mui/material';
import {KeenIcon } from '@/components';
import { toAbsoluteUrl } from '@/utils/Assets';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Container } from '@/components/container';
import { AddOnShowcaseModalClient } from "./AddOnShowcaseModalClient";
import { StripePaymentDialog } from '@/pages/billing/paymentmethods';
import { Search } from 'lucide-react';


const InfoCardsClient = ({toast}) => {
  const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
  const {userId,companyId, email}=useSelector(state=>state.AuthReducerKey);
  const [addOns, setAddOns] = useState([]);
  const [filteredAddOns, setFilteredAddOns] = useState([]);
  const [selectedAddOn, setSelectedAddOn] = useState(null);
  const [productDetails, setProductDetails] = useState(null);

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [renewModalOpen, setRenewModalOpen] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);

  useEffect(() => {
    if(paymentInfo?.success){
      debugger;
      RenewCompanyAddOn(selectedAddOn.id, 'Monthly', paymentInfo.intent.id, paymentInfo.invoiceId);
      handleRenewModalClose();
      toast.success("AddOn Added");
    }
  }, [paymentInfo]);
  
  useEffect(() => {
    fetchAddOns();
  }, []);

  const handleDetailsModalClose = () => {
    setSelectedAddOn(null);
    setDetailsModalOpen(false);
  };

  const handleDetailsModalOpen = (item) => {
    //debugger;
    setSelectedAddOn(item);
    setDetailsModalOpen(true);
  };
  const handleRenewModalClose = () => {
    setSelectedAddOn(null);
    setProductDetails(null);
    setRenewModalOpen(false);
  };

  const handleRenewModalOpen = (item) => {
    setSelectedAddOn(item);
    //debugger;
    var addOns = [];
    var obj = {
      // logo: '10.svg',
      key: item.id, //required for rendering
      id: item.id,
      name: item.name,
      price: item.pricePerMonth,
      subType: "Monthly"
    }
    addOns.push(obj);

    setProductDetails({
      // planId: 1,
      // planName: 'asd',
      // planPrice: 3,
      // planSub: 'planSub',
      key: 1, //required for rendering
      chargeType: "RENEW_ADDON",
      selectedAddOns: addOns
    });
    setRenewModalOpen(true);
  };

  const handleFreeTrial = async (item) => {
    AddCompanyAddOn(item.id, 'Trial')
  };
  
  const AddCompanyAddOn = async (addOnId, subType) => {
    try {
      const response = await axios.put(
          `${API_URL}/AddOn/AddCompanyAddOn`,
          null,
          {
              params: { companyId, userId, addOnId, subType }
          }
      );

      console.log("Response:", response.data);
      if(response.data){
        fetchAddOns();
        toast.success("AddOn Added");
      }
      else
        toast.error("Trouble while adding add-on. Please try again later.");
    } catch (error) {
        console.error("Error:", error);
        toast.error("Trouble while adding add-on. Please try again later.");
    }
  };

  const RenewCompanyAddOn = async (addOnId, subType, refNo, invoiceId) => {
    try {
      const response = await axios.put(
          `${API_URL}/AddOn/RenewCompanyAddOn`,
          null,
          {
              params: { companyId, userId, addOnId, subType, refNo, invoiceId }
          }
      );

      console.log("Response:", response.data);
      if(response.data){
        fetchAddOns();
        toast.success("AddOn Added");
      }
      else
        toast.error("Trouble while adding add-on. Please try again later.");
    } catch (error) {
        console.error("Error:", error);
        toast.error("Trouble while adding add-on. Please try again later.");
    }
  };

  const SearchAddons = (value) => {
    console.log("filtering "+value);
    setFilteredAddOns(addOns);
    const filterdData = addOns.filter((f) => f.name.toLowerCase().includes(value.toLowerCase()));
    setFilteredAddOns(filterdData);
  };

  


  const items = [
    {
      // logo: '10.svg', // Replace with actual logo URL
      logo: 'ki-mouse-circle  text-success', // Replace with actual logo URL
      name: 'Advanced Search',
      description: 'Enhance your CRM search capabilities with advanced filters and sorting options.',
      isActive: true,
    },
    {
      //logo: '10.svg', // Replace with actual logo URL
      logo: 'ki-mouse-circle  text-success', // Replace with actual logo URL
      name: 'User Management',
      description: 'Manage user roles, permissions, and activity tracking with ease.',
      isActive: false,
    },
    {
      //logo: '10.svg', // Replace with actual logo URL
      logo: 'ki-mouse-circle  text-success', // Replace with actual logo URL
      name: 'Custom Dashboards',
      description: 'Create and customize dashboards to visualize key CRM metrics in real-time.',
      isActive: true,
    },
    {
      //logo: '10.svg', // Replace with actual logo URL
      logo: 'ki-mouse-circle  text-success', // Replace with actual logo URL
      name: 'Email Campaign Manager',
      description: 'Launch and manage email campaigns directly from your CRM.',
      isActive: true,
    },
  ];

  
  const fetchAddOns = async () => {
      
    try {
      var nietos = [];
      //var filterCompTypes = [];
      const response = await axios.get(`${API_URL}/AddOn/GetAllActiveAndCompanyAddOns/${companyId}`);
      console.log('fetchAddOns Response:', response.data);
      if (response.data.length > 0) {
        response.data.map((item, index) => {
          //let date = new Date(item.createdDate);
          //let createdDate = new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(date);
            
          var comp = {
            // logo: '10.svg',
            id: item.id, 
            logo: 'ki-mouse-circle  text-success', 
            name: item.name,
            description: item.description,
            isActive: item.isActive,
            pricePerMonth: item.pricePerMonth,
            userCount: item.userCount,
            startDate: item.startDate,
            endDate: item.endDate,
            status: item.status, //[Status]='Expired' OR [Status]='Cancelled' OR [Status]='Active'
            subscriptionType: item.subscriptionType
          }
          nietos.push(comp);
          // if(filterCompTypes.indexOf(item.hierarchyName) === -1) 
          //   filterCompTypes.push(item.hierarchyName)
        })
      }
      setAddOns(nietos);
      setFilteredAddOns(nietos);
      //setCTypes(filterCompTypes);
      
    } catch (error) {
      console.error('Error fetchAddOns:', error);
    }
  };

  const handleToggle = async (e) => {
    const { value, checked } = e.target;
    console.log(`${value} is ${checked}`);
    //console.log(`Toggled ${item.name}: ${!item.isActive}`);
    try {
      const response = await axios.put(
          `${API_URL}/AddOn/AddOnToggle`,
          null,
          {
              params: { id: value, isActive: checked, userId: userId }
          }
      );

      console.log("Response:", response.data);
    } catch (error) {
        console.error("Error:", error);
    }
  };

  const handleDetails = (item) => {
    console.log(`Details clicked for ${item.name}`);
    // Open a modal or navigate to a details page
  };

  return (
    <div>
      <div className="card-header flex-wrap px-5 py-5 border-b-0">
        <h3 className="card-title">Available Add Ons</h3>
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex gap-6">
            <div className="relative">
              <KeenIcon
                icon="magnifier"
                className="leading-none text-md text-gray-500 absolute top-1/2 start-0 -translate-y-1/2 ms-3"
              />
              <input
                type="text"
                placeholder="Search Add-ons"
                className="input input-sm ps-8"
                // value={table.getColumn('name')?.getFilterValue() ?? ''}
                onChange={(event) =>
                  SearchAddons(event.target.value)
                }
                
              />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      
        {filteredAddOns.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg shadow-sm p-4 bg-white flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              {/* <img src={toAbsoluteUrl(`/media/illustrations/${item.logo}`)}  alt={item.name} className="w-20  mr-4" /> */}
              <i className={`ki-duotone text-3xl gap-1 ${item.logo}`}></i>
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-gray-800">${item.pricePerMonth}</span>
                <span className="text-xs text-gray-600">For Company/Month</span>
              </div>
            </div>
              <div className='mt-0 mb-3'>
                <h3 className="text-sm font-semibold text-gray-800 mb-2">{item.name}</h3>
                <p className="text-xs text-gray-700">{item.description}</p>
              </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <div className="flex items-center gap-1">
              
                {item.status && <div className={`badge badge-sm badge-outline ${
                    item.status === 'Active' ? 'badge-success' : item.status === 'Expired' ? 'badge-danger':'badge-warning'
                  }`}
                >
                  {item.status}
                </div>}

                {(item.status && item.status === 'Active') && 
                <div className={`badge badge-sm badge-outline badge-secondary`}>
                  {
                    item.subscriptionType === 'Trial' ? '10 Days Trial' : item.subscriptionType
                  }
                </div>}
                
                {(item.status && item.status === 'Active') && 
                <div className={`badge badge-sm badge-outline badge-warning`}>
                  Exp: {new Date(item.endDate).toLocaleDateString('en-GB', {
                    day: '2-digit', month: 'short', year: 'numeric',
                  })}
                </div>}

                {/* <span className="switch-label order-1">{item.status}</span> */}
                {/* <input name="check" defaultChecked={item.isActive} type="checkbox" value={item.id} className="order-2" readOnly onChange={handleToggle}/> */}
                
                
              
              </div>
              <div className="flex items-center gap-2">
                <a className="btn btn-sm btn-light" onClick={() => handleDetailsModalOpen(item)}>Learn More</a>
                {!item.status && <a className="btn btn-sm btn-primary" onClick={() => handleFreeTrial(item)}>Try it free</a>}
                {(item.status === 'Expired' || item.status === 'Cancelled')&& <a className="btn btn-sm btn-primary" onClick={() => handleRenewModalOpen(item)}>Renew Subscription</a>}
              </div>
              
            </div>
          </div>
        ))}
        
        {/* <Container>
          <AccountSettingsModal open={settingsModalOpen} onOpenChange={handleSettingsModalClose} />
        </Container> */}
        
      </div>
      {selectedAddOn && (
        <div>
          <AddOnShowcaseModalClient open={detailsModalOpen} onOpenChange={handleDetailsModalClose} selectedAddOn={selectedAddOn}/>
        </div>
      )}
      
      {productDetails && (
        <div>
          <StripePaymentDialog open={renewModalOpen} onOpenChange={handleRenewModalClose} productDetails={productDetails} setPaymentInfo={setPaymentInfo}/>
        </div>
      )}
      
    </div>
    
    
    
  );
};

export { InfoCardsClient };
