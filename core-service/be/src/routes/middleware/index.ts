import {
  ExNextFunction,
  ExRequestHandler,
  ExResponse,
  HttpStatusCodes,
  newBinHttpError,
} from '@bakku/platform';
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
  try {
    user = HelperUtil.decode<IJwtUser>(token);
  } catch (ignore) {}
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

export const requireAllowedUserMiddleWare = (
  role: string,
): ExRequestHandler => {
  return (req: Request, _res: ExResponse, next: ExNextFunction) => {
    if (req.user?.role !== role) {
      return next(newBinHttpError(HttpStatusCodes.UNAUTHORIZED));
    }
    next();
  };
};
