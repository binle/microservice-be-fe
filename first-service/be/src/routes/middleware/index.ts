import {
  ExNextFunction,
  ExRequestHandler,
  ExResponse,
  HttpStatusCodes,
  newBinHttpError,
} from '@bakku/platform';
import axios from 'axios';
import { Request } from 'express-serve-static-core';
import { HelperUtil } from 'src/app';
import { IJwtUser } from 'src/definitions';

export const detectUserMiddleWare: ExRequestHandler = async (
  req: Request,
  _res: ExResponse,
  next: ExNextFunction,
) => {
  const token = req.headers.authorization || '';
  let user: IJwtUser | undefined = undefined;
  if (token) {
    try {
      await axios.post(
        `${global.applicationContexts.configs.core_be_url}/api/auth/plugin-service-validate`,
        {
          clientId: global.applicationContexts.configs.client_info.client_id,
          clientSecret:
            global.applicationContexts.configs.client_info.client_secret,
          jwt: token,
        },
      );
      user = HelperUtil.decode<IJwtUser>(token);
    } catch (error) {
      console.error('detectUserMiddleWare =====', { error });
    }
  }
  req.user = user;
  next();
};

export const requireAuthenticatedUserMiddleWare: ExRequestHandler = async (
  req: Request,
  _res: ExResponse,
  next: ExNextFunction,
) => {
  if (!req.user?.id) {
    return next(newBinHttpError(HttpStatusCodes.UNAUTHORIZED));
  }
  next();
};
