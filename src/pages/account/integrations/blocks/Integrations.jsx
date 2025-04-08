import { CardIntegration } from '@/partials/cards';
import axios from 'axios';
const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
const Integrations = () => {
  const items = [{
    logo: 'stripe.svg',
    path: '/account/billing/basic',
    name: 'Stripe',
    description: 'Software and APIs to accept payments, send payouts, and manage their businesses online.',
    actions: <div className="switch switch-sm">
          <input type="checkbox" name="param" value="1" readOnly />
        </div>
  }
  , {
    logo: 'twilio.svg',
    path: '/account/billing/basic',
    name: 'Twilio',
    description: 'enables companies to use communications and data to add intelligence and security to every step of the customer journey, from sales to marketing to growth, customer service and many more engagement use cases in a flexible, programmatic way.',
    actions: <div className="switch switch-sm">
          <input type="checkbox" name="param" value="1" readOnly />
        </div>
  }
  , {
    logo: 'facebook.svg',
    path: '/account/billing/basic',
    name: 'FaceBook',
    description: 'Facebook, Instagram',
    actions: <div className="switch switch-sm">
          <input type="checkbox" name="param" value="1" readOnly />
        </div>
  },
  {
    logo: 'instagram-2.svg',
    path: '/account/billing/basic',
    name: 'Instagram',
    description: 'Login with Instagram using Facebook',
    actions: <div className="switch switch-sm">
          <input type="checkbox" name="param" value="1" readOnly />
        </div>
  },
  // , {
  //   logo: 'jira.svg',
  //   path: '/account/billing/basic',
  //   name: 'Jira',
  //   description: 'Project management for agile teams, tracking issues and tasks.',
  //   actions: <div className="switch switch-sm">
  //         <input type="checkbox" name="param" defaultChecked value="1" readOnly />
  //       </div>
  // }, {
  //   logo: 'inferno.svg',
  //   path: '/account/billing/enterprise',
  //   name: 'Inferno',
  //   description: 'Ensures healthcare app compatibility with FHIR standards.',
  //   actions: <div className="switch switch-sm">
  //         <input type="checkbox" name="param" value="1" readOnly />
  //       </div>
  // }, {
  //   logo: 'evernote.svg',
  //   path: '/account/billing/plans',
  //   name: 'Evernote',
  //   description: 'Organizes personal and professional documents, ideas, tasks.',
  //   actions: <div className="switch switch-sm">
  //         <input type="checkbox" name="param" defaultChecked value="1" readOnly />
  //       </div>
  // }, {
  //   logo: 'gitlab.svg',
  //   path: '/account/billing/history',
  //   name: 'Gitlab',
  //   description: 'DevOps platform for code control, project management, CI/CD.',
  //   actions: <div className="switch switch-sm">
  //         <input type="checkbox" name="param" defaultChecked value="1" readOnly />
  //       </div>
  // }, {
  //   logo: 'google-webdev.svg',
  //   path: '/account/security/get-started',
  //   name: 'Google webdev',
  //   description: 'Tools for building quality web experiences, focusing on performance.',
  //   actions: <div className="switch switch-sm">
  //         <input type="checkbox" name="param" defaultChecked value="1" readOnly />
  //       </div>
  // }, {
  //   logo: 'invision.svg',
  //   path: '/account/security/overview',
  //   name: 'Invision',
  //   description: 'Digital design platform for prototyping and design workflow.',
  //   actions: <div className="switch switch-sm">
  //         <input type="checkbox" name="param" value="1" readOnly />
  //       </div>
  // }, {
  //   logo: 'duolingo.svg',
  //   path: '/account/security/allowed-ip-addresses',
  //   name: 'Duolingo',
  //   description: 'Interactive exercises for fun, effective language learning.',
  //   actions: <div className="switch switch-sm">
  //         <input type="checkbox" name="param" value="1" readOnly />
  //       </div>
  // }, {
  //   logo: 'google-analytics-2.svg',
  //   path: '/account/security/privacy-settings',
  //   name: 'Google Analytics',
  //   description: 'Insights into website traffic and marketing effectiveness.',
  //   actions: <div className="switch switch-sm">
  //         <input type="checkbox" name="param" value="1" readOnly />
  //       </div>
  // }
];
  const renderItem = (item, index) => {
    return <CardIntegration logo={item.logo} path={item.path} name={item.name} description={item.description} actions={item.actions} key={index} handleConnect={() => handleConnectButton(item)}/>;
  };
  function handleConnectButton(item) {
    //e.preventDefault();
    //debugger;
    //console.log('You clicked submit.'+item);

    // (async () => {
    //       const response = await axios.get(`${API_URL}/Company/11`);
    //           console.log('company response', response.data);
          
    //     })();

    if(item.name== 'Stripe')
      createStripeAccount();
    else if(item.name == 'Twilio')
      createTwilioAccount();
  }

  const createStripeAccount = async () => {
    const apiUrl = 'https://api.stripe.com/v1/accounts';
  
    try {
      const response = await axios.post(
        apiUrl,
        new URLSearchParams({
          type: 'standard',
        })
      );
  
      //console.log('Response:', response.data);
      if(response.data.id){
        const acc_id = response.data.id;
        createAccountLink(acc_id);
      }
      
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };

  const createAccountLink = async (acc_id) => {
    const url = 'https://api.stripe.com/v1/account_links';
    const connectedAccountId = acc_id; // Replace with the connected account ID
  
    try {
      const response = await axios.post(
        url,
        new URLSearchParams({
          account: connectedAccountId,
          refresh_url: 'https://example.com/reauth',
          return_url: 'https://example.com/return',
          type: 'account_onboarding',
        })
      );
      //console.log('Response:', response.data);
      if(response.data?.object && response.data?.url && response.data?.object == 'account_link'){
        const stripeUrl = response.data.url;
        window.open(stripeUrl, "_blank", "noreferrer");
      }
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };

  const createTwilioAccount = async () => {
    window.open('https://www.twilio.com/authorize/CNb1454c242f9d3ff8a0b1810c6e50b026', "_blank", "noreferrer");
  };
  
  
  return (<div id="integrations_cards">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-7.5">
        {items.map((item, index) => {
        return renderItem(item, index);
      })}
      </div>
    </div>);
};
export { Integrations };
