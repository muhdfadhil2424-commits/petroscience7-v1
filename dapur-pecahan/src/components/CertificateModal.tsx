import React, { useState } from 'react';
import { X, Award, Printer, Sparkles, CheckCircle2 } from 'lucide-react';
import chefAlyaImg from '../assets/images/chef_alya_avatar_1785314793438.jpg';
import chefAlyaCookingImg from '../assets/images/chef_alya_cooking_1785319699414.jpg';
import kekCoklatImg from '../assets/images/kek_coklat_1785319636702.jpg';
import ayamCrispyImg from '../assets/images/ayam_crispy_1785319651198.jpg';
import karipapImg from '../assets/images/karipap_1785319665862.jpg';
import sirapBandungImg from '../assets/images/sirap_bandung_1785319682382.jpg';

interface CertificateModalProps {
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ onClose }) => {
  const [studentName, setStudentName] = useState<string>('Murid Cemerlang');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#F7F3ED] rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto border-4 border-[#A67C52] shadow-2xl p-6 sm:p-10 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-[#EFEAE1] hover:bg-[#D6CEBE] text-[#3A3A30] rounded-full cursor-pointer transition-colors print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Container with Double Border */}
        <div className="border-8 border-double border-[#A67C52] p-6 sm:p-8 bg-[#F7F3ED] rounded-2xl text-center relative shadow-inner">
          {/* Certificate Header */}
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 rounded-2xl bg-[#5A5A40] text-white flex items-center justify-center text-3xl shadow-md border-2 border-[#A67C52]">
              🏆
            </div>
          </div>

          <span className="text-[#A67C52] font-extrabold text-xs uppercase tracking-widest block mb-1">
            Kementerian Pendidikan / DSKP Matematik Tahun 3
          </span>

          <h2 className="text-2xl sm:text-4xl font-serif italic font-bold text-[#3A3A30] tracking-tight mb-2">
            SIJIL ANUGERAH MASTER CHEF CILIK
          </h2>

          <p className="text-xs sm:text-sm text-[#5A5A50] font-medium">
            Sijil ini dengan bangganya dianugerahkan kepada:
          </p>

          {/* Student Name Input / Display */}
          <div className="my-4 max-w-md mx-auto">
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Masukkan Nama Murid"
              className="w-full text-center text-xl sm:text-2xl font-serif italic font-bold text-[#3A3A30] border-b-2 border-[#A67C52] bg-[#EFEAE1] focus:bg-white px-3 py-1.5 focus:outline-none rounded-t-lg transition-colors print:border-none"
            />
            <span className="text-[10px] text-[#7A7A70] block mt-1 print:hidden">
              (Boleh sunting nama anda di atas)
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#3A3A30] leading-relaxed max-w-xl mx-auto mb-6">
            Kerana telah berjaya menguasai topik <span className="font-bold text-[#A67C52]">3.1 Pecahan Matematik Darjah 3</span> dan membantu Chef Alya menyukat bahan-bahan untuk memasak <span className="font-bold text-[#5A5A40]">4 Hidangan Mewah</span> (Kek Coklat Bulat, Ayam Goreng Crispy, Karipap Kentang, dan Air Sirap Bandung).
          </p>

          {/* 4 Completed Dish Stamps */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-lg mx-auto mb-6">
            {[
              { title: 'Kek Coklat', img: kekCoklatImg },
              { title: 'Ayam Crispy', img: ayamCrispyImg },
              { title: 'Karipap', img: karipapImg },
              { title: 'Sirap Bandung', img: sirapBandungImg },
            ].map((d, i) => (
              <div key={i} className="bg-white p-2 rounded-xl border border-[#D6CEBE] text-center shadow-xs flex flex-col items-center">
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#A67C52] mb-1">
                  <img src={d.img} alt={d.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <span className="text-[10px] font-bold text-[#3A3A30]">{d.title}</span>
                <div className="text-[9px] text-[#5A5A40] font-bold flex items-center justify-center gap-0.5 mt-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5 text-[#A67C52]" /> Lulus
                </div>
              </div>
            ))}
          </div>

          {/* Signature & Seal Footer */}
          <div className="flex items-center justify-between pt-6 border-t-2 border-[#D6CEBE] mt-4 text-left">
            <div className="flex items-center gap-3">
              <img
                src={chefAlyaImg}
                alt="Chef Alya"
                className="w-12 h-12 rounded-full border-2 border-[#A67C52] object-cover"
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="font-bold text-[#3A3A30] text-xs block">Chef Alya</span>
                <span className="text-[10px] text-[#7A7A70] font-bold">Chef Utama Dapur Pecahan</span>
              </div>
            </div>

            <div className="text-right">
              <div className="w-12 h-12 rounded-full bg-[#A67C52] text-white font-bold text-[10px] flex flex-col items-center justify-center border-2 border-[#5A5A40] shadow inline-flex">
                <span>SEAL</span>
                <span>DSKP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <button
            onClick={onClose}
            className="bg-[#EFEAE1] hover:bg-[#D6CEBE] text-[#3A3A30] font-bold px-4 py-2 rounded-xl text-xs cursor-pointer border border-[#D6CEBE]"
          >
            Tutup
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-[#5A5A40] hover:bg-[#4A4A33] text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md cursor-pointer border border-white/20"
          >
            <Printer className="w-4 h-4 text-[#F2E8CF]" />
            <span>Cetak Sijil / Simpan PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
