import type { AccessPayload } from '../tokens/jwt';

export interface AppVariables {
  authUser: AccessPayload;
}
