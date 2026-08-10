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

export default function App() {
  const [currentView, setCurrentView] = useState<'hub' | 'pizza_pecahan' | 'arena_pecahan' | 'dapur_pecahan' | 'dunia_pixel'>('hub');

  // Student & Teacher State
  const [currentStudent, setCurrentStudentState] = useState<StudentProfile | null>(() => getCurrentStudent());
  const [isStudentProfileOpen, setIsStudentProfileOpen] = useState<boolean>(() => !getCurrentStudent());
  const [isTeacherLoginOpen, setIsTeacherLoginOpen] = useState<boolean>(false);
  const [isTeacherDashboardOpen, setIsTeacherDashboardOpen] = useState<boolean>(() => getTeacherAuth().isLoggedIn);

  // LocalStorage state initialization with robust progress migration
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const activeStudent = getCurrentStudent();
      if (activeStudent && activeStudent.progress) {
        return activeStudent.progress;
      }

      const savedStr = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (!savedStr) return DEFAULT_PROGRESS;
      const parsed: UserProgress = JSON.parse(savedStr);

      // Reconstruct completedChallengeIds & challengeStars if missing/empty
      let completedIds = parsed.completedChallengeIds || [];
      let cStars = parsed.challengeStars || {};

      if (completedIds.length === 0) {
        // Reconstruct from worldStars
        const aStars = parsed.worldStars?.arena || 0;
        const dStars = parsed.worldStars?.dapur || 0;
        const pStars = parsed.worldStars?.pixel || 0;

        if (aStars >= 3) { completedIds.push('arena-1'); cStars['arena-1'] = Math.min(3, aStars); }
        if (aStars >= 6) { completedIds.push('arena-2'); cStars['arena-2'] = Math.min(3, aStars - 3); }
        if (aStars >= 9) { completedIds.push('arena-3'); cStars['arena-3'] = 3; }

        if (dStars >= 3) { completedIds.push('dapur-1'); cStars['dapur-1'] = Math.min(3, dStars); }
        if (dStars >= 6) { completedIds.push('dapur-2'); cStars['dapur-2'] = Math.min(3, dStars - 3); }
        if (dStars >= 9) { completedIds.push('dapur-3'); cStars['dapur-3'] = 3; }

        if (pStars >= 3) { completedIds.push('pixel-1'); cStars['pixel-1'] = Math.min(3, pStars); }
        if (pStars >= 6) { completedIds.push('pixel-2'); cStars['pixel-2'] = Math.min(3, pStars - 3); }
        if (pStars >= 9) { completedIds.push('pixel-3'); cStars['pixel-3'] = 3; }
      }

      const totalCompleted = Math.min(9, completedIds.length);
      const totalEarnedStars = Object.values(cStars).reduce((sum, val) => sum + val, 0) || parsed.earnedStars || 0;

      return {
        ...DEFAULT_PROGRESS,
        ...parsed,
        completedChallenges: totalCompleted,
        earnedStars: totalEarnedStars,
        completedChallengeIds: completedIds,
        challengeStars: cStars,
      };
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
      setProgress(student.progress);
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

      if (newCompletedCount >= 9 && prev.completedChallenges < 9) {
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
            <span>🍕 Petualangan Dunia Pecahan</span>
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
