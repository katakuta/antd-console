/**
 * Auth core — token & user info storage.
 * Standalone replacement for @ota/shared-auth/core.
 * No external dependencies (no js-cookie, no axios).
 */

const TOKEN_KEY = 'console_frame.token';
const USER_INFO_KEY = 'console_frame.userInfo';
const LAST_PAGE_KEY = 'console_frame.lastPagePath';

// ── SSR-safe storage helpers ──

function getLS(): Storage | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
}

function getSS(): Storage | null {
  try {
    return typeof sessionStorage === 'undefined' ? null : sessionStorage;
  } catch {
    return null;
  }
}

// ── UserInfo type ──

export type UserInfo = {
  userName: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  photo?: string;
  roles?: string[];
  authBtnList?: string[];
  [k: string]: unknown;
};

// ── Token ──

export function getToken(): string | null {
  const ls = getLS();
  const ss = getSS();
  return ss?.getItem(TOKEN_KEY) ?? ls?.getItem(TOKEN_KEY) ?? null;
}

export function setToken(token: string): void {
  getLS()?.setItem(TOKEN_KEY, token);
  getSS()?.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  getLS()?.removeItem(TOKEN_KEY);
  getSS()?.removeItem(TOKEN_KEY);
}

// ── UserInfo ──

export function setUserInfo(info: UserInfo): void {
  const json = JSON.stringify(info);
  getLS()?.setItem(USER_INFO_KEY, json);
  getSS()?.setItem(USER_INFO_KEY, json);
}

export function getUserInfo(): UserInfo | null {
  try {
    const raw = getSS()?.getItem(USER_INFO_KEY) ?? getLS()?.getItem(USER_INFO_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserInfo;
  } catch {
    return null;
  }
}

export function buildUserInfoFromLogin(
  payload: Record<string, unknown> | undefined,
  inputUserName: string,
): UserInfo {
  return {
    userName: inputUserName,
    email: (payload?.email as string) ?? inputUserName,
    firstName: (payload?.firstName as string) ?? inputUserName.split('@')[0],
    lastName: (payload?.lastName as string) ?? '',
    roles: ['admin'],
    authBtnList: ['*'],
    ...(payload ?? {}),
  };
}

// ── Clear all ──

export function clearAuthStorage(): void {
  removeToken();
  getLS()?.removeItem(USER_INFO_KEY);
  getSS()?.removeItem(USER_INFO_KEY);
}

// ── Last page path ──

export function saveLastPagePath(path: string): void {
  if (!path || path === '/' || path.startsWith('/login')) return;
  try {
    getLS()?.setItem(LAST_PAGE_KEY, path);
  } catch { /* ignore */ }
}

export function getLastPagePath(): string {
  try {
    const path = getLS()?.getItem(LAST_PAGE_KEY);
    if (path && path !== '/' && !path.startsWith('/login')) return path;
  } catch { /* ignore */ }
  return '/overview/dashboard';
}

// ── Redirect param parsing ──

export function parseRedirectParams(search: string): {
  redirect?: string;
  params?: Record<string, unknown>;
} {
  const urlParams = new URLSearchParams(search);
  const redirect = urlParams.get('redirect') ?? undefined;
  let params: Record<string, unknown> | undefined;
  const paramsRaw = urlParams.get('params');
  if (paramsRaw) {
    try {
      params = JSON.parse(decodeURIComponent(paramsRaw)) as Record<string, unknown>;
    } catch { /* ignore */ }
  }
  return { redirect, params };
}
