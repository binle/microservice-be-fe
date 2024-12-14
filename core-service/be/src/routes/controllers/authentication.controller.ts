/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Body,
  Controller,
  HttpStatusCodes,
  InjectService,
  newBinHttpError,
  Post,
  ResponseSchemaSuccess,
} from '@bakku/platform';
import { HelperUtil, PluginService } from 'src/app';

import {
  IJwtUser,
  LoginRequestBodyDto,
  LoginResponseBodyDto,
  ServiceValidateJWTRequestBodyDto,
} from 'src/definitions';

@Controller({
  name: Symbol('AuthenticationController'),
  path: 'auth',
})
class AuthenticationControllerImpl {
  jwtSecretKey: string = 'jwtSecretKey';
  @InjectService('PluginService')
  pluginService: PluginService;

  @Post('login')
  @ResponseSchemaSuccess({ propertyType: LoginResponseBodyDto })
  login(@Body() data: LoginRequestBodyDto): LoginResponseBodyDto {
    let pass = false;
    if (
      (data.id === 'test' && data.password === 'test') ||
      (data.id === 'admin' && data.password === 'admin')
    ) {
      pass = true;
    }
    if (!pass) {
      throw newBinHttpError(HttpStatusCodes.BAD_GATEWAY);
    }
    return {
      jwt: HelperUtil.generateJwtToken<IJwtUser>(
        {
          id: data.id,
          role: data.id,
          time: Date.now(),
          exp: (Date.now() + 10 * 60 * 1000) / 1000,
        },
        this.jwtSecretKey,
      ),
    };
  }

  @Post('plugin-service-validate')
  plugInServiceValidateJwt(@Body() data: ServiceValidateJWTRequestBodyDto) {
    const service = this.pluginService.getService(data.clientId);
    if (!service || service.clientSecret !== data.clientSecret) {
      throw newBinHttpError(HttpStatusCodes.BAD_REQUEST);
    }
    if (!HelperUtil.verifyJwtToken(data.jwt, this.jwtSecretKey)) {
      throw newBinHttpError(HttpStatusCodes.UNAUTHORIZED);
    }
  }
}
