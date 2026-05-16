import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API Routes
app.post("/api/ai/analyze-tactics", async (req, res) => {
  const { matchData } = req.body;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze these football match tactics and momentum: ${JSON.stringify(matchData)}. Provide a brief summary, key tactical change, and prediction suggestion.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            tacticalChange: { type: Type.STRING },
            predictionSlug: { type: Type.STRING },
            hypeRating: { type: Type.NUMBER }
          },
          required: ["summary", "tacticalChange", "predictionSlug", "hypeRating"]
        }
      }
    });
    res.json(JSON.parse(response.text || "{}"));
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "AI Error" });
  }
});

app.post("/api/ai/personalize", async (req, res) => {
  const { userData, matches } = req.body;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on user profile: ${JSON.stringify(userData)} and upcoming matches: ${JSON.stringify(matches)}. Suggest top 3 matches they should watch and why. Return as JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              matchId: { type: Type.STRING },
              reason: { type: Type.STRING }
            }
          }
        }
      }
    });
    res.json(JSON.parse(response.text || "[]"));
  } catch (error) {
    res.status(500).json({ error: "AI error" });
  }
});

app.get("/api/ai/trivia", async (req, res) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate 5 interesting football trivia questions for a daily challenge. Each with 4 options and one correct answer. Return JSON.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              answerIndex: { type: Type.NUMBER }
            }
          }
        }
      }
    });
    res.json(JSON.parse(response.text || "[]"));
  } catch (error) {
    res.status(500).json({ error: "AI error" });
  }
});

// Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
