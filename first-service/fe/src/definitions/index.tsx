/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Dispatch } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ANY = any;

export interface IJwtUser {
  id: string;
  role: string;
  time: number;
  exp: number;
}

export interface IAuthenticatedData {
  user?: IJwtUser;
}

export interface IContextData extends IAuthenticatedData {}

export interface IApplicationContext {
  contextData: IContextData;
  setContextData: Dispatch<React.SetStateAction<IContextData>>;
}

export interface PlugInServiceValidationDto {
  clientUrl: string;
  clientId: string;
  nonce: string;
  signature: string;
}
