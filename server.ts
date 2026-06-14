/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI client lazily to avoid crash on startup if key is missing as per instructions
let aiClient: GoogleGenAI | null = null;
const API_KEY = process.env.GEMINI_API_KEY;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient && API_KEY) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    } catch (e) {
      console.error("Failed to initialize GoogleGenAI client:", e);
    }
  }
  return aiClient;
}

// 1. Time Travel & Simulation generation endpoint
app.post("/api/simulate", async (req, res) => {
  const { year, config, isCustomYearRequest } = req.body;
  const client = getAiClient();

  if (!client) {
    // Graceful fallback to indicate Simulated Offline Mode
    return res.json({
      success: true,
      mode: "offline",
      message: "Simulation launched in offline tactical mode. Configure GEMINI_API_KEY in Secrets for real-time quantum projections."
    });
  }

  try {
    const prompt = `You are the core simulator engine for TIME MACHINE AI, a civilization-scale simulation.
The year is ${year}.
The civilization choices are:
- Government: ${config.government}
- Economy: ${config.economy}
- Energy: ${config.energy}
- Education: ${config.education}
- Space Expansion: ${config.spaceExpansion}

Generate a comprehensive simulation report in JSON format representing this state.
Provide very detailed, highly immersive sci-fi descriptions without "AI slop" or meta-indicators.
Do not introduce unrelated keys. Follow this exact JSON schema:
{
  "civilizationDnaName": "Name of Classified DNA, e.g., Solarpunk Federation",
  "civilizationDescription": "A 2-3 sentence overview of this society, its environment, and structural patterns.",
  "metrics": {
    "innovation": 75,
    "happiness": 80,
    "automation": 90,
    "sustainability": 85,
    "collapseRisk": 20,
    "expansionLevel": 60
  },
  "planetaryUpdates": [
    {
      "planet": "Earth",
      "population": "e.g. 10.2 Billion",
      "economy": "Description of local economic model",
      "government": "Description of local government style",
      "climate": "State of Earth's climate",
      "challenges": "Primary challenge",
      "opportunities": "Primary opportunity"
    },
    {
      "planet": "Mars",
      "population": "e.g. 1.2 Million",
      "economy": "Description of Mars economic model",
      "government": "Description of Mars government",
      "climate": "State of Mars climate",
      "challenges": "Primary Mars challenge",
      "opportunities": "Primary Mars opportunity"
    }
  ],
  "newsArticles": [
    {
      "title": "A captivating future headline aligned with Year ${year}",
      "category": "Politics",
      "content": "A detailed 2-3 sentence description of the news event."
    },
    {
      "title": "A captivating scientific headline aligned with Year ${year}",
      "category": "Science",
      "content": "A detailed 2-3 sentence description of the news event."
    }
  ]
}`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.8
      }
    });

    const resultText = response.text;
    if (resultText) {
      const parsed = JSON.parse(resultText.trim());
      return res.json({
        success: true,
        mode: "ai",
        data: parsed
      });
    } else {
      throw new Error("Empty response from Gemini API");
    }
  } catch (error: any) {
    console.error("Simulation generation failed:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Fallback to offline mode due to simulation error."
    });
  }
});

// 2. Chat with Citizen endpoint
app.post("/api/chat-citizen", async (req, res) => {
  const { citizen, year, config, messageHistory, userMessage } = req.body;
  const client = getAiClient();

  if (!client) {
    return res.json({
      success: true,
      mode: "offline",
      reply: `[Quantum Comm Offline - Local Prediction Core Activated]
Hello traveler. I am ${citizen.name}, working as a ${citizen.role} in the year ${year}.
Based on our current decentralized governance and post-scarcity framework, here is my response:
Indeed, our daily routines have transformed. Since we adopted ${config.energy} and ${config.economy}, we no longer worry about raw extraction. I spend my days tending to the mycelium basalt dome models. To answer your question "${userMessage}": this is exactly where our collective integration excels! Let's keep exploring.`
    });
  }

  try {
    // Build context
    const fullPrompt = `You are simulating the role of ${citizen.name}, a citizen in the year ${year}.
Your Character Bio:
Role: ${citizen.role}
Bio: ${citizen.bio}
Occupation: ${citizen.occupation}
Daily Life Details: ${citizen.dailyLife}
Core Beliefs: ${citizen.beliefs}
General Challenges: ${citizen.challenges}
Vision of Future: ${citizen.futureVision}

The civilization environment around you has:
- Government: ${config.government}
- Economy: ${config.economy}
- Energy: ${config.energy}
- Education: ${config.education}
- Space Expansion: ${config.spaceExpansion}

Here is the conversation history so far:
${JSON.stringify(messageHistory)}

User says: "${userMessage}"

Reply from your exact perspective. Do not break character. Do not refer to yourself as an AI. Be natural, evocative, and speak as a living resident of this timeline who experiences this civilization daily. Keep your reply concise (3-4 sentences max), conversational, and atmospheric.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: fullPrompt,
      config: {
        temperature: 0.9,
      }
    });

    return res.json({
      success: true,
      mode: "ai",
      reply: response.text?.trim() || "Deep telemetry lost. Pleae try again."
    });
  } catch (error: any) {
    console.error("Citizen chat failed:", error);
    return res.json({
      success: true,
      mode: "offline",
      reply: `[Signal Distorted - Subspace Fallback Activated] Sola here. The network is slightly unstable, but we remain fully unified under our collective learning models!`
    });
  }
});

// 3. Ask Humanity (Core consensus endpoint)
app.post("/api/ask-humanity", async (req, res) => {
  const { year, config, query } = req.body;
  const client = getAiClient();

  if (!client) {
    return res.json({
      success: true,
      mode: "offline",
      answer: `Consensus Core 2.0 (Offline Mode): Humanity in ${year} is highly structured around ${config.government}. In response to "${query}", local history archives state that our transition away from 20th-century market limits occurred during the energy revolutions of the mid-2030s, resolving key resource allocation limits.`
    });
  }

  try {
    const prompt = `You are the collective consciousness of humanity during the year ${year}.
The society config is:
- Government: ${config.government}
- Economy: ${config.economy}
- Energy: ${config.energy}
- Education: ${config.education}
- Space Colonies: ${config.spaceExpansion}

A modern researcher asks: "${query}"

Return a response representing the collective consensus, shared memories, or cultural perspectives of your citizens in this year.
Incorporate details of your energy systems (${config.energy}) or educational frameworks (${config.education}) as natural history, explaining how you solved past historic boundaries. Focus on deep philosophical maturity.
Keep it to 2-3 beautiful, immersive sci-fi paragraphs.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.85
      }
    });

    return res.json({
      success: true,
      mode: "ai",
      answer: response.text?.trim()
    });
  } catch (error: any) {
    console.error("Ask humanity failed:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Decision Lab & Prognosis simulation
app.post("/api/decision-lab", async (req, res) => {
  const { query, config, year } = req.body;
  const client = getAiClient();

  if (!client) {
    return res.json({
      success: true,
      mode: "offline",
      prognosis: {
        pros: [
          `Rapid resource optimization under ${config.economy}`,
          "Reduction in legislative latency and political deadlocks",
          "Decoupling civil service from corruptible human channels"
        ],
        cons: [
          "Risk of algorithmic opacity and cold technocratic decisions",
          "Potential feeling of civic alienation among digital demographics",
          "Secondary dependence on quantum processing security cores"
        ],
        globalImpact: "Deeply alters Earth’s civil structures, transitioning local municipalities into highly optimized nodes.",
        timelineImpact: "Accelerates technology development indexes while shifting the risk curve from eco-disasters into security vulnerabilities.",
        civilizationalImpact: "Constructs a highly durable planetary management network, shifting human actions purely from governance into spiritual, artistic, and planetary expansion realms."
      }
    });
  }

  try {
    const prompt = `You are a forecasting intelligence working for FOUNDRY IQ. Analyze the decision: "${query}" in the context of year ${year}.
The surrounding civilization config is:
- Government: ${config.government}
- Economy: ${config.economy}
- Energy: ${config.energy}
- Space Colonies: ${config.spaceExpansion}

Construct a JSON prognosis report with this exact schema:
{
  "pros": ["Pro 1", "Pro 2", "Pro 3"],
  "cons": ["Con 1", "Con 2", "Con 3"],
  "globalImpact": "A Paragraph of global impact on Earth.",
  "timelineImpact": "A Paragraph of timeline shifts.",
  "civilizationalImpact": "A Paragraph of the long-term civilizational development."
}`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.75
      }
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    return res.json({
      success: true,
      mode: "ai",
      prognosis: parsed
    });
  } catch (error: any) {
    console.error("Decision lab forecasting failed:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Serve Vite / frontend bundles
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
    console.log(`TIME MACHINE AI Server booting on port ${PORT}`);
  });
}

startServer();
