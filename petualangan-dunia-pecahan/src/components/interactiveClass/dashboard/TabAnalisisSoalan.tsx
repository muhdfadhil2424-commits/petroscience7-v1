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
      <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-amber-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-serif-title text-base sm:text-lg font-bold text-[#4A3728] flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-blue-600" />
            <span>📋 Analisis Ketepatan 15 Soalan (DSKP 3.1)</span>
          </h2>
          <p className="text-xs text-stone-500 font-medium mt-0.5">
            Ketepatan jawapan murid, pilihan distractors (A/B/C/D), dan salah faham konsep
          </p>
        </div>

        {/* Difficulty Filter Pills */}
        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-2xl border border-stone-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setFilterDifficulty('all')}
            className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
              filterDifficulty === 'all'
                ? 'bg-stone-800 text-white shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Semua ({questionsAnalysis.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterDifficulty('easy')}
            className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
              filterDifficulty === 'easy'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-emerald-800 hover:text-emerald-950'
            }`}
          >
            🟢 Mudah ({easyCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterDifficulty('medium')}
            className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
              filterDifficulty === 'medium'
                ? 'bg-amber-500 text-white shadow-2xs'
                : 'text-amber-800 hover:text-amber-950'
            }`}
          >
            🟡 Sederhana ({mediumCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterDifficulty('hard')}
            className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
              filterDifficulty === 'hard'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'text-rose-800 hover:text-rose-950'
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
              className={`bg-white rounded-3xl border-2 transition-all shadow-2xs ${
                isExpanded ? 'border-[#D98262] ring-2 ring-amber-200' : 'border-amber-200 hover:border-amber-300'
              }`}
            >
              {/* Question Row Header */}
              <div
                onClick={() => toggleExpand(q.questionId)}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-9 h-9 rounded-2xl font-mono font-black flex items-center justify-center text-sm shrink-0 ${
                      diffCat === 'easy'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : diffCat === 'medium'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-rose-100 text-rose-900 border border-rose-300'
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
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          diffCat === 'easy'
                            ? 'bg-emerald-50 text-emerald-800'
                            : diffCat === 'medium'
                            ? 'bg-amber-50 text-amber-800'
                            : 'bg-rose-50 text-rose-800'
                        }`}
                      >
                        {diffCat === 'easy' ? '🟢 Mudah' : diffCat === 'medium' ? '🟡 Sederhana' : '🔴 Mencabar'}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-[#4A3728] mt-1 line-clamp-1">
                      {q.question}
                    </p>
                  </div>
                </div>

                {/* Score Stats & Progress */}
                <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end">
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <span className="text-emerald-800 font-mono">✓ {q.correctCount} Betul</span>
                      <span className="text-stone-300">•</span>
                      <span className="text-rose-700 font-mono">✗ {q.wrongCount} Salah</span>
                    </div>
                    <div className="w-28 sm:w-36 h-2.5 bg-stone-100 rounded-full overflow-hidden mt-1 ml-auto">
                      <div
                        className={`h-full rounded-full transition-all ${
                          diffCat === 'easy'
                            ? 'bg-emerald-500'
                            : diffCat === 'medium'
                            ? 'bg-amber-400'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${q.accuracy}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-center min-w-[50px]">
                    <span className="text-base sm:text-lg font-black font-mono text-[#4A3728]">
                      {q.accuracy}%
                    </span>
                    <span className="text-[10px] text-stone-400 block">Ketepatan</span>
                  </div>

                  <button
                    type="button"
                    className="p-1.5 rounded-xl bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Accordion Detail Body */}
              {isExpanded && (
                <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-amber-100 space-y-4 animate-fadeIn">
                  {/* Full Question Text */}
                  <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-xs text-stone-800 font-medium">
                    <span className="font-bold text-stone-900 block mb-1">Teks Lengkap Soalan:</span>
                    <p className="text-sm font-semibold text-[#4A3728]">"{q.question}"</p>
                  </div>

                  {/* Options Distribution Grid (A, B, C, D) */}
                  <div>
                    <span className="text-xs font-bold text-stone-700 block mb-2">
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
                                ? 'bg-emerald-50/90 border-emerald-400 text-emerald-950'
                                : count > 0
                                ? 'bg-stone-50 border-stone-300 text-stone-800'
                                : 'bg-stone-50/50 border-stone-200 text-stone-400'
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs font-black">
                              <span className="flex items-center gap-1.5">
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono ${
                                  isCorrectLetter ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-700'
                                }`}>
                                  {letter}
                                </span>
                                {isCorrectLetter && <span>(Jawapan Betul)</span>}
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
                      <div className="bg-rose-50 p-3.5 rounded-2xl border border-rose-200 text-xs text-rose-950 space-y-1">
                        <span className="font-bold flex items-center gap-1.5 text-rose-900">
                          <AlertTriangle className="w-4 h-4 text-rose-600" />
                          <span>Punca Salah Faham Konsep:</span>
                        </span>
                        <p className="leading-relaxed font-medium">{q.misconceptionAlert}</p>
                      </div>
                    )}

                    <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-1">
                      <span className="font-bold flex items-center gap-1.5 text-amber-900">
                        <Lightbulb className="w-4 h-4 text-amber-600" />
                        <span>Petua Pedagogi Guru:</span>
                      </span>
                      <p className="leading-relaxed font-medium">{q.pedagogicalTip}</p>
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
