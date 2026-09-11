import React, { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  Award,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Grid,
  Table as TableIcon,
} from 'lucide-react';
import { StudentAnalysisResult } from '../../../utils/interactiveDashboardAnalytics';
import { playSfx } from '../../../utils/audio';

interface TabSenaraiMuridProps {
  students: StudentAnalysisResult[];
  soundEnabled: boolean;
  isPrivacyMode: boolean;
  selectedClass: string;
  onSelectStudent: (studentId: string) => void;
  onOpenIntervention: (student: {
    name: string;
    id: string;
    studentClass: string;
    profile: any;
  }) => void;
}

export const TabSenaraiMurid: React.FC<TabSenaraiMuridProps> = ({
  students,
  soundEnabled,
  isPrivacyMode,
  selectedClass,
  onSelectStudent,
  onOpenIntervention,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'mastered' | 'progress' | 'guidance' | 'no_response'>('all');
  const [learningFilter, setLearningFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'heatmap'>('table');

  const getDisplayName = (realName: string, id: string) => {
    if (!isPrivacyMode) return realName;
    return `Murid #${id}`;
  };

  const safeStudents = students || [];

  const filteredStudents = safeStudents.filter((student) => {
    const displayName = getDisplayName(student.studentName, student.studentId).toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = displayName.includes(searchLower) || student.studentId.toLowerCase().includes(searchLower);

    let matchesStatus = true;
    const currentTP = student.effectiveTP ?? student.suggestedTP;
    if (statusFilter === 'mastered') matchesStatus = currentTP >= 4;
    else if (statusFilter === 'progress') matchesStatus = currentTP === 3 && student.totalAnswered > 0;
    else if (statusFilter === 'guidance') matchesStatus = currentTP <= 2 && student.totalAnswered > 0;
    else if (statusFilter === 'no_response') matchesStatus = student.totalAnswered === 0;

    let matchesLearning = true;
    if (learningFilter !== 'all') {
      matchesLearning = student.learningProfile?.dominantMode === learningFilter;
    }

    return matchesSearch && matchesStatus && matchesLearning;
  });

  const getTpBadge = (tp: number) => {
    switch (tp) {
      case 6:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-purple-100 text-purple-950 border-2 border-purple-400 shadow-2xs">TP 6 (Kreatif)</span>;
      case 5:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-950 border-2 border-emerald-400 shadow-2xs">TP 5 (Cemerlang)</span>;
      case 4:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-teal-100 text-teal-950 border-2 border-teal-400 shadow-2xs">TP 4 (Kukuh)</span>;
      case 3:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-100 text-amber-950 border-2 border-amber-400 shadow-2xs">TP 3 (Sederhana)</span>;
      case 2:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-rose-100 text-rose-950 border-2 border-rose-400 shadow-2xs">TP 2 (Bimbingan)</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-rose-200 text-rose-950 border-2 border-rose-400 shadow-2xs">TP 1 (Asas)</span>;
    }
  };

  const stdCodes = ['3.1.1', '3.1.2', '3.1.3', '3.1.4', '3.1.5', '3.1.6', '3.1.7'];

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-amber-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Field */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari murid mengikut nama atau No Kad (cth: KP-001)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-2xl border-2 border-stone-200 focus:border-amber-400 focus:outline-none text-xs font-semibold placeholder:text-stone-400 bg-stone-50"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap text-xs font-black">
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-2xl border border-stone-200">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-xl cursor-pointer transition-all ${
                statusFilter === 'all'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-950'
              }`}
            >
              Semua ({students.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('mastered')}
              className={`px-3 py-1 rounded-xl cursor-pointer transition-all ${
                statusFilter === 'mastered'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-950 hover:bg-emerald-100/60'
              }`}
            >
              🟢 Menguasai
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('progress')}
              className={`px-3 py-1 rounded-xl cursor-pointer transition-all ${
                statusFilter === 'progress'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-amber-950 hover:bg-amber-100/60'
              }`}
            >
              🟡 Sedang
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('guidance')}
              className={`px-3 py-1 rounded-xl cursor-pointer transition-all ${
                statusFilter === 'guidance'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-rose-950 hover:bg-rose-100/60'
              }`}
            >
              🔴 Bimbingan
            </button>
          </div>

          {/* Filter Learning Mode */}
          <select
            value={learningFilter}
            onChange={(e) => setLearningFilter(e.target.value)}
            className="px-3 py-1.5 rounded-2xl border-2 border-stone-300 bg-stone-50 text-stone-900 font-black text-xs focus:border-indigo-500 focus:outline-none cursor-pointer"
          >
            <option value="all">Semua Kecenderungan</option>
            <option value="visual">👀 Visual</option>
            <option value="kinesthetic">🖐️ Kinestetik</option>
            <option value="auditory">🎧 Auditori</option>
            <option value="combined">🌈 Gabungan</option>
          </select>

          {/* Toggle View Mode */}
          <div className="flex items-center bg-stone-100 p-1 rounded-2xl border border-stone-200">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-xl cursor-pointer transition-all ${
                viewMode === 'table' ? 'bg-indigo-700 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Paparan Jadual Lengkap"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('heatmap')}
              className={`p-1.5 rounded-xl cursor-pointer transition-all ${
                viewMode === 'heatmap' ? 'bg-indigo-700 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Paparan Heatmap DSKP 3.1"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-3xl border-2 border-amber-300 shadow-sm overflow-hidden">
        {viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-amber-300 text-[11px] font-black uppercase tracking-wider">
                  <th className="py-3 px-3.5">#</th>
                  <th className="py-3 px-3.5">Murid</th>
                  <th className="py-3 px-3.5">No Kad</th>
                  <th className="py-3 px-3.5 text-center">Markah (/15)</th>
                  <th className="py-3 px-3.5 text-center">Status TP</th>
                  <th className="py-3 px-3.5 text-center">Kecenderungan</th>
                  <th className="py-3 px-3.5 text-center">DSKP Fokus</th>
                  <th className="py-3 px-3.5 text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-stone-500 font-medium">
                      Tiada rekod murid sepadan dengan tapisan carian semasa.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student, idx) => {
                    const isTop3 = idx < 3 && student.percentage > 0;
                    const weakStd = (student.weakStandards || []).length > 0 ? student.weakStandards[0] : null;

                    return (
                      <tr
                        key={student.studentId}
                        className="hover:bg-amber-50/70 transition-colors cursor-pointer"
                        onClick={() => {
                          playSfx('click', soundEnabled);
                          onSelectStudent(student.studentId);
                        }}
                      >
                        {/* Rank */}
                        <td className="py-3 px-3.5 font-mono font-bold">
                          {isTop3 ? (
                            <span className="w-6 h-6 rounded-full bg-amber-400 text-amber-950 font-black inline-flex items-center justify-center text-xs shadow-xs">
                              {idx + 1}
                            </span>
                          ) : (
                            <span className="text-stone-500">{idx + 1}</span>
                          )}
                        </td>

                        {/* Name */}
                        <td className="py-3 px-3.5 font-bold text-stone-900">
                          {getDisplayName(student.studentName, student.studentId)}
                        </td>

                        {/* Card ID */}
                        <td className="py-3 px-3.5 font-mono text-stone-500 font-bold">
                          {student.studentId}
                        </td>

                        {/* Score */}
                        <td className="py-3 px-3.5 text-center">
                          <div className="font-mono font-bold text-stone-900">
                            <span className="text-emerald-700 font-black text-sm">{student.correctCount}</span>
                            <span className="text-stone-400">/15</span>
                            <span className="text-stone-600 text-[11px] ml-1 font-semibold">({student.percentage}%)</span>
                          </div>
                        </td>

                        {/* Status TP */}
                        <td className="py-3 px-3.5 text-center">
                          <div className="inline-flex flex-col items-center gap-1">
                            {getTpBadge(student.effectiveTP ?? student.suggestedTP)}
                            {student.isTeacherOverride && (
                              <span className="text-[9px] font-black text-amber-950 bg-amber-200 px-2 py-0.5 rounded-full border border-amber-400 shadow-2xs whitespace-nowrap">
                                👨‍🏫 Guru
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Kecenderungan - VARK PALETTE */}
                        <td className="py-3 px-3.5 text-center">
                          {student.learningProfile ? (
                            <span
                              className={`inline-flex items-center gap-1 text-[11px] font-black px-3 py-1 rounded-full border shadow-2xs whitespace-nowrap ${
                                student.learningProfile.dominantMode === 'visual'
                                  ? 'bg-purple-100 text-purple-950 border-purple-300'
                                  : student.learningProfile.dominantMode === 'kinesthetic'
                                  ? 'bg-amber-100 text-amber-950 border-amber-300'
                                  : student.learningProfile.dominantMode === 'auditory'
                                  ? 'bg-sky-100 text-sky-950 border-sky-300'
                                  : student.learningProfile.dominantMode === 'combined'
                                  ? 'bg-indigo-100 text-indigo-950 border-indigo-300'
                                  : 'bg-stone-100 text-stone-700 border-stone-300'
                              }`}
                            >
                              {student.learningProfile.shortBadge || student.learningProfile.dominantLabel}
                            </span>
                          ) : (
                            <span className="text-stone-400 text-xs">-</span>
                          )}
                        </td>

                        {/* DSKP Focus */}
                        <td className="py-3 px-3.5 text-center">
                          {weakStd ? (
                            <span className="text-[11px] font-mono font-black text-amber-950 bg-amber-100 px-2.5 py-0.5 rounded-lg border border-amber-300 shadow-2xs">
                              ! {weakStd}
                            </span>
                          ) : student.strongStandards.length > 0 ? (
                            <span className="text-[11px] font-mono font-black text-emerald-950 bg-emerald-100 px-2.5 py-0.5 rounded-lg border border-emerald-300 shadow-2xs">
                              ✓ {student.strongStandards[0]}
                            </span>
                          ) : (
                            <span className="text-stone-400 text-xs">-</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-3.5 text-center">
                          <div className="inline-flex items-center gap-1.5 flex-wrap justify-center">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                playSfx('click', soundEnabled);
                                onSelectStudent(student.studentId);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-black transition-all shadow-xs cursor-pointer inline-flex items-center gap-1 whitespace-nowrap hover:scale-102"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Profil</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                playSfx('click', soundEnabled);
                                onOpenIntervention({
                                  name: student.studentName,
                                  id: student.studentId,
                                  studentClass: selectedClass,
                                  profile: student.learningProfile,
                                });
                              }}
                              className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 text-[11px] font-black transition-all shadow-xs cursor-pointer inline-flex items-center gap-1 whitespace-nowrap hover:scale-102"
                              title="Buka Cadangan Intervensi Alya"
                            >
                              <span>👩‍🏫 Intervensi</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* Heatmap View */
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-600 font-bold">
              <span>Heatmap Penguasaan Standard Murid (🟢 Baik • 🟡 Sedang • 🔴 Bimbingan)</span>
              <span>Klik mana-mana baris untuk membuka profil murid</span>
            </div>

            <div className="overflow-x-auto rounded-2xl border-2 border-stone-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-amber-300 font-black">
                    <th className="py-3 px-3.5">Nama Murid</th>
                    <th className="py-3 px-2 text-center font-black">3.1.1</th>
                    <th className="py-3 px-2 text-center font-black">3.1.2</th>
                    <th className="py-3 px-2 text-center font-black">3.1.3</th>
                    <th className="py-3 px-2 text-center font-black">3.1.4</th>
                    <th className="py-3 px-2 text-center font-black">3.1.5</th>
                    <th className="py-3 px-2 text-center font-black">3.1.6</th>
                    <th className="py-3 px-2 text-center font-black">3.1.7</th>
                    <th className="py-3 px-2 text-center font-black">Skor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredStudents.map((s) => (
                    <tr
                      key={s.studentId}
                      className="hover:bg-amber-50/70 transition-colors cursor-pointer"
                      onClick={() => {
                        playSfx('click', soundEnabled);
                        onSelectStudent(s.studentId);
                      }}
                    >
                      <td className="py-2.5 px-3.5 font-bold text-stone-900">
                        {getDisplayName(s.studentName, s.studentId)}
                      </td>

                      {stdCodes.map((code) => {
                        const isStrong = (s.strongStandards || []).includes(code);
                        const isWeak = (s.weakStandards || []).includes(code);

                        return (
                          <td key={code} className="py-2.5 px-2 text-center">
                            {s.totalAnswered === 0 ? (
                              <span className="text-stone-300 text-xs">⚪</span>
                            ) : isStrong ? (
                              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-black text-[10px] shadow-2xs">
                                🟢 Baik
                              </span>
                            ) : isWeak ? (
                              <span className="inline-block px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-black text-[10px] shadow-2xs">
                                🔴 Lemah
                              </span>
                            ) : (
                              <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500 text-white font-black text-[10px] shadow-2xs">
                                🟡 Sedang
                              </span>
                            )}
                          </td>
                        );
                      })}

                      <td className="py-2.5 px-2 text-center font-mono font-black text-stone-900">
                        {s.correctCount}/15
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
