// src/pages/billing/plan/createanewplan/CreateANewPlan.jsx
import React, { useState, useEffect } from 'react';
import { Fragment } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toolbar, ToolbarActions, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { PageNavbar } from '@/pages/account';
//import { PermissionsToggle,PlanDetails,MedicalPlans } from './blocks';
import { PermissionsToggle,PlanDetails } from './blocks';
//import  {MedicalPlan} from './blocks';
import axios from 'axios';
import { RightDrawer } from './blocks';
import { useSelector } from 'react-redux';
import MedicalPlans from './blocks/MedicalPlans';
import { Container } from '@/components/container';

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const UserPlan = () => {
  const { companyId } = useSelector((state) => state.AuthReducerKey);
  const [pCategories, setPCategories] = useState([]);
  const [pFeatures, setPFeatures] = useState([]);
  const [selectedPCategory, setSelectedPCategory] = useState(null);
  const [pCategoriesTypes, setPCategoriesTypes] = useState([]);
  const [selectedPCatType, setSelectedPCatType] = useState(null); 
  const [updateMasterPlanId, setUpdateMasterPlanId] = useState(null); 
  const [updateMasterPlan, setUpdateMasterPlan] = useState(null); 
  const [updateMPlanFeatures, setUpdateMPlanFeatures] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchFlag, setFetchFlag] = useState(null);
  const[planchnage,setPlanchnage]=useState(null)

  useEffect(() => {
    // resetting previous selected features. 
    setPFeatures([]);
    setFeaturesModules({
      selectedItems: []
    });
    
    if(updateMasterPlanId){
      fetchMasterPlanById(updateMasterPlanId);
    }
    else{
      fetchPFeatures([]);
    }
    
  }, [updateMasterPlanId]);

  const fetchPFeatures = async (selectedFeaturesIds) => {

    var nietos = [];
    try {
      const response = await axios.get(`${API_URL}/Feature/GetAllFeaturesByCompanyNonCheckBox/${updateMasterPlanId??0}`);
      if (response.data.length > 0) {
        var selectedItemsTmp = [];
        response.data.map((item, index) => {
          var checkedF = false;
          if(selectedFeaturesIds && selectedFeaturesIds.length)
            selectedFeaturesIds.map((fId, idx) => {
              if(item.id==parseInt(fId)){
                checkedF = true;

                selectedItemsTmp.push(fId);
                setFeaturesModules({
                  selectedItems: selectedItemsTmp
                });
              }
          });
          var feature = {
            id: item.id,
            icon: 'users',
            title: item.name,
            description: item.description,
            checked: checkedF,
            entityCount:item.entityCount ?? 0 ,
            isToggle: item.isToggle, // Include isToggle here
            featureCategoryName: item.featureCategoryName || "Un Categorized",
          }
          nietos.push(feature);
        })
      }
      
      
      setPFeatures(nietos);
      // if (response.data.length > 0) {
      //   setSelectedCategory(response.data[0].planCategoryId);
      // }
      setLoading(false);
    } catch (err) {
      setError('Failed to load features');
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchPCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/PlanCategory`);
        setPCategories(response.data);
        if (response.data.length > 0) {
          // on edit it selecting first plan so commented it.
          // setSelectedPCategory(response.data[0].planCategoryId);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load categories');
        setLoading(false);
      }
    };
    fetchPCategories();
  }, [planchnage]);

  useEffect(() => {
      if (!selectedPCategory) return;
  
      const fetchPRadioOptions = async () => {
        try {
          const response = await axios.get(
            `${API_URL}/PlanType/GetByPlanCategory?planCategoryId=${selectedPCategory}`
          );
          setPCategoriesTypes(response.data);
          setSelectedPCatType(response?.data[0]?.planTypeId)
        } catch (err) {
          console.error('Failed to fetch options:', err);
        }
      };
  
      fetchPRadioOptions();
    }, [selectedPCategory]);

  const fetchMasterPlanById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/MasterPlan/GetById/${id}`);
        console.log('fetchMasterPlanById: '+response.data);
        
        const masterPlan = response.data;
        if(masterPlan){
          
          if(masterPlan.features && masterPlan.features.length){
          
            fetchPFeatures(masterPlan.features.split(','));
          }

        }
        
    } catch (error) {
        console.error('Error fetching MasterPlan by ID:', error);
    }
  };

  const handlePCategoryChange = (categoryId) => {
    setSelectedPCategory(categoryId);
 
  };

  const handlePCatTypeChange = (catTypeId) => {
    setSelectedPCatType(catTypeId);
    //console.log("Selected PlanTypeId:", catTypeId);
  };
  const handleFetchFlag = (masterPlanId) => {
    //debugger;
    setFetchFlag(masterPlanId);
  };

  const [featureModules, setFeaturesModules] = useState({
    selectedItems: []
  });
  const handlePFeatureToggleChange = (e) => {
    // Destructuring
    // const { value, checked } = e.target;
    // const { selectedItems } = featureModules;

    // console.log(`${value} is ${checked}`);

    // Case 1 : The user checks the box
    // if (checked) {
    //   setFeaturesModules({
    //       selectedItems: [...selectedItems, value]
    //     });
    // }

    // Case 2  : The user unchecks the box
    // else {
    //   setFeaturesModules({
    //       selectedItems: selectedItems.filter(
    //           (e) => e !== value
    //       ),
            
    //     });
    // }
    //console.log(featureModules.selectedItems)
  };

  const editPlanHandler = (planDetails) => { 
      //debugger;
      //fetchMasterPlanById(planDetails.planId);
      setUpdateMasterPlanId(planDetails.planId);
      setUpdateMasterPlan(planDetails);

      
  };
  
  
  return (
    <div className="container m-0 w-full">
                <Container>
                    <Fragment>  
      
      <PageNavbar />  

         <Toolbar>
            <ToolbarHeading>
               <h1 className="text-xl font-medium leading-none text-gray-900">Upgrade A Plan</h1>
              <div className="flex items-center gap-2 text-sm font-normal text-gray-700"><div className="flex items-center gap-2 text-sm font-medium"><span className="text-gray-800 font-medium">Innovative strategy for effective execution</span></div></div>
            </ToolbarHeading>
            
          
          </Toolbar>
    <MedicalPlans isplanChnage={setPlanchnage} setSelectedPCategory={setSelectedPCategory} setSelectedPCatType={setSelectedPCatType} selectedPCategory={selectedPCategory} selectedPCatType={selectedPCatType} fetchFlag={fetchFlag} editPlanHandler={(masterPlan)=>editPlanHandler(masterPlan)}/>

      </Fragment>
      </Container>
      </div>
  );
}

export default UserPlan;
