import { AuthRole, AuthRoleMap } from '../models/auth/auth.role';

export function decodeToken(
  token: string
): { id: number; role: AuthRole; exp?: number } | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    const payload = JSON.parse(atob(base64Url));

    let role: AuthRole | null =
      payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ?? null;

    if (!role && payload.user) {
      const userData = JSON.parse(payload.user);
      role = AuthRoleMap[userData.Role] ?? null;
    }

    if (!role) {
      console.error('No se pudo determinar el rol del usuario.');
      return null;
    }

    return {
      id: parseInt(payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'], 10) ?? null,
      role,
      exp: payload.exp ?? undefined,
    };
  } catch (e) {
    console.error('Error al decodificar el token:', e);
    return null;
  }
}
