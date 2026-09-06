// Browser SpeechSynthesis Utility for Alya AI Learning Guide
// Specifically tuned for Bahasa Melayu (ms-MY) and primary school children

export interface SpeechState {
  isSupported: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  currentText: string;
}

let activeUtterance: SpeechSynthesisUtterance | null = null;

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

/**
 * Clean text for audio narration:
 * - Converts fraction notation (e.g. 1/2 -> satu per dua)
 * - Removes markdown asterisks, bold tags, hashes, and non-spoken emojis
 * - Normalizes punctuation for natural pauses
 */
export function cleanTextForSpeech(rawText: string): string {
  if (!rawText) return '';

  let text = rawText;

  // Convert common fractions to spoken Malay words for clear pronunciation
  const fractionMap: Record<string, string> = {
    '1/2': 'satu per dua',
    '1/3': 'satu per tiga',
    '2/3': 'dua per tiga',
    '1/4': 'satu per empat',
    '2/4': 'dua per empat',
    '3/4': 'tiga per empat',
    '1/5': 'satu per lima',
    '2/5': 'dua per lima',
    '3/5': 'tiga per lima',
    '4/5': 'empat per lima',
    '1/6': 'satu per enam',
    '2/6': 'dua per enam',
    '3/6': 'tiga per enam',
    '4/6': 'empat per enam',
    '5/6': 'lima per enam',
    '1/8': 'satu per lapan',
    '2/8': 'dua per lapan',
    '3/8': 'tiga per lapan',
    '4/8': 'empat per lapan',
    '5/8': 'lima per lapan',
    '6/8': 'enam per lapan',
    '7/8': 'tujuh per lapan',
  };

  // Replace fraction strings
  for (const [frac, spoken] of Object.entries(fractionMap)) {
    const escaped = frac.replace('/', '\\/');
    text = text.replace(new RegExp(`\\b${escaped}\\b`, 'g'), spoken);
  }

  // Handle general digits a/b -> "a per b"
  text = text.replace(/(\d+)\/(\d+)/g, '$1 per $2');

  // Remove Markdown symbols: bold **, italic *, headers #, backticks `, bullet points
  text = text.replace(/\*\*(.*?)\*\*/g, '$1');
  text = text.replace(/\*(.*?)\*/g, '$1');
  text = text.replace(/`{1,3}(.*?)`{1,3}/g, '$1');
  text = text.replace(/#{1,6}\s+/g, '');
  text = text.replace(/^[\s*•\-–—]+\s*/gm, '');

  // Strip emojis and non-standard speech symbols
  // Keep standard alphanumeric, punctuation, and Malay characters
  text = text.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1FA70}-\u{1FAFF}]/gu, '');
  text = text.replace(/[🩷✨💡🍕👧🌟🎉🏆⭐🟢🟡🔴🔄🧠💬👀👂]/g, '');

  // Clean extra whitespace
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}

/**
 * Get the best voice available (preferring Malay ms-MY, then Indonesian id-ID, then default)
 */
function findBestVoice(): SpeechSynthesisVoice | null {
  if (!isSpeechSynthesisSupported()) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // 1. Look for ms-MY voice
  const msVoice = voices.find((v) => v.lang && (v.lang.toLowerCase().includes('ms') || v.lang.toLowerCase().includes('zlm')));
  if (msVoice) return msVoice;

  // 2. Look for id-ID voice (closely intelligible Indonesian)
  const idVoice = voices.find((v) => v.lang && v.lang.toLowerCase().includes('id'));
  if (idVoice) return idVoice;

  // 3. Look for default or first voice
  const defaultVoice = voices.find((v) => v.default);
  return defaultVoice || voices[0] || null;
}

/**
 * Speak text with Alya's friendly child-tutor voice
 */
export function speakAlyaExplanation({
  text,
  onStart,
  onEnd,
  onError,
  onPause,
  onResume,
}: {
  text: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err?: any) => void;
  onPause?: () => void;
  onResume?: () => void;
}): boolean {
  if (!isSpeechSynthesisSupported()) {
    onError?.(new Error('Speech synthesis not supported'));
    return false;
  }

  try {
    // Cancel any previous speech
    window.speechSynthesis.cancel();

    const spokenText = cleanTextForSpeech(text);
    if (!spokenText) return false;

    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.lang = 'ms-MY';
    utterance.rate = 0.92; // Slightly slower, clear and friendly for kids
    utterance.pitch = 1.08; // Friendly warm Alya pitch

    const voice = findBestVoice();
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    }

    utterance.onstart = () => {
      activeUtterance = utterance;
      onStart?.();
    };

    utterance.onend = () => {
      activeUtterance = null;
      onEnd?.();
    };

    utterance.onerror = (e) => {
      activeUtterance = null;
      onError?.(e);
    };

    utterance.onpause = () => {
      onPause?.();
    };

    utterance.onresume = () => {
      onResume?.();
    };

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (error) {
    console.error('SpeechSynthesis error:', error);
    onError?.(error);
    return false;
  }
}

export function pauseAlyaSpeech(): void {
  if (isSpeechSynthesisSupported() && window.speechSynthesis.speaking) {
    window.speechSynthesis.pause();
  }
}

export function resumeAlyaSpeech(): void {
  if (isSpeechSynthesisSupported() && window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }
}

export function stopAlyaSpeech(): void {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
    activeUtterance = null;
  }
}
