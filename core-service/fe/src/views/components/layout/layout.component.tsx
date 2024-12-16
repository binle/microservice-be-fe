import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ApplicationContext, defaultContextData } from '../../../data';
import { IContextData } from '../../../definitions';
import './layout.scss';
import { LeftMenuComponent } from './left-menu.component';
import { pluginFeatureIntegrationService } from '../../../services';

export const LayoutComponent = (data: IContextData) => {
  const [contextData, setContextData] = useState<IContextData>({
    ...defaultContextData,
    user: data.user,
    pluginServices: data.pluginServices,
  });
  const clientId = contextData.selectedPluginService?.clientId;

  useEffect(() => {
    pluginFeatureIntegrationService.onPluginFeatureChange(() => {
      const pluginServices = contextData.pluginServices || [];

      for (const pluginService of pluginServices) {
        pluginService.features =
          pluginFeatureIntegrationService.getPluginFeatures(
            pluginService.clientId,
          );
        console.log({ contextData });
        setContextData({ ...contextData, pluginServices });
      }
    }, contextData.selectedPluginService?.clientId);
  }, [clientId, contextData]);

  const pluginService = contextData.pluginServices?.find(
    (item) => item.clientId === clientId,
  );

  console.log(
    'pluginService :',
    pluginService,
    contextData.selectedPluginService,
    contextData.pluginServices,
  );

  return (
    <ApplicationContext.Provider value={{ contextData, setContextData }}>
      <div className="application">
        {!!data.user && (
          <div className="left-menu">
            <LeftMenuComponent />
          </div>
        )}
        <div className="content">
          <div className="sub-menu">
            {pluginService?.features?.map((sItem, index) => (
              <button
                key={index}
                onClick={() => {
                  pluginFeatureIntegrationService
                    .actionFeature(pluginService.clientId, sItem)
                    .catch(console.error);
                }}
              >
                {sItem.label}
              </button>
            ))}
          </div>
          <div className="main-content">
            <Outlet />
          </div>
        </div>
      </div>
    </ApplicationContext.Provider>
  );
};
