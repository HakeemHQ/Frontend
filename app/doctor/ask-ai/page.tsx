"use client";

import React, { useState, useRef, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AiMagicIcon,
  Chemistry01Icon,
  ArrowRight01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";

type Message = {
  id: string;
  role: "user" | "bot";
  text: string;
  timestamp: Date;
};

export default function AskAIPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponses = [
        "I can certainly help you analyze that lab report. Could you specify which values you're concerned about?",
        "Based on the patient's history, that seems like a normal variance, but I recommend checking their previous HbA1c levels for a better baseline.",
        "I've found 3 recent clinical guidelines regarding this treatment protocol. Would you like me to summarize them?",
        "The interaction between those two medications is generally mild, but you should monitor for potential liver enzyme elevation."
      ];
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const newBotMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: messages.length === 0 ? "Hello there Dr. Ahmed, how can I help you today?" : randomResponse,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, newBotMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const suggestedPrompts = [
    "Analyze recent lab results",
    "Check drug interactions",
    "Summarize patient history",
    "Draft a referral letter"
  ];

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col max-w-5xl mx-auto bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden relative animate-in fade-in zoom-in-95 duration-300">
      
      {/* Header */}
      <div className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-slate-100 bg-white/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-sm">
            <HugeiconsIcon icon={AiMagicIcon} className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 leading-tight">H-bot AI Assistant</h1>
            <p className="text-xs font-medium text-emerald-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Online & Ready
            </p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-24 h-24 mb-6 rounded-full bg-blue-50 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-blue-100/50 rounded-full animate-ping opacity-75 duration-1000"></div>
              <HugeiconsIcon icon={Chemistry01Icon} className="w-10 h-10 text-blue-600 relative z-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2 font-heading">How can I assist you today?</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-8">
              I can help you analyze medical records, check for drug interactions, or summarize patient histories securely.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
              {suggestedPrompts.map((prompt, i) => (
                <button 
                  key={i}
                  onClick={() => {
                    setInputValue(prompt);
                    // Slight delay to allow state update before sending if we wanted to auto-send, 
                    // but we'll just populate the input for the user to edit or send.
                  }}
                  className="px-4 py-3 bg-white border border-slate-200 hover:border-blue-300 hover:shadow-sm hover:bg-blue-50/50 rounded-xl text-sm font-medium text-slate-700 transition-all text-left flex items-center gap-2"
                >
                  <HugeiconsIcon icon={AiMagicIcon} className="w-4 h-4 text-blue-500" />
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 pb-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className="flex max-w-[80%] gap-3">
                  {msg.role === 'bot' && (
                    <div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-sm mt-1">
                      <HugeiconsIcon icon={AiMagicIcon} className="w-4 h-4" />
                    </div>
                  )}
                  
                  <div className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div 
                      className={`px-5 py-3.5 shadow-sm text-[15px] leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm' 
                          : 'bg-white border border-slate-100 text-slate-800 rounded-2xl rounded-tl-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] font-medium text-slate-400 px-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 shrink-0 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 mt-1">
                      <HugeiconsIcon icon={UserIcon} className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start animate-in fade-in duration-300">
                <div className="flex gap-3">
                  <div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-sm mt-1">
                    <HugeiconsIcon icon={AiMagicIcon} className="w-4 h-4" />
                  </div>
                  <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="shrink-0 p-4 bg-white border-t border-slate-100">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask H-bot anything about your patients or medical records..."
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-full pl-6 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-full transition-colors shadow-sm"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} className="w-5 h-5" />
          </button>
        </form>
        <p className="text-center text-[11px] font-medium text-slate-400 mt-3">
          H-bot can make mistakes. Consider verifying critical clinical information.
        </p>
      </div>

    </div>
  );
}
