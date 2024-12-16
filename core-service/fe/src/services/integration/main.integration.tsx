/* eslint-disable @typescript-eslint/no-explicit-any */
import { JWT_TOKEN } from '../../constants';
import { PlugInServiceValidationDto } from '../../definitions';
import {
  asyncGenerateNonce,
  asyncValidatePluginService,
} from '../api/plugin.api';
import { communicationApiIntegrationService } from './communication-api.integration';
import { managerIntegrationService } from './manager.integration';

class MainIntegrationService {
  private clientId: string | undefined;
  private clientUrl: string | undefined;
  private resolveHandshake: ((data: any) => void) | undefined;
  constructor() {
    window.addEventListener('message', this.handleMessage.bind(this), false);
  }
  // ===========================================================================================

  public async listenHandshake(clientId: string, clientUrl: string) {
    this.clientId = clientId;
    this.clientUrl = clientUrl;
    return new Promise<boolean>((resolveHandshake) => {
      this.resolveHandshake = resolveHandshake;
      setTimeout(() => {
        this.resolveHandshake?.(false);
        delete this.resolveHandshake;
      }, 10 * 1000);
    });
  }

  // ===========================================================================================
  // handshake and validation
  private async doHandshakeNonce(payload: {
    requestId: string;
    action: string;
  }) {
    return asyncGenerateNonce(this.clientId || '', this.clientUrl || '')
      .then((nonce) => {
        communicationApiIntegrationService.responseToClientId(
          this.clientId || '',
          payload.requestId,
          nonce,
        );
      })
      .catch((error) => {
        console.error('MainIntegrationService asyncGenerateNonce error', error);
        communicationApiIntegrationService.responseToClientId(
          this.clientId || '',
          payload.requestId,
        );
        this.resolveHandshake?.(false);
        delete this.resolveHandshake;
      });
  }

  private async doHandshakeValidation(payload: {
    requestId: string;
    data: { signatureData: PlugInServiceValidationDto };
  }) {
    const signatureData = payload.data.signatureData;
    return await asyncValidatePluginService(signatureData)
      .then(() => {
        communicationApiIntegrationService.responseToClientId(
          this.clientId as string,
          payload.requestId,
          localStorage.getItem(JWT_TOKEN),
        );
        this.resolveHandshake?.(true);
        managerIntegrationService.addRegisteredService(this.clientId as string);
        delete this.resolveHandshake;
      })
      .catch((error) => {
        communicationApiIntegrationService.responseToClientId(
          this.clientId || '',
          payload.requestId,
        );
        console.error(
          'MainIntegrationService asyncValidatePluginService error',
          error,
        );
        this.resolveHandshake?.(false);
        delete this.resolveHandshake;
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
      // function handshake - step1
      if (payload.action === 'handshake-nonce') {
        await this.doHandshakeNonce(payload);
      }
      // function handshake - step2
      else if (payload.action === 'handshake-validation') {
        await this.doHandshakeValidation(payload);
      }
    }
  }
}

export const mainIntegrationService = new MainIntegrationService();
