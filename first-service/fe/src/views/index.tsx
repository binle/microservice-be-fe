import { useEffect, useState } from 'react';
import { IJwtUser } from '../definitions';
// import { asyncInit } from '../services';
import { integrationService } from '../services';

export const Application = () => {
  const [data, setData] = useState<{
    user?: IJwtUser;
    isInitialized?: boolean;
  }>();
  useEffect(() => {
    integrationService
      .prepare()
      .then(() => {
        setData({ isInitialized: true });
      })
      .catch(() => {
        setData({ isInitialized: true });
      });
  }, []);

  return (
    <>{data?.isInitialized ? 'Service was checked' : 'Service is checking'}</>
  );
};
