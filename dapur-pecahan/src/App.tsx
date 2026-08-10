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
import { sounds } from './utils/audio';

export default function App() {
  const [viewState, setViewState] = useState<'menu' | 'cooking' | 'dining'>('menu');
  const [selectedDishId, setSelectedDishId] = useState<DishId | null>(null);

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

  const [completedDishes, setCompletedDishes] = useState<Record<DishId, boolean>>({
    'kek-coklat': false,
    'ayam-crispy': false,
    'karipap': false,
    'sirap-bandung': false,
  });

  const [dishScores, setDishScores] = useState<Record<DishId, number>>({
    'kek-coklat': 0,
    'ayam-crispy': 0,
    'karipap': 0,
    'sirap-bandung': 0,
  });

  const [showDskpModal, setShowDskpModal] = useState<boolean>(false);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);
  const [showCookingAnimModal, setShowCookingAnimModal] = useState<boolean>(false);

  const totalStars = Object.values(dishScores).reduce((a: number, b: number) => a + b, 0);
  const completedCount = Object.values(completedDishes).filter(Boolean).length;

  const activeDish = DISHES_DATA.find((d) => d.id === selectedDishId);

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
      setCompletedDishes({
        'kek-coklat': false,
        'ayam-crispy': false,
        'karipap': false,
        'sirap-bandung': false,
      });
      setDishScores({
        'kek-coklat': 0,
        'ayam-crispy': 0,
        'karipap': 0,
        'sirap-bandung': 0,
      });
      setSelectedDishId(null);
      setViewState('menu');
    }
  };

  return (
    <div className="min-h-screen bg-amber-50/40 text-slate-800 font-sans selection:bg-amber-300 selection:text-amber-950">
      {/* Sticky Header Navbar */}
      <HeaderNavbar
        totalStars={totalStars}
        completedCount={completedCount}
        onOpenDskp={() => setShowDskpModal(true)}
        onOpenCertificate={() => setShowCertificateModal(true)}
        onReset={handleReset}
        onGoHome={() => setViewState('menu')}
      />

      {/* Main Content Router */}
      <main>
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
    </div>
  );
}
