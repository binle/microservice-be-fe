/* eslint-disable @typescript-eslint/no-explicit-any */
import { PluginFeature } from '../../definitions';
import { communicationApiIntegrationService } from './communication-api.integration';

class PluginFeatureIntegrationService {
  features: PluginFeature[] | undefined;

  constructor() {
    window.addEventListener('message', this.handleMessage.bind(this), false);
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

export const pluginFeatureIntegrationService =
  new PluginFeatureIntegrationService();
