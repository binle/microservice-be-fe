/* eslint-disable @typescript-eslint/no-explicit-any */
import { JWT_TOKEN } from '../../constants';
import { asyncInit } from '../api';
import * as uuid from 'uuid';

class IntegrationService {
  private requestMap: {
    [key: string]: {
      resolve: (data: any) => void;
      reject: (error?: any) => void;
    };
  } = {};

  constructor() {
    window.addEventListener('message', (event) => {
      if (event.origin === window.env.core_client_url) {
        if (event.data.requestId) {
          const promise = this.requestMap[event.data.requestId];
          promise?.resolve(event.data.data);
          delete this.requestMap[event.data.requestId];
        }
      }
    });
  }

  public async prepare() {
    const nonce = await this.request({ action: 'preparation-nonce' });
    const signatureData = await asyncInit(
      nonce,
      window.env.client_id,
      window.location.origin,
    );
    const jwt = await this.request({
      action: 'preparation-validation',
      signatureData,
    });
    localStorage.setItem(JWT_TOKEN, jwt);
  }

  private async request<I = any, O = any>(data: I) {
    return new Promise<O>((resolve, reject) => {
      const requestId = uuid.v4();
      this.requestMap[requestId] = { resolve, reject };
      const clientId = window.env.client_id;
      window.parent.postMessage(
        {
          data,
          requestId,
          clientId,
        },
        window.env.core_client_url,
      );
      setTimeout(() => {
        const promise = this.requestMap[requestId];
        promise?.reject();
        delete this.requestMap[requestId];
      }, 5000);
    });
  }
}

export const integrationService = new IntegrationService();
