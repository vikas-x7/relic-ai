import type { AccessPayload } from '../jwt/jwt';

export interface AppVariables {
  authUser: AccessPayload;
}
