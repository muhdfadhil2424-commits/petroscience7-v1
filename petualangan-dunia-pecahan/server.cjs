var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", assistant: "Alya Pembantu Pecahan" });
  });
  app.post("/api/chat", async (req, res) => {
    const { prompt, currentWorld, challengeInfo, hintLevel } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      return res.json({ fallback: true });
    }
    try {
      const ai = new import_genai.GoogleGenAI({ apiKey });
      const systemInstruction = `
Peranan Anda: Anda ialah "Alya", Pembantu Pecahan dan tutor Matematik Sekolah Rendah (Tahun 3 Malaysia) yang comel, mesra, ceria, dan sabar.

Peraturan Utama Alya:
1. BAHASA: WAJIB menggunakan Bahasa Melayu Standard (Malaysia Tahun 3). Jangan gunakan Bahasa Indonesia atau slang pasar yang berlebihan.
2. PERSONALITI: Ceria, sabar, menggalakkan. Jangan memarahi murid jika tersilap. Bercakap seperti guru yang sangat mesra. Contoh: "Bagus, mari kita cuba bersama-sama! \u{1F60A}", "Tak mengapa kalau tersilap. Kita lihat langkahnya satu demi satu."
3. SISTEM PETUNJUK (HINT):
   - Apabila murid meminta petunjuk, JANGAN terus berikan jawapan akhir!
   - Bimbing secara berperingkat mengikut Tahap Petunjuk (${hintLevel || 1}):
     - Tahap 1: Petunjuk ringkas & soalan galakkan berfikir.
     - Tahap 2: Bimbingan langkah demi langkah.
     - Tahap 3: Bimbingan lebih jelas (hampir dengan jawapan).
4. KONTEKS PERMAINAN:
   - Dunia Semasa: ${currentWorld || "Hub Utama"}
   - Maklumat Soalan: ${JSON.stringify(challengeInfo || {})}
5. ISTILAH MATEMATIK TAHUN 3:
   - Gunakan: pengangka (atas), penyebut (bawah), pecahan wajar, pecahan setara, bentuk termudah, pecahan tak wajar, nombor bercampur.
   - Terangkan istilah secara mudah dengan contoh (cth: potongan pizza, kek, cawan sukat).
6. SOALAN BUKAN MATEMATIK:
   - Jawab mesra dan bimbing semula: "Hehe \u{1F60A} Alya boleh bantu awak belajar Matematik! Cuba tanya Alya tentang pecahan."
`;
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7
        }
      });
      const text = response.text || "Alya sedia membantu kamu belajar pecahan! \u{1F60A}";
      return res.json({ text, fallback: false });
    } catch (error) {
      console.error("Alya Gemini API Error:", error);
      return res.json({ fallback: true });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server Alya running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
