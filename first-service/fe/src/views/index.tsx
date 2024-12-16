import { useEffect, useState } from 'react';
import { IJwtUser, PluginFeature } from '../definitions';
// import { asyncInit } from '../services';
import {
  mainIntegrationService,
  pluginFeatureIntegrationService,
} from '../services';

export const Application = () => {
  const [data, setData] = useState<{
    user?: IJwtUser;
    isInitialized?: boolean;
    feature?: string;
  }>();
  useEffect(() => {
    mainIntegrationService
      .handshake()
      .then(() => {
        setData({ isInitialized: true });
      })
      .catch(() => {
        setData({ isInitialized: true });
      });
  }, []);

  return (
    <div>
      <p>
        <span> This is Service 1 </span>
        <br />
        Initialized status : {data?.isInitialized ? 'checked' : 'checking'}
        <br />
        {!!data?.feature && <span>This is {data.feature}</span>}
      </p>

      {!data?.feature && (
        <button
          onClick={() => {
            const features: PluginFeature[] = [
              {
                id: '1',
                label: 'Feature 1',
                actionData: { feature: 'feature 1' },
                func: () => {
                  setData({ ...data, feature: 'feature 1' });
                },
              },
              {
                id: '2',
                label: 'Feature 2',
                actionData: { feature: 'feature 2' },
                func: () => {
                  setData({ ...data, feature: 'feature 2' });
                },
              },
            ];
            pluginFeatureIntegrationService.registerFeatures(features);
          }}
        >
          Register Features
        </button>
      )}
    </div>
  );
};
