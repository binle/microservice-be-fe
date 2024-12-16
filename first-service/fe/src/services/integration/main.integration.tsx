/* eslint-disable @typescript-eslint/no-explicit-any */
import { JWT_TOKEN } from '../../constants';
import { PluginFeature } from '../../definitions';
import { asyncInit } from '../api';
import { communicationApiIntegrationService } from './communication-api.integration';

class MainIntegrationService {
  features: PluginFeature[] | undefined;
  constructor() {
    window.addEventListener('message', this.handleMessage.bind(this), false);
  }

  public async handshake() {
    const nonce = await communicationApiIntegrationService.request(
      'handshake-nonce',
    );
    const signatureData = await asyncInit(
      nonce,
      window.env.client_id,
      window.location.origin,
    );
    const jwt = await communicationApiIntegrationService.request(
      'handshake-validation',
      { signatureData },
    );
    localStorage.setItem(JWT_TOKEN, jwt);
  }

  public registerFeatures(features: PluginFeature[]) {
    this.features = features;
    communicationApiIntegrationService.request(
      'register-plugin-feature',
      features.map((item) => ({ ...item, func: undefined })),
    );
  }

  private async handleMessage(event: MessageEvent) {
    const payload = event.data;
    // request to this window
    if (payload.requestId) {
      if (payload.action === 'action-feature') {
        this.features?.find((item) => item.id === payload.data.id)?.func();
        communicationApiIntegrationService.response(
          window.parent,
          payload.requestId,
        );
      }
    }
  }
}

export const mainIntegrationService = new MainIntegrationService();
