/**
 * Network Connectivity Manager for Kembara Dunia Pecahan
 * Handles browser network status (navigator.onLine, window online/offline events)
 * Supports real-time status transitions and storage fallback.
 */

export type NetworkStatus = 'online' | 'offline';

export interface NetworkState {
  isOnline: boolean;
  statusLabel: '🟢 Dalam Talian' | '🟠 Luar Talian';
  lastChanged: string; // ISO timestamp
}

// Check current network status safely
export function isBrowserOnline(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return true;
  }
  return navigator.onLine;
}

export function getCurrentNetworkState(): NetworkState {
  const online = isBrowserOnline();
  return {
    isOnline: online,
    statusLabel: online ? '🟢 Dalam Talian' : '🟠 Luar Talian',
    lastChanged: new Date().toISOString(),
  };
}

type NetworkListener = (isOnline: boolean) => void;
const listeners = new Set<NetworkListener>();

let initialized = false;

function initNetworkListeners(): void {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  window.addEventListener('online', () => {
    listeners.forEach((listener) => {
      try {
        listener(true);
      } catch (err) {
        console.error('Network listener error on online', err);
      }
    });
  });

  window.addEventListener('offline', () => {
    listeners.forEach((listener) => {
      try {
        listener(false);
      } catch (err) {
        console.error('Network listener error on offline', err);
      }
    });
  });
}

/**
 * Subscribe to online/offline network changes
 */
export function subscribeNetworkStatus(listener: NetworkListener): () => void {
  initNetworkListeners();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
