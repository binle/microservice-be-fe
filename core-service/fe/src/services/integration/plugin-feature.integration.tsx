import * as uuid from 'uuid';
import { managerIntegrationService } from './manager.integration';
import { JWT_TOKEN } from '../../constants';
import { PluginFeature } from '../../definitions';
import { communicationApiIntegrationService } from './communication-api.integration';

class PluginFeatureIntegrationService {
  private listeners: {
    [key: string]: { func: () => void; clientId?: string };
  } = {};

  private clientPluginFeatures: { [key: string]: PluginFeature[] } = {};

  constructor() {
    window.addEventListener('message', this.handleMessage.bind(this), false);
  }

  public onPluginFeatureChange(
    func: () => void,
    clientId?: string,
  ): () => void {
    const id = uuid.v4();
    this.listeners[id] = { func, clientId };
    return () => {
      delete this.listeners[id];
    };
  }

  public getPluginFeatures(clientId: string) {
    return this.clientPluginFeatures[clientId];
  }

  public actionFeature(clientId: string, data: PluginFeature) {
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
      managerIntegrationService.checkRegisteredService(payload.clientId) &&
      payload.jwt === localStorage.getItem(JWT_TOKEN) &&
      payload.requestId &&
      payload.action === 'register-plugin-submenu'
    ) {
      this.clientPluginFeatures[payload.clientId] = payload.data;
      this.fireFeaturesChange();
      communicationApiIntegrationService.responseToClientId(
        payload.clientId,
        payload.requestId,
      );
    }
  }

  private fireFeaturesChange(clientId?: string) {
    for (const key in this.listeners) {
      if (clientId && this.listeners[key]?.clientId === clientId) {
        this.listeners[key]?.func();
      } else if (!clientId) {
        this.listeners[key]?.func();
      }
    }
  }
}

export const pluginFeatureIntegrationService =
  new PluginFeatureIntegrationService();
