import { JWT_TOKEN } from '../../constants';
import { axiosInstance } from './common';

export const asyncLogin = async (userId: string, password: string) => {
  const response = await axiosInstance.post(
    `${window.env.be_url}/api/auth/login`,
    {
      id: userId,
      password,
    },
  );
  if (response.data.jwt) {
    localStorage.setItem(JWT_TOKEN, response.data.jwt);
  }
};
