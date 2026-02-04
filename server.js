import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.json({ reply: "Message is empty." });
  }

  try {
    const apiKey = process.env.AIzaSyBYby_YtET8cijf9cEcUp9wlDmYuqe_tdk;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: userMessage }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("FULL GEMINI RESPONSE:", JSON.stringify(data, null, 2));

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return res.json({
        reply: "Gemini returned no text response."
      });
    }

    res.json({ reply });

  } catch (err) {
    console.error("GEMINI ERROR:", err);
    res.json({ reply: "Gemini API error occurred." });
  }
});

app.listen(3000, () => {
  console.log("Roboost AI backend running on port 3000");
});
