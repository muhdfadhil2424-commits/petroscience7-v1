import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Printer,
  Download,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  FileText,
  Star,
  Award,
  BookOpen,
  BarChart2,
  Target,
  TrendingUp,
} from 'lucide-react';
import { StudentProfile } from '../types';
import { analyzeStudentLearning, AILearningAnalysisResult } from '../utils/aiLearningAnalytics';
import { playSfx } from '../utils/audio';

interface StudentReportModalProps {
  student: StudentProfile;
  soundEnabled: boolean;
  onClose: () => void;
}

export const StudentReportModal: React.FC<StudentReportModalProps> = ({
  student,
  soundEnabled,
  onClose,
}) => {
  const analytics: AILearningAnalysisResult = analyzeStudentLearning(student);
  const [overrideTP, setOverrideTP] = useState<string>(analytics.suggestedTP);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handlePrint = () => {
    playSfx('chime', soundEnabled);
    window.print();
  };

  const handleExportJSON = () => {
    playSfx('chime', soundEnabled);
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(analytics, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Laporan_AI_${student.nama.replace(/\s+/g, '_')}_${student.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast('Fail JSON Laporan AI berjaya dieksport!');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-[1050] flex items-center justify-center p-2 sm:p-4 bg-stone-950/80 backdrop-blur-md overflow-y-auto">
      {/* CSS Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-report, #printable-report * {
            visibility: visible;
          }
          #printable-report {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-4xl bg-[#FFF8E8] text-[#3c4233] rounded-3xl p-5 sm:p-7 border-4 border-[#3c4233] shadow-2xl max-h-[92vh] flex flex-col overflow-hidden font-rounded"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b-2 border-[#3c4233]/20 pb-4 shrink-0 no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#3c4233] text-[#F4C95D] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[#F4C95D]" />
            </div>
            <div>
              <h2 className="font-serif-title text-xl font-black text-[#3c4233]">
                📄 Laporan Analisis AI Pembelajaran
              </h2>
              <p className="text-xs text-gray-600 font-semibold">
                Laporan komprehensif DSKP KSSR Matematik Tahun 4
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-2 rounded-xl bg-[#3c4233] hover:bg-[#2d3226] text-[#F4C95D] font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>🖨️ Cetak Laporan</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="px-3 py-2 rounded-xl bg-[#F4C95D] hover:bg-[#e5b73e] text-[#3c4233] font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-all border border-[#3c4233]/20"
            >
              <Download className="w-4 h-4" />
              <span>⬇️ Eksport JSON</span>
            </button>

            <button
              onClick={() => {
                playSfx('click', soundEnabled);
                onClose();
              }}
              className="w-9 h-9 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="my-2 p-2 bg-emerald-700 text-white text-xs font-bold rounded-xl text-center shadow-md no-print">
            {toastMessage}
          </div>
        )}

        {/* Printable Content Area */}
        <div id="printable-report" className="flex-1 overflow-y-auto pr-1 space-y-5 my-3">
          {/* Official Report Banner */}
          <div className="p-4 rounded-2xl bg-white border-2 border-[#3c4233]/20 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <span className="text-[10px] font-mono font-black bg-[#3c4233] text-[#F4C95D] px-2.5 py-0.5 rounded uppercase">
                {analytics.studentId}
              </span>
              <h1 className="text-2xl font-black text-[#3c4233] mt-1">{analytics.studentName}</h1>
              <p className="text-xs text-gray-500 font-bold">
                Kelas: <span className="text-[#3c4233]">{analytics.studentClass}</span> • Tarikh Analisis: {analytics.dateAnalyzed}
              </p>
            </div>

            <div className="text-right sm:border-l sm:pl-4 border-stone-200">
              <p className="text-[10px] uppercase font-bold text-gray-500">Cadangan Tahap Penguasaan</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-3 py-1 rounded-xl bg-[#3c4233] text-[#F4C95D] font-black text-lg border border-[#F4C95D]">
                  {overrideTP}
                </span>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                  Cadangan AI
                </span>
              </div>
            </div>
          </div>

          {!analytics.isSufficient ? (
            <div className="p-8 text-center bg-white rounded-2xl border-2 border-amber-300 space-y-3">
              <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
              <p className="font-bold text-base text-[#3c4233]">Data Belum Mencukupi</p>
              <p className="text-xs text-gray-600 max-w-md mx-auto">{analytics.insufficiencyMessage}</p>
            </div>
          ) : (
            <>
              {/* Stat Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-bold">
                <div className="p-3 rounded-xl bg-white border border-stone-200">
                  <p className="text-[10px] text-gray-500 uppercase">Cabaran Selesai</p>
                  <p className="text-lg font-black text-[#3c4233]">{analytics.totalChallenges} / 9</p>
                </div>
                <div className="p-3 rounded-xl bg-white border border-amber-200">
                  <p className="text-[10px] text-gray-500 uppercase">Bintang Terumpul</p>
                  <p className="text-lg font-black text-amber-700">⭐ {analytics.totalStars} / 27</p>
                </div>
                <div className="p-3 rounded-xl bg-white border border-blue-200">
                  <p className="text-[10px] text-gray-500 uppercase">Kadar Ketepatan</p>
                  <p className="text-lg font-black text-blue-800">{analytics.accuracyRate}%</p>
                </div>
                <div className="p-3 rounded-xl bg-white border border-purple-200">
                  <p className="text-[10px] text-gray-500 uppercase">Purata Masa Soalan</p>
                  <p className="text-lg font-black text-purple-800">{analytics.avgResponseTimeSeconds} saat</p>
                </div>
              </div>

              {/* DSKP Skills Breakdown */}
              <div className="p-4 rounded-2xl bg-white border border-[#3c4233]/15 shadow-sm space-y-3">
                <h3 className="font-serif-title font-bold text-sm text-[#3c4233] flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#3c4233]" />
                  <span>Analisis Penguasaan Kemahiran DSKP 2.1 (Matematik Tahun 4)</span>
                </h3>

                <div className="space-y-2.5 text-xs font-bold">
                  {analytics.skills.map((skill) => (
                    <div key={skill.id} className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] bg-stone-200 text-stone-800 px-2 py-0.5 rounded font-black">
                            DSKP {skill.dskpCode}
                          </span>
                          <span className="text-[#3c4233] font-extrabold">{skill.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs">{skill.percentage}%</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black ${
                              skill.color === 'green'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : skill.color === 'yellow'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-red-100 text-red-900 border border-red-300'
                            }`}
                          >
                            {skill.status}
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-gray-500 font-normal">{skill.description}</p>

                      <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            skill.color === 'green'
                              ? 'bg-emerald-600'
                              : skill.color === 'yellow'
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${skill.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Rumusan & Pedagogi */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-medium">
                {/* Kekuatan */}
                <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-300 space-y-2">
                  <p className="font-bold text-emerald-900 text-sm flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Kekuatan Utama (Analisis AI):
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-emerald-950 font-semibold">
                    {analytics.strengthsSummary.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Perlu Perhatian */}
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-300 space-y-2">
                  <p className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    Perlu Diberi Perhatian:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-amber-950 font-semibold">
                    {analytics.attentionNeededSummary.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Cadangan Tindakan Guru (Pemulihan & Pengayaan) */}
              <div className="p-4 rounded-2xl bg-white border border-[#3c4233]/15 shadow-sm space-y-3">
                <h3 className="font-serif-title font-bold text-sm text-[#3c4233] flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-[#3c4233]" />
                  <span>Cadangan Intervensi Pedagogi Guru</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200 space-y-1.5">
                    <p className="font-bold text-orange-900 flex items-center gap-1">
                      <span>🎯 Modul Pemulihan</span>
                    </p>
                    <ul className="space-y-1 text-gray-700 font-semibold">
                      {analytics.remediationAdvice.map((adv, idx) => (
                        <li key={idx}>{adv}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 space-y-1.5">
                    <p className="font-bold text-blue-900 flex items-center gap-1">
                      <span>🌟 Modul Pengayaan</span>
                    </p>
                    <ul className="space-y-1 text-gray-700 font-semibold">
                      {analytics.enrichmentAdvice.map((adv, idx) => (
                        <li key={idx}>{adv}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Session Progression Chart */}
              <div className="p-4 rounded-2xl bg-white border border-[#3c4233]/15 shadow-sm space-y-3">
                <h3 className="font-serif-title font-bold text-sm text-[#3c4233] flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#3c4233]" />
                  <span>Carta Perkembangan Tahap Penguasaan Mengikut Sesi</span>
                </h3>

                <div className="flex items-center justify-between gap-2 overflow-x-auto p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs font-bold">
                  {analytics.sessionProgression.map((pt, idx) => (
                    <div key={idx} className="flex-1 text-center min-w-[100px] space-y-1">
                      <p className="text-[10px] text-gray-500">{pt.sessionLabel}</p>
                      <p className="text-xs text-[#3c4233] font-extrabold">{pt.worldName}</p>
                      <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden my-1">
                        <div
                          className="bg-[#3c4233] h-full"
                          style={{ width: `${(pt.tpLevel / 6) * 100}%` }}
                        />
                      </div>
                      <span className="px-2.5 py-0.5 rounded bg-[#3c4233] text-[#F4C95D] font-mono text-xs">
                        {pt.suggestedTP}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Teacher Override TP Selector */}
              <div className="p-4 rounded-2xl bg-amber-100/70 border border-amber-300 space-y-2 no-print">
                <p className="font-bold text-xs text-[#3c4233] flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-700" />
                  <span>Sahkan / Tukar Tahap Penguasaan Akhir Murid (Guru Override):</span>
                </p>
                <div className="flex items-center gap-2 flex-wrap text-xs font-bold">
                  {['TP1', 'TP2', 'TP3', 'TP4', 'TP5', 'TP6'].map((tpVal) => (
                    <button
                      key={tpVal}
                      onClick={() => setOverrideTP(tpVal)}
                      className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                        overrideTP === tpVal
                          ? 'bg-[#3c4233] text-[#F4C95D] border-[#3c4233] shadow-md font-black ring-2 ring-[#F4C95D]'
                          : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                      }`}
                    >
                      {tpVal}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t-2 border-[#3c4233]/20 flex justify-between items-center shrink-0 no-print">
          <p className="text-xs text-gray-500 font-semibold">
            Standard Kurikulum KSSR DSKP 2.1 • Wira Pecahan AI Analytics
          </p>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-[#3c4233] hover:bg-[#2d3226] text-[#F4C95D] font-bold text-xs cursor-pointer"
          >
            Selesai & Tutup Laporan 📄
          </button>
        </div>
      </motion.div>
    </div>
  );
};
