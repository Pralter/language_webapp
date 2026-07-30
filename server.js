import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Needed because __dirname doesn't exist in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure API key exists
if (!process.env.GEMINI_API_KEY) {
    console.error("\nERROR: GEMINI_API_KEY was not found.");
    console.error("Create a .env file in the project root:");
    console.error("GEMINI_API_KEY=YOUR_API_KEY\n");
    process.exit(1);
}

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

/**
 * POST /api/chat
 * Body:
 * {
 *    "message": "Hello"
 * }
 */
app.post("/api/chat", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || message.trim() === "") {
            return res.status(400).json({
                success: false,
                error: "Message is required."
            });
        }

        const model = genAI.getGenerativeModel({
            // Allow overriding the model via env var for compatibility
            model: process.env.GEMINI_MODEL || "gemini-1.0",
            systemInstruction: `
You are a friendly bilingual language tutor.

Your purpose is to teach English to native Nepali speakers and Nepali to native English speakers.

Always:

• Be encouraging and patient.
• Keep explanations beginner-friendly.
• Whenever appropriate, provide BOTH English and Nepali (Devanagari).
• Include Roman phonetic transliteration for Nepali words.
• Correct grammar politely.
• Give example sentences.
• Explain difficult vocabulary simply.

Formatting:

English:
...

Nepali:
...

Pronunciation:
...

Example:
...

Keep responses concise unless the user asks for detailed explanations.
`
        });

        const result = await model.generateContent(message);

        const response = result.response.text();

        res.json({
            success: true,
            reply: response
        });

    } catch (error) {

        console.error("\n===== GEMINI ERROR =====");
        console.error(error);
        console.error("========================\n");

        const devMessage = error && error.message ? error.message : "Unable to generate a response at this time.";

        res.status(500).json({
            success: false,
            error: process.env.NODE_ENV === "production" ? "Unable to generate a response at this time." : devMessage
        });
    }
});

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        message: "Server is running."
    });
});

// SPA fallback
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
    console.log("====================================");
    console.log(" English ↔ Nepali Language Tutor");
    console.log("====================================");
    console.log(`Server running on http://localhost:${PORT}`);
    console.log("Gemini API loaded successfully.");
});