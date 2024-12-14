/* eslint-disable @typescript-eslint/no-explicit-any */
// import { convertToSwaggerJson } from '@bakku/document';
import {
  convertToSwaggerJson,
  getDefaultCorsHandler,
  routeAppError,
  startServer,
  TypeServerOptions,
} from '@bakku/platform';
import swaggerUi from 'swagger-ui-express';
import { initialization } from './app';
import './routes';
import { detectUserMiddleWare } from './routes/middleware';

(async () => {
  await initialization();
  const options: TypeServerOptions = {
    apiPrefix: 'api',
    logger: global.applicationContexts.logger,

    documentOptions: {
      docPath: 'doc',
    },
    port: global.applicationContexts.configs.port as number,
    appHandlers: [getDefaultCorsHandler(['*']), detectUserMiddleWare],
  };
  const { app, apiData } = startServer(options);

  const swaggerJson = convertToSwaggerJson(apiData);
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerJson));

  routeAppError(app, options);
})().catch((error) => {
  const { logger } = global.applicationContexts || {};
  (logger ? logger : console).error('server error ========', error);
});
