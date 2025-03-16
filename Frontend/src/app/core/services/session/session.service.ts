import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  generateSessionId(): string {
    let match = document.cookie.match(/sessionId=([^;]*)/);
    if (!match) {
      const sessionId =
        Math.random().toString(36).substring(2) + Date.now().toString(36);
      document.cookie = `sessionId=${sessionId}; path=/; max-age=2592000`; // Expira en 30 días
      return sessionId;
    }
    return match[1];
  }

  getSessionId(): string | null {
    let match = document.cookie.match(/sessionId=([^;]*)/);
    return match ? match[1] : null;
  }
}
