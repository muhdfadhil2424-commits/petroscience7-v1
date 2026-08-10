import React from 'react';
import { motion } from 'motion/react';
import { Dish, DishId } from '../types';
import { ArrowLeft, Award, Sparkles, Star, Utensils } from 'lucide-react';
import { sounds } from '../utils/audio';

interface DiningTableProps {
  dishes: Dish[];
  completedDishes: Record<DishId, boolean>;
  onBackToMenu: () => void;
  onOpenCertificate: () => void;
}

export const DiningTable: React.FC<DiningTableProps> = ({
  dishes,
  completedDishes,
  onBackToMenu,
  onOpenCertificate,
}) => {
  const completedList = dishes.filter((d) => completedDishes[d.id]);
  const allCompleted = completedList.length === dishes.length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBackToMenu}
          className="flex items-center gap-1.5 bg-[#EFEAE1] hover:bg-[#D6CEBE] text-[#3A3A30] font-bold px-4 py-2 rounded-xl text-xs border border-[#A67C52] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#A67C52]" />
          <span>Kembali ke Dapur</span>
        </button>

        <div className="flex items-center gap-2 bg-[#5A5A40] text-white font-bold px-4 py-2 rounded-full text-xs shadow border border-white/20">
          <Utensils className="w-4 h-4 text-[#F2E8CF]" />
          <span>Meja Hidangan Mewah Chef Alya</span>
        </div>
      </div>

      {/* Banner */}
      <div className="bg-[#5A5A40] text-white p-6 sm:p-8 rounded-3xl border-4 border-[#A67C52] shadow-xl text-center relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-[#F2E8CF]/10 rounded-full blur-2xl pointer-events-none" />
        <h2 className="text-2xl sm:text-4xl font-serif italic text-[#F2E8CF] mb-2 drop-shadow">
          🍽️ Meja Santapan Mewah
        </h2>
        <p className="text-white/90 text-xs sm:text-sm max-w-xl mx-auto font-medium">
          Saksikan hidangan-hidangan istimewa yang disiapkan melalui sukatan pecahan Matematik Darjah 3 bersama Chef Alya!
        </p>

        {/* Certificate Callout if all 4 completed */}
        {allCompleted && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mt-6 inline-flex flex-col sm:flex-row items-center gap-3 bg-[#A67C52] text-white p-4 rounded-2xl border-2 border-white/30 shadow-lg"
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              <Award className="w-6 h-6 text-[#F2E8CF]" />
              <span>Tahniah! Semua 4 Hidangan Mewah Berjaya Disiapkan!</span>
            </div>
            <button
              onClick={() => {
                sounds.playSuccess();
                onOpenCertificate();
              }}
              className="bg-[#5A5A40] hover:bg-[#4A4A33] text-white font-bold px-4 py-2 rounded-xl text-xs shadow cursor-pointer transition-transform hover:scale-105 border border-white/20"
            >
              Tebus Sijil Master Chef Cilik
            </button>
          </motion.div>
        )}
      </div>

      {/* Grid of Dishes Served */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dishes.map((dish) => {
          const isDone = completedDishes[dish.id];

          return (
            <div
              key={dish.id}
              className={`rounded-3xl p-6 border-2 transition-all shadow-sm flex flex-col justify-between ${
                isDone
                  ? 'bg-[#EFEAE1] border-[#A67C52]'
                  : 'bg-white border-dashed border-[#D6CEBE] opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {dish.realImage ? (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-[#A67C52] shadow-md flex-shrink-0 bg-white">
                        <img
                          src={dish.realImage}
                          alt={dish.title}
                          className={`w-full h-full object-cover ${!isDone ? 'filter grayscale opacity-40' : ''}`}
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : (
                      <span className="text-3xl p-2 bg-white rounded-2xl shadow-xs border border-[#D6CEBE]">
                        {dish.imageIcon}
                      </span>
                    )}
                    <div>
                      <h3 className="font-serif italic font-bold text-[#3A3A30] text-base">{dish.title}</h3>
                      <span className="text-xs text-[#A67C52] font-bold">{dish.subtitle}</span>
                    </div>
                  </div>
                  {isDone ? (
                    <span className="bg-[#5A5A40] text-white font-bold text-xs px-3 py-1 rounded-full border border-white/20 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#F2E8CF]" />
                      Hidangan Sedia
                    </span>
                  ) : (
                    <span className="bg-[#D6CEBE] text-[#5A5A50] font-bold text-xs px-3 py-1 rounded-full">
                      Belum Dimasak
                    </span>
                  )}
                </div>

                {/* Fraction Ingredients Recap */}
                <div className="bg-white/80 p-4 rounded-2xl border border-[#D6CEBE] text-xs space-y-1.5 my-3">
                  <div className="font-bold text-[#5A5A40] mb-1">Sukatan Pecahan Terpakai:</div>
                  {dish.tasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between text-[#4A4A40]">
                      <span className="font-semibold">{task.icon} {task.name}:</span>
                      <span className="font-bold text-[#A67C52] bg-[#F7F3ED] px-2 py-0.5 rounded border border-[#D6CEBE]">
                        {task.numerator}/{task.denominator} {task.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-[#D6CEBE] flex items-center justify-between text-xs">
                {isDone ? (
                  <div className="flex items-center gap-1 text-[#A67C52] font-bold">
                    <Star className="w-4 h-4 fill-[#A67C52]" />
                    <Star className="w-4 h-4 fill-[#A67C52]" />
                    <Star className="w-4 h-4 fill-[#A67C52]" />
                    <span className="text-[#5A5A50] ml-1">3/3 Bintang Kecemerlangan</span>
                  </div>
                ) : (
                  <span className="text-[#7A7A70]">Sila pilih hidangan ini di menu dapur untuk mula memasak.</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
