import { LoggerOptions } from '@bakku/logger';

export interface IConfigGlobal {
  host: string;
  port: string | number;
  log_config: LoggerOptions;
}
