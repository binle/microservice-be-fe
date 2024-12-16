import {
  ListPlugInServiceResponseDto,
  PlugInServiceDto,
  PlugInServiceResponseDto,
  PlugInServiceValidationDto,
} from '../../definitions';
import { axiosInstance } from './common';

export const asyncGetPluginServices = async () => {
  const response = await axiosInstance.get<ListPlugInServiceResponseDto>(
    `${window.env.be_url}/api/plugin`,
  );
  return response.data;
};

export const asyncGetPluginServiceDetail = async (clientId: string) => {
  const response = await axiosInstance.get<PlugInServiceResponseDto>(
    `${window.env.be_url}/api/plugin/${clientId}`,
  );
  return response.data;
};

export const asyncSavePluginServiceDetail = async (
  pluginService: PlugInServiceDto,
) => {
  const response = await axiosInstance.post<PlugInServiceResponseDto>(
    `${window.env.be_url}/api/plugin`,
    pluginService,
  );
  return response.data;
};

export const asyncDeletePluginServiceDetail = async (clientId: string) => {
  await axiosInstance.delete(`${window.env.be_url}/api/plugin/${clientId}`);
};

export const asyncGenerateNonce = async (
  clientId: string,
  clientUrl: string,
): Promise<string | undefined> => {
  try {
    const response = await axiosInstance.post(
      `${window.env.be_url}/api/plugin/nonce`,
      {
        clientId,
        clientUrl,
      },
    );
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (ignore) {
    return;
  }
};

export const asyncValidatePluginService = async (
  verifyData: PlugInServiceValidationDto,
): Promise<boolean> => {
  try {
    const response = await axiosInstance.post(
      `${window.env.be_url}/api/plugin/validate`,
      verifyData,
    );
    return response.status === 200;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (ignore) {
    return false;
  }
};
