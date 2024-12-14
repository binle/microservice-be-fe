import { useContext } from 'react';
import { JWT_TOKEN } from '../../../constants';
import { ApplicationContext } from '../../../data';
import './layout.scss';

export const LeftMenuComponent = () => {
  const { contextData } = useContext(ApplicationContext);
  const pluginServices = contextData.pluginServices;

  const logout = () => {
    localStorage.removeItem(JWT_TOKEN);
    window.location.href = '/';
  };
  const onClickServiceMenu = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
  };
  return (
    <>
      <div className="user-info">
        <span> {contextData.user?.id}</span>{' '}
        <button onClick={() => logout()}>Logout</button>
      </div>
      <ul className="menu-list">
        {contextData.user?.role === 'admin' && (
          <li className="menu-item">
            <a href="/plugin">Plugin</a>
          </li>
        )}
        {!!pluginServices?.length && (
          <li className="menu-item">
            <span className="menu-item-service" onClick={onClickServiceMenu}>
              Services
            </span>
            <ul className="plugin-service-item">
              {pluginServices.map((item) => (
                <li key={item.clientId}>
                  <a href={`/plugin-service/${item.clientId}`}>
                    {item.clientName}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        )}
      </ul>
    </>
  );
};
