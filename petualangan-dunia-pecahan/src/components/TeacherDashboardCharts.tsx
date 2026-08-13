import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Minus, ChevronRight, Award } from 'lucide-react';

// ==========================================
// 🥧 1. CARTA PAI — STATUS KEMAJUAN MURID
// ==========================================
interface PieChartStatusProps {
  menguasaiCount: number;
  berkembangCount: number;
  bimbinganCount: number;
  totalStudents: number;
}

export const PieChartStatus: React.FC<PieChartStatusProps> = ({
  menguasaiCount,
  berkembangCount,
  bimbinganCount,
  totalStudents,
}) => {
  if (totalStudents === 0) {
    return (
      <div className="p-8 text-center text-xs font-bold text-gray-500 bg-stone-50 rounded-2xl border border-dashed border-stone-300">
        📊 Belum ada data yang mencukupi untuk menghasilkan carta.
      </div>
    );
  }

  const menguasaiPct = Math.round((menguasaiCount / totalStudents) * 100);
  const berkembangPct = Math.round((berkembangCount / totalStudents) * 100);
  const bimbinganPct = Math.max(0, 100 - menguasaiPct - berkembangPct);

  // SVG Donut Calculations (Radius = 40, Circumference = 2 * PI * 40 = 251.32)
  const c = 251.32;
  const stroke1 = (menguasaiPct / 100) * c;
  const stroke2 = (berkembangPct / 100) * c;
  const stroke3 = (bimbinganPct / 100) * c;

  const offset1 = 0;
  const offset2 = -stroke1;
  const offset3 = -(stroke1 + stroke2);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-around gap-4 p-2 font-rounded">
      {/* Donut SVG */}
      <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="16" />

          {/* Segment 1: Menguasai (Emerald) */}
          {stroke1 > 0 && (
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#059669"
              strokeWidth="16"
              strokeDasharray={`${stroke1} ${c - stroke1}`}
              strokeDashoffset={offset1}
              className="transition-all duration-700"
            />
          )}

          {/* Segment 2: Sedang Berkembang (Amber) */}
          {stroke2 > 0 && (
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#d97706"
              strokeWidth="16"
              strokeDasharray={`${stroke2} ${c - stroke2}`}
              strokeDashoffset={offset2}
              className="transition-all duration-700"
            />
          )}

          {/* Segment 3: Perlukan Bimbingan (Terracotta / Red) */}
          {stroke3 > 0 && (
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#D98262"
              strokeWidth="16"
              strokeDasharray={`${stroke3} ${c - stroke3}`}
              strokeDashoffset={offset3}
              className="transition-all duration-700"
            />
          )}
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xl font-black text-[#3c4233]">{totalStudents}</span>
          <span className="text-[10px] font-bold text-gray-500 uppercase">Murid</span>
        </div>
      </div>

      {/* Legend Breakdown */}
      <div className="space-y-2 text-xs font-bold w-full sm:w-auto flex-1">
        <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 border border-emerald-200">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
            <span className="text-emerald-950 font-black">🟢 Menguasai</span>
          </div>
          <span className="font-mono text-emerald-900 font-extrabold">{menguasaiPct}% ({menguasaiCount})</span>
        </div>

        <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50 border border-amber-200">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-600 inline-block" />
            <span className="text-amber-950 font-black">🟡 Sedang Berkembang</span>
          </div>
          <span className="font-mono text-amber-900 font-extrabold">{berkembangPct}% ({berkembangCount})</span>
        </div>

        <div className="flex items-center justify-between p-2 rounded-xl bg-[#D98262]/10 border border-[#D98262]/30">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#D98262] inline-block" />
            <span className="text-[#D98262] font-black">🔴 Perlukan Bimbingan</span>
          </div>
          <span className="font-mono text-[#D98262] font-extrabold">{bimbinganPct}% ({bimbinganCount})</span>
        </div>
      </div>
    </div>
  );
};


// ==========================================
// 📊 2. GRAF BAR — PRESTASI MENGIKUT KEMAHIRAN
// ==========================================
interface SkillItem {
  name: string;
  percentage: number;
}

interface SkillBarChartProps {
  skills: SkillItem[];
}

export const SkillBarChart: React.FC<SkillBarChartProps> = ({ skills }) => {
  if (!skills || skills.length === 0) {
    return (
      <div className="p-8 text-center text-xs font-bold text-gray-500 bg-stone-50 rounded-2xl border border-dashed border-stone-300">
        📊 Belum ada data yang mencukupi untuk menghasilkan carta.
      </div>
    );
  }

  return (
    <div className="space-y-3 font-rounded">
      {skills.map((sk, idx) => {
        let barColor = 'bg-emerald-600';
        let badgeColor = 'bg-emerald-100 text-emerald-900 border-emerald-300';
        if (sk.percentage < 60) {
          barColor = 'bg-[#D98262]';
          badgeColor = 'bg-red-100 text-red-900 border-red-300';
        } else if (sk.percentage < 75) {
          barColor = 'bg-amber-500';
          badgeColor = 'bg-amber-100 text-amber-900 border-amber-300';
        }

        return (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#3c4233] font-extrabold">{sk.name}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-black border ${badgeColor}`}>
                {sk.percentage}%
              </span>
            </div>

            <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden border border-stone-200 p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${sk.percentage}%` }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                className={`h-full rounded-full ${barColor}`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};


// ==========================================
// 📊 3. GRAF BAR — PRESTASI SETIAP MURID
// ==========================================
interface StudentScoreItem {
  id: string;
  name: string;
  kelas: string;
  scorePct: number;
  tp: string;
  status: string;
}

interface StudentPerformanceBarChartProps {
  students: StudentScoreItem[];
  onSelectStudent: (studentId: string) => void;
}

export const StudentPerformanceBarChart: React.FC<StudentPerformanceBarChartProps> = ({
  students,
  onSelectStudent,
}) => {
  if (!students || students.length === 0) {
    return (
      <div className="p-8 text-center text-xs font-bold text-gray-500 bg-stone-50 rounded-2xl border border-dashed border-stone-300">
        📊 Belum ada data murid untuk kelas ini.
      </div>
    );
  }

  return (
    <div className="space-y-2.5 font-rounded max-h-[300px] overflow-y-auto pr-1">
      {students.map((st, idx) => {
        let barColor = 'bg-[#3c4233]';
        if (st.scorePct >= 80) barColor = 'bg-emerald-600';
        else if (st.scorePct >= 60) barColor = 'bg-amber-500';
        else barColor = 'bg-[#D98262]';

        return (
          <div
            key={st.id}
            onClick={() => onSelectStudent(st.id)}
            className="p-2.5 rounded-xl bg-white hover:bg-amber-50/80 border border-stone-200 transition-all cursor-pointer space-y-1.5 shadow-2xs group"
          >
            <div className="flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-2">
                <span className="text-[#3c4233] font-black group-hover:text-amber-800 transition-colors">
                  {st.name}
                </span>
                <span className="text-[10px] text-gray-500 font-mono">({st.kelas})</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 text-[10px] font-black border border-blue-200">
                  {st.tp}
                </span>
                <span className="font-mono text-xs font-black text-[#3c4233]">{st.scorePct}%</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${st.scorePct}%` }}
                transition={{ duration: 0.5, delay: idx * 0.04 }}
                className={`h-full rounded-full ${barColor}`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};


// ==========================================
// 📈 4. CARTA GARIS — PERKEMBANGAN KEMAJUAN
// ==========================================
interface SessionPoint {
  label: string;
  scorePct: number;
}

interface SessionLineChartProps {
  sessions: SessionPoint[];
}

export const SessionLineChart: React.FC<SessionLineChartProps> = ({ sessions }) => {
  if (!sessions || sessions.length === 0) {
    return (
      <div className="p-8 text-center text-xs font-bold text-gray-500 bg-stone-50 rounded-2xl border border-dashed border-stone-300">
        📊 Belum ada data sesi permainan yang direkodkan.
      </div>
    );
  }

  const width = 450;
  const height = 150;
  const padding = 25;

  const firstScore = sessions[0]?.scorePct || 0;
  const lastScore = sessions[sessions.length - 1]?.scorePct || 0;

  let trendType: 'up' | 'flat' | 'down' = 'flat';
  if (lastScore > firstScore + 3) trendType = 'up';
  else if (lastScore < firstScore - 3) trendType = 'down';

  // Calculate SVG Coordinates
  const stepX = (width - padding * 2) / Math.max(1, sessions.length - 1);
  const points = sessions.map((s, idx) => {
    const x = padding + idx * stepX;
    const y = height - padding - (s.scorePct / 100) * (height - padding * 2);
    return { x, y, score: s.scorePct, label: s.label };
  });

  const pathD = points
    .map((p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(' ');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${
    height - padding
  } Z`;

  return (
    <div className="space-y-3 font-rounded">
      {/* Trend Indicator Badge */}
      <div className="flex items-center justify-between text-xs font-bold bg-stone-50 p-2 rounded-xl border border-stone-200">
        <span className="text-gray-600">Arah Trend Perkembangan:</span>
        {trendType === 'up' && (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1 font-extrabold">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
            <span>📈 Semakin Meningkat</span>
          </span>
        )}
        {trendType === 'flat' && (
          <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-300 flex items-center gap-1 font-extrabold">
            <Minus className="w-3.5 h-3.5 text-blue-700" />
            <span>➡️ Kekal Stabil</span>
          </span>
        )}
        {trendType === 'down' && (
          <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-900 border border-red-300 flex items-center gap-1 font-extrabold">
            <TrendingDown className="w-3.5 h-3.5 text-red-700" />
            <span>📉 Perlukan Intervensi</span>
          </span>
        )}
      </div>

      {/* Line SVG */}
      <div className="relative w-full overflow-hidden bg-white p-2 rounded-xl border border-stone-200">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          {/* Gradient Fill */}
          <defs>
            <linearGradient id="sessionGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3c4233" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3c4233" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area under curve */}
          <path d={areaD} fill="url(#sessionGrad)" />

          {/* Grid lines */}
          {[25, 50, 75, 100].map((val) => {
            const y = height - padding - (val / 100) * (height - padding * 2);
            return (
              <line
                key={val}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="#e2e8f0"
                strokeDasharray="3 3"
              />
            );
          })}

          {/* Main Line */}
          <path d={pathD} fill="none" stroke="#3c4233" strokeWidth="3" strokeLinecap="round" />

          {/* Point Dots */}
          {points.map((p, idx) => (
            <g key={idx}>
              <circle cx={p.x} cy={p.y} r="5" fill="#F4C95D" stroke="#3c4233" strokeWidth="2" />
              <text
                x={p.x}
                y={p.y - 9}
                textAnchor="middle"
                fontSize="9"
                fontWeight="bold"
                fill="#3c4233"
              >
                {p.score}%
              </text>
              <text
                x={p.x}
                y={height - 6}
                textAnchor="middle"
                fontSize="9"
                fontWeight="600"
                fill="#64748b"
              >
                {p.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};


// ==========================================
// 🏫 5. RINGKASAN SEMUA KELAS (COMPARISON BAR CHART)
// ==========================================
interface ClassSummaryItem {
  className: string;
  studentCount: number;
  avgScorePct: number;
  avgTP: string;
}

interface AllClassesComparisonChartProps {
  classesData: ClassSummaryItem[];
  selectedClass: string;
  onSelectClass: (clsName: string) => void;
}

export const AllClassesComparisonChart: React.FC<AllClassesComparisonChartProps> = ({
  classesData,
  selectedClass,
  onSelectClass,
}) => {
  return (
    <div className="space-y-2.5 font-rounded">
      <p className="text-xs text-gray-500 font-semibold">
        Klik mana-mana kelas di bawah untuk menapis dashboard mengikut kelas tersebut:
      </p>

      <div className="space-y-2">
        {classesData.map((cls) => {
          const isSelected = selectedClass === cls.className;
          let barWidthPct = cls.avgScorePct;
          if (cls.studentCount === 0) barWidthPct = 0;

          return (
            <div
              key={cls.className}
              onClick={() => onSelectClass(cls.className)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                isSelected
                  ? 'bg-[#3c4233] text-[#F4C95D] border-[#3c4233] shadow-md ring-2 ring-[#F4C95D]'
                  : 'bg-white text-[#3c4233] border-stone-200 hover:bg-amber-50'
              }`}
            >
              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-[#F4C95D] text-[#3c4233]' : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  🏫
                </span>
                <div>
                  <p className="font-black text-sm">{cls.className}</p>
                  <p className={`text-[10px] ${isSelected ? 'text-stone-300' : 'text-gray-500'}`}>
                    {cls.studentCount} murid • Purata {cls.avgTP}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center gap-3 flex-1 max-w-md">
                <div className={`flex-1 h-3 rounded-full overflow-hidden p-0.5 border ${
                  isSelected ? 'bg-stone-800 border-stone-600' : 'bg-stone-100 border-stone-200'
                }`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidthPct}%` }}
                    transition={{ duration: 0.5 }}
                    className={`h-full rounded-full ${isSelected ? 'bg-[#F4C95D]' : 'bg-[#3c4233]'}`}
                  />
                </div>
                <span className={`font-mono text-xs font-black shrink-0 ${isSelected ? 'text-[#F4C95D]' : 'text-[#3c4233]'}`}>
                  {cls.studentCount > 0 ? `${cls.avgScorePct}%` : 'Tiada Data'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


// ==========================================
// 🏆 6. GRAF BAR — TAHAP PENCAPAIAN KATEGORI
// ==========================================
export interface MasteryCategoryItem {
  category: string;
  count: number;
  total: number;
  color: string;
}

export const MasteryCategoryBarChart: React.FC<{ items: MasteryCategoryItem[] }> = ({ items }) => {
  return (
    <div className="space-y-3 font-rounded">
      {items.map((item, idx) => {
        const pct = item.total > 0 ? Math.round((item.count / item.total) * 100) : 0;
        return (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#3c4233] font-black">{item.category}</span>
              <span className="text-gray-600 font-mono text-[11px]">
                {item.count} orang ({pct}%)
              </span>
            </div>
            <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden border border-stone-200 p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className={`h-full rounded-full ${item.color}`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};


// ==========================================
// 🎮 7. GRAF BAR — PURATA PENCAPAIAN SETIAP PERMAINAN
// ==========================================
export interface GameAverageItem {
  gameName: string;
  avgScorePct: number;
  icon: string;
}

export const GameAverageBarChart: React.FC<{ games: GameAverageItem[] }> = ({ games }) => {
  return (
    <div className="space-y-3 font-rounded">
      {games.map((g, idx) => (
        <div key={idx} className="space-y-1">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-[#3c4233] font-black flex items-center gap-1.5">
              <span>{g.icon}</span>
              <span>{g.gameName}</span>
            </span>
            <span className="font-mono text-xs font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
              {g.avgScorePct}%
            </span>
          </div>
          <div className="w-full h-3.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200 p-0.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${g.avgScorePct}%` }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="h-full rounded-full bg-[#3c4233]"
            />
          </div>
        </div>
      ))}
    </div>
  );
};


// ==========================================
// ⭐ 8. GRAF BAR — JUMLAH BINTANG MURID
// ==========================================
export interface StudentStarItem {
  id: string;
  name: string;
  stars: number;
  maxStars: number;
  scorePct: number;
}

export const StudentStarsBarChart: React.FC<{
  students: StudentStarItem[];
  onSelectStudent?: (id: string) => void;
}> = ({ students, onSelectStudent }) => {
  if (!students || students.length === 0) return null;

  return (
    <div className="space-y-2 font-rounded max-h-[320px] overflow-y-auto pr-1">
      {students.map((st, idx) => {
        const pct = Math.round((st.stars / st.maxStars) * 100);
        return (
          <div
            key={st.id}
            onClick={() => onSelectStudent && onSelectStudent(st.id)}
            className="p-2 rounded-xl bg-white hover:bg-amber-50 border border-stone-200 transition-all cursor-pointer space-y-1 shadow-2xs group"
          >
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#3c4233] font-black group-hover:text-amber-800 transition-colors">
                {st.name}
              </span>
              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                <span className="text-amber-800 font-extrabold flex items-center gap-0.5">
                  ⭐ {st.stars} / {st.maxStars}
                </span>
                <span className="text-gray-500 font-bold">({st.scorePct}%)</span>
              </div>
            </div>
            <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.5, delay: idx * 0.02 }}
                className="h-full rounded-full bg-amber-500"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
