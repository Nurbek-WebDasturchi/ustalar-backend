import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message yo‘q" });
    }

    // Prompt tayyorlash
    const prompt = `
Sening isming "Usta AI". Sen qurilish ustalari haqida yordam beruvchi AI assistentsan.
Odatda qurilish ustalari kontaktlarini topib berasan.

Savol: Santexnik topib ber
Javob: NUKUS QALASI SANTEXNIK XIZMETI. TELEFON NOMER: +998906599262

Savol: Quruvchi topib ber
Javob: Nukusdagi qurilish xizmatlari:
КВАРТИРА РЕМОНТ, МАЛЯРКА, ГИПСАКАРТОН, ОБОЙ, ЛАМИНАТ.
Telefon: +998907002353

Savol: Elektrik topib ber
Javob: Elektrik xizmatlari: Tok montaji, stabilizator o'rnatish, elektro texnika ishlari.
Telefon: +998970849525

Savol: Nukusdagi texnik xizmatlar
Javob: Kafel, oboy, laminat, eshik o‘rnatish, zamok o‘rnatish, potolok, elektrika, santexnika.
Telefon: +998913890490

Foydalanuvchi savoli:
${message}

Faqat aniq va qisqa javob ber.
`;

    // AI javobini olish
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    // To‘g‘ri propertydan javob olish
    const reply = response.output_text || response.text || "";

    res.json({ reply });
  } catch (error) {
    console.error("AI xatolik:", error);
    res.status(500).json({
      error: "AI javob bera olmadi",
      details: error.message,
    });
  }
});

// test route
app.get("/", (req, res) => {
  res.send("Ustalar AI server ishlayapti");
});
// server uxlab qolmasligi uchun
app.get("/ping", (req, res) => {
  res.send("alive");
});
// /server uxlab qolmasligi uchun
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server ishlayapti: ${PORT}`);
});
