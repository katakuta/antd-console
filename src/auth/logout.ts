import { clearAuthStorage } from './core';

export function logoutToLogin(): void {
  clearAuthStorage();
  window.location.replace('/login');
}
