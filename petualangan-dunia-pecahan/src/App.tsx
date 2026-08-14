import React, { useState, useEffect } from 'react';
import { WORLDS_DATA } from './data/worldsData';
import { WorldInfo, UserProgress, GameSettings, StudentProfile } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProgressBarSection } from './components/ProgressBarSection';
import { WorldsHub } from './components/WorldsHub';
import { AlyaWidget } from './components/AlyaWidget';
import { AlyaContext } from './utils/alyaEngine';
import { CaraBermainModal } from './components/CaraBermainModal';
import { LockedWorldModal } from './components/LockedWorldModal';
import { SettingsModal } from './components/SettingsModal';
import { WorldPreviewModal } from './components/WorldPreviewModal';
import { GrandVictoryModal } from './components/GrandVictoryModal';
import { PizzaPecahanCoverPage } from './components/PizzaPecahanCoverPage';
import { ArenaPecahanGameplay } from './components/ArenaPecahanGameplay';
import { DapurPecahanGameplay } from './components/DapurPecahanGameplay';
import { DuniaPixelGameplay } from './components/DuniaPixelGameplay';
import { StudentProfileModal } from './components/StudentProfileModal';
import { TeacherLoginModal } from './components/TeacherLoginModal';
import { TeacherDashboardModal } from './components/TeacherDashboardModal';
import { CertificateModal } from './components/CertificateModal';
import {
  getCurrentStudent,
  saveStudentProgress,
  getTeacherAuth,
} from './utils/studentSessionManager';
import { Sparkles, Heart } from 'lucide-react';

const PROGRESS_STORAGE_KEY = 'pecahan_game_progress_v1';
const SETTINGS_STORAGE_KEY = 'pecahan_game_settings_v1';

const DEFAULT_PROGRESS: UserProgress = {
  completedChallenges: 0,
  earnedStars: 0,
  unlockedWorlds: ['arena'],
  worldStars: {
    arena: 0,
    dapur: 0,
    pixel: 0,
  },
  completedChallengeIds: [],
  challengeStars: {},
  badges: [],
};

const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  unlockAllWorlds: false,
};

export const TOTAL_CHALLENGES = 9;

export function migrateProgressData(raw: any): UserProgress {
  if (!raw || typeof raw !== 'object') {
    return DEFAULT_PROGRESS;
  }

  let completedIds: string[] = Array.isArray(raw.completedChallengeIds) ? [...raw.completedChallengeIds] : [];
  let cStars: Record<string, number> = typeof raw.challengeStars === 'object' && raw.challengeStars ? { ...raw.challengeStars } : {};

  const worldStars = raw.worldStars || { arena: 0, dapur: 0, pixel: 0 };
  const aStars = worldStars.arena || 0;
  const dStars = worldStars.dapur || 0;
  const pStars = worldStars.pixel || 0;

  // Reconstruct missing challenge IDs from world stars or legacy completion count
  if (completedIds.length === 0) {
    if (aStars >= 3 || raw.completedChallenges >= 1) { if (!completedIds.includes('arena-1')) completedIds.push('arena-1'); cStars['arena-1'] = cStars['arena-1'] || Math.min(3, Math.max(1, aStars)); }
    if (aStars >= 6 || raw.completedChallenges >= 2) { if (!completedIds.includes('arena-2')) completedIds.push('arena-2'); cStars['arena-2'] = cStars['arena-2'] || Math.min(3, Math.max(1, aStars - 3)); }
    if (aStars >= 9 || raw.completedChallenges >= 3) { if (!completedIds.includes('arena-3')) completedIds.push('arena-3'); cStars['arena-3'] = cStars['arena-3'] || 3; }

    if (dStars >= 3 || raw.completedChallenges >= 4) { if (!completedIds.includes('dapur-1')) completedIds.push('dapur-1'); cStars['dapur-1'] = cStars['dapur-1'] || Math.min(3, Math.max(1, dStars)); }
    if (dStars >= 6 || raw.completedChallenges >= 5) { if (!completedIds.includes('dapur-2')) completedIds.push('dapur-2'); cStars['dapur-2'] = cStars['dapur-2'] || Math.min(3, Math.max(1, dStars - 3)); }
    if (dStars >= 9 || raw.completedChallenges >= 6) { if (!completedIds.includes('dapur-3')) completedIds.push('dapur-3'); cStars['dapur-3'] = cStars['dapur-3'] || 3; }

    if (pStars >= 3 || raw.completedChallenges >= 7) { if (!completedIds.includes('pixel-1')) completedIds.push('pixel-1'); cStars['pixel-1'] = cStars['pixel-1'] || Math.min(3, Math.max(1, pStars)); }
    if (pStars >= 6 || raw.completedChallenges >= 8) { if (!completedIds.includes('pixel-2')) completedIds.push('pixel-2'); cStars['pixel-2'] = cStars['pixel-2'] || Math.min(3, Math.max(1, pStars - 3)); }
    if (pStars >= 9 || raw.completedChallenges >= 9) { if (!completedIds.includes('pixel-3')) completedIds.push('pixel-3'); cStars['pixel-3'] = cStars['pixel-3'] || 3; }
  }

  // If raw indicates 9 challenges completed or certificate earned, enforce all 9 IDs
  if (raw.completedChallenges >= TOTAL_CHALLENGES || raw.certificateEarned) {
    const allNine = ['arena-1', 'arena-2', 'arena-3', 'dapur-1', 'dapur-2', 'dapur-3', 'pixel-1', 'pixel-2', 'pixel-3'];
    allNine.forEach((id) => {
      if (!completedIds.includes(id)) {
        completedIds.push(id);
      }
      if (!cStars[id]) {
        cStars[id] = 3;
      }
    });
  }

  const uniqueCompletedIds = Array.from(new Set(completedIds));
  const newCompletedCount = Math.min(TOTAL_CHALLENGES, uniqueCompletedIds.length);
  const isCertificateEarned = newCompletedCount >= TOTAL_CHALLENGES || !!raw.certificateEarned;

  const totalEarnedStars = Object.values(cStars).reduce((sum, v) => sum + (v || 0), 0) || raw.earnedStars || 0;

  const unlockedWorlds: string[] = Array.isArray(raw.unlockedWorlds) ? [...raw.unlockedWorlds] : ['arena'];
  if ((uniqueCompletedIds.some(id => id.startsWith('arena')) || aStars >= 1) && !unlockedWorlds.includes('dapur')) {
    unlockedWorlds.push('dapur');
  }
  if ((uniqueCompletedIds.some(id => id.startsWith('dapur')) || dStars >= 1 || newCompletedCount >= 3) && !unlockedWorlds.includes('pixel')) {
    unlockedWorlds.push('pixel');
  }

  return {
    ...DEFAULT_PROGRESS,
    ...raw,
    completedChallenges: newCompletedCount,
    completedChallengeIds: uniqueCompletedIds,
    challengeStars: cStars,
    earnedStars: totalEarnedStars,
    unlockedWorlds,
    worldStars: {
      arena: (cStars['arena-1'] || 0) + (cStars['arena-2'] || 0) + (cStars['arena-3'] || 0) || worldStars.arena || 0,
      dapur: (cStars['dapur-1'] || 0) + (cStars['dapur-2'] || 0) + (cStars['dapur-3'] || 0) || worldStars.dapur || 0,
      pixel: (cStars['pixel-1'] || 0) + (cStars['pixel-2'] || 0) + (cStars['pixel-3'] || 0) || worldStars.pixel || 0,
    },
    certificateEarned: isCertificateEarned,
    certificateDate: raw.certificateDate || (isCertificateEarned ? new Date().toISOString() : undefined),
  };
}

export default function App() {
  const [currentView, setCurrentView] = useState<'hub' | 'pizza_pecahan' | 'arena_pecahan' | 'dapur_pecahan' | 'dunia_pixel'>('hub');

  // Student & Teacher State - default initial screen is Student Login (if no active student)
  const [currentStudent, setCurrentStudentState] = useState<StudentProfile | null>(() => getCurrentStudent());
  const [isStudentProfileOpen, setIsStudentProfileOpen] = useState<boolean>(() => !getCurrentStudent());
  const [isTeacherLoginOpen, setIsTeacherLoginOpen] = useState<boolean>(false);
  const [isTeacherDashboardOpen, setIsTeacherDashboardOpen] = useState<boolean>(false);

  // LocalStorage state initialization with robust progress migration
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const activeStudent = getCurrentStudent();
      if (activeStudent && activeStudent.progress) {
        return migrateProgressData(activeStudent.progress);
      }

      const savedStr = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (savedStr) {
        const parsed = JSON.parse(savedStr);
        return migrateProgressData(parsed);
      }
      return DEFAULT_PROGRESS;
    } catch {
      return DEFAULT_PROGRESS;
    }
  });

  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Modal visibility state
  const [isCaraBermainOpen, setIsCaraBermainOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGrandVictoryOpen, setIsGrandVictoryOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [lockedWorld, setLockedWorld] = useState<WorldInfo | null>(null);
  const [activeWorldPreview, setActiveWorldPreview] = useState<WorldInfo | null>(null);

  // Sync state to localStorage & Student Record
  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
      if (currentStudent) {
        saveStudentProgress(currentStudent.id, progress);
      }
    } catch {
      // ignore
    }
  }, [progress, currentStudent]);

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  // Handle student login start
  const handleStudentStart = (student: StudentProfile) => {
    setCurrentStudentState(student);
    if (student.progress) {
      const migrated = migrateProgressData(student.progress);
      setProgress(migrated);
    } else {
      setProgress(DEFAULT_PROGRESS);
    }
    setIsStudentProfileOpen(false);
  };


  // Derived unlocked worlds list (includes unlockAllWorlds override)
  const effectiveUnlockedWorldIds = settings.unlockAllWorlds
    ? WORLDS_DATA.map((w) => w.id)
    : progress.unlockedWorlds;

  // Handlers
  const handleToggleSound = () => {
    setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  const handleToggleUnlockAll = () => {
    setSettings((prev) => ({ ...prev, unlockAllWorlds: !prev.unlockAllWorlds }));
  };

  const handleStartAdventure = () => {
    const hubElement = document.getElementById('worlds-hub');
    if (hubElement) {
      hubElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectWorld = (world: WorldInfo) => {
    setActiveWorldPreview(world);
  };

  const handleOpenPizzaPecahan = () => {
    setCurrentView('pizza_pecahan');
  };

  const handleLockedWorldClick = (world: WorldInfo) => {
    setLockedWorld(world);
  };

  // Central Challenge Completion Handler
  const handleCompleteChallenge = (challengeId: string, starsEarned: number) => {
    let triggerGrandVictory = false;

    setProgress((prev) => {
      const currentCompletedIds = prev.completedChallengeIds || [];
      const isAlreadyCompleted = currentCompletedIds.includes(challengeId);

      const updatedCompletedIds = isAlreadyCompleted
        ? currentCompletedIds
        : [...currentCompletedIds, challengeId];

      const newCompletedCount = updatedCompletedIds.length;

      const currentChallengeStars = prev.challengeStars || {};
      const existingStars = currentChallengeStars[challengeId] || 0;
      const newStarsForChallenge = Math.max(existingStars, starsEarned);

      const updatedChallengeStars = {
        ...currentChallengeStars,
        [challengeId]: newStarsForChallenge,
      };

      const totalEarnedStars = Object.values(updatedChallengeStars).reduce(
        (sum: number, val: number) => sum + val,
        0
      );

      const arenaStars =
        (updatedChallengeStars['arena-1'] || 0) +
        (updatedChallengeStars['arena-2'] || 0) +
        (updatedChallengeStars['arena-3'] || 0);

      const dapurStars =
        (updatedChallengeStars['dapur-1'] || 0) +
        (updatedChallengeStars['dapur-2'] || 0) +
        (updatedChallengeStars['dapur-3'] || 0);

      const pixelStars =
        (updatedChallengeStars['pixel-1'] || 0) +
        (updatedChallengeStars['pixel-2'] || 0) +
        (updatedChallengeStars['pixel-3'] || 0);

      const updatedWorldStars: Record<string, number> = {
        arena: arenaStars,
        dapur: dapurStars,
        pixel: pixelStars,
      };

      // Unlock progression logic
      const newUnlocked = [...prev.unlockedWorlds];
      if (
        (updatedCompletedIds.some((id) => id.startsWith('arena')) || arenaStars >= 1 || newCompletedCount >= 1) &&
        !newUnlocked.includes('dapur')
      ) {
        newUnlocked.push('dapur');
      }
      if (
        (updatedCompletedIds.some((id) => id.startsWith('dapur')) || dapurStars >= 1 || newCompletedCount >= 3) &&
        !newUnlocked.includes('pixel')
      ) {
        newUnlocked.push('pixel');
      }

      // Badges
      const currentBadges = prev.badges || [];
      const newBadges = [...currentBadges];

      if (arenaStars >= 9 && !newBadges.includes('Juara Arena')) {
        newBadges.push('Juara Arena');
      }
      if (dapurStars >= 9 && !newBadges.includes('Chef Handal')) {
        newBadges.push('Chef Handal');
      }
      if (pixelStars >= 9 && !newBadges.includes('Pengembara Pixel')) {
        newBadges.push('Pengembara Pixel');
      }
      if (newCompletedCount >= 9 && !newBadges.includes('Master Pecahan')) {
        newBadges.push('Master Pecahan');
      }

      const isCertEarned = newCompletedCount >= TOTAL_CHALLENGES || prev.certificateEarned;
      const certDate = prev.certificateDate || (isCertEarned ? new Date().toISOString() : undefined);

      if (newCompletedCount >= TOTAL_CHALLENGES && prev.completedChallenges < TOTAL_CHALLENGES) {
        triggerGrandVictory = true;
      }

      return {
        ...prev,
        completedChallenges: newCompletedCount,
        earnedStars: totalEarnedStars,
        unlockedWorlds: newUnlocked,
        worldStars: updatedWorldStars,
        completedChallengeIds: updatedCompletedIds,
        challengeStars: updatedChallengeStars,
        badges: newBadges,
        certificateEarned: isCertEarned,
        certificateDate: certDate,
      };
    });

    if (triggerGrandVictory) {
      setTimeout(() => {
        setIsGrandVictoryOpen(true);
      }, 500);
    }
  };

  const handleUpdateWorldProgress = (worldId: string, starsEarned: number) => {
    setProgress((prev) => {
      const currentWorldStars = prev.worldStars[worldId] || 0;
      const newWorldStars = Math.max(currentWorldStars, starsEarned);
      const updatedWorldStars: Record<string, number> = {
        ...prev.worldStars,
        [worldId]: newWorldStars,
      };

      return {
        ...prev,
        worldStars: updatedWorldStars,
      };
    });
  };

  const handleResetProgress = () => {
    setProgress(DEFAULT_PROGRESS);
    setSettings((prev) => ({ ...prev, unlockAllWorlds: false }));
    setIsSettingsOpen(false);
  };

  const currentContext: AlyaContext = {
    worldId: currentView,
    challengeName:
      currentView === 'pizza_pecahan'
        ? 'Kedai Pizza Pecahan'
        : currentView === 'arena_pecahan'
        ? 'Arena Pecahan'
        : currentView === 'dapur_pecahan'
        ? 'Dapur Pecahan'
        : currentView === 'dunia_pixel'
        ? 'Dunia Pixel'
        : 'Hub Utama',
  };

  if (currentView === 'pizza_pecahan') {
    return (
      <>
        <PizzaPecahanCoverPage
          soundEnabled={settings.soundEnabled}
          onBackToHub={() => setCurrentView('hub')}
          onToggleSound={handleToggleSound}
        />
        <AlyaWidget soundEnabled={settings.soundEnabled} gameContext={currentContext} />
      </>
    );
  }

  if (currentView === 'arena_pecahan') {
    return (
      <>
        <ArenaPecahanGameplay
          soundEnabled={settings.soundEnabled}
          onBackToHub={() => setCurrentView('hub')}
          onToggleSound={handleToggleSound}
          onUpdateWorldProgress={handleUpdateWorldProgress}
          onCompleteChallenge={handleCompleteChallenge}
        />
        <AlyaWidget soundEnabled={settings.soundEnabled} gameContext={currentContext} />
      </>
    );
  }

  if (currentView === 'dapur_pecahan') {
    return (
      <>
        <DapurPecahanGameplay
          soundEnabled={settings.soundEnabled}
          onBackToHub={() => setCurrentView('hub')}
          onToggleSound={handleToggleSound}
          onUpdateWorldProgress={handleUpdateWorldProgress}
          onCompleteChallenge={handleCompleteChallenge}
        />
        <AlyaWidget soundEnabled={settings.soundEnabled} gameContext={currentContext} />
      </>
    );
  }

  if (currentView === 'dunia_pixel') {
    return (
      <>
        <DuniaPixelGameplay
          soundEnabled={settings.soundEnabled}
          onBackToHub={() => setCurrentView('hub')}
          onToggleSound={handleToggleSound}
          onUpdateWorldProgress={handleUpdateWorldProgress}
          onCompleteChallenge={handleCompleteChallenge}
        />
        <AlyaWidget soundEnabled={settings.soundEnabled} gameContext={currentContext} />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8E8] text-[#4A3728] relative overflow-x-hidden">
      {/* Top Navigation */}
      <Navbar
        stars={progress.earnedStars}
        completedChallenges={progress.completedChallenges}
        soundEnabled={settings.soundEnabled}
        student={currentStudent}
        onToggleSound={handleToggleSound}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHowToPlay={() => setIsCaraBermainOpen(true)}
        onOpenStudentProfile={() => setIsStudentProfileOpen(true)}
        onOpenTeacherLogin={() => setIsTeacherLoginOpen(true)}
        onOpenCertificate={() => setIsCertificateOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 w-full">
        {/* Hero Section */}
        <HeroSection
          soundEnabled={settings.soundEnabled}
          onStartAdventure={handleStartAdventure}
          onOpenHowToPlay={() => setIsCaraBermainOpen(true)}
        />

        {/* Progress Bar Display */}
        <ProgressBarSection
          completedChallenges={progress.completedChallenges}
          earnedStars={progress.earnedStars}
        />

        {/* 3 Worlds Hub Grid & Mini Game Section */}
        <WorldsHub
          worlds={WORLDS_DATA}
          unlockedWorldIds={effectiveUnlockedWorldIds}
          worldStars={progress.worldStars}
          soundEnabled={settings.soundEnabled}
          onSelectWorld={handleSelectWorld}
          onLockedWorldClick={handleLockedWorldClick}
          onOpenPizzaPecahan={handleOpenPizzaPecahan}
        />
      </main>

      {/* Alya AI Companion Mascot Widget */}
      <AlyaWidget soundEnabled={settings.soundEnabled} gameContext={currentContext} />

      {/* Footer */}
      <footer className="w-full py-6 px-4 bg-white/60 border-t border-[#F6C7A8] text-center mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-rounded font-bold text-[#4A3728]/80">
          <div className="flex items-center gap-2">
            <span>🍕 Kembara Dunia Pecahan</span>
            <span>•</span>
            <span className="text-[#D98262]">Matematik Tahun 3</span>
          </div>

          <div className="flex items-center gap-1.5 text-gray-500">
            <span>Dibuat khas untuk murid-murid Sekolah Rendah Malaysia</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CaraBermainModal
        isOpen={isCaraBermainOpen}
        soundEnabled={settings.soundEnabled}
        onClose={() => setIsCaraBermainOpen(false)}
      />

      <LockedWorldModal
        world={lockedWorld}
        soundEnabled={settings.soundEnabled}
        onClose={() => setLockedWorld(null)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        soundEnabled={settings.soundEnabled}
        unlockAllWorlds={settings.unlockAllWorlds}
        onToggleSound={handleToggleSound}
        onToggleUnlockAll={handleToggleUnlockAll}
        onResetProgress={handleResetProgress}
        onClose={() => setIsSettingsOpen(false)}
      />

      <WorldPreviewModal
        world={activeWorldPreview}
        soundEnabled={settings.soundEnabled}
        onOpenArenaPecahan={() => setCurrentView('arena_pecahan')}
        onOpenDapurPecahan={() => setCurrentView('dapur_pecahan')}
        onOpenDuniaPixel={() => setCurrentView('dunia_pixel')}
        onOpenPizzaPecahan={() => setCurrentView('pizza_pecahan')}
        onClose={() => setActiveWorldPreview(null)}
      />

      <GrandVictoryModal
        isOpen={isGrandVictoryOpen}
        soundEnabled={settings.soundEnabled}
        earnedStars={progress.earnedStars}
        badges={progress.badges}
        onClose={() => setIsGrandVictoryOpen(false)}
        onOpenCertificate={() => setIsCertificateOpen(true)}
      />

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={isCertificateOpen}
        student={currentStudent}
        studentName={currentStudent?.nama || 'Aiman Hakim'}
        studentClass={currentStudent?.kelas || '4 Asah'}
        completedChallenges={progress.completedChallenges}
        earnedStars={progress.earnedStars}
        progressOverride={progress}
        soundEnabled={settings.soundEnabled}
        issueDate={progress.certificateDate}
        onClose={() => setIsCertificateOpen(false)}
      />

      {/* Student Profile & Teacher Modals */}
      <StudentProfileModal
        isOpen={isStudentProfileOpen}
        soundEnabled={settings.soundEnabled}
        onStudentStart={handleStudentStart}
        onOpenTeacherLogin={() => {
          setIsStudentProfileOpen(false);
          setIsTeacherLoginOpen(true);
        }}
      />

      <TeacherLoginModal
        isOpen={isTeacherLoginOpen}
        soundEnabled={settings.soundEnabled}
        onClose={() => setIsTeacherLoginOpen(false)}
        onSuccessLogin={() => {
          setIsTeacherLoginOpen(false);
          setIsTeacherDashboardOpen(true);
        }}
      />

      <TeacherDashboardModal
        isOpen={isTeacherDashboardOpen}
        soundEnabled={settings.soundEnabled}
        onClose={() => setIsTeacherDashboardOpen(false)}
        onLogout={() => setIsTeacherDashboardOpen(false)}
      />
    </div>
  );
}
