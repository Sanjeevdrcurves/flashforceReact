import { getData, setData } from '@/utils';
const AUTH_LOCAL_STORAGE_KEY = `${import.meta.env.VITE_APP_NAME}-auth-v${import.meta.env.VITE_APP_VERSION}`;
const API_URL = import.meta.env.VITE_FLASHFORCE_URL;
const getAuth = () => {
  try {
    const auth = getData(AUTH_LOCAL_STORAGE_KEY);
    if (auth) {
      return auth;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error('AUTH LOCAL STORAGE PARSE ERROR', error);
  }
};
const setAuth = auth => {
  setData(AUTH_LOCAL_STORAGE_KEY, auth);
};
const removeAuth = () => {
  if (!localStorage) {
    return;
  }
  try {
    localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY);
  } catch (error) {
    console.error('AUTH LOCAL STORAGE REMOVE ERROR', error);
  }
};
export function setupAxios(axios) {
  axios.defaults.headers.Accept = 'application/json';
  axios.interceptors.request.use(config => {
    console.log('config', config);
    const auth = getAuth();
    if (auth?.access_token) {
      config.headers.Authorization = `Bearer ${auth.access_token}`;
    }
    
    if (config.url.includes(`${API_URL}`)) {

     const username = "drcurves";
      const password = "drCurves#!@@@";

      // Encode credentials to Base64
      if(!config.url.includes('switch-entity')){ //if we are calling switch API then we are passing userToken in Authorization header for validation.
        const encodedCredentials = btoa(`${username}:${password}`);
        config.headers.Authorization = `Basic ${encodedCredentials}`;
      }
    
    }

    if (config.url.includes('api.stripe.com')) {
      const secretKey = 'sk_test_kgzZMxnpI5wrE9uuIAsCIHAS0086g3N2bd';
 
      config.headers.Authorization = `Bearer ${secretKey}`
    }
   

    return config;
  }, async err => await Promise.reject(err));
}
export { AUTH_LOCAL_STORAGE_KEY, getAuth, removeAuth, setAuth };


