import { PlugInServiceValidationDto } from '../../definitions';
import { axiosInstance } from './common';

export const asyncInit = async (
  nonce: string,
  clientId: string,
  clientUrl: string,
) => {
  const response = await axiosInstance.get<PlugInServiceValidationDto>(
    `${window.env.be_url}/api/app/prepare`,
    { params: { nonce, clientId, clientUrl } },
  );
  return response.data;
};
