import React, { useEffect, useContext, useState } from "react";
import { CLIENT_ID, CLIENT_SECRET } from "@env";
import { ApiContext, ApiDispatchContext } from '../contexts/ApiContext';
import axios from "axios";

const requestData = {
    'grant_type': 'client_credentials',
    'client_id': CLIENT_ID,
    'client_secret': CLIENT_SECRET
  };

let requestConfig = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token',
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data : requestData
};

const useBearerToken = () => {
    const { bearer_token, expiration } = useContext(ApiContext);
    const [token, setToken] = useState(bearer_token);
    const dispatch = useContext(ApiDispatchContext);

    useEffect(() => {
        const getAuth = async () => {
            try {
                const response = await axios.post('https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token',
                requestData,
                {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                },
                     );
                const { access_token, expires_in } = response.data;
                const expiration = Date.now() + expires_in * 1000;
                dispatch({
                    type: 'SET_BEARER_TOKEN',
                    payload: {
                        bearer_token: access_token,
                        expiration,
                    },
                });
                setToken(access_token);
            } catch (error) {
                console.log(error);
            }
        }
        if ( expiration && expiration < Date.now() || !bearer_token) {
            getAuth();
        }
    }, []);

    return token;
}

export default useBearerToken;