/* eslint-disable @typescript-eslint/no-explicit-any */
import { JWT_TOKEN } from '../../constants';
import { PlugInServiceValidationDto } from '../../definitions';
import {
  asyncGenerateNonce,
  asyncValidatePluginService,
} from '../api/plugin.api';

class CoreIntegrationService {
  private clientId: string | undefined;
  private clientUrl: string | undefined;
  private resolve: ((data: any) => void) | undefined;
  constructor() {
    window.addEventListener('message', this.handleMessage.bind(this), false);
  }
  // ===========================================================================================

  public async startChannel(clientId: string, clientUrl: string) {
    this.clientId = clientId;
    this.clientUrl = clientUrl;
    return new Promise<boolean>((resolve) => {
      this.resolve = resolve;
    });
  }

  // ===========================================================================================
  // prepare and validation
  private async doPreparationNonce(payload: {
    requestId: string;
    data: { action: string };
  }) {
    return asyncGenerateNonce(this.clientId || '', this.clientUrl || '')
      .then((nonce) => {
        this.replyClient(this.clientId || '', payload.requestId, nonce);
      })
      .catch((error) => {
        console.error('CoreIntegrationService asyncGenerateNonce error', error);
        this.replyClient(this.clientId || '', payload.requestId);
        this.resolve?.(false);
        delete this.resolve;
      });
  }

  private async doPreparationValidation(payload: {
    requestId: string;
    data: { action: string; signatureData: PlugInServiceValidationDto };
  }) {
    const signatureData = payload.data.signatureData;
    return await asyncValidatePluginService(signatureData)
      .then(() => {
        this.replyClient(
          this.clientId || '',
          payload.requestId,
          localStorage.getItem(JWT_TOKEN),
        );
        this.resolve?.(true);
        delete this.resolve;
      })
      .catch((error) => {
        this.replyClient(this.clientId || '', payload.requestId);
        console.error(
          'CoreIntegrationService asyncValidatePluginService error',
          error,
        );
        this.resolve?.(false);
        delete this.resolve;
      });
  }

  // ===========================================================================================
  private async handleMessage(event: MessageEvent) {
    const payload = event.data;
    if (
      this.clientUrl &&
      this.clientUrl === event.origin &&
      this.clientId &&
      this.clientId === payload.clientId
    ) {
      // function preparation - step1
      if (payload.data.action === 'preparation-nonce') {
        await this.doPreparationNonce(payload);
      }
      // function preparation - step2
      else if (payload.data.action === 'preparation-validation') {
        await this.doPreparationValidation(payload);
      }
    }
  }

  private replyClient<T>(clientId: string, requestId: string, data?: T) {
    const iframe = window.document.querySelector(
      `iframe#${clientId}`,
    ) as HTMLIFrameElement;

    iframe.contentWindow?.postMessage({ requestId, data }, '*');
  }
}

export const coreIntegrationService = new CoreIntegrationService();
