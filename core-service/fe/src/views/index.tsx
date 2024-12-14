import { useEffect, useState } from 'react';
import { IJwtUser, PlugInServiceResponseDto } from '../definitions';
import { AppRouter } from './router';
import { asyncInit } from '../services';

export const Application = () => {
  const [data, setData] = useState<{
    user?: IJwtUser;
    pluginServices?: PlugInServiceResponseDto[];
    isInitialized?: boolean;
  }>();
  useEffect(() => {
    asyncInit()
      .then((data) =>
        setData({
          user: data.user,
          pluginServices: data.pluginServices,
          isInitialized: true,
        }),
      )
      .catch(() => {
        setData({ isInitialized: true });
      });
  }, []);

  if (!data?.isInitialized) {
    return <></>;
  }
  return <AppRouter {...data}></AppRouter>;
};
