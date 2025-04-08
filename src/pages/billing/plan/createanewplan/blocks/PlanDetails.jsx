import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RightDrawer.css'; 
//import { ToastContainer, toast } from 'react-toastify';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
//const { companyId ,fullName} = useSelector((state) => state.AuthReducerKey);
const fullName="system";
const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
const PlanDetails = ({categories, selectedCategory, categoryChangeHandler,
  categoriesTypes, selectedCatType, handleCatTypeChange,isClear,setUpdateMasterPlanId,
  selectedFeatures, fetchFlagHandler, updateMasterPlanId, updateMasterPlan,setIsDrawerOpen
}) => {
  
  const [txtPlanDesc, setPlanDesc] = useState('');
  const [txtPlanMonthlyAmt, setPlanMonthlyAmt] = useState('');
  const [txtPlanYearlyAmt, setPlanYearlyAmt] = useState('');
  const [planFreeTr, setPlanFreeTr] = useState('');
  const [createButtonTitle, setCreateButtonTitle] = useState('Create Plan');

  const [disabledCat, setDisabledCat] = useState(false);
  const [disabledCatType, setDisabledCatType] = useState(false);
  const [txtPricePerLinkedAccount, setPricePerLinkedAccount] = useState('');
  // const [txtParentAccountCnt, setParentAccountCnt] = useState('');
  // const [txtPricePerParentAccount, setPricePerParentAccount] = useState('');
  

  const [planName, setPlanName] = useState("");
  const [description, setDescription] = useState("");
  const [monthlyAmount, setMonthlyAmount] = useState(0);
  const [yearlyAmount, setYearlyAmount] = useState(0);
  const [isMostPopular, setIsMostPopular] = useState(0);
  const [isTrial, setIsTrial] = useState(false);
  const [freeTrailPeriod, setFreeTrailPeriod] = useState(0);
  const [userCnt, setUserCnt] = useState(0);
  const [pricePerUser, setPricePerUser] = useState(0);
  const [contactCnt, setContactCnt] = useState(0);
  const [pricePerContact, setPricePerContact] = useState(0);
  const [locationCnt, setLocationCnt] = useState(0);
  const [pricePerLocation, setPricePerLocation] = useState(0);
  const [linkedAccountCnt, setLinkedAccountCnt] = useState(0);
  const [pricePerLinkedAcc, setPricePerLinkedAcc] = useState(0);

  const [linkedParentAccCnt, setLinkedParentAccountCnt] = useState(0);
  const [pricePerLinkedParentAcc, setPricePerLinkedParentAccount] = useState(0);
  const [parentAccCnt, setParentAccountCnt] = useState(0);
  const [pricePerParentAcc, setPricePerParentAccount] = useState(0);


  const [planDetail, setPlanDetail] = useState("");
  // useEffect(() => {
  //   if(updateMasterPlanId && updateMasterPlan){
  //     //debugger;
  //     // title: plan.PlanName,
  //     // description: plan.Description,
  //     // planId: plan.MasterPlanId,
  //     // price: {
  //     //   regular: `$${plan.MonthlyAmount}`,
  //     //   annual: `$${plan.YearlyAmount}`,
  //     // },
  //     // free: plan.MonthlyAmount <= 0,
  //     //freePeriod: plan.FreeTrailPeriod,
  //    // monthlyAmount: plan.MonthlyAmount,
  //      //       yearlyAmount: plan.YearlyAmount

  //     setPlanName(updateMasterPlan.title);
  //     setPlanDesc(updateMasterPlan.description);
  //     setPlanMonthlyAmt(updateMasterPlan.monthlyAmount);
  //     setPlanYearlyAmt(updateMasterPlan.yearlyAmount);
  //     setPlanFreeTr(updateMasterPlan.freePeriod || '');
  //     setContactCnt(updateMasterPlan.contactCnt || '');
  //     setPricePerContact(updateMasterPlan.pricePerContact || '');
  //     setLocationCnt(updateMasterPlan.locationCnt || '');
  //     setPricePerLocation(updateMasterPlan.pricePerLocation || '');
  //     setLinkedAccountCnt(updateMasterPlan.linkedAccountCnt || '');
  //     setPricePerLinkedAccount(updateMasterPlan.pricePerLinkedAccount || '');
  //     setParentAccountCnt(updateMasterPlan.parentAccountCnt || '');
  //     setPricePerParentAccount(updateMasterPlan.pricePerParentAccount || '');

  //     setDisabledCat(true);
  //     setDisabledCatType(true);
  //     setCreateButtonTitle('Update Plan');
      // categoryChangeHandler(selectedCategory);
      // handleCatTypeChange(selectedCatType);
      // fetchFlagHandler(response.data[0].masterPlanId);
  //   }
  //   else{
  //     handleReset();
  //   }
    
  // }, [updateMasterPlanId]);
 
    useEffect(() => {
    if (updateMasterPlanId) {
      fetchMasterPlanById(updateMasterPlanId);
    }
  }, [updateMasterPlanId]);

   const fetchMasterPlanById = async (id) => {
   
      try {
          const response = await axios.get(`${API_URL}/MasterPlan/GetById/${id}`);
          console.log('fetchMasterPlanById: '+response.data);
          debugger
          const masterPlan = response.data;
          if(masterPlan){
            
            if(masterPlan.features && masterPlan.features.length){
              // selectedCategory=masterPlan?.planCategoryId;
              // selectedCatType=masterPlan?.planTypeId;
              categoryChangeHandler(masterPlan?.planCategoryId);
              handleCatTypeChange(masterPlan?.planTypeId);
              fetchFlagHandler(masterPlan?.masterPlanId);

            setPlanName(masterPlan?.planName);
            setDescription(masterPlan?.description);
            setUserCnt(masterPlan?.userCnt);
            setPricePerUser(masterPlan?.pricePerUser);
            setContactCnt(masterPlan?.contactCnt);
            setPricePerContact(masterPlan?.pricePerContact);
            setLocationCnt(masterPlan?.locationCnt);
            setPricePerLocation(masterPlan?.pricePerLocation);
            setLinkedAccountCnt(masterPlan?.linkedAccountCnt);
            setPricePerLinkedAccount(masterPlan?.pricePerLinkedAcc);

            setLinkedParentAccountCnt(masterPlan?.linkedParentAccCnt);
            setPricePerLinkedParentAccount(masterPlan?.pricePerLinkedParentAcc);
            setParentAccountCnt(masterPlan?.parentAccCnt);
            setPricePerParentAccount(masterPlan?.pricePerParentAcc);

            setPlanFreeTr(masterPlan?.freeTrailPeriod);
            setPlanDetail(masterPlan?.planDetail);
          
            setIsMostPopular(masterPlan?.isMostPopular?1:0);
            setIsTrial(masterPlan?.isTrial?1:0);
            setDisabledCat(true);
                setDisabledCatType(true);
                setCreateButtonTitle('Update Plan');
                // categoryChangeHandler(selectedCategory);
                // handleCatTypeChange(selectedCatType);
               // fetchFlagHandler(response.data[0].masterPlanId);
          }
        }
          
      } catch (error) {
          console.error('Error fetching MasterPlan by ID:', error);
      }
    };
    useEffect(()=>{
if(isClear)
{
  categoryChangeHandler('');
  handleCatTypeChange('');
  fetchFlagHandler('');

setPlanName('');
setDescription('');
setUserCnt('');
setPricePerUser('');
setContactCnt('');
setPricePerContact('');
setLocationCnt('');
setPricePerLocation('');
setLinkedAccountCnt('');
setPricePerLinkedAccount('');

setLinkedParentAccountCnt('');
setPricePerLinkedParentAccount('');
setParentAccountCnt('');
setPricePerParentAccount('');

setPlanFreeTr('');
setPlanDetail('');

setIsMostPopular(0);
setIsTrial(0);
}
    },[isClear])
  function handleCreatePlan() {
    //toast("Wow so easy!");
    console.log(selectedFeatures);
    

    if(!planName){
      toast.warning("Plan name required!");
      return;
    }
    if(!description){
      toast.warning("Description required!");
      return;
    }
    // if(!selectedFeatures || !selectedFeatures.length){
    //   toast.warning("Atleast one feature must be selected!");
    //   return;
    // } debugger;

    if(!updateMasterPlanId){
       
      addMasterPlan( false);
    }
    else{
         
      addMasterPlan( true);
    }
    
    //debugger;
    //selectedFeatures;
    
  }

  const addMasterPlan = async (update) => {
    debugger;
    // const params = {
    //   planCategoryId: 1,
    //   planTypeId: 1,
    //   planName: 'anas test',
    //   description: 'testing',
    //   monthlyAmount: 33,
    //   yearlyAmount: 22,
    //   freeTrailPeriod: 30,
    //   createdBy: 'anas',
    // };
  
    
    try {
      var response = null;
      if(!update){
        // const url = `${API_URL}/MasterPlan/AddWithFeatures`;
        // response = await axios.post(url, {}, { headers, params });
         response = await axios.post(
          `${API_URL}/MasterPlan/AddWithFeatures`, 
          // null, // No body is sent for query params
          // {
          //   params:
           {
              masterPlanId: 0,
            planCategoryId: selectedCategory,
            planTypeId: selectedCatType,
            planName: planName,
            description: description,
            userCnt: userCnt,
            pricePerUser: pricePerUser,
            contactCnt: contactCnt,
            pricePerContact: pricePerContact,
            locationCnt: locationCnt,
            pricePerLocation: pricePerLocation,
            linkedAccountCnt: linkedAccountCnt,
            pricePerLinkedAccount: pricePerLinkedAcc,
            parentAccCnt: parentAccCnt,
            pricePerParentAcc: pricePerParentAcc,
            freeTrailPeriod: planFreeTr,
            planDetails: planDetail || "",
            isMostPopular: isMostPopular ?  true : false,
            isTrial: isTrial ? true : false,
            modifiedBy: fullName,
            featureData: selectedFeatures.map((feature) => ({
              isFeatureActive: feature.checked || false, // Boolean fallback
             // description: feature.description || "", // String fallback
              entityCount: feature.entityCount ? String(feature.entityCount) : "0", // Ensure string
            // icon: feature.icon || "", // String fallback
              id: feature.id || 0, // Fallback to null if ID is missing
            //  isToggle: feature.isToggle || false, // Boolean fallback
            //  title: feature.title || "", // String fallback
            })),
          },
          {
            headers: {
              'Content-Type': 'application/json', // Ensure correct Content-Type
            },
          }
        );
      }
      else{
        // const url = `${API_URL}/MasterPlan/UpdateWithFeatures`;
        // response = await axios.post(url, {}, { headers, params });
        //  response = await axios.put(url, params, {
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        // });

        // const response = await axios.post(
        //           `${API_URL}/MasterPlan/UpdateWithFeatures`, 
        //           null, // No body is sent for query params
        //           {
        //             params,
        //             headers: {
        //               'Content-Type': 'application/json',
        //             },
        //           }
        //         ); 


         response = await axios.post(
                  `${API_URL}/MasterPlan/UpdateWithFeatures`, 
                  // null, // No body is sent for query params
                  // {
                  //   params:
                   {
                      masterPlanId: updateMasterPlanId,
                    planCategoryId: selectedCategory,
                    planTypeId: selectedCatType,
                    planName: planName,
                    description: description,
                    userCnt: userCnt,
                    pricePerUser: pricePerUser,
                    contactCnt: contactCnt,
                    pricePerContact: pricePerContact,
                    locationCnt: locationCnt,
                    pricePerLocation: pricePerLocation,
                    linkedAccountCnt: linkedAccountCnt,
                    pricePerLinkedAccount: pricePerLinkedAcc,
                    parentAccCnt: parentAccCnt,
                    pricePerParentAcc: pricePerParentAcc,
                    freeTrailPeriod: planFreeTr,
                    planDetails: planDetail || "",
                    isMostPopular: isMostPopular ?  true : false,
                    isTrial: isTrial ? true : false,
                    modifiedBy: fullName,
                    featureData: selectedFeatures.map((feature) => ({
                      isFeatureActive: feature.checked || false, // Boolean fallback
                     // description: feature.description || "", // String fallback
                      entityCount: feature.entityCount ? String(feature.entityCount) : "0", // Ensure string
                    // icon: feature.icon || "", // String fallback
                      id: feature.id || 0, // Fallback to null if ID is missing
                    //  isToggle: feature.isToggle || false, // Boolean fallback
                    //  title: feature.title || "", // String fallback
                    })),
                  },
                  {
                    headers: {
                      'Content-Type': 'application/json', // Ensure correct Content-Type
                    },
                  }
                );
      }
      console.log('Response:', response);
      if(response.data && response.data.length){
        //debugger;
        handleReset();
        // categoryChangeHandler(selectedCategory);
        // handleCatTypeChange(selectedCatType);
        
        //fetchFlagHandler(response.data[0].masterPlanId);
        if(!update){ toast.success("Plan Saved Sucessfully!");}
        else{
          toast.success("Plan updated Sucessfully!");
        }
       
        fetchFlagHandler(new Date());
        updateMasterPlanId=0;
        setUpdateMasterPlanId(0);
      }
      
    } catch (error) {
      debugger;
      toast.error("Error saving record. Please try again later.");
      console.log('Error:', error.response ? error.response.data : error.message);
    }
  };

  function handleReset() {
    
    updateMasterPlanId = null;
   setPlanName('');
  setPlanDesc('');
  setPlanMonthlyAmt('');
  setPlanYearlyAmt('');
  setPlanFreeTr('');
  setContactCnt('');
  setPricePerContact('');
  setLocationCnt('');
  setPricePerLocation('');
  setLinkedAccountCnt('');
  setPricePerLinkedAccount('');
  setParentAccountCnt('');
  setPricePerParentAccount('');
  setDisabledCat(false);
  setDisabledCatType(false);
    //selectedCategory = categories?.data[0]?.planCategoryId;
    setCreateButtonTitle('Create Plan');
    setIsDrawerOpen(false);
  }
return(
  <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          Plan
        </h3>
      </div>
        <div className="grid gap-5 lg:gap-7.5">
            <div className="flex">
      <div className="bg-white p-6 rounded-lg shadow-md w-full">

        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Category */}
          <div>
            <span className="flex items-center gap-1.5 mb-2 leading-none font-medium text-sm text-gray-900">Category</span>
            {/* <Select defaultValue="active">
              <SelectTrigger className="w-full" size="sm">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent className="w-40">
                <SelectItem value="active">Select Month</SelectItem>
                <SelectItem value="disabled">1</SelectItem>
                <SelectItem value="pending">2</SelectItem>
              </SelectContent>
            </Select> */}
            <Select value={selectedCategory} onValueChange={categoryChangeHandler} disabled={disabledCat}>
              <SelectTrigger className="w-full" size="sm">
                <SelectValue placeholder="Select" >

                </SelectValue>
              </SelectTrigger>
              <SelectContent className="w-40 select-content" >
              {categories.map((category) => (
                <SelectItem key={category.planCategoryId} value={category.planCategoryId} >
                  {category.planCategoryName} 
                </SelectItem>
                
              ))}
              </SelectContent>
            </Select>
          </div>
          {/* Category Type */}
        <div>
            <span className="flex items-center gap-1.5 mb-2 leading-none font-medium text-sm text-gray-900">Category Type</span>
               {/* <Select defaultValue="active">
            <SelectTrigger className="w-full" size="sm">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent className="w-40">
              <SelectItem value="active">Select Month</SelectItem>
              <SelectItem value="disabled">1</SelectItem>
              <SelectItem value="pending">2</SelectItem>
            </SelectContent>
          </Select> */}
          <Select value={selectedCatType} onValueChange={handleCatTypeChange} disabled={disabledCatType}>
              <SelectTrigger className="w-full" size="sm">
                <SelectValue placeholder="Select" >

                </SelectValue>
              </SelectTrigger>
              <SelectContent className="w-40 select-content">
              {categoriesTypes.map((item) => (
                <SelectItem key={item.planTypeId} value={item.planTypeId} >
                  {item.planTypeName} 
                </SelectItem>
                
              ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Plan Name */}
        <div className="mb-4">
        <span className="flex items-center gap-1.5 mb-2 leading-none font-medium text-sm text-gray-900">Plan Name</span>
          <input
            type="text"
            placeholder="Type plan name"
            className="w-full border rounded-lg p-2 text-gray-500 bg-gray-50"
            value={planName} onChange={e => setPlanName(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="mb-4">
        <span className="flex items-center gap-1.5 mb-2 leading-none font-medium text-sm text-gray-900">Description</span>
          
          <textarea
            placeholder="Type description"
            className="w-full border rounded-lg p-2 text-gray-500 bg-gray-50"
            value={description} onChange={e => setDescription(e.target.value)}
          >
            
          </textarea>
        </div>

        {/* Monthly Amount & Annual Amount */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
          <span className="flex items-center gap-1.5 mb-2 leading-none font-medium text-sm text-gray-900">User</span>
            <input
              type="text"
              className="w-full border rounded-lg p-2 text-gray-500"
              placeholder="User" 
              value={userCnt} onChange={e => setUserCnt(e.target.value)}
            />
          </div>
          <div>
          <span className="flex items-center gap-1.5 mb-2 leading-none font-medium text-sm text-gray-900">Price Per User</span>

            <input
              type="text"
              className="w-full border rounded-lg p-2 text-gray-500"
              placeholder="Price Per User"
              value={pricePerUser} onChange={e => setPricePerUser(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
          <span className="flex items-center gap-1.5 mb-2 leading-none font-medium text-sm text-gray-900">Contact</span>
            <input
              type="text"
              className="w-full border rounded-lg p-2 text-gray-500"
              placeholder="Contact" 
              value={contactCnt} onChange={e => setContactCnt(e.target.value)}
            />
          </div>
          <div>
          <span className="flex items-center gap-1.5 mb-2 leading-none font-medium text-sm text-gray-900">Price Per Contact</span>

            <input
              type="text"
              className="w-full border rounded-lg p-2 text-gray-500"
              placeholder="Price Per Contact"
              value={pricePerContact} onChange={e => setPricePerContact(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
          <span className="flex items-center gap-1.5 mb-2 leading-none font-medium text-sm text-gray-900">Location</span>
            <input
              type="text"
              className="w-full border rounded-lg p-2 text-gray-500"
              placeholder="Location" 
              value={locationCnt} onChange={e => setLocationCnt(e.target.value)}
            />
          </div>
          <div>
          <span className="flex items-center gap-1.5 mb-2 leading-none font-medium text-sm text-gray-900">Price Per Location</span>

            <input
              type="text"
              className="w-full border rounded-lg p-2 text-gray-500"
              placeholder="Price Per Location"
              value={pricePerLocation} onChange={e => setPricePerLocation(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
          <span className="flex items-center gap-1.5 mb-2 leading-none font-medium text-sm text-gray-900">Linked Account</span>
            <input
              type="text"
              className="w-full border rounded-lg p-2 text-gray-500"
              placeholder="Linked Account" 
              value={linkedAccountCnt} onChange={e => setLinkedAccountCnt(e.target.value)}
            />
          </div>
          <div>
          <span className="flex items-center gap-1.5 mb-2 leading-none font-medium text-sm text-gray-900">Price Per Linked Account</span>

            <input
              type="text"
              className="w-full border rounded-lg p-2 text-gray-500"
              placeholder="Price Per Linked Account"
              value={pricePerLinkedAcc} onChange={e => setPricePerLinkedAcc(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
          <span className="flex items-center gap-1.5 mb-2 leading-none font-medium text-sm text-gray-900">Parent Account</span>
            <input
              type="text"
              className="w-full border rounded-lg p-2 text-gray-500"
              placeholder="Parent Account" 
              value={parentAccCnt} onChange={e => setParentAccountCnt(e.target.value)}
            />
          </div>
          <div>
          <span className="flex items-center gap-1.5 mb-2 leading-none font-medium text-sm text-gray-900">Price Per Parent Account</span>

            <input
              type="text"
              className="w-full border rounded-lg p-2 text-gray-500"
              placeholder="Price Per Parent Account"
              value={pricePerParentAcc} onChange={e => setPricePerParentAccount(e.target.value)}
            />
          </div>
        </div>
       
        <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="col-span-1"><span className="switch switch-sm">
          <input  name="param" type="checkbox" defaultChecked={isMostPopular}   />
          {/* <input defaultChecked={item.checked} name="param" type="checkbox" value="1000" readOnly /> */}
          Mark as Most Popular
        </span></div>
          <div className="col-span-1"><span className="switch switch-sm">
          <input  name="param" type="checkbox" defaultChecked={isTrial} value="1001" readOnly/>Free Trial Available
        </span></div> </div>
        {/* Free Trial Period */}
        <div className="mb-4 mt-4">
          <span className="flex items-center gap-1.5 mb-2 leading-none font-medium text-sm text-gray-900">Free Trial Period</span>

          <input
            type="number"
            className="w-full border rounded-lg p-2 text-gray-500"
            placeholder="Free Trial Period"
            value={planFreeTr} onChange={e => setPlanFreeTr(e.target.value)}
          />
        </div>
        <div className="mb-4">
        <span className="flex items-center gap-1.5 mb-2 leading-none font-medium text-sm text-gray-900">Plan Details</span>
          
          <textarea
            placeholder="Type description"
            className="w-full border rounded-lg p-2 text-gray-500 bg-gray-50"
            value={planDetail} onChange={e => setPlanDetail(e.target.value)}
          >
            
          </textarea>
        </div>
        <div className="card-footer justify-center w-full  gap-2.5">
       {!updateMasterPlanId? <button className="btn btn-primary w-full justify-center" onClick={() => handleCreatePlan()}>
          {createButtonTitle}
        </button>:<button className="btn btn-primary w-full justify-center" onClick={() => handleCreatePlan()}>
          Update Plan
        </button>}
        <button className="btn btn-primary w-full justify-center" onClick={() => handleReset()} >
              Reset
            </button>
      </div>
      </div>
    </div>
          
        </div>
        {/* <ToastContainer position="top-right"
          autoClose={3000}
          theme="dark"/> */}
      </div>
  );
  
}
export { PlanDetails };