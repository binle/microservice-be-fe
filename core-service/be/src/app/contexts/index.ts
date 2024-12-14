import { newBakkuHttpError } from '@bakku/platform';
import { createLogger } from '@bakku/logger';
import axios, { AxiosResponse } from 'axios';
import { loadConfig } from './configs';

export const initialization = async (): Promise<void> => {
  const configs = loadConfig();
  const logger = createLogger(configs.log_config);
  global.applicationContexts = {
    configs,
    logger,
    rootPath: '',
  };

  axios.interceptors.response.use(
    (response: AxiosResponse) => response,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error: any) => {
      const message =
        error.response?.data?.error?.message ||
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.response?.data?.Message ||
        error.message;
      const code =
        error.response?.data?.error?.code ||
        error.response?.data?.code ||
        error.response?.data?.Code;
      const status = error.response?.status || 500;
      const httpError = newBakkuHttpError(
        { message, status },
        { code, message },
      );
      throw httpError;
    },
  );
};
