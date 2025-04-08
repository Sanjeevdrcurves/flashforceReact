import { GoogleOAuthProvider, GoogleLogin  } from "@react-oauth/google";
import React, { Fragment, useState, useEffect } from "react";
import { PageNavbar } from "@/pages/account";
import { Toolbar, ToolbarHeading,ToolbarActions } from "@/partials/toolbar";
import axios from "axios";



const GoogleProviderLogin = () => {
  const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
  const clientId = "263841041940-41tnc7g7aohnf2bsi0h5v36g30of7hqs.apps.googleusercontent.com"; // Replace with your actual client ID
  const [user, setUser] = useState(null);

    const handleSuccess = async (response) => {
        const { data } = await axios.post(`${API_URL}/email/GoogleEmailProviderLogin`, {
            token: response.credential
        });

        setUser(data);
    };

    return (
        <GoogleOAuthProvider clientId={clientId}>
            {user ? (
                <div>
                    <h3>Welcome, {user.Name}</h3>
                    <p>Email: {user.Email}</p>
                </div>
            ) : (
                <GoogleLogin onSuccess={handleSuccess} onError={() => {console.log("Login Failed")}} />
            )}
        </GoogleOAuthProvider>
    );
};

export default GoogleProviderLogin;
