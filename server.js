import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { OpenAI } from "openai";
import { HITESH_SIR_PROMPT, PIYUSH_SIR_PROMPT } from "./prompts.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Initialize OpenAI client
const apiKey = process.env.SECRET_KEY;
if (!apiKey) {
  console.error("WARNING: SECRET_KEY is not defined in the environment or .env file.");
}

const client = new OpenAI({
  apiKey: apiKey,
});

app.post("/api/chat", async (req, res) => {
  try {
    const { character, history } = req.body;

    if (!character || !history || !Array.isArray(history)) {
      return res.status(400).json({ success: false, error: "Invalid request payload. Character and history are required." });
    }

    let systemPrompt = "";
    if (character === "hitesh") {
      systemPrompt = HITESH_SIR_PROMPT;
    } else if (character === "piyush") {
      systemPrompt = PIYUSH_SIR_PROMPT;
    } else {
      return res.status(400).json({ success: false, error: "Unknown character selection." });
    }

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: "API key is missing on the server. Please add SECRET_KEY to your .env file."
      });
    }

    // Build the messages list starting with the system prompt, followed by the conversation history
    const MESSAGES_DB = [
      { role: "system", content: systemPrompt },
      ...history
    ];

    const newSteps = [];
    let maxLoops = 10; // Safety guard to prevent infinite loops
    let loopCount = 0;

    console.log(`Starting processing pipeline for ${character}...`);

    while (loopCount < maxLoops) {
      loopCount++;
      const result = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: MESSAGES_DB,
        response_format: { type: "json_object" },
      });

      const rawResult = result.choices[0].message.content;
      const parsedResult = JSON.parse(rawResult);

      MESSAGES_DB.push({ role: "assistant", content: rawResult });
      newSteps.push(parsedResult);

      console.log(`🤖 [${character}] (${parsedResult.step}): ${parsedResult.text.substring(0, 60)}...`);

      const currentStep = (parsedResult.step || "").toUpperCase();
      if (currentStep === "OUTPUT" || currentStep === "REJECTED") {
        console.log(`Pipeline finished for ${character} in ${loopCount} steps.`);
        break;
      }
    }

    res.json({
      success: true,
      newSteps: newSteps,
    });

  } catch (error) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({
      success: false,
      error: error.message || "An error occurred while communicating with the AI pipeline."
    });
  }
});

// Serve frontend for all other paths
app.get("/*splat", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`Persona AI Server running on http://localhost:${PORT}`);
  console.log(`==================================================`);
});
