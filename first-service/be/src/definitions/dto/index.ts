import { DataProperty } from '@bakku/platform';

export class ServiceValidateJWTRequestBodyDto {
  @DataProperty()
  clientId: string;
  @DataProperty()
  clientSecret: string;
  @DataProperty()
  jwt: string;
}

export class PlugInServiceValidateRequestDto {
  @DataProperty()
  clientId: string;
  @DataProperty()
  clientUrl: string;
  @DataProperty()
  nonce: string;
}

export class PlugInServiceValidationDto {
  @DataProperty()
  clientId: string;
  @DataProperty()
  clientUrl: string;
  @DataProperty()
  nonce: string;
  @DataProperty()
  signature: string;
}
