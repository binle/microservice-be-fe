import React from 'react';
import { IApplicationContext, IContextData } from '../definitions';

export const defaultContextData: IContextData = {};

export const ApplicationContext = React.createContext<IApplicationContext>({
  contextData: defaultContextData,
  setContextData: () => {},
});
