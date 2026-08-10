import React from 'react';
import { X, BookOpen, CheckCircle, Sparkles } from 'lucide-react';

interface DskpNotesModalProps {
  onClose: () => void;
}

export const DskpNotesModal: React.FC<DskpNotesModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#F7F3ED] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-4 border-[#A67C52] shadow-2xl p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-[#EFEAE1] hover:bg-[#D6CEBE] text-[#3A3A30] rounded-full cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-[#5A5A40] font-bold text-lg mb-4 font-serif italic">
          <BookOpen className="w-6 h-6 text-[#A67C52]" />
          <span>Kamus & Panduan DSKP 3.1 Pecahan Darjah 3</span>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-[#3A3A30] leading-relaxed">
          {/* Section 1 */}
          <div className="bg-[#EFEAE1] p-4 rounded-2xl border border-[#D6CEBE]">
            <h4 className="font-bold text-[#5A5A40] text-sm flex items-center gap-1.5 mb-1">
              <CheckCircle className="w-4 h-4 text-[#A67C52]" />
              <span>3.1.1 Pecahan Wajar & Kumpulan</span>
            </h4>
            <p className="mb-2">
              Pecahan wajar ialah pecahan yang mempunyai pengangka (nombor atas) yang lebih kecil daripada penyebut (nombor bawah).
            </p>
            <div className="bg-white p-2.5 rounded-xl border border-[#D6CEBE] text-xs">
              <span className="font-bold text-[#5A5A40]">Contoh Dapur:</span> 2 daripada 5 peket tepung gandum diwakili sebagai <span className="font-bold text-[#A67C52]">2/5</span>.
              <br />
              <span className="font-bold text-[#5A5A40]">Pecahan Kumpulan:</span> 3/5 daripada 15 biji telur = (15 dibahagikan kepada 5 kumpulan = 3 biji se-kumpulan. 3 kumpulan × 3 = 9 biji telur).
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-[#EFEAE1] p-4 rounded-2xl border border-[#D6CEBE]">
            <h4 className="font-bold text-[#5A5A40] text-sm flex items-center gap-1.5 mb-1">
              <CheckCircle className="w-4 h-4 text-[#A67C52]" />
              <span>3.1.2 Pecahan Setara</span>
            </h4>
            <p className="mb-2">
              Pecahan setara ialah pecahan-pecahan yang mempunyai nilai yang sama walaupun nombor pengangka dan penyebutnya berbeza.
            </p>
            <div className="bg-white p-2.5 rounded-xl border border-[#D6CEBE] text-xs">
              <span className="font-bold text-[#5A5A40]">Contoh Dapur:</span> 2 daripada 4 peket gula perang (<span className="font-bold text-[#A67C52]">2/4</span>) mempunyai nilai yang sama dengan separuh (<span className="font-bold text-[#A67C52]">1/2</span>)!
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-[#EFEAE1] p-4 rounded-2xl border border-[#D6CEBE]">
            <h4 className="font-bold text-[#5A5A40] text-sm flex items-center gap-1.5 mb-1">
              <CheckCircle className="w-4 h-4 text-[#A67C52]" />
              <span>3.1.3 Bentuk Termudah</span>
            </h4>
            <p className="mb-2">
              Menukar pecahan wajar kepada bentuk termudah dengan membahagikan pengangka dan penyebut dengan nombor bahagi teragung (faktor sepunya terbesar) sehingga tidak boleh dibahagi lagi.
            </p>
            <div className="bg-white p-2.5 rounded-xl border border-[#D6CEBE] text-xs">
              <span className="font-bold text-[#5A5A40]">Contoh Dapur:</span> 6/10 botol sirap apabila dibahagikan dengan 2 (atas dan bawah) menjadi bentuk termudah <span className="font-bold text-[#A67C52]">3/5</span>.
            </div>
          </div>

          {/* Section 4 */}
          <div className="bg-[#EFEAE1] p-4 rounded-2xl border border-[#D6CEBE]">
            <h4 className="font-bold text-[#5A5A40] text-sm flex items-center gap-1.5 mb-1">
              <CheckCircle className="w-4 h-4 text-[#A67C52]" />
              <span>3.1.5 Penambahan Pecahan Wajar</span>
            </h4>
            <p className="mb-2">
              Apabila menambah dua pecahan wajar yang mempunyai penyebut yang sama, kita hanya perlu menambah nilai pengangka sahaja, manakala penyebut kekal sama.
            </p>
            <div className="bg-white p-2.5 rounded-xl border border-[#D6CEBE] text-xs font-mono font-bold text-[#3A3A30]">
              3/10 + 4/10 = 7/10 peha ayam
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#5A5A40] hover:bg-[#4A4A33] text-white font-bold px-5 py-2.5 rounded-xl text-xs cursor-pointer shadow border border-white/20"
          >
            Tutup Nota
          </button>
        </div>
      </div>
    </div>
  );
};
