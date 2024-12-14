import {
  DataArrayPropertyOptional,
  DataProperty,
  DataPropertyOptional,
} from '@bakku/platform';
import { IJwtUser } from '../common';

export class DetailParamRequestDto {
  @DataProperty()
  id: string;
}

export class PlugInServiceDto {
  @DataProperty()
  clientUrl: string;
  @DataProperty()
  clientName: string;
  @DataProperty()
  clientId: string;
  @DataProperty()
  clientSecret: string;
}

export class PlugInServiceResponseDto {
  @DataProperty()
  clientUrl: string;
  @DataProperty()
  clientName: string;
  @DataProperty()
  clientId: string;
  @DataPropertyOptional()
  clientSecret?: string;
}

export class PlugInServiceGenerateRequestBodyDto {
  @DataProperty()
  clientId: string;
  @DataProperty()
  clientUrl: string;
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

export class ListPlugInServiceResponseDto {
  @DataArrayPropertyOptional({
    itemSchema: { propertyType: PlugInServiceResponseDto },
  })
  list?: PlugInServiceResponseDto[];
}

export class LoginRequestBodyDto {
  @DataProperty()
  id: string;
  @DataProperty()
  password: string;
}

export class LoginResponseBodyDto {
  @DataProperty()
  jwt: string;
}

export class ServiceValidateJWTRequestBodyDto {
  @DataProperty()
  clientId: string;
  @DataProperty()
  clientSecret: string;
  @DataProperty()
  jwt: string;
}

export class IJwtUserDto implements IJwtUser {
  @DataProperty()
  id: string;
  @DataProperty()
  role: string;
  @DataProperty()
  time: number;
  @DataProperty()
  exp: number;
}

export class AppInitResponseDto {
  @DataProperty({ propertyType: IJwtUserDto })
  user: IJwtUserDto;
  @DataArrayPropertyOptional({
    itemSchema: { propertyType: PlugInServiceResponseDto },
  })
  pluginServices?: PlugInServiceResponseDto[];
}
