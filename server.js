import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());

// ===== HEALTH CHECK (OPTIONAL) =====
app.get("/", (req, res) => {
  res.send("Roboost AI Backend is running");
});

// ===== CHAT ENDPOINT =====
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.json({ reply: "Message is empty." });
  }

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://roboost.github.io", // optional
          "X-Title": "Roboost AI Assistant"           // optional
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `
You are Roboost AI, a professional assistant for Roboost Solutions.
Roboost works in Industrial IoT, AI, Embedded Systems, Automation, and Cloud platforms.
Answer clearly, professionally, and concisely.
If asked about careers, guide users to the Careers page.
              `
            },
            {
              role: "user",
              content: userMessage
            }
          ]
        })
      }
    );

    const data = await response.json();

    const reply =
      data?.choices?.[0]?.message?.content ||
      "AI did not return a response.";

    res.json({ reply });

  } catch (error) {
    console.error("AI ERROR:", error);
    res.json({ reply: "AI service error. Please try again." });
  }
});

// ===== START SERVER =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Roboost AI backend running on port ${PORT}`);
});
