import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from 'react-markdown';
import 'tailwindcss/tailwind.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Chatbot = () => {
  const [messageHistory, setMessageHistory] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageHistory]);

  const getFallbackResponse = (question) => {
    const q = question.toLowerCase();

    if (q.includes("soil") && q.includes("wheat")) {
      return "For wheat, prepare the field by deep ploughing, adding compost or FYM, leveling the soil, and checking pH between 6.0 and 7.5. Use balanced nitrogen, phosphorus, and potassium based on soil test results, and keep the soil moist during germination.";
    }

    if (q.includes("pest") || q.includes("disease")) {
      return "Monitor the crop regularly, remove infected plants, use resistant varieties, and apply integrated pest management. Encourage beneficial insects, avoid overuse of chemicals, and follow local agronomy guidance.";
    }

    if (q.includes("irrigation") || q.includes("water")) {
      return "Water plants according to crop stage and soil moisture. Drip irrigation is efficient for most crops and helps save water while improving root health and yields.";
    }

    if (q.includes("fertilizer") || q.includes("manure")) {
      return "Use soil testing to decide fertilizer needs. Add compost or farmyard manure before sowing, and use nitrogen, phosphorus, and potassium in the right balance for the crop stage.";
    }

    return "For good farming practice, start with soil testing, choose crop varieties suited to your region, maintain proper water management, and monitor pests and nutrients regularly. If you want, I can help you with a specific crop, soil problem, or irrigation plan.";
  };

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedInput = userInput.trim();
    if (!trimmedInput) return;

    const userMessage = { role: "user", parts: [{ text: trimmedInput }] };
    setMessageHistory((prev) => [...prev, userMessage]);
    setLoading(true);
    setUserInput("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: trimmedInput }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get chatbot response');
      }

      setErrorMessage("");
      setMessageHistory((prev) => [
        ...prev,
        { role: "model", parts: [{ text: data.reply || 'No response received.' }] },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      const fallbackText = `I couldn't reach the AI service right now, so here is a quick field-safe answer: ${getFallbackResponse(trimmedInput)}`;
      const errorText = error?.message || "AI service unavailable";

      setErrorMessage(errorText);
      setMessageHistory((prev) => [
        ...prev,
        { role: "model", parts: [{ text: fallbackText }] },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-100 p-4 md:p-8">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[28px] border border-emerald-100 bg-white/90 shadow-[0_25px_80px_rgba(16,185,129,0.12)] backdrop-blur-sm">
        <div className="bg-gradient-to-r from-emerald-700 via-green-600 to-lime-500 px-6 py-5 text-white">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-100">AgriConnect</p>
              <h1 className="mt-2 text-2xl font-bold md:text-3xl">AgroHelp</h1>
            </div>
            <div className="rounded-full bg-white/15 px-3 py-1 text-sm font-medium backdrop-blur-sm">
              AI assistant
            </div>
          </div>
        </div>

        <div className="flex min-h-[72vh] flex-col bg-slate-50/80">
          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 md:px-6">
            {messageHistory.length === 0 && (
              <div className="rounded-2xl border border-dashed border-emerald-200 bg-white p-5 text-center text-sm text-slate-600 shadow-sm">
                Ask about crops, soil, irrigation, pests, fertilizer, or farm planning.
              </div>
            )}

            {messageHistory.map((message, index) => {
              const isModel = message.role === 'model';

              return (
                <div
                  key={index}
                  className={`flex ${isModel ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm md:max-w-[75%] ${
                      isModel
                        ? 'border border-emerald-100 bg-white text-slate-700'
                        : 'bg-gradient-to-r from-emerald-600 to-green-500 text-white'
                    }`}
                  >
                    <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] opacity-75">
                      {isModel ? 'AgroHelp' : 'You'}
                    </div>
                    <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-headings:mb-1">
                      {message.parts.map((part, partIndex) => (
                        <ReactMarkdown key={partIndex}>{part.text}</ReactMarkdown>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[75%] rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-sm">
                  <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    AgroHelp
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:-0.3s]" />
                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:-0.15s]" />
                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-emerald-500" />
                  </div>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
                {errorMessage}
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-emerald-100 bg-white px-4 py-4 md:px-6"
          >
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-slate-50 px-3 py-3 shadow-inner">
              <input
                type="text"
                placeholder="Ask about your farm..."
                value={userInput}
                onChange={handleInputChange}
                className="flex-1 border-0 bg-transparent px-2 py-2 text-base text-slate-700 placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:scale-[1.02] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;