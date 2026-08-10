import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dish, IngredientTask } from '../types';
import { ChefAlyaGuide } from './ChefAlyaGuide';
import { SetFractionVisualizer } from './FractionVisualizers/SetFractionVisualizer';
import { BarFractionVisualizer } from './FractionVisualizers/BarFractionVisualizer';
import { CircleFractionVisualizer } from './FractionVisualizers/CircleFractionVisualizer';
import { EggGroupsVisualizer } from './FractionVisualizers/EggGroupsVisualizer';
import { AdditionFractionVisualizer } from './FractionVisualizers/AdditionFractionVisualizer';
import { LiquidGaugeVisualizer } from './FractionVisualizers/LiquidGaugeVisualizer';
import { ArrowLeft, CheckCircle2, ChevronRight, HelpCircle, Lightbulb, Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';

interface IngredientTaskScreenProps {
  dish: Dish;
  onBackToMenu: () => void;
  onFinishDish: () => void;
}

export const IngredientTaskScreen: React.FC<IngredientTaskScreenProps> = ({
  dish,
  onBackToMenu,
  onFinishDish,
}) => {
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number>(0);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [selectedEggGroupIndices, setSelectedEggGroupIndices] = useState<number[]>([]);
  const [liquidLevel, setLiquidLevel] = useState<number>(0);
  const [isTaskValidated, setIsTaskValidated] = useState<boolean>(false);
  const [showHintModal, setShowHintModal] = useState<boolean>(false);

  const task: IngredientTask = dish.tasks[currentTaskIndex];

  // Reset state on task change
  useEffect(() => {
    setSelectedIndices([]);
    setSelectedEggGroupIndices([]);
    setLiquidLevel(0);
    setIsTaskValidated(false);
  }, [currentTaskIndex]);

  // Handle toggling items in set, bar, circle visualizers
  const handleToggleItem = (idx: number) => {
    let newIndices: number[];
    if (selectedIndices.includes(idx)) {
      newIndices = selectedIndices.filter((i) => i !== idx);
    } else {
      newIndices = [...selectedIndices, idx];
    }
    setSelectedIndices(newIndices);

    // Auto validate if count matches task.numerator
    if (newIndices.length === task.numerator) {
      if (!isTaskValidated) {
        sounds.playSuccess();
        setIsTaskValidated(true);
      }
    } else {
      setIsTaskValidated(false);
    }
  };

  // Handle toggling egg group crates
  const handleToggleEggGroup = (groupIdx: number) => {
    let newGroups: number[];
    if (selectedEggGroupIndices.includes(groupIdx)) {
      newGroups = selectedEggGroupIndices.filter((g) => g !== groupIdx);
    } else {
      newGroups = [...selectedEggGroupIndices, groupIdx];
    }
    setSelectedEggGroupIndices(newGroups);

    if (newGroups.length === task.numerator) {
      if (!isTaskValidated) {
        sounds.playSuccess();
        setIsTaskValidated(true);
      }
    } else {
      setIsTaskValidated(false);
    }
  };

  // Handle selecting liquid level
  const handleSelectLiquidLevel = (lvl: number) => {
    setLiquidLevel(lvl);
    if (lvl === task.numerator) {
      if (!isTaskValidated) {
        sounds.playSuccess();
        setIsTaskValidated(true);
      }
    } else {
      setIsTaskValidated(false);
    }
  };

  const handleNextTask = () => {
    sounds.playPop();
    if (currentTaskIndex < dish.tasks.length - 1) {
      setCurrentTaskIndex((prev) => prev + 1);
    } else {
      onFinishDish();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <button
          onClick={onBackToMenu}
          className="flex items-center gap-1.5 bg-[#EFEAE1] hover:bg-[#D6CEBE] text-[#3A3A30] font-bold px-3.5 py-2 rounded-xl text-xs border border-[#A67C52] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#A67C52]" />
          <span>Kembali ke Menu</span>
        </button>

        <div className="flex items-center gap-2 bg-[#5A5A40] text-white px-3 py-1 rounded-full text-xs font-bold shadow border border-white/10">
          {dish.realImage ? (
            <img src={dish.realImage} alt={dish.title} className="w-6 h-6 rounded-full object-cover border border-white/40" referrerPolicy="no-referrer" />
          ) : (
            <span className="text-base">{dish.imageIcon}</span>
          )}
          <span>{dish.title}</span>
        </div>

        {/* Task Step Progress Pills */}
        <div className="flex items-center gap-1.5">
          {dish.tasks.map((_, idx) => (
            <div
              key={idx}
              className={`h-2.5 rounded-full transition-all ${
                idx === currentTaskIndex
                  ? 'w-8 bg-[#A67C52]'
                  : idx < currentTaskIndex
                  ? 'w-3 bg-[#5A5A40]'
                  : 'w-3 bg-[#D6CEBE]'
              }`}
            />
          ))}
          <span className="text-xs font-bold text-[#5A5A40] ml-1">
            Bahan {currentTaskIndex + 1}/{dish.tasks.length}
          </span>
        </div>
      </div>

      {/* Chef Alya Character Dialogue */}
      <ChefAlyaGuide
        dialogueText={task.instructionText}
        subTipText={task.dskpTopic}
        badgeTag={`Bahan ${currentTaskIndex + 1}: ${task.name}`}
        emotion="cooking"
      />

      {/* Interactive Workbench Container */}
      <div className="my-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {task.visualType === 'set' && (
              <SetFractionVisualizer
                totalItems={task.denominator}
                requiredCount={task.numerator}
                selectedIndices={selectedIndices}
                onToggleItem={handleToggleItem}
                icon={task.icon}
                itemName={task.name}
              />
            )}

            {task.visualType === 'bar' && (
              <BarFractionVisualizer
                totalItems={task.denominator}
                requiredCount={task.numerator}
                selectedIndices={selectedIndices}
                onToggleItem={handleToggleItem}
                icon={task.icon}
                itemName={task.name}
              />
            )}

            {task.visualType === 'circle' && (
              <CircleFractionVisualizer
                totalItems={task.denominator}
                requiredCount={task.numerator}
                selectedIndices={selectedIndices}
                onToggleItem={handleToggleItem}
                icon={task.icon}
                itemName={task.name}
              />
            )}

            {task.visualType === 'egg-groups' && (
              <EggGroupsVisualizer
                totalEggs={task.totalItems || 15}
                groupSize={task.groupSize || 3}
                requiredGroups={task.numerator}
                selectedGroupIndices={selectedEggGroupIndices}
                onToggleGroup={handleToggleEggGroup}
              />
            )}

            {task.visualType === 'addition-fraction' && (
              <AdditionFractionVisualizer
                onSuccess={() => setIsTaskValidated(true)}
              />
            )}

            {task.visualType === 'liquid-gauge' && (
              <LiquidGaugeVisualizer
                totalItems={task.denominator}
                requiredCount={task.numerator}
                selectedCount={liquidLevel}
                onSelectLevel={handleSelectLiquidLevel}
                icon={task.icon}
                itemName={task.name}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Equivalence and DSKP Knowledge Box */}
      {(task.equivalentText || task.simplifiedText) && isTaskValidated && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto bg-[#F2E8CF] border-2 border-[#D6CEBE] p-4 rounded-2xl mb-6 shadow-sm flex items-start gap-3"
        >
          <Lightbulb className="w-6 h-6 text-[#A67C52] flex-shrink-0 mt-0.5" />
          <div className="text-xs text-[#3A3A30]">
            <span className="font-bold text-[#5A5A40] block mb-0.5">Nota Pecahan DSKP 3.1:</span>
            {task.equivalentText && <p className="mb-1">{task.equivalentText}</p>}
            {task.simplifiedText && <p>{task.simplifiedText}</p>}
          </div>
        </motion.div>
      )}

      {/* Bottom Task Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-xl mx-auto bg-white p-4 rounded-2xl border-2 border-[#D6CEBE] shadow-md">
        <button
          onClick={() => setShowHintModal(!showHintModal)}
          className="flex items-center gap-1.5 text-xs font-bold text-[#5A5A40] hover:text-[#A67C52] cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-[#A67C52]" />
          <span>Petunjuk Chef Alya</span>
        </button>

        {/* Validation Status / Next Button */}
        <div>
          {isTaskValidated ? (
            <button
              onClick={handleNextTask}
              className="flex items-center gap-2 bg-[#5A5A40] hover:bg-[#4A4A33] text-white font-extrabold px-6 py-2.5 rounded-xl text-sm shadow-md transition-transform hover:scale-105 cursor-pointer border border-[#A67C52] animate-pulse"
            >
              <CheckCircle2 className="w-4 h-4 text-[#F2E8CF]" />
              <span>
                {currentTaskIndex < dish.tasks.length - 1
                  ? 'Syabas! Masuk Bahan Seterusnya'
                  : 'Sedia Untuk Memasak! 🍳'}
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="text-xs font-semibold text-[#7A7A70] px-4 py-2 bg-[#F7F3ED] rounded-xl border border-[#D6CEBE]">
              Sila dapatkan sukatan pecahan yang betul ({task.numerator}/{task.denominator})
            </div>
          )}
        </div>
      </div>

      {/* Hint Modal */}
      {showHintModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#F7F3ED] rounded-3xl p-6 max-w-md w-full border-2 border-[#A67C52] shadow-xl">
            <div className="flex items-center gap-2 text-[#5A5A40] font-extrabold text-base mb-2">
              <Sparkles className="w-5 h-5 text-[#A67C52]" />
              <span>Petunjuk Chef Alya</span>
            </div>
            <p className="text-xs sm:text-sm text-[#3A3A30] leading-relaxed mb-4">
              Untuk mendapatkan pecahan <span className="font-extrabold text-[#A67C52]">{task.numerator}/{task.denominator}</span>, adik perlu memilih secara tepat <span className="font-extrabold text-[#A67C52]">{task.numerator}</span> bahagian daripada keseluruhan <span className="font-extrabold text-[#3A3A30]">{task.denominator}</span> bahagian yang sedia ada.
            </p>
            <button
              onClick={() => setShowHintModal(false)}
              className="w-full bg-[#5A5A40] hover:bg-[#4A4A33] text-white font-extrabold py-2 rounded-xl text-xs cursor-pointer border border-white/20"
            >
              Faham, Terima Kasih Chef!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
