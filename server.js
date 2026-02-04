import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + process.env.AIzaSyCn6Wf0G51tTmWcgJSSFrsdXGaL890zXiY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
You are Roboost AI, an assistant for Roboost Solutions.
You specialize in Industrial IoT, AI, Embedded Systems, Automation.
Be professional, concise, and helpful.

User: ${userMessage}
                  `
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    res.json({ reply: reply || "Sorry, I couldn’t respond." });
  } catch (err) {
    res.status(500).json({ reply: "Server error. Try again." });
  }
});

app.listen(3000, () => {
  console.log("Roboost AI backend running on port 3000");
});
