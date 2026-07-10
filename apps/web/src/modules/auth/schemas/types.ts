export type AuthUser = {
  id: number;
  email: string;
  name: string | null;
  avatar: string | null;
};

export type AuthResponse = {
  user: AuthUser;
};

export type ProviderAvailability = {
  google: boolean;
  github: boolean;
};
