import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wifi,
  WifiOff,
  CheckCircle2,
  X,
  Database,
  Cpu,
  Sparkles,
  Zap,
  Globe,
  HardDrive,
  RefreshCw,
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface NetworkStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  isOnline: boolean;
  isSimulatedOffline: boolean;
  onToggleSimulateOffline: () => void;
}

export const NetworkStatusModal: React.FC<NetworkStatusModalProps> = ({
  isOpen,
  onClose,
  isOnline,
  isSimulatedOffline,
  onToggleSimulateOffline,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          className="bg-[#FDFBF7] border-2 border-[#A67C52] rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="bg-[#5A5A40] text-white p-4 flex items-center justify-between border-b border-[#4A4A33]">
            <div className="flex items-center gap-2.5">
              <div
                className={`p-2 rounded-2xl ${
                  isOnline
                    ? 'bg-emerald-600/90 text-white'
                    : 'bg-amber-600/90 text-white'
                }`}
              >
                {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-serif italic font-bold text-base text-white flex items-center gap-2">
                  Adaptasi Rangkaian (Online & Offline)
                </h3>
                <p className="text-xs text-[#D6CEBE]">
                  Status Semasa: <strong className={isOnline ? 'text-emerald-300' : 'text-amber-300'}>
                    {isOnline ? '🌐 Mod Dalam Talian (Online)' : '📶 Mod Luar Talian (Offline)'}
                  </strong>
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                sounds.playPop();
                onClose();
              }}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#F2E8CF] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Status Highlight Banner */}
            <div
              className={`p-4 rounded-2xl border-2 flex items-start gap-3 ${
                isOnline
                  ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                  : 'bg-amber-50/80 border-amber-300 text-amber-950'
              }`}
            >
              <div className="mt-0.5">
                {isOnline ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <WifiOff className="w-5 h-5 text-amber-600" />
                )}
              </div>
              <div className="text-xs leading-relaxed">
                <div className="font-bold text-sm mb-0.5">
                  {isOnline ? 'Aplikasi Dalam Talian & Sedia Luar Talian' : 'Aplikasi Beroperasi Penuh Secara Luar Talian'}
                </div>
                <p>
                  {isOnline
                    ? 'Peranti anda mempunyai sambungan internet. Semua kemajuan permainan, bintang, dan perbualan AI disimpan secara langsung pada pelayar anda dan sedia untuk mod luar talian bila-bila masa.'
                    : 'Peranti anda sedang berada dalam mod luar talian (tanpa internet). Permainan memasak, pengiraan matematik DSKP 3.1, dan AI Puan Alya kekal 100% beroperasi tanpa sebarang gangguan!'}
                </p>
              </div>
            </div>

            {/* Dua Keadaan Adaptasi (Two Modes Comparison) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Keadaan 1: Mod Online */}
              <div
                className={`p-3.5 rounded-2xl border-2 transition-all ${
                  isOnline
                    ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-200'
                    : 'bg-[#F7F3ED] border-[#D6CEBE] opacity-80'
                }`}
              >
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-stone-200">
                  <Globe className="w-4 h-4 text-emerald-600" />
                  <span className="font-extrabold text-xs text-[#5A5A40]">1. Keadaan Dalam Talian (Online)</span>
                </div>
                <ul className="text-[11px] space-y-1.5 text-stone-700">
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Penyegerakan automatik data & kemajuan pelajar.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Memuatkan kemas kini versi dan modul terbaharu secara pantas.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>AI Puan Alya beroperasi dengan status penunjuk hijau.</span>
                  </li>
                </ul>
              </div>

              {/* Keadaan 2: Mod Offline */}
              <div
                className={`p-3.5 rounded-2xl border-2 transition-all ${
                  !isOnline
                    ? 'bg-white border-amber-500 shadow-md ring-2 ring-amber-200'
                    : 'bg-[#F7F3ED] border-[#D6CEBE] opacity-80'
                }`}
              >
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-stone-200">
                  <HardDrive className="w-4 h-4 text-amber-600" />
                  <span className="font-extrabold text-xs text-[#5A5A40]">2. Keadaan Luar Talian (Offline)</span>
                </div>
                <ul className="text-[11px] space-y-1.5 text-stone-700">
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">✓</span>
                    <span>100% bebas internet (sesuai untuk bilik darjah tanpa WiFi).</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">✓</span>
                    <span>Enjin Matematik & AI Puan Alya berjalan terbina dalam peranti.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">✓</span>
                    <span>Bintang, hidangan siap, dan sejarah disimpan dalam storan setempat.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Enjin AI & Logik Matematik */}
            <div className="bg-[#EFEAE1] p-3.5 rounded-2xl border border-[#D6CEBE] text-xs text-stone-800 space-y-1.5">
              <div className="font-bold text-[#5A5A40] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#A67C52]" />
                <span>Bagaimana AI Puan Alya Menjawab Tanpa Internet?</span>
              </div>
              <p className="text-[11px] leading-relaxed text-stone-600">
                AI Puan Alya dilengkapi dengan <strong>Enjin Logik Matematik DSKP 3.1 Terbina Dalam</strong>. Setiap soalan penambahan, penolakan, penukaran peratus, perpuluhan, pecahan setara, dan situasi masakan dianalisis secara automatik di dalam peranti murid tanpa perlu menghantar data ke pelayan luar.
              </p>
            </div>

            {/* Interactive Simulation Switch for Teachers & Students */}
            <div className="bg-white p-3.5 rounded-2xl border border-[#D6CEBE] flex items-center justify-between gap-3">
              <div className="text-xs">
                <div className="font-bold text-[#5A5A40] flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-[#A67C52]" />
                  <span>Uji Simulasi Mod Luar Talian / Dalam Talian</span>
                </div>
                <p className="text-[11px] text-stone-500">
                  Guru atau murid boleh menguji kedua-dua keadaan untuk melihat adaptasi aplikasi secara langsung.
                </p>
              </div>
              <button
                onClick={() => {
                  sounds.playPop();
                  onToggleSimulateOffline();
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  isSimulatedOffline
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-amber-700 hover:bg-amber-800 text-white'
                }`}
              >
                {isSimulatedOffline ? (
                  <>
                    <Wifi className="w-3.5 h-3.5" />
                    <span>Kembali ke Online</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3.5 h-3.5" />
                    <span>Uji Mod Offline</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-[#EFEAE1] p-3.5 px-5 border-t border-[#D6CEBE] flex items-center justify-between text-xs text-stone-600">
            <span className="text-[11px]">
              Dapur Pecahan Chef Alya • Sedia Berkhidmat Bila-bila Masa
            </span>
            <button
              onClick={() => {
                sounds.playPop();
                onClose();
              }}
              className="bg-[#5A5A40] hover:bg-[#4A4A33] text-white px-4 py-1.5 rounded-xl font-bold transition-colors cursor-pointer"
            >
              Faham & Tutup
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
