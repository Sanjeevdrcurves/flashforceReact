import React, { useState, useEffect } from 'react';
import { Fragment } from 'react';
import { PageNavbar } from '@/pages/account';
import { Toolbar,ToolbarActions, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { MiscHelp } from '@/partials/misc';
import { BillingInvoicing, CompanyProfile, LatestPayment, NextPayment, RightDrawerStripe, Upgrade } from './blocks';
//import { PaymentMethods } from '@/pages/account/billing/basic';
import { PaymentMethods } from './blocks';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

const ClientBillingPage = () => {
  const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
  const {userId, companyId, fullName, email}=useSelector(state=>state.AuthReducerKey);
  const[isDrawerOpen,setisDrawerOpen]=useState(false);
  const[customerCards,setCustomerCards]=useState([]);
  const[isTrial,setisTrial]=useState(true);
  const onDrawerCloseHandler=()=>{
    setisDrawerOpen(false);
  }
  useEffect(() => {
      fetchCustomerCards();
    }, []);

  useEffect(() => {
      // Fetch payment data from API
      axios
        .get(`${API_URL}/Payment/GetAllPaymentsByCompanyId/${companyId}`)
        .then((response) => {
          if(response.data && response.data.length){
            setisTrial(false);
          }
        })
        .catch((error) => {
          console.error('Error fetching payment data:', error);
          
        });
    }, []);
  
    
  const onItemSaved = async() => {
    fetchCustomerCards();
  }
    const fetchCustomerCards = async () => {
      var nietos = [];
      axios
            .get(`${API_URL}/Payment/GetStripeCustomerByUserId/${userId}`)
            .then((response) => {
              const card = response.data;
              if(card && card.id){
                var comp = {
                  id: card.id,
                  logo: card.cardBrand+'.svg',
                  title: card.cardTitle,
                  email: 'Ending '+card.cardLast4+'  Expires on '+card.exp,
                  label: true
                }
                nietos.push(comp);
                setCustomerCards(nietos);
              }
              
            })
            .catch((error) => {
              console.error('Error fetching StripeCustomer data:', error);
              
            });
      
      
    };

  const deletePaymentMethod = async (id) => {
      const url = `${API_URL}/Payment/DeleteStripePaymentMethod/${id}`;
      
  
      try {
          const response = await axios.delete(url);
          console.log('Response:', response.data);
          setCustomerCards([]);
          fetchCustomerCards();
          toast.success("Payment method removed from the list");
          
      } catch (error) {
          toast.error("Error in deleting payment method");
          console.error('Error deleting payment method:', error);
      }
    };
  return (
        <Fragment>
    <PageNavbar />   
    <div className="container-fixed" id='clientBilling'>
      
       <Toolbar>
            <ToolbarHeading>
              <h1 className="text-xl font-medium leading-none text-gray-900">Client Billing</h1>
              <div className="flex items-center gap-2 text-sm font-normal text-gray-700"><div className="flex items-center gap-2 text-sm font-medium"><span className="text-gray-800 font-medium">Advanced Billing Solutions for Large Businesses</span></div></div>
            </ToolbarHeading>
             <ToolbarActions>
                          <a href="billingenterprise" className="btn btn-sm btn-light">
                            Order History
                          </a>
                        </ToolbarActions>
            <div className='flex gap-3'>
              {/* <StripeCard onItemSaved={fetchCompaniesByAdminUser}/> */}
              <div>

                  {/* <button className="btn btn-success" onClick={()=>{setisDrawerOpen(true)}}><i className="ki-duotone ki-arrow-mix"></i>Link Entity</button> */}
                  {isDrawerOpen && (
                    <RightDrawerStripe
                      isDrawerOpen={isDrawerOpen}
                      onClose={onDrawerCloseHandler}
                      billingId={''}
                      onItemSaved={onItemSaved}
                    />
                  )}
              </div>
            </div>
          </Toolbar>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-7.5">
      <div className="col-span-2">
        {isTrial && (<Upgrade />)}
      </div>

      <div className="col-span-2">
        <CompanyProfile />
      </div>

      <div className="col-span-2 lg:col-span-1 flex">
        <LatestPayment />
      </div>

      <div className="col-span-2 lg:col-span-1 flex">
        <NextPayment />
      </div>

      <div className="col-span-2 lg:col-span-1 flex">
        <PaymentMethods setisDrawerOpen={setisDrawerOpen} customerCards={customerCards} deletePaymentMethod={(id) => deletePaymentMethod(id)} />
      </div>

      <div className="col-span-2 lg:col-span-1">
        <BillingInvoicing />
      </div>

      <div className="col-span-2">
        <MiscHelp />
      </div>
    </div>
      </div>
    
    </Fragment>
  );
};

export default ClientBillingPage;
