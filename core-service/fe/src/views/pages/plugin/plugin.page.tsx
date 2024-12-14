import { useContext, useState } from 'react';
import { ApplicationContext } from '../../../data';
import {
  PlugInServiceDto,
  PlugInServiceResponseDto,
} from '../../../definitions';

import {
  asyncDeletePluginServiceDetail,
  asyncGetPluginServices,
  asyncSavePluginServiceDetail,
} from '../../../services';
import './plugin.page.scss';

const PlugInServiceDtoDefault: PlugInServiceDto = {
  clientId: '',
  clientName: '',
  clientSecret: '',
  clientUrl: '',
};

export const PluginPage = () => {
  const { contextData, setContextData } = useContext(ApplicationContext);
  const pluginServices = contextData.pluginServices;

  const [detail, setDetail] = useState<PlugInServiceDto | undefined>();

  const onAdd = () => {
    setDetail({ ...PlugInServiceDtoDefault });
  };
  const onBackToList = () => {
    setDetail(undefined);
  };

  const onSelectDetail = (item: PlugInServiceResponseDto) => {
    setDetail({ ...item, clientSecret: '' });
  };

  const onDelete = () => {
    asyncDeletePluginServiceDetail(detail?.clientId as string)
      .then(reloadList)
      .catch((error) => {
        alert('delete plugin service failed!');
        console.error(error);
      });
  };

  const reloadList = async () => {
    const data = await asyncGetPluginServices();
    setContextData({ ...contextData, pluginServices: data.list });
    setDetail(undefined);
  };

  const onSave = () => {
    asyncSavePluginServiceDetail(detail as PlugInServiceDto)
      .then(reloadList)
      .catch((error) => {
        alert('Save plugin service failed!');
        console.error(error);
      });
  };

  return (
    <div className="plugin-page">
      <div className="header">
        <div className="search"></div>
        {!detail && (
          <button className="right-btn" onClick={onAdd}>
            Add new
          </button>
        )}

        {!!detail && (
          <button className="right-btn" onClick={onBackToList}>
            Back to list
          </button>
        )}
      </div>
      {!detail && (
        <div className="list">
          <div className="plugin-service list-header ">
            <div className="col-no">No</div>
            <div className="col-id">Client Id</div>
            <div className="col-name">Client Name</div>
            <div className="col-url">Client Url</div>
          </div>
          {pluginServices?.map((item, index) => (
            <div className="plugin-service" key={item.clientId}>
              <div className="col-no">{index + 1}</div>
              <div className="col-id" onClick={() => onSelectDetail(item)}>
                {item.clientId}
              </div>
              <div className="col-name">{item.clientName}</div>
              <div className="col-url">{item.clientUrl}</div>
            </div>
          ))}
        </div>
      )}
      {!!detail && (
        <div className="detail">
          <div className="form-data">
            <div className="form-row">
              <label htmlFor="plugin-service-detail-client-id">Client Id</label>
              <input
                id="plugin-service-detail-client-id"
                placeholder="Client Id"
                value={detail.clientId}
                onChange={(e) =>
                  setDetail({ ...detail, clientId: e.target.value })
                }
              />
            </div>

            <div className="form-row">
              <label htmlFor="plugin-service-detail-client-secret">
                Client Secret
              </label>
              <input
                id="plugin-service-detail-client-secret"
                placeholder="Client Secret"
                value={detail.clientSecret}
                onChange={(e) =>
                  setDetail({ ...detail, clientSecret: e.target.value })
                }
              />
            </div>

            <div className="form-row">
              <label htmlFor="plugin-service-detail-client-name">
                Client Name
              </label>
              <input
                id="plugin-service-detail-client-name"
                placeholder="Client Name"
                value={detail.clientName}
                onChange={(e) =>
                  setDetail({ ...detail, clientName: e.target.value })
                }
              />
            </div>

            <div className="form-row">
              <label htmlFor="plugin-service-detail-client-url">
                Client Url
              </label>
              <input
                id="plugin-service-detail-client-url"
                placeholder="Client Url"
                value={detail.clientUrl}
                onChange={(e) =>
                  setDetail({ ...detail, clientUrl: e.target.value })
                }
              />
            </div>
          </div>
          <div className="form-action">
            <button className="save" onClick={onSave}>
              Save
            </button>
            {!!pluginServices?.find(
              (item) => item.clientId === detail.clientId,
            ) && (
              <button className="cancel" onClick={onDelete}>
                Delete
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
