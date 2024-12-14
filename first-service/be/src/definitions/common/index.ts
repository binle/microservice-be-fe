import { INumberSchema, IStringSchema } from '@bakku/platform';

export * from './context.definition';

export interface IDataError {
  message: string;
  code?: string;
}

export const StringRequireSchemaValidator: IStringSchema = {
  type: 'string',
  validation: { isRequired: true },
};
export const NumberRequireSchemaValidator: INumberSchema = {
  type: 'number',
  validation: { isRequired: true },
};

export interface IJwtUser {
  id: string;
  role: string;
  time: number;
  exp: number;
}
