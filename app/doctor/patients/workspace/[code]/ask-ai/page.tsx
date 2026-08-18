"use client";

import React, { useState, useRef, useEffect, use } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AiMagicIcon,
  Chemistry01Icon,
  ArrowRight01Icon,
  ArrowLeft01Icon,
  UserIcon,
  DocumentValidationIcon,
} from "@hugeicons/core-free-icons";
import { askAiQuestion, AiSource, AiQuestionResponse } from "@/lib/api/ai";
import { useLanguage } from "@/localization/LanguageContext";

type Message = {
  id: string;
  role: "user" | "bot";
  text: string;
  timestamp: Date;
  sources?: AiSource[];
  generatedCv?: AiQuestionResponse["generatedCv"];
  isError?: boolean;
};

export default function WorkspaceAskAIPage({ params }: { params: Promise<{ code: string }> }) {
  const { t } = useLanguage();
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
          generatedCv: responseData.generatedCv,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, newBotMsg]);
      } else {
        throw new Error((response as any).message || t('ui.somethingWentWrong'));
      }
    } catch (err: any) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: err.message || t('ui.somethingWentWrong'),
        isError: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestedPrompts = [
    t('doctor.askAi.prompts.analyzeLab'),
    t('doctor.askAi.prompts.checkInteractions'),
    t('doctor.askAi.prompts.summarizeHistory'),
    t('doctor.askAi.prompts.draftReferral')
  ];

  return (
    <div className="h-[calc(100vh-4rem)] sm:h-[calc(100vh-6rem)] flex flex-col max-w-6xl mx-auto bg-white border-0 sm:rounded-[48px] shadow-2xl shadow-slate-200/50 overflow-hidden relative animate-in fade-in duration-300 mt-0 sm:mt-4">
      
      {/* Header */}
      <div className="h-20 sm:h-24 shrink-0 flex items-center justify-between px-4 sm:px-8 bg-primary text-white z-10">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link 
            href={`/doctor/patients/workspace/${code}`}
            className="w-12 h-12 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all shrink-0"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="w-6 h-6 rtl:rotate-180" />
          </Link>
          <div className="w-14 h-14 rounded-[20px] bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner shrink-0">
            <HugeiconsIcon icon={AiMagicIcon} className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-black font-heading tracking-tight leading-tight">{t('doctor.askAi.title')}</h1>
            <p className="text-sm font-bold text-white/80 flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]"></span>
              {t('doctor.workspace.patientCode')}: {code}
            </p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-32 h-32 mb-8 rounded-[32px] bg-primary/5 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-primary/10 rounded-[32px] animate-ping opacity-75 duration-1000"></div>
              <HugeiconsIcon icon={Chemistry01Icon} className="w-14 h-14 text-primary relative z-10" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-4 font-heading tracking-tighter">
              {t('doctor.askAi.title')}
            </h2>
            <p className="text-slate-500 max-w-md mx-auto mb-8">
              {t('doctor.askAi.subtitle')}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
              {suggestedPrompts.map((prompt, i) => (
                <button 
                  key={i}
                  onClick={() => {
                    handleSendMessage(undefined, prompt);
                  }}
                  className="px-6 py-5 bg-white border-2 border-slate-100 hover:border-primary hover:shadow-xl hover:shadow-primary/10 rounded-[24px] text-base font-bold text-slate-700 transition-all text-left rtl:text-right flex items-center gap-3 hover:-translate-y-1 cursor-pointer"
                >
                  <HugeiconsIcon icon={AiMagicIcon} className="w-5 h-5 text-primary" />
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
                      className={`px-6 py-4 shadow-sm text-base leading-relaxed font-medium ${
                        msg.role === 'user' 
                          ? 'bg-primary text-white rounded-[24px] rounded-tr-sm shadow-primary/20' 
                          : msg.isError 
                            ? 'bg-red-50 text-red-800 rounded-[24px] rounded-tl-sm'
                            : 'bg-white text-slate-800 rounded-[24px] rounded-tl-sm shadow-md'
                      }`}
                    >
                      <div className="markdown-content space-y-2">
                        <ReactMarkdown
                          components={{
                            p: ({node, ...props}) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2" {...props} />,
                            li: ({node, ...props}) => <li className="mb-1" {...props} />,
                            h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-2 mt-4" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-2 mt-3" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-base font-bold mb-2 mt-2" {...props} />,
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                      
                      {msg.generatedCv && (
                        <div className="mt-4 p-4 sm:p-5 bg-white/60 backdrop-blur-sm border border-emerald-200/60 rounded-2xl flex flex-col gap-3 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all">
                           <div className="flex items-start gap-3">
                             <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                               <HugeiconsIcon icon={DocumentValidationIcon} className="w-5 h-5 text-emerald-600" />
                             </div>
                             <div>
                               <h4 className="font-bold text-slate-800 text-sm sm:text-base leading-snug">{msg.generatedCv.title}</h4>
                               <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-sm line-clamp-1">{msg.generatedCv.focus}</p>
                             </div>
                           </div>
                           
                           <div className="flex gap-2 items-center mt-1">
                             <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-emerald-100 text-emerald-600 font-bold uppercase tracking-wide">v{msg.generatedCv.versionNumber}</span>
                             <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-slate-100 text-slate-600 font-bold uppercase tracking-wide">
                               {t(`doctor.medicalCvs.${msg.generatedCv.status?.toLowerCase()}`) || msg.generatedCv.status}
                             </span>
                           </div>
                           
                           <div className="mt-2 pt-3 border-t border-emerald-100/50 flex flex-col sm:flex-row gap-2">
                             {msg.generatedCv.previewUrl && (
                               <a 
                                 href={msg.generatedCv.previewUrl} 
                                 target="_blank" 
                                 rel="noopener noreferrer" 
                                 className="flex-1 text-center text-xs bg-emerald-600 text-white px-3 py-2 rounded-xl font-bold hover:bg-emerald-700 transition shadow-sm"
                               >
                                 {t('doctor.medicalCvs.previewPdf')}
                               </a>
                             )}
                             <Link 
                               href={`/doctor/patients/workspace/${code}/medical-cv/${msg.generatedCv.medicalCvId}`} 
                               className="flex-1 text-center text-xs bg-white text-emerald-700 border border-emerald-200 px-3 py-2 rounded-xl font-bold hover:bg-emerald-50 transition shadow-sm"
                             >
                               {t('doctor.medicalCvs.title')}
                             </Link>
                           </div>
                        </div>
                      )}
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-100/60 flex flex-col gap-1.5">
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                            {t('doctor.askAi.sources')}
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.sources.map((src, i) => {
                              const isDoc = src.recordType?.toLowerCase() === 'document' || src.recordType?.toLowerCase() === 'medicalcv';
                              const linkPath = src.recordType?.toLowerCase() === 'medicalcv'
                                ? `/doctor/patients/workspace/${code}/medical-cv/${src.medicalRecordId}`
                                : `/doctor/patients/workspace/${code}/documents/${src.medicalRecordId}`;
                              
                              if (isDoc) {
                                return (
                                  <Link 
                                    key={i} 
                                    href={linkPath}
                                    className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 text-[11px] font-semibold rounded-md border border-blue-200 transition-colors cursor-pointer" 
                                    title={src.recordType}
                                  >
                                    {src.displayName}
                                  </Link>
                                );
                              }
                              return (
                                <span key={i} className="inline-flex items-center px-2 py-1 bg-slate-50 text-slate-600 text-[11px] rounded-md border border-slate-200" title={src.recordType}>
                                  {src.displayName}
                                </span>
                              );
                            })}
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
      <div className="shrink-0 p-4 sm:p-8 bg-white border-t border-slate-100 sm:rounded-b-[48px]">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t('doctor.askAi.inputPlaceholder')}
            className="w-full bg-slate-50 border-0 text-slate-900 text-lg font-bold rounded-full pl-8 pr-16 rtl:pl-16 rtl:pr-8 py-5 focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-primary hover:bg-primary/90 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-[55%] border-none"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} className="w-6 h-6 rtl:rotate-180" />
          </button>
        </form>
        <p className="text-center text-xs font-bold text-slate-400 mt-4">
          {t('doctor.askAi.disclaimer')}
        </p>
      </div>
    </div>
  );
}
