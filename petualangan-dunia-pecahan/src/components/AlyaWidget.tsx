import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lightbulb, 
  Send, 
  Sparkles, 
  X, 
  MessageCircle, 
  HelpCircle, 
  RefreshCw, 
  ChevronRight,
  BookOpen,
  Award
} from 'lucide-react';
import { AlyaCharacter } from './AlyaCharacter';
import { AlyaContext, getAlyaHint, answerAlyaQuestion } from '../utils/alyaEngine';
import { playSfx } from '../utils/audio';
import { FormattedMathText } from './MathFraction';

interface AlyaWidgetProps {
  soundEnabled: boolean;
  gameContext?: AlyaContext;
}

interface Message {
  id: string;
  sender: 'alya' | 'user';
  text: string;
  hintLevel?: 1 | 2 | 3;
}

export const AlyaWidget: React.FC<AlyaWidgetProps> = ({ soundEnabled, gameContext = {} as AlyaContext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hintLevel, setHintLevel] = useState<1 | 2 | 3>(1);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alyaMood, setAlyaMood] = useState<'happy' | 'thinking' | 'encouraging' | 'celebrating'>('happy');
  const [activeTab, setActiveTab] = useState<'hint' | 'chat'>('hint');

  // Initial welcome message
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'alya',
      text: 'Hai! Saya Alya, Pembantu Pecahan kamu! 👧✨ Ada soalan tentang pecahan atau perlukan petunjuk?',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, activeTab]);

  // Update speech when context or result changes
  useEffect(() => {
    if (gameContext.lastAttemptResult === 'correct') {
      playSfx('correct', soundEnabled);
      setAlyaMood('celebrating');
      const praise = hintLevel > 1 
        ? 'Hebat! Awak berjaya menggunakan petunjuk dengan baik! ⭐'
        : 'Wow! Awak berjaya sendiri! 🌟 Jawapan awak tepat sekali!';
      
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), sender: 'alya', text: praise },
      ]);
    } else if (gameContext.lastAttemptResult === 'incorrect') {
      playSfx('wrong', soundEnabled);
      setAlyaMood('encouraging');
      setMessages((prev) => [
        ...prev,
        { 
          id: Date.now().toString(), 
          sender: 'alya', 
          text: 'Tak mengapa! Mari kita cuba sekali lagi. 😊 Boleh tekan butang 💡 Petunjuk jika mahu bantuan Alya!' 
        },
      ]);
    }
  }, [gameContext.lastAttemptResult, soundEnabled]);

  // Toggle drawer open/close
  const handleToggleOpen = () => {
    playSfx('pop', soundEnabled);
    setIsOpen((prev) => !prev);
  };

  // Request Hint Step by Step
  const handleGetHint = () => {
    playSfx('pop', soundEnabled);
    setAlyaMood('thinking');
    
    const hintText = getAlyaHint(gameContext, hintLevel);
    
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'alya',
        text: hintText,
        hintLevel: hintLevel,
      },
    ]);

    // Advance hint level (1 -> 2 -> 3 -> 1)
    setHintLevel((prev) => (prev >= 3 ? 1 : ((prev + 1) as 1 | 2 | 3)));
    
    setTimeout(() => {
      setAlyaMood('happy');
    }, 1500);
  };

  // Send Custom Question to Alya
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
          challengeInfo: gameContext,
          hintLevel: hintLevel,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.text && !data.fallback) {
          setMessages((prev) => [
            ...prev,
            { id: (Date.now() + 1).toString(), sender: 'alya', text: data.text },
          ]);
          setIsLoading(false);
          setAlyaMood('happy');
          return;
        }
      }
    } catch {
      // Ignore API error and fallback to local engine
    }

    // Local fallback response via alyaEngine
    setTimeout(() => {
      const alyaReply = answerAlyaQuestion(query, gameContext);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), sender: 'alya', text: alyaReply },
      ]);
      setIsLoading(false);
      setAlyaMood('happy');
    }, 500);
  };

  const sampleQuestions = [
    'Apa itu pecahan?',
    'Apa itu pecahan wajar?',
    'Adakah 1/2 sama dengan 2/4?',
    'Bagaimana nak tambah 1/4 + 2/4?',
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
            className="mb-3 w-[calc(100vw-2rem)] sm:w-96 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-amber-300 overflow-hidden flex flex-col text-[#4A3728] max-h-[500px]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200 p-3.5 px-4 flex items-center justify-between border-b-2 border-amber-300">
              <div className="flex items-center gap-3">
                <div className="bg-white rounded-2xl p-1 shadow-md border border-amber-200">
                  <AlyaCharacter mood={alyaMood} size="sm" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-serif-title font-extrabold text-base text-[#4A3728]">
                      👧 Alya
                    </h3>
                    <span className="bg-emerald-500 text-white text-[10px] font-rounded font-bold px-1.5 py-0.5 rounded-full">
                      Tutor AI
                    </span>
                  </div>
                  <p className="text-xs font-rounded font-semibold text-[#4A3728]/80">
                    Pembantu Pecahan Tahun 3
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

            {/* Mode Switch Tabs */}
            <div className="flex border-b border-amber-200 bg-[#FFF8E8] p-1 gap-1">
              <button
                onClick={() => {
                  playSfx('pop', soundEnabled);
                  setActiveTab('hint');
                }}
                className={`flex-1 py-1.5 px-3 rounded-xl font-rounded font-extrabold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  activeTab === 'hint'
                    ? 'bg-amber-400 text-[#4A3728] shadow-sm'
                    : 'text-amber-800 hover:bg-amber-100'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Minta Petunjuk</span>
              </button>
              <button
                onClick={() => {
                  playSfx('pop', soundEnabled);
                  setActiveTab('chat');
                }}
                className={`flex-1 py-1.5 px-3 rounded-xl font-rounded font-extrabold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  activeTab === 'chat'
                    ? 'bg-amber-400 text-[#4A3728] shadow-sm'
                    : 'text-amber-800 hover:bg-amber-100'
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Tanya Alya</span>
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-3.5 overflow-y-auto space-y-3 min-h-[220px] max-h-[300px]">
              {activeTab === 'hint' ? (
                /* HINT TAB */
                <div className="space-y-3">
                  {/* Context Info Badge */}
                  <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="text-xs font-rounded font-bold text-amber-900">
                      Soalan Semasa:{' '}
                      <span className="text-amber-700">
                        {gameContext.challengeName || 'Pecahan Asas'}
                      </span>
                    </span>
                  </div>

                  {/* Action Request Hint Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGetHint}
                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-[#4A3728] font-rounded font-extrabold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer border-b-4 border-amber-600"
                  >
                    <Lightbulb className="w-4 h-4 fill-amber-100 text-amber-800" />
                    <span>💡 Minta Petunjuk ({hintLevel}/3)</span>
                  </motion.button>

                  {/* Level Indicators */}
                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    <div
                      className={`p-1.5 rounded-xl border text-[10px] font-bold ${
                        hintLevel === 1
                          ? 'bg-emerald-100 border-emerald-400 text-emerald-800 ring-2 ring-emerald-300'
                          : 'bg-gray-50 border-gray-200 text-gray-500'
                      }`}
                    >
                      🟢 Tahap 1<br />
                      <span className="font-normal text-[9px]">Ringkas</span>
                    </div>
                    <div
                      className={`p-1.5 rounded-xl border text-[10px] font-bold ${
                        hintLevel === 2
                          ? 'bg-yellow-100 border-yellow-400 text-yellow-800 ring-2 ring-yellow-300'
                          : 'bg-gray-50 border-gray-200 text-gray-500'
                      }`}
                    >
                      🟡 Tahap 2<br />
                      <span className="font-normal text-[9px]">Langkah</span>
                    </div>
                    <div
                      className={`p-1.5 rounded-xl border text-[10px] font-bold ${
                        hintLevel === 3
                          ? 'bg-orange-100 border-orange-400 text-orange-800 ring-2 ring-orange-300'
                          : 'bg-gray-50 border-gray-200 text-gray-500'
                      }`}
                    >
                      🔴 Tahap 3<br />
                      <span className="font-normal text-[9px]">Bimbingan</span>
                    </div>
                  </div>

                  {/* Messages Feed for Hints */}
                  <div className="space-y-2 mt-2">
                    {messages.map((m) => (
                      <div
                        key={m.id}
                        className={`flex gap-2 ${
                          m.sender === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {m.sender === 'alya' && (
                          <div className="w-7 h-7 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
                            👧
                          </div>
                        )}
                        <div
                          className={`p-3 rounded-2xl text-xs font-rounded font-medium leading-relaxed max-w-[85%] ${
                            m.sender === 'user'
                              ? 'bg-amber-500 text-white rounded-br-none'
                              : 'bg-[#FFF8E8] text-[#4A3728] border border-amber-200 rounded-bl-none shadow-sm'
                          }`}
                        >
                          {m.hintLevel && (
                            <span className="inline-block px-2 py-0.5 mb-1.5 rounded-full bg-amber-200 text-amber-900 font-bold text-[10px]">
                              PETUNJUK {m.hintLevel}
                            </span>
                          )}
                          <div className="whitespace-pre-line">
                            <FormattedMathText text={m.text} size="xs" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* CHAT TAB */
                <div className="space-y-3">
                  {/* Chat Messages */}
                  <div className="space-y-2">
                    {messages.map((m) => (
                      <div
                        key={m.id}
                        className={`flex gap-2 ${
                          m.sender === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {m.sender === 'alya' && (
                          <div className="w-7 h-7 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
                            👧
                          </div>
                        )}
                        <div
                          className={`p-3 rounded-2xl text-xs font-rounded font-medium leading-relaxed max-w-[85%] ${
                            m.sender === 'user'
                              ? 'bg-amber-500 text-white rounded-br-none'
                              : 'bg-[#FFF8E8] text-[#4A3728] border border-amber-200 rounded-bl-none shadow-sm'
                          }`}
                        >
                          <div className="whitespace-pre-line">
                            <FormattedMathText text={m.text} size="xs" />
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex gap-2 items-center text-xs text-amber-700 italic">
                        <span>👧 Alya sedang berfikir...</span>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Sample Question Chips */}
                  <div className="pt-2 border-t border-amber-100">
                    <span className="text-[10px] font-bold text-gray-500 block mb-1">
                      Soalan Contoh:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {sampleQuestions.map((sq, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(sq)}
                          className="text-[10px] bg-amber-100 hover:bg-amber-200 text-amber-900 px-2 py-1 rounded-full transition cursor-pointer font-medium"
                        >
                          {sq}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input Bar (Available when chat tab is active) */}
            {activeTab === 'chat' && (
              <div className="p-2.5 bg-[#FFF8E8] border-t border-amber-200 flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Tanya Alya tentang pecahan..."
                  className="flex-1 bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-rounded focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <button
                  onClick={() => handleSendMessage()}
                  className="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition cursor-pointer shadow-sm"
                  title="Hantar"
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
        whileHover={{ scale: 1.08, rotate: 2 }}
        whileTap={{ scale: 0.92 }}
        onClick={handleToggleOpen}
        className="relative bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-200 p-2 sm:p-2.5 rounded-3xl shadow-xl border-2 border-white ring-4 ring-amber-400/40 flex items-center justify-center cursor-pointer group"
      >
        <AlyaCharacter mood={alyaMood} size="md" />

        {/* Floating Speech Badge */}
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="absolute -top-11 left-6 sm:left-8 bg-white/95 backdrop-blur-sm text-[#4A3728] text-[11px] font-rounded font-extrabold px-3 py-1.5 rounded-2xl rounded-bl-none shadow-lg border-2 border-amber-300 flex items-center gap-1.5 max-w-[220px] whitespace-normal leading-tight z-10"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 animate-pulse" />
            <span>👋 Hai! Saya Alya! 🥰</span>
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
