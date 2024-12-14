import axios from 'axios';
import { JWT_TOKEN } from '../../constants';

window.env = {
  be_url: import.meta.env.VITE_BACKEND_PREFIX_URL,
  client_id: import.meta.env.VITE_CLIENT_ID,
  core_client_url: import.meta.env.VITE_CORE_CLIENT_URL,
};
const axiosInstance = axios.create();
axiosInstance.interceptors.request.use((config) => {
  const jwt = window.localStorage.getItem(JWT_TOKEN);
  config.headers.setAuthorization(
    jwt && !config.headers?.notAddAuthorization ? `${jwt}` : '',
  );
  return config;
});

export { axiosInstance };
