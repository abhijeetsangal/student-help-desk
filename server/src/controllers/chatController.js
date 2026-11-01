
const { GoogleGenAI } = require("@google/genai");
const asyncHandler = require("../middleware/asyncHandler");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

exports.chat = asyncHandler(async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({
      message: "Please enter a question.",
    });
  }

  if (message.length > 2000) {
    return res.status(400).json({
      message: "Your question is too long. Maximum 2000 characters.",
    });
  }

  if (!Array.isArray(history) || history.length > 10) {
    return res.status(400).json({
      message: "Invalid chat history.",
    });
  }

  const validHistory = history.every(
    (item) =>
      item &&
      ["user", "model"].includes(item.role) &&
      typeof item.text === "string" &&
      item.text.length <= 2000
  );

  if (!validHistory) {
    return res.status(400).json({
      message: "Invalid chat history format.",
    });
  }

  const historyText = history
    .slice(-10)
    .map(
      (item) =>
        `${item.role === "user" ? "Student" : "Assistant"}: ${item.text}`
    )
    .join("\n");

  const prompt = `
You are CampusAssist, an AI-powered Student Help Desk assistant.

Student name: ${req.user.name}
Student course: ${req.user.course || "Not specified"}

Your responsibilities:
1. Help students with academic and college-related questions.
2. Explain concepts in simple language.
3. Help with admissions, examinations, attendance, fees and campus services.
4. Be polite, concise and easy to understand.
5. Never invent official college policies, dates, fees or deadlines.
6. If you do not know an official answer, clearly say so and suggest contacting college administration.
7. Do not pretend that you have access to college records.

Previous conversation:
${historyText || "No previous conversation."}

Current student question:
${message.trim()}
`;

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL,
    contents: prompt,
  });

  const reply = response.text;

  if (!reply) {
    return res.status(502).json({
      message: "The AI could not generate a response. Please try again.",
    });
  }

  res.json({ reply });
});
