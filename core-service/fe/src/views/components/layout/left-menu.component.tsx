/* eslint-disable @typescript-eslint/no-explicit-any */
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
          <>
            {pluginServices.map((item) => (
              <li className="menu-item" key={item.clientId}>
                <a href={`/plugin-service/${item.clientId}`}>
                  {item.clientName}
                </a>
              </li>
            ))}
          </>
        )}
      </ul>
    </>
  );
};
