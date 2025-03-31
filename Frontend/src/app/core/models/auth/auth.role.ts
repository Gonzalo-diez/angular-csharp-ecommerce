export enum AuthRole {
  User = 'User',
  Premium = 'Premium',
  Admin = 'Admin',
}

export const AuthRoleMap: Record<number, AuthRole> = {
  0: AuthRole.User,
  1: AuthRole.Premium,
  2: AuthRole.Admin,
};
