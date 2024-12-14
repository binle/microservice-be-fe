import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PlugInServiceResponseDto } from '../../../definitions';
import {
  asyncGetPluginServiceDetail,
  coreIntegrationService,
} from '../../../services';
import './plugin-service.scss';

export const PluginServicePage = () => {
  const params = useParams();
  const [pluginService, setPluginService] = useState<
    PlugInServiceResponseDto | undefined
  >();
  const [status, setStatus] = useState<boolean>();

  useEffect(() => {
    asyncGetPluginServiceDetail(params.id as string).then((pluginService) => {
      coreIntegrationService
        .startChannel(pluginService.clientId, pluginService.clientUrl)
        .then((result) => {
          setStatus(result);
        });
      setPluginService(pluginService);
    });
  }, []);

  if (!pluginService) {
    return <></>;
  }

  return (
    <>
      <div
        className="plugin-service-page"
        style={{ display: status ? 'flex' : 'none' }}
      >
        <iframe id={pluginService.clientId} src={pluginService.clientUrl} />
      </div>
      {!status && <div> Service validate failed!!!</div>}
    </>
  );
};
