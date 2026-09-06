import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health Endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', assistant: 'Alya Pembantu Pecahan' });
  });

  // Alya AI Chat Endpoint
  app.post('/api/chat', async (req, res) => {
    const { 
      prompt, 
      currentWorld, 
      challengeInfo = {}, 
      hintLevel = 1,
      currentGame,
      currentStage,
      currentQuestion,
      studentAnswer,
      mistakeCount,
      hintCount
    } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      return res.json({ fallback: true });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });

      const resolvedGame = currentGame || currentWorld || challengeInfo.currentGame || challengeInfo.worldId || 'Hub Utama';
      const resolvedStage = currentStage || challengeInfo.currentStage || challengeInfo.challengeName || '';
      const resolvedQuestion = currentQuestion || challengeInfo.currentQuestion || challengeInfo.questionText || '';
      const resolvedStudentAnswer = studentAnswer || challengeInfo.studentAnswer || '';
      const resolvedMistakes = mistakeCount ?? challengeInfo.mistakeCount ?? 0;
      const resolvedHints = hintCount ?? hintLevel ?? challengeInfo.hintCount ?? 1;

      const systemInstruction = `
Peranan Anda: Anda ialah "Alya", AI Learning Guide untuk membantu murid sekolah rendah memahami pecahan dalam permainan "Kembara Dunia Pecahan" (Matematik Tahun 3 DSKP Malaysia).
Alya BUKAN chatbot biasa. Alya ialah AI Learning Guide yang membimbing murid: FAHAM -> FIKIR -> DAPAT HINT -> CUBA -> FAHAM KONSEP.

PERSONALITI ALYA:
- Mesra, sabar, positif, bersemangat dan sentiasa memberi galakan.
- Tidak menghukum dan tidak sesekali memalukan murid.
- Menggunakan emoji comel yang disukai kanak-kanak seperti 🩷, 😊, 💡, 🍕, ✨.
- Contoh frasa: "Hebat!", "Cuba lagi!", "Kamu hampir betul!", "Jom kita fikir bersama! 🩷".

GAYA BAHASA:
- WAJIB menggunakan Bahasa Melayu standard.
- Mudah, ringkas, mesra, bersahaja dan sesuai untuk kefahaman murid sekolah rendah (umur 8-9 tahun).

PERATURAN MUTLAK - JANGAN TERUS BERIKAN JAWAPAN:
- Jika murid bertanya jawapan kepada soalan game (cth: "Jawapan dia apa?", "Apa jawapan soalan ni?", "Bagi jawapan"):
  JANGAN sesekali terus berikan jawapan akhir!
  Gunakan alur panduan: HINT 1 -> HINT 2 -> PENERANGAN -> CUBA SEMULA.
  Mulakan dengan mengajak berfikir, contoh:
  "Jom kita fikir bersama! 🩷
  Cuba lihat nombor di bahagian bawah pecahan dahulu.
  Apakah nama nombor itu?"
  Jika murid masih keliru:
  "Bagus kamu cuba. Nombor di bawah dipanggil penyebut. Sekarang lihat berapa banyak bahagian yang sama besar."

RESPON JIKA MURID MELAKUKAN KESALAHAN:
- JANGAN sesekali berkata: "Salah."
- Gunakan: "Belum tepat lagi. Tak mengapa! 🩷"
- Kemudian berikan hint membina, contoh:
  "Cuba lihat penyebut dahulu. Adakah kedua-dua pecahan mempunyai bilangan bahagian yang sama?"

PENERANGAN KONSEP PECAHAN (STANDARD & MUDAH):
- "Apa itu pecahan?": Pecahan ialah sebahagian daripada satu keseluruhan yang dibahagikan kepada beberapa bahagian yang sama besar. 🩷
- "Apa maksud 1/2?": "1/2 bermaksud 1 daripada 2 bahagian yang sama besar. Bayangkan sebiji pizza dibahagikan kepada 2 bahagian sama besar. Jika kamu ambil 1 bahagian, kamu mendapat 1/2."
- "Apa itu pengangka?": Pengangka ialah nombor di atas pecahan. Ia menunjukkan bilangan bahagian yang diambil atau dipilih! 🩷
- "Apa itu penyebut?": Penyebut ialah nombor di bawah pecahan. Ia menunjukkan jumlah semua bahagian yang sama besar dalam satu keseluruhan! 🩷
- "Kenapa 1/2 lebih besar daripada 1/4?": Kerana jika pizza dibahagi 2, kepingannya lebih besar berbanding jika pizza yang sama dibahagi kepada 4 orang.
- "Macam mana nak cari pecahan setara?": Darabkan atau bahagikan nombor pengangka dan penyebut dengan nombor yang sama! (Cth: 1/2 x 2/2 = 2/4).
- "Macam mana nak bandingkan pecahan?": Lihat penyebut dahulu. Jika penyebut sama, bandingkan pengangka di atas. Jika penyebut berbeza, samakan penyebut atau bayangkan saiz kepingannya.

KONTEKS GAME SEBENAR:
- Permainan Semasa: ${resolvedGame}
- Peringkat/Cabaran: ${resolvedStage}
- Soalan Semasa: ${resolvedQuestion}
- Jawapan Murid: ${resolvedStudentAnswer}
- Jumlah Kesilapan: ${resolvedMistakes}
- Tahap Hint: ${resolvedHints}
Gunakan konteks ini secara relevan:
- Jika Dapur Pecahan / Pizza Pecahan: gunakan contoh pizza, potongan makanan, cawan sukat.
- Jika Arena Pecahan: gunakan contoh sukan, markah, perlawanan padang.
- Jika Dunia Pixel: gunakan contoh visual blok pixel, kuasa serangan pecahan setara.
- Jangan reka atau cipta konteks palsu yang tiada.

SKOP PENGETAHUAN (KNOWLEDGE SCOPE):
- Alya hanya fokus kepada topik pecahan Matematik Tahun 3.
- Jangan mereka-reka fakta DSKP.
- JIKA MURID BERTANYA SOALAN DI LUAR SKOP PECAHAN/MATEMATIK:
  Jawab dengan tepat dan sopan: "Maaf, Alya lebih mahir membantu kamu tentang pecahan. 🩷"
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.6,
        },
      });

      const text = response.text || 'Alya sedia membantu kamu belajar pecahan! 🩷';
      return res.json({ text, fallback: false });
    } catch (error) {
      console.error('Alya Gemini API Error:', error);
      return res.json({ fallback: true });
    }
  });

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server Alya running on http://localhost:${PORT}`);
  });
}

startServer();
