import React, { useState } from 'react';
import { Lock, CheckCircle, PlayCircle, X } from 'lucide-react';

interface VideoItem {
  id: string;
  youtubeId: string;
  title: string;
}

const VIDEOS: VideoItem[] = [
  { id: '1', youtubeId: 'xvfHeiVJkj4', title: 'Video 1: Asas Pecahan' },
  { id: '2', youtubeId: '2Ije-NiWzB0', title: 'Video 2: Pecahan Wajar' },
  { id: '3', youtubeId: '4PhWvfaQ5U0', title: 'Video 3: Tambah & Tolak Pecahan' },
];

interface DapurVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DapurVideoModal: React.FC<DapurVideoModalProps> = ({ isOpen, onClose }) => {
  const [activeVideoIndex, setActiveVideoIndex] = useState<number>(0);
  const [unlockedIndex, setUnlockedIndex] = useState<number>(0);
  const [completedVideos, setCompletedVideos] = useState<boolean[]>([false, false, false]);

  if (!isOpen) return null;

  const handleMarkAsCompleted = () => {
    const updatedCompleted = [...completedVideos];
    updatedCompleted[activeVideoIndex] = true;
    setCompletedVideos(updatedCompleted);

    const nextIndex = activeVideoIndex + 1;
    if (nextIndex > unlockedIndex && nextIndex < VIDEOS.length) {
      setUnlockedIndex(nextIndex);
    }
  };

  const isAllCompleted = completedVideos.every(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 p-2"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-amber-800 mb-2 text-center">
          🎬 Tonton Video Pembelajaran Sebelum Masuk Ke Dapur!
        </h2>
        <p className="text-gray-600 text-sm text-center mb-6">
          Sila tonton video dan tekan &quot;Selesai Tonton&quot; untuk membuka video berikutnya.
        </p>

        {/* Player YouTube Iframe Standard */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-inner mb-4">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${VIDEOS[activeVideoIndex].youtubeId}?autoplay=1`}
            title={VIDEOS[activeVideoIndex].title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* Butang Sahkan Selesai Tonton */}
        <div className="text-center mb-6">
          <button
            onClick={handleMarkAsCompleted}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
              completedVideos[activeVideoIndex]
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                : 'bg-amber-500 hover:bg-amber-600 text-white shadow'
            }`}
          >
            {completedVideos[activeVideoIndex] ? '✓ Video Ini Telah Diselesaikan' : 'Tanda Selesai Tonton Video Ini'}
          </button>
        </div>

        {/* Senarai 3 Video */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {VIDEOS.map((video, index) => {
            const isUnlocked = index <= unlockedIndex;
            const isCompleted = completedVideos[index];
            const isActive = index === activeVideoIndex;

            return (
              <button
                key={video.id}
                disabled={!isUnlocked}
                onClick={() => setActiveVideoIndex(index)}
                className={`p-4 rounded-xl border-2 text-left flex items-center justify-between transition-all ${
                  isActive 
                    ? 'border-amber-500 bg-amber-50 shadow-md' 
                    : isUnlocked 
                      ? 'border-gray-200 bg-white hover:border-amber-300' 
                      : 'border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3">
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : isUnlocked ? (
                    <PlayCircle className="w-5 h-5 text-amber-500 shrink-0" />
                  ) : (
                    <Lock className="w-5 h-5 text-gray-400 shrink-0" />
                  )}
                  <span className="font-semibold text-xs md:text-sm text-gray-800">
                    {video.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Butang Terus Ke Dapur */}
        <div className="text-center">
          <button
            onClick={onClose}
            className={`px-8 py-3 rounded-full font-bold text-lg shadow-lg transition-all ${
              isAllCompleted
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white animate-bounce'
                : 'bg-amber-600 hover:bg-amber-700 text-white'
            }`}
          >
            {isAllCompleted ? '🎉 Tahniah! Masuk Ke Dapur Sekarang' : 'Terus Ke Dapur Chef Alya'}
          </button>
        </div>
      </div>
    </div>
  );
};