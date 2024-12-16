import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PlugInServiceResponseDto } from '../../../definitions';
import {
  asyncGetPluginServiceDetail,
  mainIntegrationService,
} from '../../../services';
import './plugin-service.scss';
import { ApplicationContext } from '../../../data';

export const PluginServicePage = () => {
  const { contextData, setContextData } = useContext(ApplicationContext);

  const params = useParams();
  const [pluginService, setPluginService] = useState<
    PlugInServiceResponseDto | undefined
  >();
  const [status, setStatus] = useState<string>();

  useEffect(() => {
    asyncGetPluginServiceDetail(params.id as string).then((pluginService) => {
      setContextData({ ...contextData, selectedPluginService: pluginService });
      setStatus('checking');
      mainIntegrationService
        .listenHandshake(pluginService.clientId, pluginService.clientUrl)
        .then((result) => {
          console.log({ result });
          setStatus(result ? 'checked' : 'not correct');
        });
      setPluginService(pluginService);
    });
  }, []);

  if (!pluginService) {
    return <></>;
  }

  return (
    <>
      {status !== 'checked' && <div> Service is {status}!!!</div>}
      {status !== 'not correct' && (
        <div
          className="plugin-service-page"
          style={{ display: status === 'checked' ? 'flex' : 'none' }}
        >
          <iframe id={pluginService.clientId} src={pluginService.clientUrl} />
        </div>
      )}
    </>
  );
};
