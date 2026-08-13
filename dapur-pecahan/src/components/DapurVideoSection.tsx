import React, { useState } from 'react';
import { Play, CheckCircle, Lock } from 'lucide-react';

interface VideoItem {
  id: string;
  videoUrl: string;
  title: string;
}

const VIDEOS: VideoItem[] = [
  { id: '1', videoUrl: '/video1.mp4', title: 'Video 1: Asas Pecahan' },
  { id: '2', videoUrl: '/video2.mp4', title: 'Video 2: Pecahan Wajar' },
  { id: '3', videoUrl: '/video3.mp4', title: 'Video 3: Tambah & Tolak Pecahan' },
];

export const DapurVideoSection: React.FC = () => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [completedVideos, setCompletedVideos] = useState<number[]>([]);

  const handleVideoEnded = () => {
    if (!completedVideos.includes(activeVideoIndex)) {
      setCompletedVideos([...completedVideos, activeVideoIndex]);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 p-6 bg-gradient-to-br from-amber-50 to-orange-100 rounded-3xl shadow-xl border-4 border-amber-300">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-extrabold text-amber-900 drop-shadow">
          📺 Tonton Video Pembelajaran
        </h2>
        <p className="text-sm text-amber-800 font-medium">
          Tonton video mengikut urutan untuk membuka video seterusnya!
        </p>
      </div>

      {/* HTML5 Video Player */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-inner mb-6 flex items-center justify-center">
        <video
          key={VIDEOS[activeVideoIndex].id}
          controls
          autoPlay
          className="w-full h-full object-contain"
          onEnded={handleVideoEnded}
          controlsList="nodownload"
        >
          <source src={VIDEOS[activeVideoIndex].videoUrl} type="video/mp4" />
          Pelayar anda tidak menyokong paparan video ini.
        </video>
      </div>

      {/* Pilihan Video Level 1, 2, 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {VIDEOS.map((video, index) => {
          const isUnlocked = index === 0 || completedVideos.includes(index - 1);
          const isCompleted = completedVideos.includes(index);
          const isActive = activeVideoIndex === index;

          return (
            <button
              key={video.id}
              onClick={() => isUnlocked && setActiveVideoIndex(index)}
              disabled={!isUnlocked}
              className={`flex items-center justify-between p-3 rounded-xl border-2 font-bold transition-all duration-200 ${
                isActive
                  ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-105'
                  : isUnlocked
                  ? 'bg-white text-amber-900 border-amber-200 hover:bg-amber-100'
                  : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed opacity-75'
              }`}
            >
              <div className="flex items-center space-x-2 truncate">
                {isUnlocked ? (
                  <Play className={`w-4 h-4 ${isActive ? 'text-white' : 'text-amber-600'}`} />
                ) : (
                  <Lock className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-sm truncate">{video.title}</span>
              </div>

              {isCompleted && (
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 ml-1" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};