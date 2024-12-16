/* eslint-disable @typescript-eslint/no-explicit-any */
import { JWT_TOKEN } from '../../constants';
import { asyncInit } from '../api';
import { communicationApiIntegrationService } from './communication-api.integration';

class MainIntegrationService {
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
}

export const mainIntegrationService = new MainIntegrationService();
