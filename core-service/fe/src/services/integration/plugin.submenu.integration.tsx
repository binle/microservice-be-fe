import * as uuid from 'uuid';
import { storeIntegrationService } from './store.integration';
import { JWT_TOKEN } from '../../constants';
import { PluginSubMenu } from '../../definitions';
import { communicationApiIntegrationService } from './communication-api.integration';

class PluginSubMenuIntegrationService {
  private listeners: {
    [key: string]: { func: () => void; clientId?: string };
  } = {};

  private clientPluginSubMenus: { [key: string]: PluginSubMenu[] } = {};

  constructor() {
    window.addEventListener('message', this.handleMessage.bind(this), false);
  }

  public onPluginSubMenuChange(
    func: () => void,
    clientId?: string,
  ): () => void {
    const id = uuid.v4();
    this.listeners[id] = { func, clientId };
    return () => {
      delete this.listeners[id];
    };
  }

  public getPluginSubMenus(clientId: string) {
    return this.clientPluginSubMenus[clientId];
  }

  public actionOnSubMenu(clientId: string, data: PluginSubMenu) {
    return communicationApiIntegrationService.requestToClientId(
      clientId,
      'action-submenu',
      data,
    );
  }

  // ===========================================================================================
  private async handleMessage(event: MessageEvent) {
    const payload = event.data;
    if (
      payload.clientId &&
      storeIntegrationService.checkRegisteredService(payload.clientId) &&
      payload.jwt === localStorage.getItem(JWT_TOKEN) &&
      payload.requestId &&
      payload.action === 'register-plugin-submenu'
    ) {
      this.clientPluginSubMenus[payload.clientId] = payload.data;
      this.fireSubmenuChange();
      communicationApiIntegrationService.responseToClientId(
        payload.clientId,
        payload.requestId,
      );
    }
  }

  private fireSubmenuChange(clientId?: string) {
    for (const key in this.listeners) {
      if (clientId && this.listeners[key]?.clientId === clientId) {
        this.listeners[key]?.func();
      } else if (!clientId) {
        this.listeners[key]?.func();
      }
    }
  }
}

export const pluginSubMenuIntegrationService =
  new PluginSubMenuIntegrationService();
