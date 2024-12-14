import { ILogger } from '@bakku/logger';
import { IConfigGlobal, IRedisGlobal } from 'src/definitions';

declare global {
  namespace NodeJS {
    interface Global {
      applicationContexts: {
        configs: IConfigGlobal;
        logger: ILogger;
        rootPath: string;
      };
    }
  }
}
