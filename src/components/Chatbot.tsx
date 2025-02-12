import React, { useState, useRef, useEffect } from "react";
import { getChatbotResponse } from "../services/api";
import { FiVolume2, FiCopy } from "react-icons/fi";

const languages = [
  { code: "en", name: "English", voice: "en-US" },
  { code: "ta", name: "Tamil", voice: "ta-IN" },
  { code: "te", name: "Telugu", voice: "te-IN" },
  { code: "ml", name: "Malayalam", voice: "ml-IN" },
  { code: "hi", name: "Hindi", voice: "hi-IN" },
];

const Chatbot: React.FC = () => {
  const [question, setQuestion] = useState("");
  const [language, setLanguage] = useState("en");
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "bot" }[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    setMessages((prev) => [...prev, { text: question, sender: "user" }]);
    const data = await getChatbotResponse(question, language);
    setMessages((prev) => [...prev, { text: data.answer, sender: "bot" }]);
    setQuestion("");
  };

  const handleSpeak = (text: string) => {
    if (!window.speechSynthesis) {
      console.warn("Text-to-Speech not supported in this browser.");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    const langConfig = languages.find((lang) => lang.code === language);
    if (langConfig) utterance.lang = langConfig.voice;
    speechSynthesis.speak(utterance);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => alert("Copied to clipboard!"));
  };

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-4">
      <h2 className="text-xl font-bold text-center mb-4">College Chatbot</h2>
      <select
        className="w-full p-2 border rounded mb-2"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
      <div className="h-80 overflow-y-auto p-2 border rounded mb-2 bg-gray-100">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} mb-2`}
          >
            <div
              className={`p-2 rounded-lg max-w-xs relative ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              {msg.text}
              {msg.sender === "bot" && (
                <div className="flex space-x-2 mt-1 absolute right-2 bottom-2">
                  <FiVolume2
                    className="text-gray-600 cursor-pointer"
                    onClick={() => handleSpeak(msg.text)}
                  />
                  <FiCopy
                    className="text-gray-600 cursor-pointer"
                    onClick={() => handleCopy(msg.text)}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={chatRef}></div>
      </div>
      <div className="flex">
        <input
          type="text"
          className="flex-grow p-2 border rounded-l"
          placeholder="Ask a question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 rounded-r"
          onClick={handleAskQuestion}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;