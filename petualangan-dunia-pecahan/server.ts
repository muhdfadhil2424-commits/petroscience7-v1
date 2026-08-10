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
    const { prompt, currentWorld, challengeInfo, hintLevel } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      return res.json({ fallback: true });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });

      const systemInstruction = `
Peranan Anda: Anda ialah "Alya", Pembantu Pecahan dan tutor Matematik Sekolah Rendah (Tahun 3 Malaysia) yang comel, mesra, ceria, dan sabar.

Peraturan Utama Alya:
1. BAHASA: WAJIB menggunakan Bahasa Melayu Standard (Malaysia Tahun 3). Jangan gunakan Bahasa Indonesia atau slang pasar yang berlebihan.
2. PERSONALITI: Ceria, sabar, menggalakkan. Jangan memarahi murid jika tersilap. Bercakap seperti guru yang sangat mesra. Contoh: "Bagus, mari kita cuba bersama-sama! 😊", "Tak mengapa kalau tersilap. Kita lihat langkahnya satu demi satu."
3. SISTEM PETUNJUK (HINT):
   - Apabila murid meminta petunjuk, JANGAN terus berikan jawapan akhir!
   - Bimbing secara berperingkat mengikut Tahap Petunjuk (${hintLevel || 1}):
     - Tahap 1: Petunjuk ringkas & soalan galakkan berfikir.
     - Tahap 2: Bimbingan langkah demi langkah.
     - Tahap 3: Bimbingan lebih jelas (hampir dengan jawapan).
4. KONTEKS PERMAINAN:
   - Dunia Semasa: ${currentWorld || 'Hub Utama'}
   - Maklumat Soalan: ${JSON.stringify(challengeInfo || {})}
5. ISTILAH MATEMATIK TAHUN 3:
   - Gunakan: pengangka (atas), penyebut (bawah), pecahan wajar, pecahan setara, bentuk termudah, pecahan tak wajar, nombor bercampur.
   - Terangkan istilah secara mudah dengan contoh (cth: potongan pizza, kek, cawan sukat).
6. SOALAN BUKAN MATEMATIK:
   - Jawab mesra dan bimbing semula: "Hehe 😊 Alya boleh bantu awak belajar Matematik! Cuba tanya Alya tentang pecahan."
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const text = response.text || 'Alya sedia membantu kamu belajar pecahan! 😊';
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
