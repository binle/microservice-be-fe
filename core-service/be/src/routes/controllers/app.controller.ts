/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Controller,
  Get,
  InjectService,
  Middleware,
  Req,
  ResponseSchemaSuccess,
} from '@bakku/platform';
import { Request } from 'express-serve-static-core';

import {
  AppInitResponseDto,
  IJwtUserDto,
  LoginResponseBodyDto,
} from 'src/definitions';
import { requireAuthenticatedUserMiddleWare } from '../middleware';
import { PluginService } from 'src/app';

@Controller({
  name: Symbol('ApplicationController'),
  path: 'app',
})
class ApplicationControllerImpl {
  @InjectService('PluginService')
  pluginService: PluginService;

  @Get('init')
  @Middleware(requireAuthenticatedUserMiddleWare)
  @ResponseSchemaSuccess({ propertyType: LoginResponseBodyDto })
  init(@Req() req: Request): AppInitResponseDto {
    return {
      user: req.user as IJwtUserDto,
      pluginServices: this.pluginService.getServices(),
    };
  }
}
