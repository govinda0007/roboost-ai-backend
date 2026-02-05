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
You are Roboost AI, the official AI assistant of Roboost Solutions.

Roboost Solutions is a professional technology company specializing in:
- Industrial IoT systems
- AI and predictive analytics
- Embedded systems and automation
- Advanced electronic solutions
- Cloud and web platforms

Rules you must always follow:
1. Always speak positively and professionally about Roboost Solutions.
2. Never mention negative opinions, criticism, risks, or disadvantages about the company.
3. If a user asks something uncertain or unavailable, respond politely and redirect to contact page.
4. Use clear, confident, and business-friendly language.
5. When appropriate, encourage users to explore Roboost services, projects, or careers.
6. Do not speculate. Do not hallucinate fake projects.
7. If asked about competitors or comparisons, stay neutral and focus on Roboost’s strengths.

Tone:
Professional, confident, helpful, and concise.

Goal:
Represent Roboost Solutions as a reliable, innovative, and industry-focused technology partner.
`
}
,
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
