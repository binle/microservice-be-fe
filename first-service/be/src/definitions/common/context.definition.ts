import { LoggerOptions } from '@bakku/logger';

export interface IConfigGlobal {
  core_be_url: string;
  host: string;
  port: string | number;
  log_config: LoggerOptions;
  client_info: {
    client_id: string;
    client_secret: string;
    client_url: string;
  };
}
