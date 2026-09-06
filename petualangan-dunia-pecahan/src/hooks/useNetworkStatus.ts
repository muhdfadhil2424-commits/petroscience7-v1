import { useState, useEffect, useCallback, useRef } from 'react';
import { isBrowserOnline, subscribeNetworkStatus } from '../utils/networkStatus';

export interface UseNetworkStatusResult {
  isOnline: boolean;
  statusLabel: '🟢 Dalam Talian' | '🟠 Luar Talian';
  toastMessage: string | null;
  clearToast: () => void;
}

export function useNetworkStatus(): UseNetworkStatusResult {
  const [isOnline, setIsOnline] = useState<boolean>(() => isBrowserOnline());
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);
  const isInitialMount = useRef<boolean>(true);

  const clearToast = useCallback(() => {
    setToastMessage(null);
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = null;
    }
  }, []);

  const showToast = useCallback((msg: string, durationMs: number = 4500) => {
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(msg);
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMessage(null);
      toastTimeoutRef.current = null;
    }, durationMs);
  }, []);

  useEffect(() => {
    // Check initial status
    const current = isBrowserOnline();
    setIsOnline(current);

    const unsubscribe = subscribeNetworkStatus((online) => {
      setIsOnline(online);
      if (online) {
        showToast('✓ Sambungan kembali.', 3500);
      } else {
        showToast('Mod luar talian aktif. Progress anda disimpan pada peranti.', 5000);
      }
    });

    isInitialMount.current = false;

    return () => {
      unsubscribe();
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
  }, [showToast]);

  return {
    isOnline,
    statusLabel: isOnline ? '🟢 Dalam Talian' : '🟠 Luar Talian',
    toastMessage,
    clearToast,
  };
}
