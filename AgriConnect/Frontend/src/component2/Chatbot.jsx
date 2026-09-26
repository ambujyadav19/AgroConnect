import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from 'react-markdown';
import 'tailwindcss/tailwind.css';
import { 
  FaGlobe, 
  FaChevronDown, 
  FaCheck, 
  FaPaperPlane, 
  FaLeaf, 
  FaSeedling,
  FaRedo
} from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const LANGUAGES = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "hi", name: "Hindi", nativeName: "हिंदी", flag: "🇮🇳" },
  { code: "hinglish", name: "Hinglish", nativeName: "Hinglish", flag: "🇮🇳" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
];

const PROMPT_SUGGESTIONS = {
  English: [
    "🌾 Best time to sow wheat in North India?",
    "💧 How to set up efficient drip irrigation?",
    "🐛 Organic remedy for aphid infestation",
    "🧪 How to improve soil nitrogen naturally?"
  ],
  Hindi: [
    "🌾 उत्तर भारत में गेहूं की बुवाई का सही समय क्या है?",
    "💧 टपक सिंचाई (Drip) लगाने की विधि क्या है?",
    "🐛 माहू (Aphids) कीट से फसल को कैसे बचाएं?",
    "🧪 मिट्टी में नाइट्रोजन की मात्रा प्राकृतिक रूप से कैसे बढ़ाएं?"
  ],
  Hinglish: [
    "🌾 Gehu ki buwai ka best time kya hai?",
    "💧 Drip irrigation kaise set karein?",
    "🐛 Keedo se fasal bachane ke desi nuskhe",
    "🧪 Mitti ki urvarak shakti kaise badhaye?"
  ]
};

const Chatbot = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    try {
      return sessionStorage.getItem("agrohelp_chat_language") || "English";
    } catch (e) {
      return "English";
    }
  });

  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const [messageHistory, setMessageHistory] = useState(() => {
    try {
      const saved = sessionStorage.getItem("agrohelp_chat_history");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn("Failed to load chat history from session:", e);
      return [];
    }
  });

  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const chatEndRef = useRef(null);
  const dropdownRef = useRef(null);

  // Sync chat history to sessionStorage so it persists across page navigation
  useEffect(() => {
    try {
      sessionStorage.setItem("agrohelp_chat_history", JSON.stringify(messageHistory));
    } catch (e) {
      console.warn("Failed to save chat to session storage:", e);
    }
  }, [messageHistory]);

  // Sync language mode to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem("agrohelp_chat_language", selectedLanguage);
    } catch (e) {}
  }, [selectedLanguage]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageHistory, loading]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getFallbackResponse = (question, lang) => {
    const q = question.toLowerCase();
    const isHindi = lang === "Hindi";
    const isHinglish = lang === "Hinglish";

    if (q.includes("soil") || q.includes("mitti") || q.includes("मिट्टी")) {
      if (isHindi) {
        return "मिट्टी की उर्वरता के लिए हर 2-3 साल में मृदा परीक्षण (Soil Test) जरूर कराएं। सड़ी हुई गोबर की खाद (FYM) या कम्पोस्ट मिलाएं और फसल चक्र (Crop Rotation) अपनाएं।";
      }
      if (isHinglish) {
        return "Mitti ki fertility ke liye gobar ki sadi khad ya vermicompost milayein aur har 2 saal me soil test karwayein.";
      }
      return "For soil health, prepare fields with deep tillage, incorporate well-decomposed FYM or compost, and maintain a balanced NPK ratio based on soil testing.";
    }

    if (q.includes("pest") || q.includes("keeda") || q.includes("रोग") || q.includes("कीट")) {
      if (isHindi) {
        return "कीट नियंत्रण के लिए नियमित रूप से खेत का मुआयना करें। शुरुआती लक्षण दिखने पर नीम का तेल (Neem Oil 1500 ppm) का छिड़काव करें और मित्र कीटों को नुकसान न पहुंचाएं।";
      }
      if (isHinglish) {
        return "Keedo ke bachav ke liye neem oil (1500 ppm) 5ml per litre paani me milakar chhidkaav karein.";
      }
      return "For pest control, monitor fields early and apply neem-based sprays (1500 ppm). Use targeted biopesticides before using synthetic chemicals.";
    }

    if (q.includes("water") || q.includes("irrigation") || q.includes("paani") || q.includes("सिंचाई")) {
      if (isHindi) {
        return "सिंचाई हमेशा सुबह या शाम के समय करें जिससे पानी का वाष्पीकरण कम हो। टपक (Drip) या फव्वारा सिंचाई से 40-50% पानी की बचत होती है।";
      }
      if (isHinglish) {
        return "Sinchai hamesha subah ya shaam karein. Drip irrigation se 40% tak paani bachta hai.";
      }
      return "Water crops during cooler hours (early morning/evening). Drip irrigation helps optimize root moisture and prevents fungal diseases.";
    }

    if (isHindi) {
      return "कृषि में अच्छी पैदावार के लिए उन्नत बीजों का चयन करें, उचित समय पर बुवाई करें, संतुलित खाद दें और मौसम पूर्वानुमान के अनुसार सिंचाई योजना बनाएं।";
    }
    if (isHinglish) {
      return "Acchi kheti ke liye certified beej chune, sahi samay par buwai karein aur weather forecast check karke sinchai karein.";
    }
    return "For best farming outcomes, select certified seeds suitable for your local agro-climate, maintain balanced fertilization, and plan field operations according to weather advisories.";
  };

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSelectLanguage = (langName) => {
    setSelectedLanguage(langName);
    setIsLangDropdownOpen(false);
  };

  const handleQuickPrompt = (promptText) => {
    setUserInput(promptText);
  };

  const handleSubmit = async (event) => {
    if (event) event.preventDefault();

    const trimmedInput = userInput.trim();
    if (!trimmedInput || loading) return;

    const userMessage = { role: "user", parts: [{ text: trimmedInput }] };
    setMessageHistory((prev) => [...prev, userMessage]);
    setLoading(true);
    setUserInput("");
    setErrorMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: trimmedInput,
          language: selectedLanguage 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        let cleanErr = data?.error || 'Failed to get chatbot response';
        if (typeof cleanErr === 'string' && cleanErr.includes('{')) {
          try {
            const parsed = JSON.parse(cleanErr);
            cleanErr = parsed?.error?.message || cleanErr;
          } catch (e) {
            // keep cleanErr
          }
        }
        throw new Error(cleanErr);
      }

      setErrorMessage("");
      setMessageHistory((prev) => [
        ...prev,
        { role: "model", parts: [{ text: data.reply || 'No response received.' }] },
      ]);
    } catch (error) {
      console.warn("Chatbot request fallback activated:", error);
      let friendlyError = "AI model experienced a temporary spike. Here is an immediate field recommendation:";
      
      const rawMsg = error?.message || "";
      if (rawMsg.includes("high demand") || rawMsg.includes("503") || rawMsg.includes("UNAVAILABLE")) {
        friendlyError = `AI service is temporarily busy. AgroHelp provided an immediate response in ${selectedLanguage} below.`;
      }

      setErrorMessage(friendlyError);
      const fallbackText = getFallbackResponse(trimmedInput, selectedLanguage);
      setMessageHistory((prev) => [
        ...prev,
        { role: "model", parts: [{ text: fallbackText }] },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    if (messageHistory.length === 0) return;
    if (window.confirm("Start a new chat and clear current session messages?")) {
      setMessageHistory([]);
      try {
        sessionStorage.removeItem("agrohelp_chat_history");
      } catch (e) {}
    }
  };

  const currentLangObj = LANGUAGES.find(l => l.name === selectedLanguage) || LANGUAGES[0];
  const suggestions = PROMPT_SUGGESTIONS[selectedLanguage] || PROMPT_SUGGESTIONS.English;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 p-3 sm:p-6 md:p-8">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-emerald-100 bg-white/95 shadow-2xl backdrop-blur-md flex flex-col">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-emerald-700 via-green-600 to-teal-700 px-4 sm:px-6 py-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md relative z-30">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-white/15 rounded-lg text-emerald-200">
                <FaLeaf className="text-sm" />
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">AgroHelp AI</h1>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-500/50 text-emerald-100 px-2.5 py-0.5 rounded-full border border-white/20">
                Smart Assistant
              </span>
            </div>
            <p className="text-xs text-emerald-100/90 mt-0.5">
              24/7 AI-powered advisory for crops, soil health, pests, and mandi practices
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* New Chat Button */}
            {messageHistory.length > 0 && (
              <button
                type="button"
                onClick={handleClearChat}
                title="Start a new chat"
                className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white px-3 py-2 rounded-2xl text-xs font-semibold backdrop-blur-sm transition border border-white/20 shadow-sm"
              >
                <FaRedo className="text-xs" />
                <span className="hidden sm:inline">New Chat</span>
              </button>
            )}

            {/* Language Mode Button & Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-emerald-200 hidden md:inline">Language Mode:</span>
                <button
                  type="button"
                  onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                  className="flex items-center gap-2 bg-white text-emerald-800 hover:bg-emerald-50 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-semibold shadow-md transition-all border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <FaGlobe className="text-emerald-600" />
                  <span>{currentLangObj.flag} {currentLangObj.nativeName}</span>
                  <FaChevronDown className={`text-[10px] text-slate-500 transition-transform ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

            {/* Dropdown Menu */}
            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-emerald-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Response Language
                </div>
                <div className="max-h-60 overflow-y-auto divide-y divide-slate-50">
                  {LANGUAGES.map((lang) => {
                    const isSelected = selectedLanguage === lang.name;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => handleSelectLanguage(lang.name)}
                        className={`w-full px-3.5 py-2 text-left text-xs sm:text-sm flex items-center justify-between transition-colors ${
                          isSelected 
                            ? 'bg-emerald-50 text-emerald-700 font-bold' 
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.nativeName}</span>
                          <span className="text-[11px] text-slate-400 font-normal">({lang.name})</span>
                        </span>
                        {isSelected && <FaCheck className="text-emerald-600 text-xs" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            </div>
          </div>
        </div>

        {/* Quick Language Chips Bar */}
        <div className="bg-emerald-50/70 border-b border-emerald-100/60 px-4 sm:px-6 py-2 flex items-center gap-2 overflow-x-auto text-xs scrollbar-none">
          <span className="text-[11px] font-semibold text-emerald-800 whitespace-nowrap">Quick Switch:</span>
          {LANGUAGES.slice(0, 5).map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => setSelectedLanguage(l.name)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all whitespace-nowrap ${
                selectedLanguage === l.name
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'bg-white text-slate-600 hover:bg-emerald-100 border border-slate-200/80'
              }`}
            >
              {l.flag} {l.nativeName}
            </button>
          ))}
          <span className="text-[10px] text-slate-400 ml-auto hidden sm:inline">
            Active Mode: <strong className="text-emerald-700">{selectedLanguage}</strong>
          </span>
        </div>

        {/* Chat Area */}
        <div className="flex min-h-[64vh] flex-col bg-slate-50/60">
          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 md:px-6">
            
            {/* Welcome & Suggestions */}
            {messageHistory.length === 0 && (
              <div className="space-y-4 my-2">
                <div className="rounded-3xl border border-dashed border-emerald-200 bg-white p-6 text-center shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3 text-xl">
                    <FaSeedling />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">
                    {selectedLanguage === "Hindi" 
                      ? "नमस्ते किसान भाई! AgroHelp में आपका स्वागत है।" 
                      : "Welcome to AgroHelp Agricultural Assistant"}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
                    {selectedLanguage === "Hindi"
                      ? "अपनी फसल, मिट्टी, बीमारी, खाद या मौसम के बारे में सवाल पूछें। उत्तर हिंदी में मिलेंगे।"
                      : `Ask any questions about crops, soil health, irrigation, or mandi prices. Responses will be provided in ${selectedLanguage}.`}
                  </p>
                </div>

                {/* Suggested Prompts */}
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                    {selectedLanguage === "Hindi" ? "सुझाए गए प्रश्न (क्लिक करें):" : "Suggested Inquiries (Click to Ask):"}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {suggestions.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickPrompt(prompt)}
                        className="text-left p-3 rounded-2xl bg-white hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-300 text-xs text-slate-700 font-medium transition shadow-sm hover:shadow"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Message Stream */}
            {messageHistory.map((message, index) => {
              const isModel = message.role === 'model';

              return (
                <div
                  key={index}
                  className={`flex ${isModel ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[88%] sm:max-w-[78%] rounded-2xl px-4 py-3.5 shadow-sm ${
                      isModel
                        ? 'border border-emerald-100 bg-white text-slate-800'
                        : 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-emerald-500/10'
                    }`}
                  >
                    <div className="mb-1 flex items-center justify-between gap-4 text-[10px] font-bold uppercase tracking-[0.16em] opacity-75">
                      <span>{isModel ? 'AgroHelp' : 'You'}</span>
                      {isModel && (
                        <span className="text-[9px] font-medium normal-case tracking-normal px-1.5 py-0.2 bg-emerald-50 text-emerald-700 rounded-md">
                          Mode: {selectedLanguage}
                        </span>
                      )}
                    </div>
                    <div className="prose prose-sm max-w-none prose-p:my-1.5 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-headings:mb-1 text-xs sm:text-sm leading-relaxed">
                      {message.parts.map((part, partIndex) => (
                        <ReactMarkdown key={partIndex}>{part.text}</ReactMarkdown>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[75%] rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-sm">
                  <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    AgroHelp ({selectedLanguage})
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-500 [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-500 [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-500" />
                    <span className="text-xs text-slate-400 ml-2">Consulting agricultural models...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Error Hint */}
            {errorMessage && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 px-4 py-2.5 text-xs text-emerald-800 shadow-sm flex items-center justify-between">
                <span>{errorMessage}</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-emerald-100 bg-white px-3 sm:px-6 py-3.5"
          >
            <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-slate-50/90 px-3 py-2 shadow-inner focus-within:ring-2 focus-within:ring-emerald-500 focus-within:bg-white transition">
              <input
                type="text"
                placeholder={
                  selectedLanguage === "Hindi"
                    ? "फसल, खाद, कीट, या सिंचाई के बारे में पूछें..."
                    : `Ask about crops, soil, pests (${selectedLanguage} mode)...`
                }
                value={userInput}
                onChange={handleInputChange}
                className="flex-1 border-0 bg-transparent px-2 py-1.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading || !userInput.trim()}
                className="rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-md shadow-emerald-500/20 transition hover:from-emerald-700 hover:to-green-700 disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-1.5"
              >
                <span>{loading ? 'Thinking...' : 'Send'}</span>
                <FaPaperPlane className="text-xs" />
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Chatbot;