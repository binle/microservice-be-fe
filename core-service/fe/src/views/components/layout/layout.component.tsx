import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ApplicationContext, defaultContextData } from '../../../data';
import { IContextData } from '../../../definitions';
import './layout.scss';
import { LeftMenuComponent } from './left-menu.component';

export const LayoutComponent = (data: IContextData) => {
  const [contextData, setContextData] = useState<IContextData>({
    ...defaultContextData,
    user: data.user,
    pluginServices: data.pluginServices,
  });

  return (
    <ApplicationContext.Provider value={{ contextData, setContextData }}>
      <div className="application">
        {!!data.user && (
          <div className="left-menu">
            <LeftMenuComponent />
          </div>
        )}
        <div className="content">
          <Outlet />
        </div>
      </div>
    </ApplicationContext.Provider>
  );
};
