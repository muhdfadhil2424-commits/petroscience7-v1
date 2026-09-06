import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wifi, WifiOff, CheckCircle2, ShieldCheck } from 'lucide-react';

interface NetworkStatusBadgeProps {
  isOnline: boolean;
  compact?: boolean;
  className?: string;
  showTooltip?: boolean;
}

export const NetworkStatusBadge: React.FC<NetworkStatusBadgeProps> = ({
  isOnline,
  compact = false,
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all select-none ${
        isOnline
          ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-600/50 shadow-sm'
          : 'bg-amber-900/70 text-amber-300 border border-amber-500/60 shadow-sm animate-pulse'
      } ${className}`}
      title={
        isOnline
          ? 'Sambungan internet aktif. Data disimpan pada peranti.'
          : 'Tiada internet. Mod Luar Talian aktif — progress anda selamat disimpan pada peranti.'
      }
    >
      <span className="relative flex h-2 w-2">
        <span
          className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
            isOnline ? 'bg-emerald-400 animate-ping' : 'bg-amber-400 animate-ping'
          }`}
        />
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            isOnline ? 'bg-emerald-400' : 'bg-amber-400'
          }`}
        />
      </span>

      {isOnline ? (
        <Wifi className="w-3 h-3 text-emerald-400 flex-shrink-0" />
      ) : (
        <WifiOff className="w-3 h-3 text-amber-400 flex-shrink-0" />
      )}

      <span className="whitespace-nowrap font-medium">
        {compact ? (isOnline ? 'Dalam Talian' : 'Luar Talian') : isOnline ? '🟢 Dalam Talian' : '🟠 Luar Talian'}
      </span>
    </div>
  );
};

interface NetworkToastNotificationProps {
  message: string | null;
  isOnline: boolean;
  onClose: () => void;
}

export const NetworkToastNotification: React.FC<NetworkToastNotificationProps> = ({
  message,
  isOnline,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.aside
          aria-label="Notifikasi Rangkaian"
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed top-3 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] sm:w-auto pointer-events-auto"
        >
          <div
            onClick={onClose}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl shadow-xl border backdrop-blur-md cursor-pointer transition-transform hover:scale-[1.01] ${
              isOnline
                ? 'bg-[#1b382b]/95 text-emerald-100 border-emerald-400/50 shadow-emerald-950/40'
                : 'bg-[#3b2413]/95 text-amber-100 border-amber-400/50 shadow-amber-950/40'
            }`}
          >
            {isOnline ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
            )}
            <span className="text-xs sm:text-sm font-semibold leading-snug">
              {message}
            </span>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
