/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Body,
  Controller,
  Get,
  HttpStatusCodes,
  Middleware,
  newBinHttpError,
  Queries,
  ResponseSchemaSuccess,
} from '@bakku/platform';

import { HelperUtil, uuidV4 } from 'src/app';
import {
  PlugInServiceValidateRequestDto,
  PlugInServiceValidationDto,
} from 'src/definitions';
import { requireAuthenticatedUserMiddleWare } from '../middleware';

@Controller({
  name: Symbol('ApplicationController'),
  path: 'app',
})
class ApplicationControllerImpl {
  @Get('prepare')
  @ResponseSchemaSuccess({ propertyType: PlugInServiceValidationDto })
  init(
    @Queries() data: PlugInServiceValidateRequestDto,
  ): PlugInServiceValidationDto {
    const nonce = data.nonce;
    if (
      data.clientId !==
        global.applicationContexts.configs.client_info.client_id ||
      data.clientUrl !==
        global.applicationContexts.configs.client_info.client_url
    ) {
      throw newBinHttpError(HttpStatusCodes.BAD_REQUEST);
    }
    return {
      clientId: global.applicationContexts.configs.client_info.client_id,
      clientUrl: global.applicationContexts.configs.client_info.client_url,
      nonce,
      signature: HelperUtil.sign(
        global.applicationContexts.configs.client_info.client_secret,
        nonce,
      ),
    };
  }

  @Get('sayHello')
  @Middleware(requireAuthenticatedUserMiddleWare)
  sayHello() {
    return `${global.applicationContexts.configs.client_info.client_id} hello!`;
  }
}
