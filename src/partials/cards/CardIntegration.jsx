import { KeenIcon } from '@/components';
import { toAbsoluteUrl } from '@/utils/Assets';
import FacebookLogin from 'react-facebook-login';
import { Link } from 'react-router-dom';
const LARAVEL_URL = import.meta.env.VITE_APP_LARAVEL_URL;
const CardIntegration = ({
  logo,
  path,
  name,
  description,
  actions,
  handleConnect
}) => {
  return <div className="card">
      <div className="card-body p-5 lg:p-7.5">
        <div className="flex items-center justify-between mb-3 lg:mb-5">
          <div className="flex items-center justify-center">
            <img src={toAbsoluteUrl(`/media/brand-logos/${logo}`)} className="h-11 shrink-0" alt="" />
          </div>
          <div className="btn btn-sm btn-icon btn-clear btn-light">
            <KeenIcon icon="exit-right-corner" />
          </div>
        </div>

        <div className="flex flex-col gap-1 lg:gap-2.5">
          <Link to={`${path}`} className="text-base font-medium text-gray-900 hover:text-primary-active">
            {name}
          </Link>
          <span className="text-2sm text-gray-700">{description}</span>
        </div>
      </div>

      <div className="card-footer justify-between items-center py-3.5">
        {/* <a className="btn btn-light btn-sm" onClick={handleConnect} >
          <KeenIcon icon="mouse-square" />
          Connect
        </a> */}
        <ConnectButton channelName={name} channelHandler={handleConnect}/>
        <div className="flex items-center gap-2.5">{actions}</div>
      </div>
    </div>;
    
};
function ConnectButton(props) {
  //const isLoggedIn = props.isLoggedIn;
  if (props.channelName=='FaceBook') {
    // return <FacebookLogin
    //           appId="9755919627759288" //drcurves_conversation app ID in meta developer account of support@drcurves.com
    //           autoLoad={true}
    //           fields="name,email,picture"
    //           scope="public_profile,email,page_events" //public_profile,email are default permissions and we also need an extra permission so page_events was added
    //           callback={responseFacebook} 
    //           cssClass="btn btn-light btn-sm"
    //           icon="fa-facebook"/>;
  } else if (props.channelName === 'Instagram') {
    return <FacebookLogin
      // appId="3603720059877540" //drcurves_conversation app ID in meta developer account of support@drcurves.com
      appId="3603720059877540"
      // autoLoad={true}
      fields="name,email,picture"
      scope="instagram_basic,instagram_manage_messages,instagram_manage_comments,pages_messaging,pages_show_list,pages_read_engagement,pages_manage_ads,pages_manage_metadata,business_management,ads_management,leads_retrieval,pages_messaging_subscriptions,instagram_content_publish"
      callback={handleInstagramResponse} 
      cssClass="btn btn-light btn-sm flex items-center gap-2"
      icon="fa-facebook"
    />
  }
  return <a className="btn btn-light btn-sm" onClick={props.channelHandler} >
            <KeenIcon icon="mouse-square" />
            Connect
          </a>;
}
const responseFacebook = (response) => {
  console.log(response);
}

const handleInstagramResponse = async (response) => {
  console.log(response);

  fetch(`${LARAVEL_URL}/save-insta-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(response)
  });
};
export { CardIntegration };
