const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.post("/chat", async (req, res) => {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: req.body.message || "Hello"
          }
        ]
      })
    });

    const data = await response.json();
    console.log("API RESPONSE:", data);

    const reply = data.choices?.[0]?.message?.content;

console.log("BOT REPLY:", reply);

res.json({
  content: [
    {
      text: reply || "No response from AI"
    }
  ]
});

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});