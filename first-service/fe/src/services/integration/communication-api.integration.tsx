/* eslint-disable @typescript-eslint/no-explicit-any */
import * as uuid from 'uuid';
import { JWT_TOKEN } from '../../constants';

class CommunicationApiIntegrationService {
  private apiPromise: {
    [key: string]: {
      resolve: (data: any) => void;
      reject: (error?: any) => void;
    };
  } = {};

  constructor() {
    window.addEventListener('message', (event) => {
      // response to this window
      const responseId = event.data.responseId;
      if (responseId) {
        const promise = this.apiPromise[responseId];
        promise?.resolve(event.data.data);
        delete this.apiPromise[responseId];
      }
    });
  }

  public async request<I = any, O = any>(
    action: string,
    data?: I,
    ignoreResponse?: boolean,
  ) {
    return new Promise<O | undefined>((resolve, reject) => {
      const requestId = uuid.v4();
      if (!ignoreResponse) {
        this.apiPromise[requestId] = { resolve, reject };
      }
      const clientId = window.env.client_id;
      window.parent.postMessage(
        {
          data,
          requestId,
          clientId,
          action,
          jwt: localStorage.getItem(JWT_TOKEN),
        },
        window.env.core_client_url, // from child window
      );
      if (!ignoreResponse) {
        setTimeout(() => {
          const promise = this.apiPromise[requestId];
          promise?.reject();
          delete this.apiPromise[requestId];
        }, 5000);
      } else {
        resolve(undefined as O);
      }
    });
  }

  public response<T>(windowTarget: Window, responseId: string, data?: T) {
    windowTarget.postMessage({ responseId, data }, window.env.core_client_url); // from child window
  }
}

export const communicationApiIntegrationService =
  new CommunicationApiIntegrationService();
