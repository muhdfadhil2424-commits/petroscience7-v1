import React, { useState } from 'react';
import { Lock, CheckCircle, PlayCircle } from 'lucide-react';

interface VideoItem {
  id: string;
  youtubeId: string;
  title: string;
}

// 📌 3 Video YouTube mengikut pautan yang diberikan
const VIDEOS: VideoItem[] = [
  { id: '1', youtubeId: 'xvfHeiVJkj4', title: 'Video 1: Asas Pecahan' },
  { id: '2', youtubeId: '2Ije-NiWzB0', title: 'Video 2: Pecahan Wajar' },
  { id: '3', youtubeId: '4PhWvfaQ5U0', title: 'Video 3: Tambah & Tolak Pecahan' },
];

export const DapurVideoSection: React.FC = () => {
  const [activeVideoIndex, setActiveVideoIndex] = useState<number>(0);
  const [unlockedIndex, setUnlockedIndex] = useState<number>(0);
  const [completedVideos, setCompletedVideos] = useState<boolean[]>([false, false, false]);

  const handleMarkAsCompleted = () => {
    // Tanda video semasa sebagai selesai
    const updatedCompleted = [...completedVideos];
    updatedCompleted[activeVideoIndex] = true;
    setCompletedVideos(updatedCompleted);

    // Buka kunci video seterusnya
    const nextIndex = activeVideoIndex + 1;
    if (nextIndex > unlockedIndex && nextIndex < VIDEOS.length) {
      setUnlockedIndex(nextIndex);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-amber-200 mb-8 max-w-5xl mx-auto">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-amber-800 flex items-center justify-center gap-2">
          🎬 Video Pembelajaran Dapur Pecahan
        </h2>
        <p className="text-gray-600 text-sm">
          Sila tonton video mengikut urutan. Selesaikan Video 1 untuk membuka Video 2 dan seterusnya!
        </p>
      </div>

      {/* Skrin Player YouTube */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-inner mb-4">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${VIDEOS[activeVideoIndex].youtubeId}`}
          title={VIDEOS[activeVideoIndex].title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      {/* Butang Selesai Tonton */}
      <div className="text-center mb-6">
        <button
          onClick={handleMarkAsCompleted}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow ${
            completedVideos[activeVideoIndex]
              ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
              : 'bg-amber-500 hover:bg-amber-600 text-white'
          }`}
        >
          {completedVideos[activeVideoIndex] ? '✓ Video Ini Telah Diselesaikan' : 'Tanda Selesai Tonton Video Ini'}
        </button>
      </div>

      {/* Senarai 3 Kad Video (Kunci & Buka) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {VIDEOS.map((video, index) => {
          const isUnlocked = index <= unlockedIndex;
          const isCompleted = completedVideos[index];
          const isActive = index === activeVideoIndex;

          return (
            <button
              key={video.id}
              disabled={!isUnlocked}
              onClick={() => setActiveVideoIndex(index)}
              className={`p-3.5 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
                isActive 
                  ? 'border-amber-500 bg-amber-50 shadow-md ring-2 ring-amber-300' 
                  : isUnlocked 
                    ? 'border-gray-200 bg-white hover:border-amber-300 cursor-pointer' 
                    : 'border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-2.5">
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
    </div>
  );
};