import React from 'react';
import { Switch } from '@mui/material';
import {KeenIcon } from '@/components';
import { toAbsoluteUrl } from '@/utils/Assets';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Container } from '@/components/container';
import { AddOnShowcaseModal } from "./AddOnShowcaseModal";
import { Search } from 'lucide-react';


const InfoCards = () => {
  const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
  const {userId,companyId, email}=useSelector(state=>state.AuthReducerKey);
  const [addOns, setAddOns] = useState([]);
  const [filteredAddOns, setFilteredAddOns] = useState([]);
  const [selectedAddOn, setSelectedAddOn] = useState(null);

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const handleDetailsModalClose = () => {
    setSelectedAddOn(null);
    setDetailsModalOpen(false);
  };

  const handleDetailsModalOpen = (item) => {
    //debugger;
    setSelectedAddOn(item);
    setDetailsModalOpen(true);
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

  useEffect(() => {
    fetchAddOns();
  }, []);
  const fetchAddOns = async () => {
      
    try {
      var nietos = [];
      //var filterCompTypes = [];
      const response = await axios.get(`${API_URL}/AddOn`);
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
            userCount: item.userCount
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
            <div className="flex items-center mb-4">
              {/* <img src={toAbsoluteUrl(`/media/illustrations/${item.logo}`)}  alt={item.name} className="w-20  mr-4" /> */}
              <i className={`ki-duotone text-3xl gap-1 ${item.logo}`}></i>
            </div>
              <div className='mt-0 mb-3'>
                <h3 className="text-sm font-semibold text-gray-800 mb-2">{item.name}</h3>
                <p className="text-xs text-gray-700">{item.description}</p>
              </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <div className="flex items-center gap-2">
              <label className="switch switch-sm">
                <span className="switch-label order-1">Activated</span>
                <input name="check" defaultChecked={item.isActive} type="checkbox" value={item.id} className="order-2" readOnly onChange={handleToggle}/>
              </label>
              </div>
              <a className="btn btn-sm btn-light" onClick={() => handleDetailsModalOpen(item)}>Details</a>
            </div>
          </div>
        ))}
        
        {/* <Container>
          <AccountSettingsModal open={settingsModalOpen} onOpenChange={handleSettingsModalClose} />
        </Container> */}
        
      </div>
      {selectedAddOn && (
        <div>
          <AddOnShowcaseModal open={detailsModalOpen} onOpenChange={handleDetailsModalClose} selectedAddOn={selectedAddOn}/>
        </div>
      )}
      
    </div>
    
    
    
  );
};

export { InfoCards };
