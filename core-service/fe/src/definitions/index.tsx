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

export interface PluginSubMenu {
  id: string;
  label: string;
  actionData: unknown;
}

export interface IAuthenticatedData {
  user?: IJwtUser;
  selectedPluginService?: PlugInServiceResponseDto;
  pluginServices?: (PlugInServiceResponseDto & {
    subMenus?: PluginSubMenu[];
  })[];
}

export interface IContextData extends IAuthenticatedData {}

export interface IApplicationContext {
  contextData: IContextData;
  setContextData: Dispatch<React.SetStateAction<IContextData>>;
}

export interface PlugInServiceDto {
  clientUrl: string;
  clientName: string;
  clientId: string;
  clientSecret: string;
}

export interface PlugInServiceResponseDto {
  clientUrl: string;
  clientName: string;
  clientId: string;
  clientSecret?: string;
}

export interface ListPlugInServiceResponseDto {
  list?: PlugInServiceResponseDto[];
}

export interface PlugInServiceValidationDto {
  clientUrl: string;
  clientId: string;
  nonce: string;
  signature: string;
}

export interface AppInitResponseDto {
  user: IJwtUser;
  pluginServices?: PlugInServiceResponseDto[];
}
