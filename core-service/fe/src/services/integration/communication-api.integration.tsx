/* eslint-disable @typescript-eslint/no-explicit-any */
import * as uuid from 'uuid';

class CommunicationApiIntegrationService {
  private apiPromise: {
    [key: string]: {
      resolve: (data: any) => void;
      reject: (error?: any) => void;
    };
  } = {};

  constructor() {
    window.addEventListener('message', (event) => {
      const responseId = event.data.responseId;
      if (responseId) {
        const promise = this.apiPromise[responseId];
        promise?.resolve(event.data.data);
        delete this.apiPromise[responseId];
      }
    });
  }

  public async request<I = any, O = any>(
    windowTarget: Window,
    action: string,
    data?: I,
    ignoreResponse?: boolean,
  ) {
    return new Promise<O | undefined>((resolve, reject) => {
      if (!windowTarget || !windowTarget.postMessage) {
        return reject('Can not detect target window or window.postMessage!');
      }
      const requestId = uuid.v4();
      if (!ignoreResponse) {
        this.apiPromise[requestId] = { resolve, reject };
      }
      windowTarget.postMessage(
        {
          data,
          requestId,
          action,
        },
        '*', // from main window
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

  public async requestToClientId<I = any, O = any>(
    clientId: string,
    action: string,
    data?: I,
  ) {
    const iframe = window.document.querySelector(
      `iframe#${clientId}`,
    ) as HTMLIFrameElement;
    return this.request<I, O>(iframe.contentWindow as Window, action, data);
  }

  public responseToClientId<T>(clientId: string, responseId: string, data?: T) {
    const iframe = window.document.querySelector(
      `iframe#${clientId}`,
    ) as HTMLIFrameElement;
    iframe.contentWindow?.postMessage({ responseId, data }, '*'); // from main window
  }

  public response<T>(windowTarget: Window, responseId: string, data?: T) {
    windowTarget.postMessage({ responseId, data }, '*'); // from main window
  }
}

export const communicationApiIntegrationService =
  new CommunicationApiIntegrationService();
