import { FormattedMessage } from 'react-intl';
import { useState, useEffect, Fragment } from 'react';
import { KeenIcon } from '@/components';
import { MenuItem, MenuLink, MenuTitle, MenuIcon, MenuBadge, MenuSub } from '@/components/menu';
import clsx from 'clsx';
import { I18N_LANGUAGES, useLanguage } from '@/i18n';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { toAbsoluteUrl } from '@/utils';
import { Authhandler } from '../../../redux/actions';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import "./DropdownUserEntities.css"; // Import the CSS file for styling
import { fetchMenu } from "../../../config/menu.config"; // Import the fetchMenu function
//import * as authHelper from '../_helpers';
const DropdownUserEntities = ({
  menuItemRef
}) => {
  // const {
  //   currentLanguage,
  //   changeLanguage
  // } = useLanguage();
  const {
    isRTL
  } = useLanguage();
  // const handleLanguage = lang => {
  //   changeLanguage(lang);
  //   if (menuItemRef.current) {
  //     menuItemRef.current.hide(); // Call the closeMenu method to hide the submenu
  //   }
  // };
  

  const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
  const {userId,companyId, userToken, parentEmail, parentUserId}=useSelector(state=>state.AuthReducerKey);
  const [companies, setCompanies] = useState([]); 
  const [currentCompany, setCurrentCompany] = useState([]); 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //enforcing userId to take effect after switching user
  useEffect(() => {
    console.log('User ID changed:', userId);
    // Fetch the menu dynamically after switch
    fetchMenu();
  }, [userId]);

  useEffect(() => {
    fetchCompaniesByAdminUser();
  }, []);
  
  useEffect(() => {
    fetchCompanyByUser();
  }, []);

  const fetchCompaniesByAdminUser = async () => {
    
    try {
      var nietos = [];
      const response = await axios.get(`${API_URL}/Company/CompaniesByAdminUser`, 
        {
          params:{
            userId: parentUserId
          }
        });
      console.log('CompaniesByAdminUser Response:', response.data);
      if (response.data.length > 0) {
        response.data.map((item, index) => { 
          var comp = {  
  
            label: item.companyName,
            code: item.companyId,
            direction: 'ltr',
            flag: toAbsoluteUrl('/media/app/company-48.png'), //item.companyImage,
            //messages: I18N_MESSAGES.en
          }
          nietos.push(comp);
        })
      }
      setCompanies(nietos);
      
    } catch (error) {
      console.error('Error CompaniesByAdminUser:', error);
    }
  };

  const fetchCompanyByUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/Company/GetCompanyByUserId/${userId}`);
        //debugger;
        console.log('GetCompanyByUserId Response:', response.data);
        setCurrentCompany(response.data);
      } catch (error) {
        console.error('Error ChildHierarchies:', error);
      }
    };

  const handleEntityChange = item => {
    // setCurrentCompany(item);
    // if (menuItemRef.current) {
    //   menuItemRef.current.hide(); // Call the closeMenu method to hide the submenu
    // }
    handleSwitchEntity(item.code);
  };

  const handleSwitchEntity = async (companyId) => {
    try {
        // Make the API request
        var NewEntityId = companyId;
        var UserId = parentUserId;
        var Email = parentEmail;
        const response = await axios.post(`${API_URL}/auth/switch-entity`, // API endpoint
            { UserId, NewEntityId, Email}, // Request body
            {
                headers: {
                    Authorization: `Bearer ${userToken}`, // Pass the JWT token
                    "Content-Type": "application/json",
                },
            }
        );

        // Handle successful response
        console.log(response.data);

        //logout methods
        //authHelper.removeAuth();
        ////setCurrentUser(undefined);

        //Login Formalities
        dispatch(Authhandler(response.data));
        localStorage.setItem('enterprise',response.data.enterprise);
        localStorage.setItem('agency',response.data.agency);
        localStorage.setItem('franchise',response.data.franchise);
        localStorage.setItem('conglomerate',response.data.conglomerate);
        setTimeout(() => {
          window.location.reload(); 
        }, 2000);
        
        //navigate('/', { replace: true });
    } catch (err) {
        // Handle errors
        debugger;
        if(err.status == 401)
          alert('Session invalid or expire. Please re-login.');
        console.log(err.response ? err.response.data : "Network error: "+err);
    }
  };
  const buildItems = () => {
    // return I18N_LANGUAGES.map((item, index) => <MenuItem key={index} className={clsx(item.code === currentLanguage.code && 'active')} onClick={() => {
    //   handleLanguage(item);
    // }}>
    return companies.map((item, index) => <MenuItem key={index} className={clsx(item.code === currentCompany.companyId && 'active','')} onClick={() => {
      handleEntityChange(item);
    }}>
        <MenuLink >
          <MenuIcon>
            <img src={item.flag} className="inline-block size-4 rounded-full" alt={item.label} />
          </MenuIcon>
          <MenuTitle>{item.label}</MenuTitle>
          {item.code === currentCompany.companyId && <MenuBadge>
              <KeenIcon icon="check-circle" style="solid" className="text-success text-base" />
            </MenuBadge>}
        </MenuLink>
      </MenuItem>);
  };
  return <MenuItem toggle="dropdown" trigger="hover" dropdownProps={{
    placement: isRTL() ? 'left-start' : 'right-start',
    modifiers: [{
      name: 'offset',
      options: {
        offset: isRTL() ? [-10, 0] : [10, 0] // [skid, distance]
      }
    }]
  }}>
      <MenuLink>
        <MenuIcon>
          <KeenIcon icon="data" />
        </MenuIcon>
        <MenuTitle>
          <FormattedMessage id="USER.MENU.LOGINAS" />
        </MenuTitle>
        <div className="flex items-center gap-1.5 rounded-md border border-gray-300 text-gray-600 p-1.5 text-2xs font-medium shrink-0">
          {currentCompany.companyName}
          <img src={toAbsoluteUrl('/media/app/company-48.png')} className="inline-block size-3.5 rounded-full" alt="{currentCompany.companyName}" />
        </div>
      </MenuLink>
      <MenuSub className="menu-default light:border-gray-300 w-[190px] menu-container-scroll">{buildItems()}</MenuSub>
    </MenuItem>;
};
export { DropdownUserEntities };