import React from 'react';
import { motion } from 'motion/react';
import chefAlyaImg from '../assets/images/chef_alya_avatar_1785314793438.jpg';
import chefAlyaCookingImg from '../assets/images/chef_alya_cooking_1785319699414.jpg';

interface ChefAlyaGuideProps {
  dialogueText: string;
  subTipText?: string;
  badgeTag?: string;
  emotion?: 'happy' | 'thinking' | 'celebrating' | 'cooking';
}

export const ChefAlyaGuide: React.FC<ChefAlyaGuideProps> = ({
  dialogueText,
  subTipText,
  badgeTag = 'Pesanan Chef Alya',
  emotion = 'happy',
}) => {
  const avatarSrc = emotion === 'cooking' ? chefAlyaCookingImg : chefAlyaImg;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row items-center sm:items-start gap-4 bg-[#EFEAE1] p-4 sm:p-5 rounded-2xl border-2 border-[#D6CEBE] shadow-md max-w-4xl mx-auto my-3 relative overflow-hidden"
    >
      {/* Background Decorative Accent */}
      <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-[#A67C52]/10 rounded-full blur-xl pointer-events-none" />

      {/* Chef Alya Avatar Frame */}
      <div className="relative flex-shrink-0">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-4 border-white shadow-md bg-[#D6CEBE] flex items-center justify-center relative">
          <img
            src={avatarSrc}
            alt="Chef Alya Bertudung"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#5A5A40] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-white/30 shadow whitespace-nowrap">
          Chef Alya
        </span>
      </div>

      {/* Dialogue Speech Bubble */}
      <div className="flex-1 text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
          <span className="bg-[#A67C52] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md shadow-xs">
            {badgeTag}
          </span>
          {emotion === 'celebrating' && (
            <span className="bg-[#5A5A40] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md animate-bounce">
              🎉 Tahniah!
            </span>
          )}
        </div>

        <p className="text-[#3A3A30] text-sm sm:text-base font-medium leading-relaxed">
          "{dialogueText}"
        </p>

        {subTipText && (
          <div className="mt-2 text-xs text-[#5A5A40] bg-[#F2E8CF] border border-[#D6CEBE] px-3 py-1.5 rounded-xl font-semibold inline-block">
            💡 <span className="font-bold">Petak DSKP:</span> {subTipText}
          </div>
        )}
      </div>
    </motion.div>
  );
};
