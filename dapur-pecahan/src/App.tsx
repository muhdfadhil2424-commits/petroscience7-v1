import React, { useState, useEffect } from 'react';
import { DishId } from './types';
import { DISHES_DATA } from './data/dishesData';
import { HeaderNavbar } from './components/HeaderNavbar';
import { DishSelector } from './components/DishSelector';
import { IngredientTaskScreen } from './components/IngredientTaskScreen';
import { CookingAnimationModal } from './components/CookingAnimationModal';
import { DiningTable } from './components/DiningTable';
import { DskpNotesModal } from './components/DskpNotesModal';
import { CertificateModal } from './components/CertificateModal';
import { AlyaAIChatbot } from './components/AlyaAIChatbot';
import { NetworkStatusModal } from './components/NetworkStatusModal';
import { sounds } from './utils/audio';
import { WifiOff, CheckCircle2, X } from 'lucide-react';

export default function App() {
  const [viewState, setViewState] = useState<'menu' | 'cooking' | 'dining'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dapur_pecahan_view_state_v1');
      if (saved === 'menu' || saved === 'cooking' || saved === 'dining') {
        return saved;
      }
    }
    return 'menu';
  });

  const [selectedDishId, setSelectedDishId] = useState<DishId | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dapur_pecahan_selected_dish_v1');
      if (saved && (saved === 'karipap' || saved === 'sirap-bandung' || saved === 'kek-coklat' || saved === 'ayam-crispy')) {
        return saved as DishId;
      }
    }
    return null;
  });

  // Offline / Online Network State with Simulation Capability
  const [realIsOnline, setRealIsOnline] = useState<boolean>(() => {
    if (typeof navigator !== 'undefined') {
      return navigator.onLine;
    }
    return true;
  });

  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  const [showNetworkModal, setShowNetworkModal] = useState<boolean>(false);
  const [showOfflineToast, setShowOfflineToast] = useState<boolean>(false);

  const effectiveIsOnline = isSimulatedOffline ? false : realIsOnline;

  useEffect(() => {
    const handleOnline = () => {
      setRealIsOnline(true);
      if (!isSimulatedOffline) {
        setShowOfflineToast(true);
        setTimeout(() => setShowOfflineToast(false), 4000);
      }
    };

    const handleOffline = () => {
      setRealIsOnline(false);
      setShowOfflineToast(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isSimulatedOffline]);

  const handleToggleSimulateOffline = () => {
    setIsSimulatedOffline((prev) => {
      const next = !prev;
      setShowOfflineToast(true);
      if (!next) {
        setTimeout(() => setShowOfflineToast(false), 4000);
      }
      return next;
    });
  };

  // Persistent AI Chatbot collapse state (Open by default on wide screens)
  const [isAiCollapsed, setIsAiCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024;
    }
    return false;
  });

  // Auto start BGM on first user interaction (browser gesture requirement)
  useEffect(() => {
    const handleFirstUserInteraction = () => {
      sounds.startBGM();
      window.removeEventListener('click', handleFirstUserInteraction);
      window.removeEventListener('keydown', handleFirstUserInteraction);
    };

    window.addEventListener('click', handleFirstUserInteraction);
    window.addEventListener('keydown', handleFirstUserInteraction);

    return () => {
      window.removeEventListener('click', handleFirstUserInteraction);
      window.removeEventListener('keydown', handleFirstUserInteraction);
    };
  }, []);

  const [completedDishes, setCompletedDishes] = useState<Record<DishId, boolean>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('dapur_pecahan_completed_dishes_v1');
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return {
      'karipap': false,
      'sirap-bandung': false,
      'kek-coklat': false,
      'ayam-crispy': false,
    };
  });

  const [dishScores, setDishScores] = useState<Record<DishId, number>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('dapur_pecahan_dish_scores_v1');
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return {
      'karipap': 0,
      'sirap-bandung': 0,
      'kek-coklat': 0,
      'ayam-crispy': 0,
    };
  });

  // Save changes to localStorage for offline persistence
  useEffect(() => {
    try {
      localStorage.setItem('dapur_pecahan_completed_dishes_v1', JSON.stringify(completedDishes));
    } catch {
      // ignore
    }
  }, [completedDishes]);

  useEffect(() => {
    try {
      localStorage.setItem('dapur_pecahan_dish_scores_v1', JSON.stringify(dishScores));
    } catch {
      // ignore
    }
  }, [dishScores]);

  useEffect(() => {
    try {
      localStorage.setItem('dapur_pecahan_view_state_v1', viewState);
      if (selectedDishId) {
        localStorage.setItem('dapur_pecahan_selected_dish_v1', selectedDishId);
      } else {
        localStorage.removeItem('dapur_pecahan_selected_dish_v1');
      }
    } catch {
      // ignore
    }
  }, [viewState, selectedDishId]);

  const [showDskpModal, setShowDskpModal] = useState<boolean>(false);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);
  const [showCookingAnimModal, setShowCookingAnimModal] = useState<boolean>(false);

  const totalStars = Object.values(dishScores).reduce((a: number, b: number) => a + b, 0);
  const completedCount = Object.values(completedDishes).filter(Boolean).length;

  const activeDish = DISHES_DATA.find((d) => d.id === selectedDishId);

  // Auto scroll smoothly to the top whenever the main view state or active dish changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [viewState, selectedDishId]);

  // Handle selecting dish to cook
  const handleSelectDish = (id: DishId) => {
    setSelectedDishId(id);
    setViewState('cooking');
  };

  // Handle finishing all ingredients for active dish
  const handleFinishDishIngredients = () => {
    if (selectedDishId) {
      setCompletedDishes((prev) => ({ ...prev, [selectedDishId]: true }));
      setDishScores((prev) => ({ ...prev, [selectedDishId]: 3 }));
      setShowCookingAnimModal(true);
    }
  };

  // Reset entire simulation state
  const handleReset = () => {
    if (window.confirm('Adakah anda pasti ingin memulakan semula simulasi Dapur Pecahan Chef Alya?')) {
      const resetDishes = {
        'karipap': false,
        'sirap-bandung': false,
        'kek-coklat': false,
        'ayam-crispy': false,
      };
      const resetScores = {
        'karipap': 0,
        'sirap-bandung': 0,
        'kek-coklat': 0,
        'ayam-crispy': 0,
      };
      setCompletedDishes(resetDishes);
      setDishScores(resetScores);
      setSelectedDishId(null);
      setViewState('menu');
      try {
        localStorage.setItem('dapur_pecahan_completed_dishes_v1', JSON.stringify(resetDishes));
        localStorage.setItem('dapur_pecahan_dish_scores_v1', JSON.stringify(resetScores));
        localStorage.removeItem('dapur_pecahan_selected_dish_v1');
        localStorage.setItem('dapur_pecahan_view_state_v1', 'menu');
      } catch {
        // ignore
      }
    }
  };

  return (
    <div className="min-h-screen bg-amber-50/40 text-slate-800 font-sans selection:bg-amber-300 selection:text-amber-950 flex flex-col relative">
      {/* Persistent Left Sidebar AI Tutor */}
      <AlyaAIChatbot
        isCollapsed={isAiCollapsed}
        onToggleCollapse={() => setIsAiCollapsed(!isAiCollapsed)}
        isOnline={effectiveIsOnline}
      />

      {/* Main App Container with responsive dynamic margin when AI Sidebar is visible */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          !isAiCollapsed ? 'lg:pl-80 md:pl-0' : 'pl-0'
        }`}
      >
        {/* Sticky Header Navbar */}
        <HeaderNavbar
          totalStars={totalStars}
          completedCount={completedCount}
          onOpenDskp={() => setShowDskpModal(true)}
          onOpenCertificate={() => setShowCertificateModal(true)}
          onReset={handleReset}
          onGoHome={() => setViewState('menu')}
          onToggleAi={() => setIsAiCollapsed(!isAiCollapsed)}
          isAiOpen={!isAiCollapsed}
          isOnline={effectiveIsOnline}
          onOpenNetworkModal={() => setShowNetworkModal(true)}
        />

        {/* Offline Notification Banner / Toast */}
        {(!effectiveIsOnline || showOfflineToast) && (
          <div className="bg-[#4A4A33] text-white px-4 py-2 text-xs flex items-center justify-between border-b border-amber-200/20 shadow-sm animate-fadeIn">
            <div className="flex items-center gap-2 max-w-4xl mx-auto">
              {!effectiveIsOnline ? (
                <>
                  <span className="p-1 rounded-md bg-amber-600/80 text-white flex-shrink-0">
                    <WifiOff className="w-3.5 h-3.5" />
                  </span>
                  <span className="font-medium text-[#F2E8CF]">
                    <strong className="text-amber-300">Mod Luar Talian Aktif:</strong> Aplikasi & AI Puan Alya beroperasi 100% tanpa internet. Semua kemajuan & pengiraan disimpan dalam peranti anda.
                  </span>
                </>
              ) : (
                <>
                  <span className="p-1 rounded-md bg-emerald-600/80 text-white flex-shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                  <span className="font-medium text-[#F2E8CF]">
                    <strong className="text-emerald-300">Mod Dalam Talian Aktif:</strong> Data diselaraskan secara automatik & sedia bila-bila masa untuk mod luar talian.
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowNetworkModal(true)}
                className="underline text-amber-200 hover:text-white cursor-pointer font-bold"
              >
                Ketahui Lanjut
              </button>
              {effectiveIsOnline && (
                <button
                  onClick={() => setShowOfflineToast(false)}
                  className="text-stone-300 hover:text-white p-1 rounded cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Main Content Router */}
        <main className="flex-1">
          {viewState === 'menu' && (
            <DishSelector
              dishes={DISHES_DATA}
              completedDishes={completedDishes}
              dishScores={dishScores}
              onSelectDish={handleSelectDish}
              onViewDiningTable={() => setViewState('dining')}
            />
          )}

          {viewState === 'cooking' && activeDish && (
            <IngredientTaskScreen
              dish={activeDish}
              onBackToMenu={() => setViewState('menu')}
              onFinishDish={handleFinishDishIngredients}
            />
          )}

          {viewState === 'dining' && (
            <DiningTable
              dishes={DISHES_DATA}
              completedDishes={completedDishes}
              onBackToMenu={() => setViewState('menu')}
              onOpenCertificate={() => setShowCertificateModal(true)}
            />
          )}
        </main>
      </div>

      {/* Cooking Simulation Animation Modal */}
      {showCookingAnimModal && activeDish && (
        <CookingAnimationModal
          dish={activeDish}
          onClose={() => {
            setShowCookingAnimModal(false);
            setViewState('menu');
          }}
          onGoToDiningTable={() => {
            setShowCookingAnimModal(false);
            setViewState('dining');
          }}
        />
      )}

      {/* Educational DSKP 3.1 Reference Modal */}
      {showDskpModal && <DskpNotesModal onClose={() => setShowDskpModal(false)} />}

      {/* Master Chef Certificate Modal */}
      {showCertificateModal && (
        <CertificateModal onClose={() => setShowCertificateModal(false)} />
      )}

      {/* Network Status & Dual Adaptation Modal */}
      <NetworkStatusModal
        isOpen={showNetworkModal}
        onClose={() => setShowNetworkModal(false)}
        isOnline={effectiveIsOnline}
        isSimulatedOffline={isSimulatedOffline}
        onToggleSimulateOffline={handleToggleSimulateOffline}
      />
    </div>
  );
}
