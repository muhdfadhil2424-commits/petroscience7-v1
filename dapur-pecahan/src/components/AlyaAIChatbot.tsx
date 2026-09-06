import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Calculator,
  CheckCircle2,
  Brain,
  Lightbulb,
  WifiOff,
  Check,
  Eye,
  GraduationCap,
  HelpCircle as QuestionIcon,
} from 'lucide-react';
import chefAlyaImg from '../assets/images/chef_alya_avatar_1785314793438.jpg';
import { ChatMessage, PRESET_QUESTIONS, getAlyaResponse } from '../utils/alyaAiKnowledge';
import { FractionVisualDiagram } from './FractionVisualDiagram';
import { sounds } from '../utils/audio';

interface AlyaAIChatbotProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isOnline?: boolean;
}

const DEFAULT_WELCOME_MESSAGE: ChatMessage = {
  id: 'm-welcome',
  sender: 'alya',
  identifiedTopic: 'AI Teaching Assistant — Pecahan Darjah 3',
  pedagogicalStageTag: 'FAHAM → VISUALKAN → FIKIR → SELESAIKAN → SEMAK',
  visualDiagram: {
    type: 'circle_chart',
    selectedVisualMode: 'circle',
    title: 'Rajah Bulatan Pecahan: 3/4 Bahagian',
    totalParts: 4,
    shadedParts: 3,
    emojiBlocks: '🟩 🟩 🟩 ⬜',
    explanation: 'Rajah bulatan di atas dipotong kepada 4 bahagian sama rata, dengan 3 bahagian diwarnakan hijau (3/4).',
  },
  mathWorkspace: {
    problemTitle: 'Kaedah Pembelajaran 5-Langkah Guru Matematik',
    category: 'Pedagogi Socratic & Visual Rajah Bulatan DSKP',
    problemEquation: 'FAHAM → VISUALKAN → FIKIR → SELESAIKAN → SEMAK',
    formulaUsed: 'Membimbing Murid Memahami KENAPA Jawapan Itu Betul',
    stepByStep: [
      '1. FAHAM: Kenal pasti apa yang soalan mahu kita cari.',
      '2. VISUALKAN: Lihat rajah bulatan yang dipotong sama rata mengikut nombor penyebut.',
      '3. FIKIR: Analisis saiz bahagian dan hubungan nombor atas (pengangka) & nombor bawah (penyebut).',
      '4. SELESAIKAN: Tunjukkan langkah demi langkah yang kemas dan berkonsep.',
      '5. SEMAK: Pastikan jawapan tepat dan buat penilaian secara matematik.',
    ],
    finalAnswer: 'Sedia Bimbing Murid Menguasai Pecahan!',
    socraticQuestion: 'Cuba adik bayangkan: Kalau ada 1 bulatan dipotong 4 bahagian sama besar dan kita warnakan 3 bahagian, apakah nombor yang patut berada di atas?',
  },
  text: 'Hai adik-adik! Saya Puan Alya, guru dan pembantu pintar matematik anda untuk topik Pecahan Darjah 3 👩‍🏫✨\n\nUntuk membantu adik lebih cepat dan mudah faham, Puan Alya menyediakan **Rajah Bulatan Pecahan Interaktif (siri 1 hingga 12 bahagian)**.\n\nBila adik ada soalan pecahan wajar, tak wajar, nombor bercampur, operasi tambah, tolak, atau soalan cerita, tanya saja Puan Alya di sini. Berfungsi lancar secara Online mahupun 100% Offline! 😊',
  timestamp: 'Baru saja',
  socraticPrompt: 'Tak apa kalau buat kesilapan. Yang penting kita belajar sama-sama dan faham konsepnya! 💡',
  proTip: 'Cuba klik kepingan bulatan atau butang nombor di bawah rajah untuk meneroka pecahan lain secara interaktif!',
};

export const AlyaAIChatbot: React.FC<AlyaAIChatbotProps> = ({
  isCollapsed,
  onToggleCollapse,
  isOnline = true,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('alya_chat_history_v1');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch {
        // ignore parse errors
      }
    }
    return [DEFAULT_WELCOME_MESSAGE];
  });

  const [inputQuery, setInputQuery] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Save chat messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('alya_chat_history_v1', JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    sounds.playPop();

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    // Natural AI analytical thinking delay
    setTimeout(() => {
      const response = getAlyaResponse(query);
      const alyaMsg: ChatMessage = {
        id: `alya-${Date.now()}`,
        sender: 'alya',
        identifiedTopic: response.identifiedTopic,
        pedagogicalStageTag: response.pedagogicalStageTag,
        mathWorkspace: response.mathWorkspace,
        visualDiagram: response.visualDiagram,
        text: response.explanationText,
        socraticPrompt: response.socraticPrompt,
        proTip: response.proTip,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, alyaMsg]);
      setIsTyping(false);
    }, 400);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    sounds.playPop();
    const resetMsg: ChatMessage = {
      id: `m-reset-${Date.now()}`,
      sender: 'alya',
      identifiedTopic: 'Sesi Baharu (Mod Luar Talian Aktif)',
      text: 'Perbualan telah dibersihkan! Ada apa-apa lagi soalan atau pengiraan pecahan yang adik ingin tanyakan? Puan Alya sedia membantu secara luar talian! 😊',
      timestamp: 'Baru saja',
    };
    setMessages([resetMsg]);
    try {
      localStorage.setItem('alya_chat_history_v1', JSON.stringify([resetMsg]));
    } catch {
      // ignore
    }
  };

  return (
    <>
      {/* Floating Toggle Button when Collapsed */}
      {isCollapsed && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={onToggleCollapse}
          className="fixed left-3 bottom-6 z-40 bg-[#5A5A40] hover:bg-[#4A4A33] text-white p-3 rounded-2xl shadow-xl border-2 border-[#A67C52] flex items-center gap-2.5 cursor-pointer group hover:scale-105 transition-transform"
          title="Buka AI Puan Alya (Tanya Soalan)"
        >
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/40 flex-shrink-0">
            <img
              src={chefAlyaImg}
              alt="AI Alya"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="text-left pr-1">
            <div className="text-[10px] uppercase tracking-wider font-extrabold text-[#F2E8CF] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300 animate-spin" /> AI Tutor
            </div>
            <div className="text-xs font-bold leading-tight">Tanya AI Puan Alya</div>
          </div>
          <ChevronRight className="w-4 h-4 text-amber-200 group-hover:translate-x-0.5 transition-transform" />
        </motion.button>
      )}

      {/* Main Persistent Left Sidebar Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-80 sm:w-88 md:w-96 bg-[#FDFBF7] border-r-2 border-[#D6CEBE] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isCollapsed ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        {/* Chatbot Top Header */}
        <div className="bg-[#5A5A40] text-white p-3.5 border-b border-[#4A4A33] flex items-center justify-between flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-white shadow-sm flex-shrink-0 bg-[#EFEAE1]">
                <img
                  src={chefAlyaImg}
                  alt="AI Puan Alya"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span
                className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 border-2 border-[#5A5A40] rounded-full ${
                  isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
                }`}
                title={isOnline ? 'Mod Dalam Talian' : 'Mod Luar Talian'}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-serif italic font-bold text-sm text-white">AI Puan Alya</h3>
                <span
                  className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-1 border ${
                    isOnline
                      ? 'bg-emerald-800/80 text-emerald-100 border-emerald-500/40'
                      : 'bg-amber-800/80 text-amber-100 border-amber-500/40'
                  }`}
                >
                  {isOnline ? (
                    <>
                      <Sparkles className="w-2.5 h-2.5 text-emerald-300" /> Online
                    </>
                  ) : (
                    <>
                      <Check className="w-2.5 h-2.5 text-amber-300" /> Luar Talian
                    </>
                  )}
                </span>
              </div>
              <p className="text-[11px] text-[#D6CEBE] leading-tight flex items-center gap-1">
                <span>
                  {isOnline
                    ? 'Tutor Pintar DSKP (Segerak Automatik)'
                    : 'Tutor Pintar DSKP (100% Bebas Internet)'}
                </span>
              </p>
            </div>
          </div>

          {/* Header Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleResetChat}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#F2E8CF] hover:text-white transition-colors cursor-pointer"
              title="Mula Perbualan Baharu"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#F2E8CF] hover:text-white transition-colors cursor-pointer"
              title="Kecilkan Ruang AI"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Question Suggested Chips */}
        <div className="bg-[#EFEAE1] border-b border-[#D6CEBE] px-3 py-2 flex-shrink-0">
          <div className="text-[10px] font-bold text-[#5A5A40] uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-[#A67C52]" />
            <span>Pilih Soalan Pantas (Klik Untuk Jawapan):</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
            {PRESET_QUESTIONS.map((q) => (
              <button
                key={q.id}
                onClick={() => handleSendMessage(q.query)}
                className="text-[11px] font-semibold bg-white hover:bg-[#F2E8CF] text-[#3A3A30] hover:text-[#5A5A40] border border-[#D6CEBE] hover:border-[#A67C52] px-2.5 py-1 rounded-xl whitespace-nowrap flex-shrink-0 transition-all shadow-2xs cursor-pointer active:scale-95"
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        {/* Message Log Container */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gradient-to-b from-[#FDFBF7] to-[#F7F3ED]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[96%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-[#5A5A40] text-white rounded-tr-none'
                    : 'bg-white border border-[#D6CEBE] text-[#3A3A30] rounded-tl-none shadow-sm'
                }`}
              >
                {/* Sender Tag */}
                <div
                  className={`text-[10px] font-bold mb-1 flex items-center justify-between gap-1 ${
                    msg.sender === 'user' ? 'text-amber-200' : 'text-[#A67C52]'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {msg.sender === 'alya' ? (
                      <>
                        <Sparkles className="w-3 h-3 text-[#A67C52]" />
                        <span>AI Puan Alya</span>
                      </>
                    ) : (
                      <span>Adik Pelajar</span>
                    )}
                  </div>
                  <span className="text-[9px] font-normal opacity-70">{msg.timestamp}</span>
                </div>

                {/* AI Intent & Topic Recognition Badge */}
                {msg.identifiedTopic && msg.sender === 'alya' && (
                  <div className="my-1.5 flex flex-wrap items-center gap-1.5">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#EFEAE1] border border-[#D6CEBE] text-[#5A5A40] text-[10px] font-extrabold">
                      <Brain className="w-3.5 h-3.5 text-[#A67C52] flex-shrink-0" />
                      <span>🧠 {msg.identifiedTopic}</span>
                    </div>
                    {msg.pedagogicalStageTag && (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-100/70 border border-amber-300 text-amber-900 text-[9px] font-bold">
                        <GraduationCap className="w-3 h-3 text-amber-700" />
                        <span>Kaedah: {msg.pedagogicalStageTag}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* VISUAL DIAGRAM (Rendered prominently for concrete visual learning) */}
                {msg.visualDiagram && (
                  <FractionVisualDiagram diagram={msg.visualDiagram} />
                )}

                {/* RUANG KHAS PENGIRAAN MATEMATIK (Calculations rendered FIRST before explanation) */}
                {msg.mathWorkspace && (
                  <div className="my-2.5 bg-[#F7F3ED] border-2 border-[#A67C52]/40 rounded-xl p-3 text-[#3A3A30] shadow-xs">
                    {/* Header Workspace Title */}
                    <div className="flex items-center justify-between gap-1 pb-1.5 border-b border-[#D6CEBE] mb-2">
                      <div className="font-extrabold text-[11px] text-[#5A5A40] flex items-center gap-1.5">
                        <Calculator className="w-3.5 h-3.5 text-[#A67C52]" />
                        <span>{msg.mathWorkspace.problemTitle}</span>
                      </div>
                      <span className="text-[9px] bg-[#5A5A40] text-white px-1.5 py-0.5 rounded font-bold">
                        {msg.mathWorkspace.category}
                      </span>
                    </div>

                    {/* Problem Equation Banner */}
                    <div className="bg-white p-2 rounded-lg border border-[#D6CEBE] mb-2 text-center">
                      <span className="text-[10px] text-[#7A7A70] block font-semibold">Persamaan Matematik:</span>
                      <span className="font-mono font-black text-sm text-[#A67C52] tracking-wide">
                        {msg.mathWorkspace.problemEquation}
                      </span>
                    </div>

                    {/* Formula Used */}
                    <div className="text-[10px] text-[#5A5A50] mb-2 bg-[#EFEAE1] p-1.5 rounded-lg border border-[#D6CEBE]/70">
                      <span className="font-bold text-[#A67C52]">Konsep/Prinsip: </span>
                      <span>{msg.mathWorkspace.formulaUsed}</span>
                    </div>

                    {/* Step-by-Step Calculation */}
                    <div className="space-y-1 text-[11px]">
                      <span className="font-bold text-[10px] text-[#5A5A40] uppercase tracking-wider block mb-0.5">
                        Langkah Kerja Pengiraan & Pemahaman:
                      </span>
                      {msg.mathWorkspace.stepByStep.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 bg-white/70 p-1.5 rounded-md border border-[#D6CEBE]/50">
                          <span className="w-4 h-4 rounded-full bg-[#A67C52] text-white text-[9px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-tight">{step}</span>
                        </div>
                      ))}
                    </div>

                    {/* Final Answer Highlight Pill */}
                    <div className="mt-2.5 pt-2 border-t border-[#D6CEBE] flex items-center justify-between gap-2 bg-emerald-50 p-2 rounded-lg border border-emerald-300">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-900">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Jawapan Tepat:</span>
                      </div>
                      <span className="font-mono font-black text-xs text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-400 shadow-2xs">
                        {msg.mathWorkspace.finalAnswer}
                      </span>
                    </div>

                    {/* Socratic Question for Student's Self Reflection */}
                    {msg.mathWorkspace.socraticQuestion && (
                      <div className="mt-2.5 bg-amber-50/90 border border-amber-300 rounded-lg p-2.5 text-[11px] text-[#3A3A30]">
                        <div className="font-extrabold text-amber-900 flex items-center gap-1.5 mb-1">
                          <QuestionIcon className="w-3.5 h-3.5 text-amber-700" />
                          <span>🤔 Soalan Fikir Puan Alya (Cuba Adik Jawab):</span>
                        </div>
                        <p className="text-amber-950 font-medium leading-normal">
                          {msg.mathWorkspace.socraticQuestion}
                        </p>
                      </div>
                    )}

                    {msg.mathWorkspace.note && (
                      <p className="text-[10px] text-[#7A7A70] italic mt-1.5 text-right">
                        * {msg.mathWorkspace.note}
                      </p>
                    )}
                  </div>
                )}

                {/* Main Explanation Text */}
                <div className="text-xs font-normal leading-relaxed mt-1 whitespace-pre-line">
                  {msg.text}
                </div>

                {/* Socratic Encouragement / Growth Mindset */}
                {msg.socraticPrompt && (
                  <div className="mt-2 bg-emerald-50 border border-emerald-300/80 p-2 rounded-xl text-[11px] text-emerald-950 flex items-start gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0 mt-0.5" />
                    <span className="font-medium">{msg.socraticPrompt}</span>
                  </div>
                )}

                {/* ProTip / Kitchen Analogy */}
                {msg.proTip && (
                  <div className="mt-2 bg-[#F2E8CF]/60 border border-[#D6CEBE] p-2 rounded-xl text-[11px] text-[#3A3A30] flex items-start gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-[#A67C52] flex-shrink-0 mt-0.5" />
                    <span>{msg.proTip}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 bg-white p-2.5 rounded-2xl border border-[#D6CEBE] w-36 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#A67C52] animate-spin" />
              <span className="text-[10px] font-bold text-[#A67C52]">Menganalisis...</span>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-[#A67C52] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-[#A67C52] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-[#A67C52] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 bg-white border-t border-[#D6CEBE] flex-shrink-0 shadow-inner">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={
                isOnline
                  ? "Tanya soalan pecahan (cth: 3/4 + 1/4 atau peratus) • Mod Online..."
                  : "Tanya soalan pecahan (cth: 3/4 + 1/4 atau peratus) • 100% Offline..."
              }
              className="flex-1 text-xs bg-[#F7F3ED] border border-[#D6CEBE] rounded-xl px-3 py-2 text-[#3A3A30] placeholder-[#7A7A70] focus:outline-none focus:border-[#A67C52] focus:ring-1 focus:ring-[#A67C52]"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputQuery.trim()}
              className="bg-[#5A5A40] hover:bg-[#4A4A33] disabled:opacity-40 text-white p-2 rounded-xl transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed flex-shrink-0"
              title="Hantar Soalan"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-[#7A7A70] mt-1.5 text-center flex items-center justify-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full inline-block ${
                isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            ></span>
            <span>
              {isOnline
                ? 'AI Puan Alya beroperasi secara lancar dalam talian & bersedia untuk mod luar talian.'
                : 'AI Puan Alya beroperasi penuh di dalam peranti anda tanpa internet.'}
            </span>
          </p>
        </div>
      </aside>
    </>
  );
};
