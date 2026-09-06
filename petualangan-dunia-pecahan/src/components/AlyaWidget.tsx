import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lightbulb, 
  Send, 
  Sparkles, 
  X, 
  MessageCircle, 
  BookOpen,
  Volume2,
  Pause,
  Play,
  Square,
  Eye,
  Ear,
  Hand
} from 'lucide-react';
import { AlyaCharacter } from './AlyaCharacter';
import { 
  AlyaContext, 
  getAlyaHint, 
  answerAlyaQuestion, 
  getIncorrectFeedback,
  detectVisualForAlya,
  FractionVisualData
} from '../utils/alyaEngine';
import { 
  isSpeechSynthesisSupported, 
  speakAlyaExplanation, 
  pauseAlyaSpeech, 
  resumeAlyaSpeech, 
  stopAlyaSpeech 
} from '../utils/speech';
import { playSfx } from '../utils/audio';
import { FormattedMathText } from './MathFraction';
import { FractionVisual } from './FractionVisual';
import { AlyaKinestheticActivity } from './AlyaKinestheticActivity';

interface AlyaWidgetProps {
  soundEnabled: boolean;
  gameContext?: AlyaContext;
}

interface Message {
  id: string;
  sender: 'alya' | 'user';
  text: string;
  hintStep?: 1 | 2 | 3 | 4;
  visualData?: FractionVisualData | null;
}

export const AlyaWidget: React.FC<AlyaWidgetProps> = ({ soundEnabled, gameContext = {} as AlyaContext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hintStep, setHintStep] = useState<1 | 2 | 3 | 4>(1);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alyaMood, setAlyaMood] = useState<'happy' | 'thinking' | 'encouraging' | 'celebrating'>('happy');
  const [activeTab, setActiveTab] = useState<'chat' | 'hint' | 'kinesthetic'>('chat');

  // Visual & Auditory Learning Mode Toggles
  const [visualModeEnabled, setVisualModeEnabled] = useState(true);
  const [auditoryModeEnabled, setAuditoryModeEnabled] = useState(false);

  // Audio Playback State
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [speechStatus, setSpeechStatus] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [speechNotice, setSpeechNotice] = useState<string | null>(null);

  // Initial welcome message
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'alya',
      text: 'Hai! Saya Alya! 🩷 Jom belajar pecahan sama-sama! Ada apa-apa nak tanya Alya?',
      visualData: {
        numerator: 1,
        denominator: 2,
        type: 'pizza',
        caption: 'Pecahan 1/2: 1 daripada 2 bahagian pizza yang sama besar.',
      },
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, activeTab]);

  // Clean up audio on unmount or drawer close
  useEffect(() => {
    return () => {
      stopAlyaSpeech();
    };
  }, []);

  // Stop speech if widget is closed
  useEffect(() => {
    if (!isOpen) {
      stopAlyaSpeech();
      setSpeakingMessageId(null);
      setSpeechStatus('idle');
    }
  }, [isOpen]);

  // Update speech when context or result changes
  useEffect(() => {
    if (gameContext.lastAttemptResult === 'correct') {
      playSfx('correct', soundEnabled);
      setAlyaMood('celebrating');
      const praise = hintStep > 1 
        ? 'Bagus! Kamu berjaya guna hint! 🌟 Hebat!'
        : 'Bagus! Jawapan kamu tepat sekali! 🌟';
      
      const visual = detectVisualForAlya('tahniah', praise, gameContext);
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), sender: 'alya', text: praise, visualData: visual },
      ]);
    } else if (gameContext.lastAttemptResult === 'incorrect') {
      playSfx('wrong', soundEnabled);
      setAlyaMood('encouraging');
      const encouragement = getIncorrectFeedback(gameContext);
      const visual = detectVisualForAlya('cuba lagi', encouragement, gameContext);
      setMessages((prev) => [
        ...prev,
        { 
          id: Date.now().toString(), 
          sender: 'alya', 
          text: encouragement,
          visualData: visual,
        },
      ]);
    }
  }, [gameContext.lastAttemptResult, soundEnabled]);

  // Toggle drawer open/close
  const handleToggleOpen = () => {
    playSfx('pop', soundEnabled);
    setIsOpen((prev) => !prev);
  };

  // Audio Playback Controls
  const handlePlayAudio = (msgId: string, text: string) => {
    if (!isSpeechSynthesisSupported()) {
      setSpeechNotice('Fungsi audio tidak tersedia pada peranti ini.');
      setTimeout(() => setSpeechNotice(null), 4000);
      return;
    }
    setSpeechNotice(null);

    // If currently playing this message -> pause it
    if (speakingMessageId === msgId && speechStatus === 'playing') {
      pauseAlyaSpeech();
      setSpeechStatus('paused');
      return;
    }

    // If currently paused on this message -> resume it
    if (speakingMessageId === msgId && speechStatus === 'paused') {
      resumeAlyaSpeech();
      setSpeechStatus('playing');
      return;
    }

    // Start speaking new text
    stopAlyaSpeech();
    setSpeakingMessageId(msgId);
    setSpeechStatus('playing');

    const started = speakAlyaExplanation({
      text,
      onStart: () => {
        setSpeechStatus('playing');
        setSpeakingMessageId(msgId);
      },
      onEnd: () => {
        setSpeechStatus('idle');
        setSpeakingMessageId(null);
      },
      onError: () => {
        setSpeechStatus('idle');
        setSpeakingMessageId(null);
      },
      onPause: () => setSpeechStatus('paused'),
      onResume: () => setSpeechStatus('playing'),
    });

    if (!started) {
      setSpeechNotice('Fungsi audio tidak tersedia pada peranti ini.');
      setSpeechStatus('idle');
      setSpeakingMessageId(null);
      setTimeout(() => setSpeechNotice(null), 4000);
    }
  };

  const handlePauseAudio = () => {
    pauseAlyaSpeech();
    setSpeechStatus('paused');
  };

  const handleStopAudio = () => {
    stopAlyaSpeech();
    setSpeechStatus('idle');
    setSpeakingMessageId(null);
  };

  // Request Hint Step by Step: HINT 1 -> HINT 2 -> PENERANGAN -> CUBA SEMULA
  const handleGetHint = () => {
    playSfx('pop', soundEnabled);
    setAlyaMood('thinking');
    
    const hintText = getAlyaHint(gameContext, hintStep);
    const visual = detectVisualForAlya(`hint ${hintStep}`, hintText, gameContext);
    
    const newMsgId = Date.now().toString();
    setMessages((prev) => [
      ...prev,
      {
        id: newMsgId,
        sender: 'alya',
        text: hintText,
        hintStep: hintStep,
        visualData: visual,
      },
    ]);

    // Auto-read if auditory mode is active
    if (auditoryModeEnabled) {
      setTimeout(() => {
        handlePlayAudio(newMsgId, hintText);
      }, 400);
    }

    // Advance hint step: 1 -> 2 -> 3 -> 4 -> 1
    setHintStep((prev) => (prev >= 4 ? 1 : ((prev + 1) as 1 | 2 | 3 | 4)));
    
    setTimeout(() => {
      setAlyaMood('happy');
    }, 1200);
  };

  // Send Question to Alya
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    playSfx('pop', soundEnabled);
    setInputText('');
    
    // Append user message
    const userMsgId = Date.now().toString();
    setMessages((prev) => [
      ...prev,
      { id: userMsgId, sender: 'user', text: query },
    ]);

    setIsLoading(true);
    setAlyaMood('thinking');

    try {
      // Call server backend API (/api/chat)
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          currentWorld: gameContext.worldId || 'Hub Utama',
          currentGame: gameContext.currentGame || gameContext.worldId || 'Hub Utama',
          currentStage: gameContext.currentStage || gameContext.challengeName || '',
          currentQuestion: gameContext.currentQuestion || gameContext.questionText || '',
          studentAnswer: gameContext.studentAnswer || '',
          mistakeCount: gameContext.mistakeCount || 0,
          hintCount: hintStep,
          challengeInfo: gameContext,
          hintLevel: hintStep,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.text && !data.fallback) {
          const visual = detectVisualForAlya(query, data.text, gameContext);
          const replyId = (Date.now() + 1).toString();
          setMessages((prev) => [
            ...prev,
            { id: replyId, sender: 'alya', text: data.text, visualData: visual },
          ]);
          setIsLoading(false);
          setAlyaMood('happy');

          if (auditoryModeEnabled) {
            setTimeout(() => {
              handlePlayAudio(replyId, data.text);
            }, 300);
          }
          return;
        }
      }
    } catch {
      // Fallback cleanly to local engine
    }

    // Local fallback response via improved alyaEngine
    setTimeout(() => {
      const alyaReply = answerAlyaQuestion(query, gameContext);
      const visual = detectVisualForAlya(query, alyaReply, gameContext);
      const replyId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        { id: replyId, sender: 'alya', text: alyaReply, visualData: visual },
      ]);
      setIsLoading(false);
      setAlyaMood('happy');

      if (auditoryModeEnabled) {
        setTimeout(() => {
          handlePlayAudio(replyId, alyaReply);
        }, 300);
      }
    }, 400);
  };

  const sampleQuestions = [
    'Apa maksud 1/2?',
    'Apa maksud 1/4?',
    'Kenapa 1/2 lebih besar daripada 1/4?',
    'Apa itu pecahan?',
    'Apa itu pengangka?',
    'Apa itu penyebut?',
    'Macam mana nak cari pecahan setara?',
    'Jawapan soalan ni apa?',
  ];

  return (
    <div className="fixed bottom-[12px] sm:bottom-[16px] md:bottom-[20px] left-[12px] sm:left-[16px] md:left-[20px] right-auto z-[1000] flex flex-col items-start pointer-events-auto select-none">
      {/* Expanded Alya Card / Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 26 }}
            className="mb-3 w-[calc(100vw-2rem)] sm:w-[420px] bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-pink-300 overflow-hidden flex flex-col text-[#4A3728] max-h-[600px]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200 p-3 px-4 flex items-center justify-between border-b-2 border-pink-300">
              <div className="flex items-center gap-2.5">
                <div className="bg-white rounded-2xl p-1 shadow-md border border-pink-200">
                  <AlyaCharacter mood={alyaMood} size="sm" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-serif-title font-extrabold text-base text-[#4A3728]">
                      👧 Alya
                    </h3>
                    <span className="bg-pink-600 text-white text-xs font-rounded font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                      Cikgu Kecil 🩷
                    </span>
                  </div>
                  <p className="text-xs font-rounded font-semibold text-[#4A3728]/80">
                    Kembara Dunia Pecahan
                  </p>
                </div>
              </div>

              {/* Close Drawer Button */}
              <button
                onClick={handleToggleOpen}
                className="p-1.5 rounded-full bg-white/80 hover:bg-white text-[#4A3728] transition cursor-pointer shadow-sm"
                title="Tutup Alya"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Learning Style Toggles: 👀 Lihat & 👂 Dengar & ✋ Cuba */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-gradient-to-r from-pink-50 to-amber-50 border-b border-pink-200">
              <span className="text-[11px] font-bold text-[#4A3728]/80 flex items-center gap-1">
                <span>Mod Pembelajaran:</span>
              </span>
              <div className="flex items-center gap-1.5">
                {/* Visual Toggle: 👀 Lihat */}
                <button
                  id="btn-toggle-lihat"
                  type="button"
                  onClick={() => {
                    playSfx('pop', soundEnabled);
                    setVisualModeEnabled((prev) => !prev);
                  }}
                  className={`px-2 py-1 rounded-full text-[10px] sm:text-[11px] font-bold transition flex items-center gap-1 cursor-pointer border ${
                    visualModeEnabled
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50'
                  }`}
                  title="Paparkan Visual Pembelajaran Pecahan"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>👀 Lihat</span>
                  {visualModeEnabled && <span className="text-[9px]">✓</span>}
                </button>

                {/* Audio Toggle: 👂 Dengar */}
                <button
                  id="btn-toggle-dengar"
                  type="button"
                  onClick={() => {
                    playSfx('pop', soundEnabled);
                    setAuditoryModeEnabled((prev) => !prev);
                  }}
                  className={`px-2 py-1 rounded-full text-[10px] sm:text-[11px] font-bold transition flex items-center gap-1 cursor-pointer border ${
                    auditoryModeEnabled
                      ? 'bg-purple-600 text-white border-purple-700 shadow-xs'
                      : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50'
                  }`}
                  title="Aktifkan Mod Audio Dengar"
                >
                  <Ear className="w-3.5 h-3.5" />
                  <span>👂 Dengar</span>
                  {auditoryModeEnabled && <span className="text-[9px]">✓</span>}
                </button>

                {/* Kinesthetic Action: ✋ Cuba */}
                <button
                  id="btn-toggle-cuba"
                  type="button"
                  onClick={() => {
                    playSfx('pop', soundEnabled);
                    setActiveTab('kinesthetic');
                  }}
                  className={`px-2 py-1 rounded-full text-[10px] sm:text-[11px] font-bold transition flex items-center gap-1 cursor-pointer border ${
                    activeTab === 'kinesthetic'
                      ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                      : 'bg-white text-rose-700 border-rose-300 hover:bg-rose-50'
                  }`}
                  title="Aktiviti Kinestetik: Belajar Sambil Buat"
                >
                  <Hand className="w-3.5 h-3.5" />
                  <span>✋ Cuba</span>
                  {activeTab === 'kinesthetic' && <span className="text-[9px]">✓</span>}
                </button>
              </div>
            </div>

            {/* Speech Notice (If speech is unsupported or active error) */}
            {speechNotice && (
              <div className="bg-amber-100 text-amber-900 px-3 py-1.5 text-xs font-semibold flex items-center justify-between border-b border-amber-300">
                <span>⚠️ {speechNotice}</span>
                <button onClick={() => setSpeechNotice(null)} className="text-amber-700 cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Active Audio Bar (If speaking or paused) */}
            {speakingMessageId && (
              <div className="bg-purple-100/90 border-b border-purple-200 px-3 py-1.5 flex items-center justify-between text-xs text-purple-900 font-bold">
                <span className="flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-purple-700 animate-bounce" />
                  <span>
                    {speechStatus === 'playing'
                      ? 'Alya sedang membaca... 🎙️'
                      : 'Audio dijeda ⏸️'}
                  </span>
                </span>
                <div className="flex items-center gap-1">
                  {speechStatus === 'playing' ? (
                    <button
                      onClick={handlePauseAudio}
                      className="px-2 py-0.5 rounded bg-purple-200 hover:bg-purple-300 text-purple-900 text-[10px] cursor-pointer"
                    >
                      ⏸️ Jeda
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (speakingMessageId) {
                          const msg = messages.find((m) => m.id === speakingMessageId);
                          if (msg) handlePlayAudio(msg.id, msg.text);
                        }
                      }}
                      className="px-2 py-0.5 rounded bg-purple-200 hover:bg-purple-300 text-purple-900 text-[10px] cursor-pointer"
                    >
                      ▶️ Sambung
                    </button>
                  )}
                  <button
                    onClick={handleStopAudio}
                    className="px-2 py-0.5 rounded bg-rose-200 hover:bg-rose-300 text-rose-900 text-[10px] cursor-pointer"
                  >
                    ⏹️ Berhenti
                  </button>
                </div>
              </div>
            )}

            {/* Mode Switch Tabs: 💬 Tanya, 💡 Hint, ✋ Cuba Sekarang */}
            <div className="flex border-b border-pink-200 bg-[#FFF8E8] p-1 gap-1">
              <button
                id="btn-tab-tanya-alya"
                onClick={() => {
                  playSfx('pop', soundEnabled);
                  setActiveTab('chat');
                }}
                className={`flex-1 py-1.5 px-2 rounded-xl font-rounded font-extrabold text-[11px] sm:text-xs flex items-center justify-center gap-1 transition cursor-pointer ${
                  activeTab === 'chat'
                    ? 'bg-pink-500 text-white shadow-sm'
                    : 'text-[#4A3728] hover:bg-pink-100'
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>💬 Tanya</span>
              </button>
              <button
                id="btn-tab-dapatkan-hint"
                onClick={() => {
                  playSfx('pop', soundEnabled);
                  setActiveTab('hint');
                }}
                className={`flex-1 py-1.5 px-2 rounded-xl font-rounded font-extrabold text-[11px] sm:text-xs flex items-center justify-center gap-1 transition cursor-pointer ${
                  activeTab === 'hint'
                    ? 'bg-amber-400 text-[#4A3728] shadow-sm'
                    : 'text-amber-800 hover:bg-amber-100'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>💡 Hint</span>
              </button>
              <button
                id="btn-tab-cuba-sekarang"
                onClick={() => {
                  playSfx('pop', soundEnabled);
                  setActiveTab('kinesthetic');
                }}
                className={`flex-1 py-1.5 px-2 rounded-xl font-rounded font-extrabold text-[11px] sm:text-xs flex items-center justify-center gap-1 transition cursor-pointer ${
                  activeTab === 'kinesthetic'
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-sm'
                    : 'text-rose-700 hover:bg-rose-100 bg-rose-50/50'
                }`}
              >
                <Hand className="w-3.5 h-3.5" />
                <span>✋ Cuba Sekarang</span>
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2.5 min-h-[220px] max-h-[380px]">
              {activeTab === 'hint' ? (
                /* HINT TAB */
                <div className="space-y-2.5">
                  {/* Context Info Badge */}
                  <div className="p-2 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="text-xs font-rounded font-bold text-amber-900">
                      Konteks Permainan:{' '}
                      <span className="text-amber-700">
                        {gameContext.challengeName || gameContext.currentGame || 'Asas Pecahan'}
                      </span>
                    </span>
                  </div>

                  {/* Kinesthetic Callout in Hint */}
                  <div className="p-2 rounded-2xl bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200 flex items-center justify-between gap-2 shadow-2xs">
                    <span className="text-[11px] font-bold text-[#4A3728]">
                      Alya: “Sekarang kamu cuba sendiri.”
                    </span>
                    <button
                      id="btn-cuba-sekarang-hint-callout"
                      type="button"
                      onClick={() => {
                        playSfx('pop', soundEnabled);
                        setActiveTab('kinesthetic');
                      }}
                      className="py-1 px-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-[10px] shadow-xs flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Hand className="w-3 h-3" />
                      <span>✋ Cuba Sekarang</span>
                    </button>
                  </div>

                  {/* Action Request Hint Button */}
                  <motion.button
                    id="btn-dapatkan-hint-action"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGetHint}
                    className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-[#4A3728] font-rounded font-extrabold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer border-b-4 border-amber-600"
                  >
                    <Lightbulb className="w-4 h-4 fill-amber-100 text-amber-800" />
                    <span>💡 Dapatkan Hint (Tahap {hintStep}/4)</span>
                  </motion.button>

                  {/* 4-Step Level Indicators */}
                  <div className="grid grid-cols-4 gap-1 text-center">
                    <div
                      className={`p-1 rounded-xl border text-[9px] font-bold ${
                        hintStep === 1
                          ? 'bg-emerald-100 border-emerald-400 text-emerald-800 ring-2 ring-emerald-300'
                          : 'bg-gray-50 border-gray-200 text-gray-400'
                      }`}
                    >
                      💡 Hint 1<br />
                      <span className="font-normal text-[8px]">Fikir</span>
                    </div>
                    <div
                      className={`p-1 rounded-xl border text-[9px] font-bold ${
                        hintStep === 2
                          ? 'bg-yellow-100 border-yellow-400 text-yellow-800 ring-2 ring-yellow-300'
                          : 'bg-gray-50 border-gray-200 text-gray-400'
                      }`}
                    >
                      💡 Hint 2<br />
                      <span className="font-normal text-[8px]">Langkah</span>
                    </div>
                    <div
                      className={`p-1 rounded-xl border text-[9px] font-bold ${
                        hintStep === 3
                          ? 'bg-orange-100 border-orange-400 text-orange-800 ring-2 ring-orange-300'
                          : 'bg-gray-50 border-gray-200 text-gray-400'
                      }`}
                    >
                      🧠 Konsep<br />
                      <span className="font-normal text-[8px]">Faham</span>
                    </div>
                    <div
                      className={`p-1 rounded-xl border text-[9px] font-bold ${
                        hintStep === 4
                          ? 'bg-pink-100 border-pink-400 text-pink-800 ring-2 ring-pink-300'
                          : 'bg-gray-50 border-gray-200 text-gray-400'
                      }`}
                    >
                      🔄 Cuba<br />
                      <span className="font-normal text-[8px]">Semula</span>
                    </div>
                  </div>

                  {/* Messages Feed for Hints */}
                  <div className="space-y-2 mt-2">
                    {messages.map((m) => {
                      const isAlya = m.sender === 'alya';
                      const isSpeakingThis = speakingMessageId === m.id;
                      return (
                        <div
                          key={m.id}
                          className={`flex flex-col ${isAlya ? 'items-start' : 'items-end'}`}
                        >
                          <div className={`flex gap-2 max-w-[92%] ${isAlya ? 'justify-start' : 'justify-end'}`}>
                            {isAlya && (
                              <div className="w-7 h-7 rounded-full bg-pink-100 border border-pink-300 flex items-center justify-center shrink-0">
                                👧
                              </div>
                            )}
                            <div
                              className={`p-3 rounded-2xl text-xs font-rounded font-medium leading-relaxed shadow-sm ${
                                isAlya
                                  ? 'bg-[#FFF8E8] text-[#4A3728] border border-amber-200 rounded-bl-none'
                                  : 'bg-pink-500 text-white rounded-br-none'
                              }`}
                            >
                              {m.hintStep && (
                                <span className="inline-block px-2 py-0.5 mb-1.5 rounded-full bg-amber-200 text-amber-900 font-bold text-[10px]">
                                  💡 TAHAP {m.hintStep}
                                </span>
                              )}
                              <div className="whitespace-pre-line">
                                <FormattedMathText text={m.text} size="xs" />
                              </div>

                              {/* Visual in Hint */}
                              {isAlya && visualModeEnabled && m.visualData && (
                                <div className="mt-2.5 pt-2 border-t border-amber-200">
                                  <FractionVisual
                                    numerator={m.visualData.numerator}
                                    denominator={m.visualData.denominator}
                                    type={m.visualData.type || 'bar'}
                                    comparison={m.visualData.comparison}
                                    comparisonTitle={m.visualData.comparisonTitle}
                                    caption={m.visualData.caption}
                                    allowTypeSwitch={true}
                                    size="sm"
                                  />
                                </div>
                              )}

                              {/* Audio button in Hint */}
                              {isAlya && (
                                <div className="mt-2 pt-2 border-t border-amber-200/60 flex flex-wrap items-center justify-between gap-1.5">
                                  <button
                                    id={`btn-listen-hint-${m.id}`}
                                    onClick={() => handlePlayAudio(m.id, m.text)}
                                    className={`py-1 px-2.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs ${
                                      isSpeakingThis && speechStatus === 'playing'
                                        ? 'bg-purple-600 text-white animate-pulse'
                                        : isSpeakingThis && speechStatus === 'paused'
                                        ? 'bg-amber-500 text-white'
                                        : 'bg-white hover:bg-pink-50 text-pink-700 border border-pink-300'
                                    }`}
                                  >
                                    {isSpeakingThis && speechStatus === 'playing' ? (
                                      <>
                                        <Pause className="w-3.5 h-3.5 fill-current" />
                                        <span>⏸️ Jeda</span>
                                      </>
                                    ) : isSpeakingThis && speechStatus === 'paused' ? (
                                      <>
                                        <Play className="w-3.5 h-3.5 fill-current" />
                                        <span>▶️ Sambung</span>
                                      </>
                                    ) : (
                                      <>
                                        <Volume2 className="w-3.5 h-3.5" />
                                        <span>🔊 Dengar Penjelasan</span>
                                      </>
                                    )}
                                  </button>

                                  {isSpeakingThis && (
                                    <button
                                      onClick={handleStopAudio}
                                      className="p-1 px-2 rounded-xl text-[10px] font-bold bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 flex items-center gap-1 cursor-pointer"
                                    >
                                      <Square className="w-2.5 h-2.5 fill-current" />
                                      <span>⏹️ Berhenti</span>
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : activeTab === 'kinesthetic' ? (
                /* KINESTHETIC TAB */
                <AlyaKinestheticActivity
                  soundEnabled={soundEnabled}
                  auditoryModeEnabled={auditoryModeEnabled}
                  onActivityComplete={() => {
                    setAlyaMood('celebrating');
                  }}
                />
              ) : (
                /* CHAT TAB */
                <div className="space-y-2.5">
                  {/* Kinesthetic Prompt Banner in Chat */}
                  <div className="p-2.5 rounded-2xl bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 flex items-center justify-between gap-2 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-xs text-[#4A3728] font-bold">
                      <Hand className="w-4 h-4 text-rose-500 shrink-0" />
                      <span className="text-[11px]">Alya: “Sekarang kamu cuba sendiri.”</span>
                    </div>
                    <button
                      id="btn-cuba-sekarang-chat-callout"
                      type="button"
                      onClick={() => {
                        playSfx('pop', soundEnabled);
                        setActiveTab('kinesthetic');
                      }}
                      className="py-1 px-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-[10px] shadow-xs flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <span>✋ Cuba Sekarang</span>
                    </button>
                  </div>

                  {/* Chat Messages */}
                  <div className="space-y-2">
                    {messages.map((m) => {
                      const isAlya = m.sender === 'alya';
                      const isSpeakingThis = speakingMessageId === m.id;
                      return (
                        <div
                          key={m.id}
                          className={`flex flex-col ${isAlya ? 'items-start' : 'items-end'}`}
                        >
                          <div className={`flex gap-2 max-w-[92%] ${isAlya ? 'justify-start' : 'justify-end'}`}>
                            {isAlya && (
                              <div className="w-7 h-7 rounded-full bg-pink-100 border border-pink-300 flex items-center justify-center shrink-0">
                                👧
                              </div>
                            )}
                            <div
                              className={`p-3 rounded-2xl text-sm sm:text-base font-rounded font-medium leading-relaxed shadow-sm ${
                                isAlya
                                  ? 'bg-[#FFF8E8] text-[#4A3728] border border-pink-200 rounded-bl-none'
                                  : 'bg-pink-500 text-white rounded-br-none'
                              }`}
                            >
                              <div className="whitespace-pre-line">
                                <FormattedMathText text={m.text} size="sm" />
                              </div>

                              {/* Visual in Chat */}
                              {isAlya && visualModeEnabled && m.visualData && (
                                <div className="mt-2.5 pt-2 border-t border-pink-200">
                                  <FractionVisual
                                    numerator={m.visualData.numerator}
                                    denominator={m.visualData.denominator}
                                    type={m.visualData.type || 'bar'}
                                    comparison={m.visualData.comparison}
                                    comparisonTitle={m.visualData.comparisonTitle}
                                    caption={m.visualData.caption}
                                    allowTypeSwitch={true}
                                    size="sm"
                                  />
                                </div>
                              )}

                              {/* Audio button in Chat */}
                              {isAlya && (
                                <div className="mt-2 pt-2 border-t border-pink-200/60 flex flex-wrap items-center justify-between gap-1.5">
                                  <button
                                    id={`btn-listen-${m.id}`}
                                    onClick={() => handlePlayAudio(m.id, m.text)}
                                    className={`py-1 px-2.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs ${
                                      isSpeakingThis && speechStatus === 'playing'
                                        ? 'bg-purple-600 text-white animate-pulse'
                                        : isSpeakingThis && speechStatus === 'paused'
                                        ? 'bg-amber-500 text-white'
                                        : 'bg-white hover:bg-pink-50 text-pink-700 border border-pink-300'
                                    }`}
                                  >
                                    {isSpeakingThis && speechStatus === 'playing' ? (
                                      <>
                                        <Pause className="w-3.5 h-3.5 fill-current" />
                                        <span>⏸️ Jeda</span>
                                      </>
                                    ) : isSpeakingThis && speechStatus === 'paused' ? (
                                      <>
                                        <Play className="w-3.5 h-3.5 fill-current" />
                                        <span>▶️ Sambung</span>
                                      </>
                                    ) : (
                                      <>
                                        <Volume2 className="w-3.5 h-3.5" />
                                        <span>🔊 Dengar Penjelasan</span>
                                      </>
                                    )}
                                  </button>

                                  {isSpeakingThis && (
                                    <button
                                      onClick={handleStopAudio}
                                      className="p-1 px-2 rounded-xl text-[10px] font-bold bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 flex items-center gap-1 cursor-pointer"
                                    >
                                      <Square className="w-2.5 h-2.5 fill-current" />
                                      <span>⏹️ Berhenti</span>
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {isLoading && (
                      <div className="flex gap-2 items-center text-xs text-pink-700 italic">
                        <span>👧 Alya sedang berfikir... 🩷</span>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Sample Question Chips */}
                  <div className="pt-2 border-t border-pink-100">
                    <span className="text-[10px] font-bold text-gray-500 block mb-1">
                      💡 Cadangan Soalan (Visual & Audio):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {sampleQuestions.map((sq, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(sq)}
                          className="text-[10px] bg-pink-50 hover:bg-pink-100 text-pink-900 px-2 py-1 rounded-full transition cursor-pointer font-medium border border-pink-200"
                        >
                          {sq}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input Bar (Available in 💬 Tanya Alya tab) */}
            {activeTab === 'chat' && (
              <div className="p-2.5 bg-[#FFF8E8] border-t border-pink-200 flex items-center gap-2">
                <input
                  id="input-tanya-alya"
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Tanya Alya tentang pecahan... 🩷"
                  className="flex-1 bg-white border border-pink-300 rounded-xl px-3 py-2 text-xs font-rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
                <button
                  id="btn-hantar-soalan-alya"
                  onClick={() => handleSendMessage()}
                  className="p-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl transition cursor-pointer shadow-sm"
                  title="Hantar Soalan"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Alya Mascot Trigger Button */}
      <motion.button
        data-alya="alya-button"
        id="alya-floating-mascot-button"
        whileHover={{ scale: 1.08, rotate: 2 }}
        whileTap={{ scale: 0.92 }}
        onClick={handleToggleOpen}
        className="relative bg-gradient-to-tr from-pink-400 via-rose-300 to-amber-200 p-2 sm:p-2.5 rounded-3xl shadow-xl border-2 border-white ring-4 ring-pink-400/40 flex items-center justify-center cursor-pointer group"
      >
        <AlyaCharacter mood={alyaMood} size="md" />

        {/* Floating Speech Badge */}
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="absolute -top-11 left-6 sm:left-8 bg-white/95 backdrop-blur-sm text-[#4A3728] text-[11px] font-rounded font-extrabold px-3 py-1.5 rounded-2xl rounded-bl-none shadow-lg border-2 border-pink-300 flex items-center gap-1.5 max-w-[220px] whitespace-normal leading-tight z-10"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-500 shrink-0 animate-pulse" />
            <span>👋 Hai! Saya Alya! 🩷</span>
          </motion.div>
        )}

        {/* Name Tag overlay */}
        <span className="absolute -bottom-2 bg-[#4A3728] text-[#FFF8E8] text-[10px] font-rounded font-extrabold px-2 py-0.5 rounded-full border border-white shadow-sm flex items-center gap-1">
          <span>👧 Alya</span>
        </span>
      </motion.button>
    </div>
  );
};

