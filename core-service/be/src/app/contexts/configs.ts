import { merge } from 'lodash';
import { LoggerOptions } from '@bakku/logger';

import fse from 'fs-extra';
import { IConfigGlobal } from 'src/definitions';
import path from 'path';

const REQUIRED_STRING = 'REQUIRED_STRING';
const REQUIRED_NUMBER = 99999999;

class Config implements IConfigGlobal {
  host: string = REQUIRED_STRING;
  port: number | string = REQUIRED_STRING;
  log_config: LoggerOptions = {
    level: 'debug',
    filename: 'server',
    folderPath: REQUIRED_STRING,
    maxSizePerFile: 1048576,
  };
}

const loadJsonFile = (path: string): Config => {
  return fse.readJSONSync(path) as Config;
};

export const loadConfig = (): IConfigGlobal => {
  let envConfig = {};

  envConfig = process.env.CONFIG_FILE_PATH
    ? loadJsonFile(process.env.CONFIG_FILE_PATH)
    : loadJsonFile(
        path.join(__dirname, './../../../env/local/local.config.json'),
      );
  const configs: Config = merge(new Config(), envConfig);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const verifyConfig = (obj: any, configPath?: string) => {
    for (const key in obj) {
      if (obj[key] instanceof Object) {
        verifyConfig(obj[key], `${configPath || 'configs'}.${key}`);
      } else if (obj[key] === REQUIRED_STRING || obj[key] === REQUIRED_NUMBER) {
        throw new Error(
          `Configuration for key "${
            configPath || 'configs'
          }.${key}" is missing`,
        );
      }
    }
  };
  verifyConfig(configs);
  return configs;
};
