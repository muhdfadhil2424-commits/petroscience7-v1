import React from 'react';
import {
  Calendar,
  Sparkles,
  Eye,
  EyeOff,
  RotateCcw,
  Save,
  FileSpreadsheet,
  Printer,
  Trash2,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { DashboardTab, DASHBOARD_TABS } from './types';
import { SessionDataMode } from '../../../utils/interactiveSessionManager';

interface DashboardHeaderProps {
  selectedClass: string;
  sessionMode: SessionDataMode;
  sessionLabel: string;
  currentDateStr: string;
  studentsCount: number;
  totalQuestions: number;
  totalScans: number;
  isPrivacyMode: boolean;
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  onToggleDataMode: (mode: SessionDataMode) => void;
  onTogglePrivacy: () => void;
  onResetDemo: () => void;
  onSaveSession: () => void;
  onExportCSV: () => void;
  onOpenPrintModal: () => void;
  onClearSession: () => void;
  onNavigateToSession?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  selectedClass,
  sessionMode,
  sessionLabel,
  currentDateStr,
  studentsCount,
  totalQuestions,
  totalScans,
  isPrivacyMode,
  activeTab,
  onTabChange,
  onToggleDataMode,
  onTogglePrivacy,
  onResetDemo,
  onSaveSession,
  onExportCSV,
  onOpenPrintModal,
  onClearSession,
  onNavigateToSession,
}) => {
  const currentTabConfig = DASHBOARD_TABS.find((t) => t.id === activeTab) || DASHBOARD_TABS[0];

  return (
    <div className="space-y-4">
      {/* ======================================================== */}
      {/* 1. HEADER UTAMA KELAS INTERAKTIF */}
      {/* ======================================================== */}
      <header className="bg-gradient-to-r from-white via-amber-50/40 to-white rounded-3xl p-5 sm:p-6 border-2 border-amber-300 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
            📊
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-serif-title text-xl sm:text-2xl font-black text-stone-900">
                Analisis Kelas Interaktif
              </h1>
              <span className="bg-gradient-to-r from-stone-900 to-indigo-950 text-amber-300 font-mono text-xs font-black px-3 py-1 rounded-full shadow-2xs">
                Kelas: {selectedClass}
              </span>
              <span
                className={`text-xs font-black px-3 py-1 rounded-full border shadow-2xs ${
                  sessionMode === 'demo'
                    ? 'bg-amber-100 text-amber-950 border-amber-300'
                    : 'bg-rose-100 text-rose-950 border-rose-300'
                }`}
              >
                {sessionLabel}
              </span>
              <span className="bg-stone-100 text-stone-700 font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1 border border-stone-200">
                <Calendar className="w-3.5 h-3.5 text-stone-500" />
                <span>{currentDateStr}</span>
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-stone-600 font-medium mt-1.5 flex-wrap">
              <span>
                Soalan: <strong className="text-stone-900 font-bold">{totalQuestions} Soalan (DSKP 3.1)</strong>
              </span>
              <span className="text-stone-300">•</span>
              <span>
                Murid: <strong className="text-stone-900 font-bold">{studentsCount} Murid</strong>
              </span>
              <span className="text-stone-300">•</span>
              <span>
                Imbasan Direkodkan: <strong className="text-stone-900 font-bold">{totalScans} Jawapan</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Data Mode Switcher (Demo vs Live) */}
          <div className="flex items-center bg-stone-100 p-1 rounded-2xl border border-stone-200 shadow-2xs">
            <button
              type="button"
              onClick={() => onToggleDataMode('demo')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all ${
                sessionMode === 'demo'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title={`Data Demo ${selectedClass}: 40 murid, 600 respons`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>🧪 Demo ({selectedClass})</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleDataMode('live')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all ${
                sessionMode === 'live'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Sesi imbasan QR langsung murid di bilik darjah"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>🔴 Sesi Sebenar</span>
            </button>
          </div>

          {onNavigateToSession && (
            <button
              type="button"
              onClick={onNavigateToSession}
              className="px-3.5 py-2 rounded-2xl bg-white hover:bg-stone-50 text-stone-800 border-2 border-stone-300 text-xs font-bold shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>← Kembali ke Sesi</span>
            </button>
          )}

          {/* Privacy Mode Toggle */}
          <button
            type="button"
            onClick={onTogglePrivacy}
            className={`px-3.5 py-2 rounded-2xl text-xs font-black shadow-2xs flex items-center gap-1.5 cursor-pointer transition-all border ${
              isPrivacyMode
                ? 'bg-purple-100 text-purple-950 border-purple-300'
                : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
            }`}
            title="Sembunyikan nama sebenar murid apabila memaparkan dashboard di projektor kelas"
          >
            {isPrivacyMode ? (
              <EyeOff className="w-3.5 h-3.5 text-purple-700" />
            ) : (
              <Eye className="w-3.5 h-3.5 text-stone-500" />
            )}
            <span>{isPrivacyMode ? '🔒 Mod Privasi' : '🔓 Mod Privasi'}</span>
          </button>

          {/* Reset Demo Data Button (when in demo mode) */}
          {sessionMode === 'demo' && (
            <button
              type="button"
              onClick={onResetDemo}
              className="px-3.5 py-2 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 text-xs font-black shadow-2xs flex items-center gap-1.5 cursor-pointer transition-all hover:scale-102"
              title={`Reset data demo sesi ${selectedClass} kepada 600 respons lengkap`}
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
              <span>🔄 Reset Demo</span>
            </button>
          )}

          {/* Save Session Snapshot */}
          {totalScans > 0 && (
            <button
              type="button"
              onClick={onSaveSession}
              className="px-3.5 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-xs flex items-center gap-1.5 cursor-pointer transition-all hover:scale-102"
              title="Simpan sesi ini ke rekod sejarah untuk perbandingan peningkatan kelas"
            >
              <Save className="w-3.5 h-3.5" />
              <span>💾 Simpan</span>
            </button>
          )}

          {/* Export CSV */}
          <button
            type="button"
            onClick={onExportCSV}
            className="px-3.5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs flex items-center gap-1.5 cursor-pointer transition-all hover:scale-102"
            title="Muat turun fail CSV bagi rekod Excel guru"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>📥 Eksport CSV</span>
          </button>

          {/* Print / PDF Report */}
          <button
            type="button"
            onClick={onOpenPrintModal}
            className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 hover:from-slate-800 hover:to-indigo-900 text-amber-300 text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer transition-all hover:scale-102"
            title="Buka laporan format cetak dan PDF rasmi PBD"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>🖨️ Cetak Laporan</span>
          </button>

          {totalScans > 0 && (
            <button
              type="button"
              onClick={onClearSession}
              className="p-2 rounded-2xl bg-stone-100 hover:bg-rose-50 text-stone-500 hover:text-rose-600 border border-stone-200 cursor-pointer transition-colors"
              title={
                sessionMode === 'demo'
                  ? `Padam data demo sesi ${selectedClass}`
                  : 'Padam semua data imbasan sesi sebenar'
              }
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. BREADCRUMB & QUICK ACTION BAR */}
      {/* ======================================================== */}
      <div className="bg-gradient-to-r from-white via-amber-50/70 to-white rounded-2xl p-3 sm:px-4 border-2 border-amber-300 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs font-black text-stone-600">
          <span>Dashboard</span>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-stone-800">Kelas Interaktif</span>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-amber-950 font-black bg-amber-200 px-3 py-0.5 rounded-lg border-2 border-amber-400 shadow-2xs">
            {currentTabConfig.label}
          </span>
        </div>

        {/* Quick Action Bar */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-black uppercase tracking-wider text-amber-950 flex items-center gap-1 mr-1">
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>TINDAKAN PANTAS:</span>
          </span>

          <button
            type="button"
            onClick={() => onTabChange('students')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'students'
                ? 'bg-indigo-700 text-white shadow-xs'
                : 'bg-white hover:bg-indigo-50 text-indigo-950 border-2 border-indigo-200'
            }`}
          >
            👥 Lihat Murid
          </button>

          <button
            type="button"
            onClick={() => onTabChange('ai')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'ai'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-white hover:bg-purple-50 text-purple-950 border-2 border-purple-200'
            }`}
          >
            🧠 Analisis AI
          </button>

          <button
            type="button"
            onClick={() => onTabChange('dskp')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'dskp'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white hover:bg-amber-50 text-amber-950 border-2 border-amber-300'
            }`}
          >
            🎯 Analisis DSKP
          </button>

          <button
            type="button"
            onClick={() => onTabChange('questions')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'questions'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white hover:bg-sky-50 text-sky-950 border-2 border-sky-300'
            }`}
          >
            📋 Analisis Soalan
          </button>

          <button
            type="button"
            onClick={() => onTabChange('reports')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'reports'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white hover:bg-emerald-50 text-emerald-950 border-2 border-emerald-300'
            }`}
          >
            📄 Laporan & Sijil
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. HORIZONTAL TAB NAVIGATION (7 TABS) */}
      {/* ======================================================== */}
      <nav
        aria-label="Navigasi Bahagian Dashboard"
        className="bg-white rounded-2xl p-1.5 border-2 border-amber-300 shadow-sm overflow-x-auto scrollbar-none"
      >
        <div className="flex items-center gap-1.5 min-w-max">
          {DASHBOARD_TABS.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 text-amber-300 shadow-md ring-2 ring-purple-400'
                    : 'text-stone-700 hover:text-stone-950 hover:bg-amber-100/70'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
