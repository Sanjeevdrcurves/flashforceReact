//import { useGoogleLogin , googleLogout} from '@react-oauth/google';
import axios from 'axios';
import React, { Fragment, useState, useEffect } from "react";
import { PageNavbar } from "@/pages/account";
import { Toolbar, ToolbarHeading,ToolbarActions } from "@/partials/toolbar";
import { useSelector } from 'react-redux';
import { UserEmails } from './blocks';
import { toast } from 'sonner';


const GoogleLoginComponent = () => {
  const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
  const {userId,companyId}=useSelector(state=>state.AuthReducerKey);
  const[isDrawerOpen,setisDrawerOpen]=useState(false);
  const[customerCards,setCustomerCards]=useState([]);
  const [activeTab, setActiveTab] = useState("account");
  const [bccEmail, setBccEmail] = useState("anas.bcc@flashforcemail.com");

  useEffect(() => {
    fetchUserEmails();
      }, []);

  const fetchUserEmails = async () => {
    var nietos = [];
    axios
          .get(`${API_URL}/email/GetUserEmailsByUserId/${userId}`)
          .then((response) => {


            response?.data?.map((item) => {
              var comp = {
                id: item.id,
                logo: 'google.svg',
                title: 'Gmail',
                email: item.email,
                label: item.isDefault
              }
              nietos.push(comp);
            });
            setCustomerCards(nietos);
            
            
          })
          .catch((error) => {
            console.error('Error fetching StripeCustomer data:', error);
            
          });
    
    
  };

  const deletePaymentMethod = async (id) => {
    const url = `${API_URL}/Payment/DeleteStripePaymentMethoddddd/${id}`;
    

    try {
        const response = await axios.delete(url);
        console.log('Response:', response.data);
        setCustomerCards([]);
        fetchUserEmails();
        toast.success("Payment method removed from the list");
        
    } catch (error) {
        toast.error("Error in deleting payment method");
        console.error('Error deleting payment method:', error);
    }
  };
  
  const handleLogin = () => {
    const clientId = "263841041940-41tnc7g7aohnf2bsi0h5v36g30of7hqs.apps.googleusercontent.com";
    const redirectUri = window.location.origin + "/metronic/tailwind/react/email/google/callback";
    //const scope = "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/gmail.metadata https://www.googleapis.com/auth/gmail.send openid email profile";
    const scope = "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/gmail.send openid email profile";
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent`;

    window.location.href = authUrl;
};

  // const login = useGoogleLogin({
  //     clientId: "263841041940-41tnc7g7aohnf2bsi0h5v36g30of7hqs.apps.googleusercontent.com", // Enforce the correct Client ID
  //     scope: 'https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.readonly openid email profile',
  //     redirect_uri: window.location.origin + "/metronic/tailwind/react/email/google/callback", // Dynamic Redirect URI
  //     //flow: 'implicit',
  //     onSuccess: async tokenResponse => {
  //         try {
  //             // Get user info
  //             const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
  //                 headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
  //             });
  //             debugger;

  //             // Send the token to the backend
  //             await axios.post(`${API_URL}/email/SaveUserEmails`, {
  //                 userId,
  //                 type:'GMAIL',
  //                 email: userInfo.data.email,
  //                 accessToken: tokenResponse.access_token,
  //                 refreshToken: tokenResponse.refresh_token // This is needed for long-term access
  //             });
  //             fetchUserEmails();
  //             toast.success("Gmail Account Connected!");
  //             //debugger;
  //             // Redirect to the callback page after login
  //             //window.location.href = "/email/google/callback?token=" + tokenResponse.access_token;
  //         } catch (error) {
  //             console.error("Error during authentication", error);
  //         }
  //     },
  //     onError: error => console.log("Login Failed:", error)
  // });

  // const logout = () => {
  //   googleLogout();
  //   localStorage.removeItem("google_access_token");
  //   console.log("User logged out");
  //   window.location.reload(); // Reload to force fresh login
  // };

  // const forceGoogleLogout = () => {
  //   window.open("https://accounts.google.com/logout", "_blank");
  //   setTimeout(() => {
  //     window.location.reload();
  //   }, 2000);
  // };

  return <Fragment>
      <PageNavbar />
      <div className="container mx-auto px-4 py-6">
        <Toolbar>
          <ToolbarHeading>
            <h1 className="text-xl font-medium text-gray-900">Configure Email</h1>
            <p className="text-sm text-gray-700">Enhance Workflow with email Integrations</p>
          </ToolbarHeading>
        </Toolbar>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-4">
            {["account", "smartbcc", "general"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 font-medium text-sm transition ${
                  activeTab === tab ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "account" ? "Account" : tab === "smartbcc" ? "Smart Bcc" : "General Settings"}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {activeTab === "account" && (
            <>
              <button className="btn btn-primary" onClick={handleLogin}>
                Sync Email
              </button>
              <div className="col-span-2 lg:col-span-1 flex">
                <UserEmails setisDrawerOpen={setisDrawerOpen} customerCards={customerCards} deletePaymentMethod={deletePaymentMethod} />
              </div>
            </>
          )}

          {activeTab === "smartbcc" && (
            <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-lg">
              <label className="block text-sm font-medium text-gray-700">Smart Bcc Email</label>
              <div className="flex items-center mt-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                  value={bccEmail}
                  readOnly
                />
                <button
                  className="bg-green-600 text-white px-3 py-2 rounded-r-md hover:bg-green-700"
                  onClick={() => navigator.clipboard.writeText(bccEmail)}
                >
                  Copy
                </button>
                <button
                  className="ml-2 text-blue-600 hover:text-blue-800"
                  onClick={() => setBccEmail(prompt("Enter new Bcc Email", bccEmail) || bccEmail)}
                >
                  Change
                </button>
              </div>
            </div>
          )}

          {activeTab === "general" && <p className="text-gray-600">No settings available.</p>}
        </div>
      </div>
    </Fragment>
    
    ;
};

export default GoogleLoginComponent;
