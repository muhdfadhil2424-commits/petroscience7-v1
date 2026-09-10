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
    if (statusFilter === 'mastered') matchesStatus = student.suggestedTP >= 4;
    else if (statusFilter === 'progress') matchesStatus = student.suggestedTP === 3 && student.totalAnswered > 0;
    else if (statusFilter === 'guidance') matchesStatus = student.suggestedTP <= 2 && student.totalAnswered > 0;
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
        return <span className="px-2 py-0.5 rounded-full text-xs font-black bg-purple-100 text-purple-900 border border-purple-300">TP 6 (Kreatif)</span>;
      case 5:
        return <span className="px-2 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-950 border border-emerald-300">TP 5 (Cemerlang)</span>;
      case 4:
        return <span className="px-2 py-0.5 rounded-full text-xs font-black bg-blue-100 text-blue-950 border border-blue-300">TP 4 (Kukuh)</span>;
      case 3:
        return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-950 border border-amber-300">TP 3 (Sederhana)</span>;
      case 2:
        return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-950 border border-orange-300">TP 2 (Bimbingan)</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-stone-100 text-stone-600 border border-stone-300">TP 1 (Asas)</span>;
    }
  };

  const stdCodes = ['3.1.1', '3.1.2', '3.1.3', '3.1.4', '3.1.5', '3.1.6', '3.1.7'];

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-amber-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Field */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari murid mengikut nama atau No Kad (cth: KP-001)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-2xl border-2 border-stone-200 focus:border-[#D98262] focus:outline-none text-xs font-semibold placeholder:text-stone-400 bg-stone-50"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap text-xs font-bold">
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-2xl border border-stone-200">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-xl cursor-pointer transition-all ${
                statusFilter === 'all'
                  ? 'bg-stone-800 text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Semua ({students.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('mastered')}
              className={`px-2.5 py-1 rounded-xl cursor-pointer transition-all ${
                statusFilter === 'mastered'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-emerald-800 hover:text-emerald-950'
              }`}
            >
              🟢 Menguasai
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('progress')}
              className={`px-2.5 py-1 rounded-xl cursor-pointer transition-all ${
                statusFilter === 'progress'
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'text-amber-800 hover:text-amber-950'
              }`}
            >
              🟡 Sedang
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('guidance')}
              className={`px-2.5 py-1 rounded-xl cursor-pointer transition-all ${
                statusFilter === 'guidance'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'text-rose-800 hover:text-rose-950'
              }`}
            >
              🔴 Bimbingan
            </button>
          </div>

          {/* Filter Learning Mode */}
          <select
            value={learningFilter}
            onChange={(e) => setLearningFilter(e.target.value)}
            className="px-3 py-1.5 rounded-2xl border-2 border-stone-200 bg-stone-50 text-stone-700 font-bold text-xs focus:border-indigo-400 focus:outline-none cursor-pointer"
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
                viewMode === 'table' ? 'bg-[#3c4233] text-white shadow-2xs' : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Paparan Jadual Lengkap"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('heatmap')}
              className={`p-1.5 rounded-xl cursor-pointer transition-all ${
                viewMode === 'heatmap' ? 'bg-[#3c4233] text-white shadow-2xs' : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Paparan Heatmap DSKP 3.1"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-3xl border-2 border-amber-200 shadow-sm overflow-hidden">
        {viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#3c4233] text-white">
                  <th className="py-3 px-3.5 font-bold">#</th>
                  <th className="py-3 px-3.5 font-bold">Murid</th>
                  <th className="py-3 px-3.5 font-bold">No Kad</th>
                  <th className="py-3 px-3.5 font-bold text-center">Markah (/15)</th>
                  <th className="py-3 px-3.5 font-bold text-center">Status TP</th>
                  <th className="py-3 px-3.5 font-bold text-center">Kecenderungan</th>
                  <th className="py-3 px-3.5 font-bold text-center">DSKP Lemah/Kukuh</th>
                  <th className="py-3 px-3.5 font-bold text-center">Tindakan</th>
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
                        <td className="py-3 px-3.5 font-bold text-[#4A3728]">
                          {getDisplayName(student.studentName, student.studentId)}
                        </td>

                        {/* Card ID */}
                        <td className="py-3 px-3.5 font-mono text-stone-500">
                          {student.studentId}
                        </td>

                        {/* Score */}
                        <td className="py-3 px-3.5 text-center">
                          <div className="font-mono font-bold text-stone-900">
                            <span className="text-emerald-800">{student.correctCount}</span>
                            <span className="text-stone-400">/15</span>
                            <span className="text-stone-500 text-[11px] ml-1">({student.percentage}%)</span>
                          </div>
                        </td>

                        {/* Status TP */}
                        <td className="py-3 px-3.5 text-center">
                          {getTpBadge(student.suggestedTP)}
                        </td>

                        {/* Kecenderungan */}
                        <td className="py-3 px-3.5 text-center">
                          {student.learningProfile ? (
                            <span
                              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border shadow-2xs whitespace-nowrap ${
                                student.learningProfile.dominantMode === 'visual'
                                  ? 'bg-blue-50 text-blue-900 border-blue-300'
                                  : student.learningProfile.dominantMode === 'kinesthetic'
                                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                                  : student.learningProfile.dominantMode === 'auditory'
                                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                                  : student.learningProfile.dominantMode === 'combined'
                                  ? 'bg-purple-50 text-purple-900 border-purple-300'
                                  : 'bg-stone-100 text-stone-600 border-stone-200'
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
                            <span className="text-[11px] font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                              ⚠️ {weakStd}
                            </span>
                          ) : student.strongStandards.length > 0 ? (
                            <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
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
                              className="px-2.5 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-900 hover:text-white border border-indigo-200 text-[11px] font-bold transition-all shadow-2xs cursor-pointer inline-flex items-center gap-1 whitespace-nowrap"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Lihat Profil</span>
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
                              className="px-2 py-1 rounded-xl bg-purple-50 hover:bg-purple-600 text-purple-900 hover:text-white border border-purple-200 text-[11px] font-bold transition-all shadow-2xs cursor-pointer inline-flex items-center gap-1 whitespace-nowrap"
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
            <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
              <span>Heatmap Penguasaan Standard Murid (🟢 Baik • 🟡 Sedang • 🔴 Bimbingan)</span>
              <span>Klik mana-mana baris untuk membuka profil murid</span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-stone-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#3c4233] text-white">
                    <th className="py-3 px-3 font-bold">Nama Murid</th>
                    <th className="py-3 px-2 text-center font-bold">3.1.1</th>
                    <th className="py-3 px-2 text-center font-bold">3.1.2</th>
                    <th className="py-3 px-2 text-center font-bold">3.1.3</th>
                    <th className="py-3 px-2 text-center font-bold">3.1.4</th>
                    <th className="py-3 px-2 text-center font-bold">3.1.5</th>
                    <th className="py-3 px-2 text-center font-bold">3.1.6</th>
                    <th className="py-3 px-2 text-center font-bold">3.1.7</th>
                    <th className="py-3 px-2 text-center font-bold">Skor</th>
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
                      <td className="py-2.5 px-3 font-bold text-[#4A3728]">
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
                              <span className="inline-block px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                🟢 Baik
                              </span>
                            ) : isWeak ? (
                              <span className="inline-block px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">
                                🔴 Lemah
                              </span>
                            ) : (
                              <span className="inline-block px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                                🟡 Sedang
                              </span>
                            )}
                          </td>
                        );
                      })}

                      <td className="py-2.5 px-2 text-center font-mono font-bold text-[#4A3728]">
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
