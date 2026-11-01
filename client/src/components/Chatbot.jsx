
import { useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: "Hi! 👋 I'm CampusAssist, your AI student help desk. Ask me anything about academics or college life!",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    const message = input.trim();
    if (!message || loading) return;

    const previousMessages = messages.filter(
      (item) => item.role === "user" || item.role === "model"
    );

    setMessages((prev) => [...prev, { role: "user", text: message }]);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("studentHelpDeskToken");

      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message,
          history: previousMessages.slice(-10),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to get AI response.");
      }

      setMessages((prev) => [
        ...prev,
        { role: "model", text: data.reply },
      ]);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[600px] flex-col overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)]">

      {/* Header */}
      <div className="flex items-center gap-3 border-b border-[var(--border-color)] p-5">
        <div className="rounded-xl bg-blue-600 p-3 text-xl">
          🤖
        </div>

        <div>
          <h2 className="font-bold text-[var(--text-primary)]">
            CampusAssist AI
          </h2>
          <p className="text-xs text-green-600 dark:text-green-400">
            ● AI Student Support
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-5 overflow-y-auto bg-[var(--bg-primary)] p-5">

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)]"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="animate-pulse text-sm text-blue-600 dark:text-blue-400">
            CampusAssist is thinking...
          </div>
        )}

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={sendMessage}
        className="flex gap-3 border-t border-[var(--border-color)] bg-[var(--bg-secondary)] p-4"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your question..."
          maxLength={2000}
          disabled={loading}
          className="min-w-0 flex-1 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)] focus:border-blue-500"
        />

        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-xl bg-blue-600 px-5 font-semibold text-white hover:bg-blue-700 disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default Chatbot;
