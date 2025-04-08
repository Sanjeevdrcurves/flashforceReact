import '@/components/keenicons/assets/styles.css';
import './styles/globals.css';
import axios from 'axios';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { setupAxios } from './auth';
import { ProvidersWrapper } from './providers';
import React from 'react';
import {GoogleOAuthProvider} from '@react-oauth/google';
/**
 * Inject interceptors for axios.
 *
 * @see https://github.com/axios/axios#interceptors
 */
setupAxios(axios);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <GoogleOAuthProvider clientId='41957435474-nrql02e8j1t4ufp0aqpo54hhj19g2eop.apps.googleusercontent.com'> {/* sanjeev@drcurves.com*/}
  <GoogleOAuthProvider clientId='263841041940-41tnc7g7aohnf2bsi0h5v36g30of7hqs.apps.googleusercontent.com'> {/* developers@drcurves.com*/}

<React.StrictMode>
    <ProvidersWrapper>
      <App />
    </ProvidersWrapper>
  </React.StrictMode>
  </GoogleOAuthProvider>
  );