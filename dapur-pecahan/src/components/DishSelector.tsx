import React from 'react';
import { motion } from 'motion/react';
import { Dish, DishId } from '../types';
import { ChefAlyaGuide } from './ChefAlyaGuide';
import kitchenBg from '../assets/images/kitchen_background_1785314809938.jpg';
import { CheckCircle2, Star, Clock, ChefHat, Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';

interface DishSelectorProps {
  dishes: Dish[];
  completedDishes: Record<DishId, boolean>;
  dishScores: Record<DishId, number>;
  onSelectDish: (dishId: DishId) => void;
  onViewDiningTable: () => void;
}

export const DishSelector: React.FC<DishSelectorProps> = ({
  dishes,
  completedDishes,
  dishScores,
  onSelectDish,
  onViewDiningTable,
}) => {
  const completedCount = Object.values(completedDishes).filter(Boolean).length;

  const handlePickDish = (id: DishId) => {
    sounds.playPop();
    onSelectDish(id);
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] pb-12">
      {/* Hero Kitchen Background Header */}
      <div className="relative h-64 sm:h-72 w-full overflow-hidden border-b-4 border-[#5A5A40] shadow-lg">
        <img
          src={kitchenBg}
          alt="Dapur Chef Alya"
          className="w-full h-full object-cover filter brightness-90 contrast-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#3A3A28] via-[#3A3A28]/60 to-transparent flex flex-col justify-end p-6 text-white max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#A67C52] text-white font-bold px-3 py-1 rounded-full text-xs w-max mb-2 shadow border border-white/20">
            <ChefHat className="w-4 h-4 text-[#F2E8CF]" />
            <span>Pilih Hidangan Mewah Dapur</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif italic text-[#F2E8CF] drop-shadow-md">
            Selamat Datang ke Dapur Chef Alya!
          </h2>
          <p className="text-white/90 text-xs sm:text-sm font-medium mt-1 max-w-2xl">
            Sila pilih 1 hidangan mewah yang ingin anda masak terlebih dahulu. Kumpul bahan-bahan menggunakan kemahiran pecahan Matematik Darjah 3!
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-4">
        {/* Chef Alya Guidance */}
        <ChefAlyaGuide
          dialogueText="Hai adik-adik cilik! Chef Alya perlukan bantuan anda untuk menyediakan 4 hidangan istimewa hari ini. Pilih hidangan mana yang adik nak bantu buat dahulu!"
          subTipText="Pecahan mengukur bahagian daripada satu bahan atau kumpulan."
        />

        {/* Completed Dishes Banner Link */}
        {completedCount > 0 && (
          <div className="flex justify-end mb-4">
            <button
              onClick={onViewDiningTable}
              className="flex items-center gap-2 bg-[#5A5A40] hover:bg-[#4A4A33] text-white font-bold px-4 py-2 rounded-xl text-sm shadow-md transition-transform hover:scale-105 cursor-pointer border border-[#A67C52]"
            >
              <Sparkles className="w-4 h-4 text-[#F2E8CF]" />
              <span>Lihat Meja Hidangan Mewah ({completedCount} Siap)</span>
            </button>
          </div>
        )}

        {/* Dish Selection Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {dishes.map((dish) => {
            const isCompleted = completedDishes[dish.id];
            const score = dishScores[dish.id] || 0;

            return (
              <motion.div
                key={dish.id}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className={`relative rounded-3xl overflow-hidden border-2 transition-all shadow-sm flex flex-col justify-between ${
                  isCompleted
                    ? 'bg-[#EFEAE1] border-[#A67C52]'
                    : 'bg-white border-[#D6CEBE] hover:border-[#A67C52]'
                }`}
              >
                {/* Top Badge strip */}
                <div className={`px-5 py-3 flex items-center justify-between text-white bg-gradient-to-r ${dish.accentColor}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl filter drop-shadow">{dish.imageIcon}</span>
                    <span className="font-extrabold text-sm sm:text-base tracking-tight">{dish.title}</span>
                  </div>
                  {isCompleted ? (
                    <span className="bg-[#5A5A40] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow border border-white/20">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#F2E8CF]" /> Siap Masak
                    </span>
                  ) : (
                    <span className="bg-black/20 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                      {dish.difficulty}
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex gap-4 items-start mb-3">
                      {dish.realImage && (
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-[#A67C52] shadow-md flex-shrink-0 bg-[#EFEAE1]">
                          <img
                            src={dish.realImage}
                            alt={dish.title}
                            className="w-full h-full object-cover transition-transform hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-[#3A3A30] font-serif italic">{dish.subtitle}</h3>
                        <p className="text-xs text-[#5A5A50] mt-1 leading-relaxed">
                          {dish.description}
                        </p>
                      </div>
                    </div>

                    {/* Ingredient tasks preview */}
                    <div className="mt-4 bg-[#F7F3ED] p-3 rounded-2xl border border-[#D6CEBE]">
                      <div className="text-[11px] font-extrabold text-[#5A5A40] uppercase tracking-wider mb-2">
                        Bahan & Sukatan Pecahan Dikehendaki:
                      </div>
                      <ul className="space-y-1 text-xs text-[#4A4A40]">
                        {dish.tasks.map((task) => (
                          <li key={task.id} className="flex items-center gap-2">
                            <span className="text-[#A67C52] font-bold">{task.icon}</span>
                            <span className="font-bold text-[#3A3A30]">
                              {task.numerator}/{task.denominator}
                            </span>
                            <span className="text-[#6A6A60]">{task.unit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Footer & Action Button */}
                  <div className="mt-5 pt-3 border-t border-[#EFEAE1] flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-[#7A7A70] font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#A67C52]" /> {dish.estimatedTime}
                      </span>
                      {isCompleted && (
                        <div className="flex items-center text-amber-500 font-bold">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < score ? 'fill-[#A67C52] text-[#A67C52]' : 'text-stone-300'}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handlePickDish(dish.id)}
                      className={`px-5 py-2.5 rounded-2xl font-bold text-xs transition-all shadow-sm flex items-center gap-2 cursor-pointer ${
                        isCompleted
                          ? 'bg-[#EFEAE1] hover:bg-[#D6CEBE] text-[#3A3A30] border border-[#A67C52]'
                          : 'bg-[#5A5A40] hover:bg-[#4A4A33] text-white hover:scale-105 border border-white/10'
                      }`}
                    >
                      <span>{isCompleted ? 'Masak Lagi' : 'Pilih Hidangan Ini'}</span>
                      <span className="text-base">👩‍🍳</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
