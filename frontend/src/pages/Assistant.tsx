"use client";

import { Bot, MessageCircleMore, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const ChatbotUI = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Namaste! How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  const handleSend = async () => {
    if (input.trim() === "") return;

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    const userMessage = input;
    setInput("");

    try {
      const res = await fetch("http://localhost:5000/api/chat/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();
setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
      console.log(data.reply);

    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, there was an error processing your request." },
      ]);
    }
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/chat/clear", { method: "POST" });
  }, []);

  useEffect(() => {
    // @ts-expect-error: chatEndRef may be null or not have scrollIntoView, but we ensure it's used safely
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-[800px] rounded-lg shadow-lg border border-indigo-800 bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-indigo-800 text-white rounded-t-lg">
          <div className="flex flex-row justify-center items-center space-x-2">
            <MessageCircleMore />
            <h1 className="font-bold text-lg">AI Assist</h1>
          </div>
          <div className="flex gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          </div>
        </div>

        {/* Chat Window */}
        <div className="p-4 space-y-4 min-h-[400px] max-h-[400px] overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex flex-row ${
                message.sender === "bot"
                  ? "items-start"
                  : "items-end justify-end"
              } gap-3`}
            >
              {message.sender === "bot" && (
                <div className="mt-1 p-2 rounded-full bg-yellow-300">
                  <Bot />
                </div>
              )}
              <div
                className={`${
                  message.sender === "bot"
                    ? "bg-indigo-100 text-black"
                    : "bg-indigo-800 text-white"
                } rounded-lg p-3 shadow`}
              >
                <p>{message.text}</p>
              </div>
              {message.sender === "user" && (
                <div className="mb-1 p-2 rounded-full bg-green-300">
                  <User />
                </div>
              )}
            </div>
          ))}
          <div ref={chatEndRef}></div>
        </div>

        {/* Input Section */}
        <div className="flex items-center p-2 border-t bg-indigo-400 bg-opacity-50 backdrop-blur-sm rounded-b-md">
          <input
            type="text"
            className="flex-1 bg-white border border-indigo-800 rounded-lg px-4 py-2 text-black outline-none"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            className="ml-2 px-4 py-2 bg-indigo-800 text-white rounded-lg hover:bg-indigo-900 transition-all duration-200"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotUI;
