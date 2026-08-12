import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Printer, Download, Sparkles, Award, Star, CheckCircle, Lock, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';
import { StudentProfile, UserProgress } from '../types';
import { playSfx } from '../utils/audio';
import { AlyaCharacter } from './AlyaCharacter';
import { MathFraction } from './MathFraction';

interface CertificateModalProps {
  isOpen: boolean;
  soundEnabled?: boolean;
  student?: StudentProfile | null;
  studentName?: string;
  studentClass?: string;
  teacherName?: string;
  completedChallenges?: number;
  earnedStars?: number;
  issueDate?: string;
  progressOverride?: UserProgress;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  soundEnabled = true,
  student,
  studentName: studentNameProp,
  studentClass: studentClassProp,
  teacherName = 'Guru Matematik',
  completedChallenges: completedChallengesProp,
  earnedStars: earnedStarsProp,
  issueDate,
  progressOverride,
  onClose,
}) => {
  const activeProgress = progressOverride || student?.progress;

  const completedChallenges =
    typeof completedChallengesProp === 'number'
      ? completedChallengesProp
      : activeProgress?.completedChallenges || 0;

  const totalEarnedStars =
    typeof earnedStarsProp === 'number'
      ? earnedStarsProp
      : activeProgress?.earnedStars || 0;

  const displayName = studentNameProp || student?.nama || 'Aiman Hakim';
  const displayClass = studentClassProp || student?.kelas || '4 Asah';
  const displayTeacher = teacherName || 'Guru Matematik';

  const isUnlocked = completedChallenges >= 9;

  useEffect(() => {
    if (isOpen) {
      if (isUnlocked) {
        playSfx('fanfare', soundEnabled);
        try {
          confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.4 },
          });
          setTimeout(() => {
            confetti({
              particleCount: 80,
              angle: 60,
              spread: 70,
              origin: { x: 0 },
            });
            confetti({
              particleCount: 80,
              angle: 120,
              spread: 70,
              origin: { x: 1 },
            });
          }, 350);
        } catch {
          // ignore
        }
      } else {
        playSfx('lock', soundEnabled);
      }
    }
  }, [isOpen, soundEnabled, isUnlocked]);

  if (!isOpen) return null;

  // Determine Dynamic Tier Badge (Tahap Pencapaian)
  let tierBadge = '⭐ PEJUANG PECAHAN';
  let tierBg = 'bg-amber-100 text-amber-900 border-amber-300';
  if (totalEarnedStars >= 27) {
    tierBadge = '🏆 MASTER PECAHAN';
    tierBg = 'bg-amber-400 text-amber-950 border-amber-600';
  } else if (totalEarnedStars >= 20) {
    tierBadge = '🌟 WIRA PECAHAN';
    tierBg = 'bg-emerald-100 text-emerald-900 border-emerald-400';
  } else if (totalEarnedStars >= 10) {
    tierBadge = '⭐ PEJUANG PECAHAN';
    tierBg = 'bg-blue-100 text-blue-900 border-blue-300';
  }

  // Format Completion Date
  const rawDate = issueDate || activeProgress?.certificateDate || student?.tarikhDaftar || new Date().toISOString();
  let formattedDate = '11 Ogos 2026';
  try {
    const d = new Date(rawDate);
    if (!isNaN(d.getTime())) {
      formattedDate = d.toLocaleDateString('ms-MY', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
  } catch {
    formattedDate = '11 Ogos 2026';
  }

  const handlePrint = () => {
    playSfx('click', soundEnabled);
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1050] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* CSS for A4 Landscape Printing */}
        <style>{`
          @media print {
            body * {
              visibility: hidden !important;
            }
            #printable-certificate, #printable-certificate * {
              visibility: visible !important;
            }
            #printable-certificate {
              position: fixed !important;
              left: 0 !important;
              top: 0 !important;
              width: 100vw !important;
              height: 100vh !important;
              margin: 0 !important;
              padding: 24px !important;
              box-sizing: border-box !important;
              background-color: #FFFDF7 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              display: flex !important;
              flex-direction: column !important;
              justify-content: space-between !important;
              border: 12px double #D4AF37 !important;
              border-radius: 16px !important;
              box-shadow: none !important;
            }
            .no-print {
              display: none !important;
            }
            @page {
              size: A4 landscape;
              margin: 0;
            }
          }
        `}</style>

        {/* LOCKED STATE MODAL */}
        {!isUnlocked ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#FFF8E8] text-[#4A3728] rounded-3xl p-6 sm:p-8 max-w-md w-full border-4 border-[#F4C95D] shadow-2xl relative text-center space-y-5 font-rounded my-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-amber-100 hover:bg-amber-200 text-[#4A3728] transition cursor-pointer no-print"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-20 h-20 rounded-3xl bg-amber-200 border-4 border-amber-400 flex items-center justify-center mx-auto shadow-inner text-4xl">
              🔒
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-200/80 border border-amber-400 text-amber-900 font-extrabold text-xs uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5 text-amber-700" />
                <span>SIJIL BELUM DIBUKA</span>
              </span>

              <h2 className="font-serif-title font-bold text-xl sm:text-2xl text-[#4A3728]">
                🔒 Selesaikan semua cabaran untuk membuka sijil.
              </h2>

              <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed max-w-xs mx-auto">
                Murid perlu menyelesaikan kesemua 9 cabaran dalam permainan untuk layak menerima Sijil Pencapaian rasmi Master Pecahan.
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border-2 border-amber-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-gray-600">Kemajuan Cabaran Anda:</span>
                <span className="font-mono text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                  {completedChallenges} / 9 Selesai
                </span>
              </div>
              <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden p-0.5 border border-stone-300">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-[#D98262] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (completedChallenges / 9) * 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-gray-500 italic">
                {9 - completedChallenges} lagi cabaran yang perlu diselesaikan!
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#3c4233] to-[#2d3226] text-[#F4C95D] font-extrabold text-sm shadow-lg hover:brightness-110 transition cursor-pointer border border-[#525a46]"
            >
              FAHAM, SAYA AKAN TERUS BERMAIN 🎮
            </button>
          </motion.div>
        ) : (
          /* UNLOCKED CERTIFICATE VIEW */
          <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto my-auto flex flex-col items-center">
            {/* Top Toolbar Action Bar (Non-Printable) */}
            <div className="w-full flex items-center justify-between mb-3 px-2 no-print">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500 text-white font-extrabold text-xs shadow-md flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>Sijil Sah Master Pecahan</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-[#D98262] text-white font-bold text-xs shadow-lg hover:from-amber-600 hover:to-[#c87253] transition-all flex items-center gap-1.5 cursor-pointer border border-amber-300"
                >
                  <Printer className="w-4 h-4" />
                  <span>🖨️ CETAK SIJIL</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-xl bg-[#3c4233] text-[#F4C95D] font-bold text-xs shadow-lg hover:bg-[#2d3226] transition-all flex items-center gap-1.5 cursor-pointer border border-[#525a46]"
                >
                  <Download className="w-4 h-4" />
                  <span>⬇️ SIMPAN SIJIL (PDF)</span>
                </button>

                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-white/90 hover:bg-white text-gray-800 transition cursor-pointer shadow-md"
                  title="Tutup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PRINTABLE CERTIFICATE CONTAINER */}
            <div
              id="printable-certificate"
              className="w-full bg-[#FFFDF7] text-[#3c4233] rounded-3xl p-6 sm:p-10 border-[10px] double border-[#D4AF37] shadow-2xl relative font-rounded overflow-hidden flex flex-col justify-between"
              style={{
                backgroundImage: 'radial-gradient(#F4C95D 0.5px, transparent 0.5px)',
                backgroundSize: '24px 24px',
              }}
            >
              {/* Decorative Corner Accents */}
              <div className="absolute top-3 left-3 w-12 h-12 border-t-4 border-l-4 border-[#D4AF37] rounded-tl-xl pointer-events-none" />
              <div className="absolute top-3 right-3 w-12 h-12 border-t-4 border-r-4 border-[#D4AF37] rounded-tr-xl pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-12 h-12 border-b-4 border-l-4 border-[#D4AF37] rounded-bl-xl pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-12 h-12 border-b-4 border-r-4 border-[#D4AF37] rounded-br-xl pointer-events-none" />

              {/* Watermark Fraction Graphics in Background */}
              <div className="absolute top-1/2 left-10 -translate-y-1/2 text-8xl font-serif font-black text-[#F4C95D]/20 select-none pointer-events-none">
                <MathFraction num={1} den={2} size="2xl" />
              </div>
              <div className="absolute top-1/2 right-10 -translate-y-1/2 text-8xl font-serif font-black text-[#F4C95D]/20 select-none pointer-events-none">
                <MathFraction num={3} den={4} size="2xl" />
              </div>

              {/* Header Emblem & Title */}
              <div className="text-center space-y-2 relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border-2 border-[#D4AF37] text-[#4A3728] font-bold text-xs uppercase tracking-widest shadow-sm">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>KSSR REKOD PEMBELAJARAN MATEMATIK</span>
                </div>

                <h1 className="font-serif-title font-black text-3xl sm:text-4xl md:text-5xl text-[#4A3728] tracking-tight mt-1">
                  SIJIL PENCAPAIAN
                </h1>

                <div className="flex items-center justify-center gap-3">
                  <div className="h-0.5 w-12 bg-gradient-to-r from-transparent to-[#D4AF37]" />
                  <span className="font-serif-title font-bold text-lg sm:text-xl text-[#D98262] tracking-widest uppercase">
                    "MASTER PECAHAN"
                  </span>
                  <div className="h-0.5 w-12 bg-gradient-to-l from-transparent to-[#D4AF37]" />
                </div>
              </div>

              {/* Certificate Body Text */}
              <div className="text-center space-y-4 my-6 relative z-10">
                <p className="font-serif italic text-sm sm:text-base text-gray-600">
                  Dengan ini diperakui bahawa
                </p>

                {/* Student Name */}
                <div className="py-2 px-6 inline-block bg-amber-50/80 border-b-2 border-t-2 border-[#D4AF37] my-1">
                  <h2 className="font-serif-title font-black text-2xl sm:text-3xl md:text-4xl text-[#3c4233] uppercase tracking-wide">
                    🌟 {displayName} 🌟
                  </h2>
                </div>

                <p className="font-medium text-xs sm:text-sm md:text-base text-[#4A3728] max-w-2xl mx-auto leading-relaxed">
                  telah berjaya melengkapkan semua cabaran dalam <span className="font-bold text-[#D98262]">"Cabaran Sukatan Resepi Ajaib"</span> dan menunjukkan usaha serta penguasaan yang baik dalam pembelajaran pecahan.
                </p>
              </div>

              {/* Student Info & Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#FAF6EE] p-3.5 rounded-2xl border border-amber-200/80 shadow-inner relative z-10 my-2">
                <div className="p-2.5 bg-white rounded-xl border border-amber-200 text-center">
                  <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block">
                    MAKLUMAT MURID
                  </span>
                  <p className="font-bold text-xs sm:text-sm text-[#3c4233] mt-0.5">
                    {displayName}
                  </p>
                  <p className="text-[11px] font-bold text-gray-600">
                    Kelas: <span className="text-[#D98262]">{displayClass}</span>
                  </p>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-amber-200 text-center">
                  <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block">
                    PENCAPAIAN PERMAINAN
                  </span>
                  <div className="flex items-center justify-center gap-3 mt-1">
                    <span className="text-xs font-black text-amber-600 font-mono flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      {totalEarnedStars} / 27
                    </span>
                    <span className="text-xs font-black text-emerald-700 font-mono">
                      🎮 9 / 9
                    </span>
                  </div>
                  <p className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider mt-0.5">
                    SELESAI 100%
                  </p>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-amber-200 text-center flex flex-col items-center justify-center">
                  <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block">
                    TAHAP PENCAPAIAN
                  </span>
                  <span className={`px-3 py-0.5 rounded-full text-xs font-black border mt-1 ${tierBg}`}>
                    {tierBadge}
                  </span>
                </div>
              </div>

              {/* Footer Row: Date, Alya Mascot & Signature */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-amber-200/80 relative z-10 mt-2">
                {/* Date */}
                <div className="text-center sm:text-left text-xs font-medium text-gray-600 space-y-0.5">
                  <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">TARIKH SELENSAI</p>
                  <p className="font-bold text-[#3c4233] font-mono text-sm">{formattedDate}</p>
                </div>

                {/* Mascot Alya Accent */}
                <div className="flex items-center gap-2 bg-amber-50 p-2 rounded-2xl border border-amber-200/80 shadow-xs max-w-xs">
                  <div className="w-10 h-10 rounded-xl bg-white border border-amber-300 p-0.5 shrink-0">
                    <AlyaCharacter size="sm" mood="happy" className="w-full h-full" />
                  </div>
                  <p className="text-[10px] font-medium text-[#4A3728] leading-tight italic">
                    "Syabas! Teruskan usaha belajar Matematik!" <br />
                    <span className="font-bold text-amber-700 font-serif">— Alya 💛</span>
                  </p>
                </div>

                {/* Teacher Signature Line */}
                <div className="text-center sm:text-right space-y-1">
                  <div className="w-36 sm:w-44 h-8 border-b-2 border-gray-400 mx-auto sm:ml-auto flex items-end justify-center pb-1">
                    <span className="font-serif italic text-xs text-stone-500 font-bold">{teacherName}</span>
                  </div>
                  <p className="font-bold text-xs text-[#3c4233]">
                    {teacherName && teacherName !== 'Guru Matematik' ? teacherName : 'Guru Matematik'}
                  </p>
                  <p className="text-[10px] text-gray-400 font-mono">Pengesahan Pendidik</p>
                </div>
              </div>
            </div>

            {/* Bottom Modal Close Button for screen view (Non-Printable) */}
            <div className="mt-4 no-print">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-2xl bg-white/90 hover:bg-white text-stone-800 font-extrabold text-xs shadow-md border border-stone-200 cursor-pointer"
              >
                KEMBALI KE PERMAINAN
              </button>
            </div>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
};
