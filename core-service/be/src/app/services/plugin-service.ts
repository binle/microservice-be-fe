import { Service } from '@bakku/platform';
import {
  PlugInServiceDto,
  PlugInServiceGenerateRequestBodyDto,
  PlugInServiceValidationDto,
} from 'src/definitions';
import { HelperUtil, uuidV4 } from '../utils';

@Service('PluginService')
export class PluginService {
  private services: { [key: string]: PlugInServiceDto } = {};
  private serviceNonce: {
    [key: string]: { [key: string]: boolean | undefined };
  } = {};

  public getServices() {
    return Object.values(this.services);
  }

  public getService(id: string) {
    return this.services[id];
  }

  public deleteService(id: string) {
    delete this.services[id];
  }
  public saveService(service: PlugInServiceDto) {
    this.services[service.clientId] = service;
  }

  public generateNonce(data: PlugInServiceGenerateRequestBodyDto) {
    const service = this.services[data.clientId];
    if (!service || service.clientUrl !== data.clientUrl) {
      return false;
    }
    const nonce = uuidV4();
    this.serviceNonce[data.clientId] = this.serviceNonce[data.clientId] || {};
    this.serviceNonce[data.clientId][nonce] = true;
    return nonce;
  }

  public validate(data: PlugInServiceValidationDto) {
    const service = this.services[data.clientId];
    if (
      !service ||
      service.clientUrl !== data.clientUrl ||
      !this.serviceNonce[data.clientId]?.[data.nonce]
    ) {
      return false;
    }
    delete this.serviceNonce[data.clientId][data.nonce];
    const signature = HelperUtil.sign(service.clientSecret, data.nonce);
    if (signature !== data.signature) {
      return false;
    }
    return true;
  }
}
