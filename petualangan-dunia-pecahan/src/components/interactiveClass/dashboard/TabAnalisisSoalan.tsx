import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Filter,
  BarChart2,
  Lightbulb,
} from 'lucide-react';
import { QuestionDetailedAnalysis } from '../../../utils/interactiveDashboardAnalytics';
import { INTERACTIVE_CLASS_15_QUESTIONS } from '../../../data/interactiveClass30Questions';

interface TabAnalisisSoalanProps {
  questionsAnalysis: QuestionDetailedAnalysis[];
}

export const TabAnalisisSoalan: React.FC<TabAnalisisSoalanProps> = ({
  questionsAnalysis,
}) => {
  const [filterDifficulty, setFilterDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  const toggleExpand = (qId: string) => {
    setExpandedQuestionId((prev) => (prev === qId ? null : qId));
  };

  const getDifficultyCategory = (accuracy: number) => {
    if (accuracy >= 85) return 'easy';
    if (accuracy >= 70) return 'medium';
    return 'hard';
  };

  const safeQuestionsAnalysis = questionsAnalysis || [];

  const filteredQuestions = safeQuestionsAnalysis.filter((q) => {
    if (filterDifficulty === 'all') return true;
    return getDifficultyCategory(q.accuracy) === filterDifficulty;
  });

  const easyCount = safeQuestionsAnalysis.filter((q) => getDifficultyCategory(q.accuracy) === 'easy').length;
  const mediumCount = safeQuestionsAnalysis.filter((q) => getDifficultyCategory(q.accuracy) === 'medium').length;
  const hardCount = safeQuestionsAnalysis.filter((q) => getDifficultyCategory(q.accuracy) === 'hard').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Filter and Overview Bar */}
      <div className="bg-gradient-to-r from-white via-amber-50/50 to-white rounded-3xl p-4 sm:p-5 border-2 border-amber-300 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-serif-title text-base sm:text-lg font-black text-stone-900 flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-sm shadow-2xs">
              📋
            </div>
            <span>Analisis Ketepatan 15 Soalan (DSKP 3.1)</span>
          </h2>
          <p className="text-xs text-stone-600 font-bold mt-1">
            Ketepatan jawapan murid, pilihan distractors (A/B/C/D), dan salah faham konsep
          </p>
        </div>

        {/* Difficulty Filter Pills */}
        <div className="flex items-center gap-1.5 bg-stone-100 p-1.5 rounded-2xl border border-stone-200 text-xs font-black shadow-2xs">
          <button
            type="button"
            onClick={() => setFilterDifficulty('all')}
            className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
              filterDifficulty === 'all'
                ? 'bg-stone-900 text-amber-300 shadow-xs'
                : 'text-stone-700 hover:text-stone-950'
            }`}
          >
            Semua ({questionsAnalysis.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterDifficulty('easy')}
            className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
              filterDifficulty === 'easy'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-950 hover:bg-emerald-100/60'
            }`}
          >
            🟢 Mudah ({easyCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterDifficulty('medium')}
            className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
              filterDifficulty === 'medium'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-amber-950 hover:bg-amber-100/60'
            }`}
          >
            🟡 Sederhana ({mediumCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterDifficulty('hard')}
            className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
              filterDifficulty === 'hard'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-rose-950 hover:bg-rose-100/60'
            }`}
          >
            🔴 Mencabar ({hardCount})
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {filteredQuestions.map((q) => {
          const isExpanded = expandedQuestionId === q.questionId;
          const diffCat = getDifficultyCategory(q.accuracy);
          const rawQ = INTERACTIVE_CLASS_15_QUESTIONS.find((item) => item.questionId === q.questionId);

          return (
            <div
              key={q.questionId}
              className={`rounded-3xl border-2 transition-all shadow-xs hover:shadow-sm ${
                diffCat === 'easy'
                  ? 'bg-gradient-to-r from-emerald-50/30 via-white to-white border-emerald-300'
                  : diffCat === 'medium'
                  ? 'bg-gradient-to-r from-amber-50/30 via-white to-white border-amber-300'
                  : 'bg-gradient-to-r from-rose-50/40 via-white to-white border-rose-300'
              } ${isExpanded ? 'ring-2 ring-amber-300' : ''}`}
            >
              {/* Question Row Header */}
              <div
                onClick={() => toggleExpand(q.questionId)}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-9 h-9 rounded-2xl font-mono font-black flex items-center justify-center text-sm shrink-0 shadow-2xs ${
                      diffCat === 'easy'
                        ? 'bg-emerald-100 text-emerald-950 border-2 border-emerald-400'
                        : diffCat === 'medium'
                        ? 'bg-amber-100 text-amber-950 border-2 border-amber-400'
                        : 'bg-rose-100 text-rose-950 border-2 border-rose-400'
                    }`}
                  >
                    Q{q.questionNumber}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-black text-amber-950 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                        DSKP {q.dskpCode}
                      </span>
                      <span
                        className={`text-[11px] font-black px-3 py-0.5 rounded-full border-2 shadow-2xs ${
                          diffCat === 'easy'
                            ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                            : diffCat === 'medium'
                            ? 'bg-amber-100 text-amber-950 border-amber-400'
                            : 'bg-rose-100 text-rose-950 border-rose-400'
                        }`}
                      >
                        {diffCat === 'easy' ? '🟢 Mudah' : diffCat === 'medium' ? '🟡 Sederhana' : '🔴 Mencabar'}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-black text-stone-900 mt-1 line-clamp-1">
                      {q.question}
                    </p>
                  </div>
                </div>

                {/* Score Stats & Progress */}
                <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end">
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-xs font-black">
                      <span className="text-emerald-700 font-mono">✓ {q.correctCount} Betul</span>
                      <span className="text-stone-300">•</span>
                      <span className="text-rose-600 font-mono">✗ {q.wrongCount} Salah</span>
                    </div>
                    <div className="w-28 sm:w-36 h-3 bg-stone-100 rounded-full overflow-hidden mt-1 ml-auto border border-stone-200">
                      <div
                        className={`h-full rounded-full transition-all ${
                          diffCat === 'easy'
                            ? 'bg-emerald-600'
                            : diffCat === 'medium'
                            ? 'bg-amber-500'
                            : 'bg-rose-600'
                        }`}
                        style={{ width: `${q.accuracy}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-center min-w-[50px]">
                    <span className="text-base sm:text-lg font-black font-mono text-stone-900">
                      {q.accuracy}%
                    </span>
                    <span className="text-[10px] text-stone-600 font-black block">Ketepatan</span>
                  </div>

                  <button
                    type="button"
                    className="p-1.5 rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Accordion Detail Body */}
              {isExpanded && (
                <div className="px-4 sm:px-5 pb-5 pt-1 border-t-2 border-stone-100 space-y-4 animate-fadeIn">
                  {/* Full Question Text */}
                  <div className="bg-white p-3.5 rounded-2xl border-2 border-stone-200 text-xs text-stone-800 font-medium">
                    <span className="font-black text-stone-900 block mb-1">Teks Lengkap Soalan:</span>
                    <p className="text-sm font-bold text-stone-900">"{q.question}"</p>
                  </div>

                  {/* Options Distribution Grid (A, B, C, D) */}
                  <div>
                    <span className="text-xs font-black text-stone-900 block mb-2">
                      Taburan Pilihan Jawapan Murid (A / B / C / D):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                      {(['A', 'B', 'C', 'D'] as const).map((letter) => {
                        const count = q.distribution[letter] || 0;
                        const isCorrectLetter = letter === q.correctAnswerLetter;
                        const letterIdx = letter === 'A' ? 0 : letter === 'B' ? 1 : letter === 'C' ? 2 : 3;
                        const optText = rawQ?.options[letterIdx] || '';
                        const optPercent = q.totalAnswered > 0 ? Math.round((count / q.totalAnswered) * 100) : 0;

                        return (
                          <div
                            key={letter}
                            className={`p-3 rounded-2xl border-2 space-y-1 ${
                              isCorrectLetter
                                ? 'bg-emerald-100/90 border-emerald-500 text-emerald-950 shadow-2xs'
                                : count > 0
                                ? 'bg-white border-stone-300 text-stone-900 font-bold'
                                : 'bg-stone-50 border-stone-200 text-stone-400'
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs font-black">
                              <span className="flex items-center gap-1.5">
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono ${
                                  isCorrectLetter ? 'bg-emerald-600 text-white' : 'bg-stone-300 text-stone-800'
                                }`}>
                                  {letter}
                                </span>
                                {isCorrectLetter && <span className="text-emerald-900">(Betul)</span>}
                              </span>
                              <span className="font-mono">{count} murid ({optPercent}%)</span>
                            </div>
                            <p className="text-xs font-medium line-clamp-2">{optText}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Pedagogical Tip & Misconception Alert */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {q.misconceptionAlert && (
                      <div className="bg-rose-100/90 p-3.5 rounded-2xl border-2 border-rose-300 text-xs text-rose-950 space-y-1 shadow-2xs">
                        <span className="font-black flex items-center gap-1.5 text-rose-950">
                          <AlertTriangle className="w-4 h-4 text-rose-600" />
                          <span>Punca Salah Faham Konsep:</span>
                        </span>
                        <p className="leading-relaxed font-semibold text-rose-950">{q.misconceptionAlert}</p>
                      </div>
                    )}

                    <div className="bg-amber-100/90 p-3.5 rounded-2xl border-2 border-amber-300 text-xs text-amber-950 space-y-1 shadow-2xs">
                      <span className="font-black flex items-center gap-1.5 text-amber-950">
                        <Lightbulb className="w-4 h-4 text-amber-600" />
                        <span>Petua Pedagogi Guru:</span>
                      </span>
                      <p className="leading-relaxed font-semibold text-amber-950">{q.pedagogicalTip}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
