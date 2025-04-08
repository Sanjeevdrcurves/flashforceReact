import React from 'react';
import { useState, useEffect, Fragment } from 'react';
import { PageNavbar } from '@/pages/account';
import { Toolbar, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { Company, CreateCompany, LinkCompany } from './blocks/company';
import { useParams  } from 'react-router-dom';
import { CompanyProfile } from '../../billing/clientbilling/blocks';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';

const CompanyManagement = () => {
  const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
  const {userId,companyId, email}=useSelector(state=>state.AuthReducerKey);
  const { type } = useParams();
  
  const [companies, setCompanies] = useState([]);
  const [cTypes, setCTypes] = useState([]);
  //console.log(type);

  useEffect(() => {
    fetchCompaniesByAdminUser();
  }, []);

  

  const fetchCompaniesByAdminUser = async () => {
    
    try {
      var nietos = [];
      var filterCompTypes = [];
      const response = await axios.get(`${API_URL}/Company/CompaniesByAdminUser`, 
        {
          params:{
            userId: userId
          }
        });
      console.log('CompaniesByAdminUser Response:', response.data);
      if (response.data.length > 0) {
        response.data.map((item, index) => {
          let date = new Date(item.createdDate);
          let createdDate = new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(date);
            
          var comp = {  
            companyId: item.companyId,
            user: {
              avatar: '300-33.png',
              userName: item.companyName,
              userGmail: item.email? item.email:''
            },
            role: item.hierarchyName,
            status: {
              label: item.parentName? item.parentName:'',
              color: 'success'
            },
            location: item.relationshipNumber,
            flag: '',
            activity: createdDate
          }
          nietos.push(comp);
          if(filterCompTypes.indexOf(item.hierarchyName) === -1) 
            filterCompTypes.push(item.hierarchyName)
          //filterCompTypes.push(item.hierarchyName);
        })
      }
      setCompanies(nietos);
      setCTypes(filterCompTypes);
      
    } catch (error) {
      console.error('Error CompaniesByAdminUser:', error);
    }
  };

  const deleteCompany = async (id) => {
    debugger;
    const url = `${API_URL}/Company/delete/${id}`;
    const params = { modifiedBy: userId };

    try {
        const response = await axios.delete(url, {
            params: params, // Query parameters
        });
        console.log('Response:', response.data);
        toast.success("Company removed from the list");
        fetchCompaniesByAdminUser();
    } catch (error) {
        toast.error("Error in deleting company");
        console.error('Error deleting the company:', error);
    }
  };

    // const handleHierarchyChange = (hierarchyId) => {
    //   setSelectedHierarchy(hierarchyId);
    // };
    return (
       <Fragment>
    <PageNavbar />
     <div className="container-fixed" id='CompanyManagement'>
      
       <Toolbar>
            <ToolbarHeading>
              <h1 className="text-xl font-medium leading-none text-gray-900">Company & Agency Management Module</h1>
              <div className="flex items-center gap-2 text-sm font-normal text-gray-700"><div className="flex items-center gap-2 text-sm font-medium"><span className="text-gray-800 font-medium">Effortless organization for streamlined operations.</span></div></div>
            </ToolbarHeading>
          
            <div className='flex gap-3'>
              <CreateCompany onItemSaved={fetchCompaniesByAdminUser} toast={toast}/>
              <LinkCompany onItemSaved={fetchCompaniesByAdminUser} toast={toast}/>
            </div>
            


          </Toolbar>
          <div className="col-span-2">
        <CompanyProfile />
      </div>
   <div className="grid gap-5 lg:gap-7.5">
           <Company companies={companies} filterTypes={cTypes} deleteCompany={(id) => deleteCompany(id)}/>

      

    </div>
    </div>
    
    </Fragment>
    );
};

export default CompanyManagement;
