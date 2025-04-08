import React from 'react';
import { Switch } from '@mui/material';
import {KeenIcon } from '@/components';
import { toAbsoluteUrl } from '@/utils/Assets';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Container } from '@/components/container';
import { AddOnShowcaseSignUpModal } from "./AddOnShowcaseSignUpModal";
import { Search } from 'lucide-react';


const InfoCardsSignUp = ({selectedAddOns, setSelectedAddOns}) => {
  const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
  const {userId,companyId, email}=useSelector(state=>state.AuthReducerKey);
  const [addOns, setAddOns] = useState([]);
  const [filteredAddOns, setFilteredAddOns] = useState([]);
  const [selectedAddOn, setSelectedAddOn] = useState(null);
  //const [selectedAddOnIds, setSelectedAddOnIds] = useState([]);

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const handleDetailsModalClose = () => {
    setSelectedAddOn(null);
    setDetailsModalOpen(false);
  };

  const handleDetailsModalOpen = (item) => {
    setSelectedAddOn(item);
    setDetailsModalOpen(true);
  };
  const SearchAddons = (value) => {
    console.log("filtering "+value);
    setFilteredAddOns(addOns);
    const filterdData = addOns.filter((f) => f.name.toLowerCase().includes(value.toLowerCase()));
    setFilteredAddOns(filterdData);
  };


  useEffect(() => {
    fetchAddOns();
  }, []);
  const fetchAddOns = async () => {
      
    try {
      var nietos = [];
      //var filterCompTypes = [];
      const response = await axios.get(`${API_URL}/AddOn/GetAllActiveAddOns`);
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
    //debugger;
    const { value, checked, dataset } = e.target;
    //var addOnName = e.target.getAttribute("data-name");
    console.log(`${value} ${dataset.name} is ${checked}`);
    //console.log(`Toggled ${item.name}: ${!item.isActive}`);
    var c = selectedAddOns;
    if(checked){  //add into addons list
      const objArr = c.filter((f) => f.id == value);
      if(!objArr.length){
        var obj = {
          // logo: '10.svg',
          id: value,
          name: dataset.name,
          price: dataset.price,
          subType: "Monthly"
        }
        c.push(obj);
      }
    }
    else{   //remove from addons list
      c = c.filter((f) => f.id !== value);
    }
    setSelectedAddOns(c);
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
            {/* <div className="flex-wrap">

            </div> */}
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
              <div className="flex items-center gap-2">
              <label className="switch switch-sm">
                <span className="switch-label order-1">Activated</span>
                <input name="check" defaultChecked={false} type="checkbox" value={item.id} className="order-2" 
                  data-price={item.pricePerMonth} data-name={item.name} readOnly onChange={handleToggle}/>
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
          <AddOnShowcaseSignUpModal open={detailsModalOpen} onOpenChange={handleDetailsModalClose} selectedAddOn={selectedAddOn}/>
        </div>
      )}
      
    </div>
    
    
    
  );
};

export { InfoCardsSignUp };
