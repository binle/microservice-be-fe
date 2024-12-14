import { AppInitResponseDto } from '../../definitions';
import { axiosInstance } from './common';

export const asyncInit = async () => {
  const response = await axiosInstance.get<AppInitResponseDto>(
    `${window.env.be_url}/api/app/init`,
  );
  return response.data;
};
