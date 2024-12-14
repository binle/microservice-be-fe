import { IJwtUser } from 'src/definitions';

declare global {
  namespace Express {
    interface Request {
      user?: IJwtUser;
    }
  }
}
