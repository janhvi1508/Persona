import "dotenv/config";
import { OpenAI } from "openai";
import { PIYUSH_SIR_PROMPT } from "./prompts.js";

const client = new OpenAI({
  apiKey: process.env.SECRET_KEY,
});

const MESSAGES_DB = [{ role: "system", content: PIYUSH_SIR_PROMPT }];

async function main(prompt = "") {
  MESSAGES_DB.push({ role: "user", content: prompt });

  console.log("Starting the Piyush Sir processing pipeline...\n");

  while (true) {
    const result = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: MESSAGES_DB,
      response_format: { type: "json_object" },
    });

    const rawResult = result.choices[0].message.content;
    const parsedResult = JSON.parse(rawResult);

    MESSAGES_DB.push({ role: "assistant", content: rawResult });

    console.log(`🤖 (${parsedResult.step}): ${parsedResult.text}\n`);

    const currentStep = parsedResult.step.toUpperCase();
    if (currentStep === "OUTPUT" || currentStep === "REJECTED") {
      console.log("Pipeline finished.");
      break;
    }
  }
}

main(
  "Piyush sir, I am starting a new project. Should I build it using a monolithic architecture or go straight to microservices?",
);
