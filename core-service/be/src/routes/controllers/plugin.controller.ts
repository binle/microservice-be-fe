/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatusCodes,
  InjectService,
  Middleware,
  newBakkuHttpError,
  Params,
  Post,
  ResponseSchemaSuccess,
} from '@bakku/platform';
import { PluginService } from 'src/app';

import {
  DetailParamRequestDto,
  ListPlugInServiceResponseDto,
  PlugInServiceDto,
  PlugInServiceGenerateRequestBodyDto,
  PlugInServiceResponseDto,
  PlugInServiceValidationDto,
} from 'src/definitions';
import {
  requireAllowedUserMiddleWare,
  requireAuthenticatedUserMiddleWare,
} from '../middleware';

@Controller({
  name: Symbol('PluginController'),
  path: 'plugin',
})
class PluginControllerImpl {
  @InjectService('PluginService')
  pluginService: PluginService;

  @Get('')
  @ResponseSchemaSuccess({ propertyType: ListPlugInServiceResponseDto })
  @Middleware(requireAllowedUserMiddleWare('admin'))
  getPlugInServices(): ListPlugInServiceResponseDto {
    return {
      list: this.pluginService
        .getServices()
        .map((item) => ({ ...item, clientSecret: '' })),
    };
  }

  @Post('')
  @ResponseSchemaSuccess({ propertyType: PlugInServiceResponseDto })
  @Middleware(requireAllowedUserMiddleWare('admin'))
  savePlugInServiceDetail(
    @Body() service: PlugInServiceDto,
  ): PlugInServiceResponseDto {
    this.pluginService.saveService(service);
    return {
      ...this.pluginService.getService(service.clientId),
      clientSecret: '',
    };
  }
  @Delete(':id')
  @Middleware(requireAllowedUserMiddleWare('admin'))
  deletePlugInServiceDetail(@Params() { id }: DetailParamRequestDto) {
    this.pluginService.deleteService(id);
  }

  @Get(':id')
  @ResponseSchemaSuccess({ propertyType: PlugInServiceResponseDto })
  @Middleware(requireAuthenticatedUserMiddleWare)
  getPlugInServiceDetail(
    @Params() { id }: DetailParamRequestDto,
  ): PlugInServiceResponseDto {
    return { ...this.pluginService.getService(id), clientSecret: '' };
  }

  @Post('nonce')
  @Middleware(requireAuthenticatedUserMiddleWare)
  generateNonce(@Body() data: PlugInServiceGenerateRequestBodyDto) {
    return this.pluginService.generateNonce(data);
  }

  @Post('validate')
  @Middleware(requireAuthenticatedUserMiddleWare)
  validatePlugInService(@Body() data: PlugInServiceValidationDto) {
    if (!this.pluginService.validate(data)) {
      throw newBakkuHttpError(HttpStatusCodes.BAD_REQUEST);
    }
  }
}
