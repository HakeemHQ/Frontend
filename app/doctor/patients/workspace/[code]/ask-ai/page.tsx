"use client";

import React, { useState, useRef, useEffect, use } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AiMagicIcon,
  Chemistry01Icon,
  ArrowRight01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { askAiQuestion, AiSource } from "@/lib/api/ai";

type Message = {
  id: string;
  role: "user" | "bot";
  text: string;
  timestamp: Date;
  sources?: AiSource[];
  isError?: boolean;
};

export default function WorkspaceAskAIPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
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

  const handleSendMessage = async (e?: React.FormEvent, presetPrompt?: string) => {
    e?.preventDefault();
    const textToSend = presetPrompt || inputValue.trim();
    if (!textToSend) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const dataStr = sessionStorage.getItem(`access_${code}`);
      let patientId = "";
      if (dataStr) {
        const accessData = JSON.parse(dataStr);
        patientId = accessData?.patientId || accessData?.patient?.patientId;
      }

      if (!patientId) {
        throw new Error("Patient session not found.");
      }

      const response = await askAiQuestion(patientId, textToSend);
      
      const isSuccess = 'success' in response ? response.success : true;
      const responseData = 'success' in response ? response.data : response;

        if (isSuccess && responseData) {
        const newBotMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "bot",
          text: responseData.message,
          sources: responseData.ragResults,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, newBotMsg]);
      } else {
        throw new Error((response as any).message || "Failed to get an answer.");
      }
    } catch (err: any) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: err.message || "An error occurred while connecting to H-bot.",
        isError: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
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
              Patient Context: {code}
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
            <h2 className="text-2xl font-bold text-slate-900 mb-2 font-heading">How can I assist you with this patient?</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-8">
              I have access to patient {code}&apos;s medical history. I can help analyze records, check for drug interactions, or summarize their case.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
              {suggestedPrompts.map((prompt, i) => (
                <button 
                  key={i}
                  onClick={() => {
                    handleSendMessage(undefined, prompt);
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
                          : msg.isError 
                            ? 'bg-red-50 border border-red-100 text-red-800 rounded-2xl rounded-tl-sm'
                            : 'bg-white border border-slate-100 text-slate-800 rounded-2xl rounded-tl-sm'
                      }`}
                    >
                      {msg.text}
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-100/60 flex flex-col gap-1.5">
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Sources referenced</span>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.sources.map((src, i) => (
                              <span key={i} className="inline-flex items-center px-2 py-1 bg-slate-50 text-slate-600 text-[11px] rounded-md border border-slate-200" title={src.recordType}>
                                {src.displayName}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
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
            placeholder={`Ask H-bot anything about patient ${code}...`}
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
