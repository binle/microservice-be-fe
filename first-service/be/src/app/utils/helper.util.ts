/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from 'crypto';
import fsExtra from 'fs-extra';
import * as jsonwebtoken from 'jsonwebtoken';
import { merge } from 'lodash';
import path from 'path';
import * as uuid from 'uuid';

export class HelperUtil {
  static getFileExtensions(folderPath: string): string[] {
    const getAllExtensions = (folderPath: string) => {
      let results: { [key: string]: boolean } = {};
      const listItem = fsExtra.readdirSync(folderPath);
      for (const item of listItem) {
        const itemPath = path.join(folderPath, item);
        const stat = fsExtra.statSync(itemPath);
        if (stat.isFile()) {
          results[path.extname(item).substring(1)] = true;
        } else if (stat.isDirectory()) {
          results = merge(results, getAllExtensions(itemPath));
        }
      }
      return results;
    };
    return Object.keys(getAllExtensions(folderPath));
  }

  static sign(key: string, nonce: string) {
    return crypto
      .createHmac('SHA256', key)
      .update(nonce)
      .digest()
      .toString('hex');
  }

  static generateJwtToken<T extends jsonwebtoken.JwtPayload>(
    payload: T,
    secret: string,
  ): string {
    return jsonwebtoken.sign(payload, secret);
  }

  static verifyJwtToken<T extends jsonwebtoken.JwtPayload>(
    token: string,
    secret: string,
  ): T {
    return jsonwebtoken.verify(token, secret) as T;
  }

  static decode<T extends jsonwebtoken.JwtPayload>(jwt: string): T {
    return jsonwebtoken.decode(jwt) as T;
  }
}

export const uuidV4 = (): string => uuid.v4();
