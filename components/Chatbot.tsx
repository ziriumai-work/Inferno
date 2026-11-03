"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { knowledgeBase, KnowledgeBaseItem } from "@/lib/chatbotData";
import { dataStore } from "@/utils/dataStore";

export default function Chatbot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [qaList, setQaList] = useState<KnowledgeBaseItem[]>(knowledgeBase);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "assistant",
      text: "Inferno Operations Desk active. I can answer inquiries regarding SBA certifications, FEMA program compliance, cost accounting, and strategic teaming configurations. Select a question below to coordinate your query.",
      timestamp: new Date(0), // stable SSR default
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Fix hydration + tooltip popup every 20 seconds
  const [showTooltip, setShowTooltip] = useState(false);
  useEffect(() => {
    setMessages((prev) => prev.map((m) => ({ ...m, timestamp: new Date() })));
    const refreshQA = () => {
      const storedQA = dataStore.getChatbotQA();
      if (storedQA.length > 0) {
        setQaList(storedQA);
      }
    };
    refreshQA();
    setIsMounted(true);

    window.addEventListener("storage", refreshQA);
    window.addEventListener("cms-update", refreshQA);

    const show = () => {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 5000);
    };
    const t1 = setTimeout(show, 20000);
    const cycle = setInterval(show, 20000);
    return () => {
      clearTimeout(t1);
      clearInterval(cycle);
      window.removeEventListener("storage", refreshQA);
      window.removeEventListener("cms-update", refreshQA);
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/infernollc/admin")) {
    return null;
  }

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return;

    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = null;
    }

    const userMsg: Message = {
      sender: "user",
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Analyze query and simulate response delay
    setTimeout(() => {
      const query = textToSend.toLowerCase();
      let matchedAnswer = "";

      const exactMatch = qaList.find(
        (item) => item.question.toLowerCase() === query,
      );

      if (exactMatch) {
        matchedAnswer = exactMatch.answer;
      } else {
        for (const item of qaList) {
          if (item.keywords.some((kw) => query.includes(kw))) {
            matchedAnswer = item.answer;
            break;
          }
        }
      }

      if (!matchedAnswer) {
        matchedAnswer =
          "Understood. The Inferno Group operations desk stands ready. Please submit a coordination request on our [Contact page](/contact) or email us directly at Contact@theinfernogroup.com, and an officer will reach out within 12 business hours.";
      }

      simulateStreaming(matchedAnswer);
    }, 800);
  };

  const simulateStreaming = (fullText: string) => {
    setIsTyping(false);

    // We add the assistant bubble empty and stream text into it
    let currentText = "";
    const words = fullText.split(" ");
    let wordIndex = 0;

    // Create message bubble
    setMessages((prev) => [
      ...prev,
      {
        sender: "assistant",
        text: "",
        timestamp: new Date(),
      },
    ]);

    streamIntervalRef.current = setInterval(() => {
      if (wordIndex < words.length) {
        currentText += (wordIndex === 0 ? "" : " ") + words[wordIndex];
        setMessages((prev) => {
          const updated = [...prev];
          if (updated.length > 0) {
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              text: currentText,
            };
          }
          return updated;
        });
        wordIndex++;
      } else if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
        streamIntervalRef.current = null;
      }
    }, 35); // fast stream
  };

  // Helper to parse markdown links like [Contact page](/contact)
  const renderMessageText = (text: string) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      parts.push(
        <Link
          key={match[1] + match.index}
          href={match[2]}
          className="chat-link text-[var(--primary)] underline font-semibold hover:opacity-80"
          onClick={() => setIsOpen(false)}
        >
          {match[1]}
        </Link>,
      );
      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <>
      {/* Tooltip popup (hidden on small mobile screens) */}
      <div
        className={`hidden sm:block fixed bottom-[2.2rem] right-[82px] z-[9998] transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] pointer-events-none whitespace-nowrap ${showTooltip && !isOpen ? "translate-x-0 opacity-100" : "translate-x-[20px] opacity-0"}`}
      >
        <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-white px-5 py-[0.6rem] rounded-lg text-[0.85rem] font-semibold font-[family-name:var(--font-space-grotesk)] shadow-[0_4px_20px_rgba(225,77,24,0.25)] relative">
          Quick answers
          <div className="absolute -right-[6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-[var(--secondary)]" />
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        className={`chatbot-fab ${isOpen ? "open" : ""}`}
        onClick={() => {
          setHasOpened(true);
          setIsOpen(!isOpen);
        }}
        aria-label="Toggle AI Assistant"
      >
        {isOpen ? (
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </button>

      {/* Chat Window Panel */}
      <div
        className={`chatbot-window ${isOpen ? "open" : ""}`}
        style={!hasOpened && !isOpen ? { display: "none" } : undefined}
      >
        {/* Header */}
        <div className="chat-header">
          <div>
            <h4>Inferno Operations Desk</h4>
            <div className="flex items-center gap-[0.35rem] text-xs opacity-85">
              <span className="chat-indicator"></span>
              Secure GovCon AI Desk
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close assistant"
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer border border-white/15 active:scale-90"
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-bubble-wrapper ${msg.sender}`}>
              <div className="chat-bubble">
                {msg.sender === "assistant"
                  ? renderMessageText(msg.text)
                  : msg.text}
              </div>
              <span className="chat-time">
                {isMounted
                  ? `${String(msg.timestamp.getHours()).padStart(2, "0")}:${String(msg.timestamp.getMinutes()).padStart(2, "0")}`
                  : ""}
              </span>
            </div>
          ))}
          {isTyping && (
            <div className="chat-bubble-wrapper assistant">
              <div className="chat-bubble typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Preset questions */}
        <div className="chat-presets-container">
          <div className="chat-presets-label">Select a question:</div>
          <div className="chat-presets">
            {qaList.map((item, idx) => (
              <button
                key={idx}
                className="preset-btn"
                onClick={() => handleSend(item.question)}
                disabled={isTyping}
              >
                {item.question}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* ── CHATBOT STYLING ── */
        .chatbot-fab {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: var(--primary);
          color: #ffffff;
          border: none;
          cursor: pointer;
          z-index: 1999;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition:
            transform 0.2s ease,
            background-color 0.2s ease;
        }
        .chatbot-fab:hover {
          background: #c84113;
          transform: translateY(-1px);
        }
        .chatbot-fab.open {
          transform: rotate(90deg);
        }

        .chatbot-window {
          position: fixed;
          bottom: 5.5rem;
          right: 2rem;
          width: 390px;
          height: min(550px, calc(100dvh - 6.5rem));
          max-height: calc(100dvh - 6.5rem);
          border-radius: 16px;
          background: #ffffff;
          border: 1px solid var(--border);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
          z-index: 1999;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          opacity: 0;
          visibility: hidden;
          transform: translateY(12px) scale(0.98);
          transition:
            opacity 0.2s ease,
            transform 0.2s ease,
            visibility 0.2s ease;
        }
        .chatbot-window.open {
          opacity: 1;
          visibility: visible;
          transform: translateY(0) scale(1);
        }

        .chat-header {
          background: var(--navy);
          color: #ffffff;
          padding: 1.1rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .chat-header h4 {
          font-family: var(--font-space-grotesk), sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 0.1rem;
        }
        .chat-indicator {
          width: 8px;
          height: 8px;
          background: #22c55e;
          border-radius: 50%;
          display: inline-block;
        }

        .chat-messages {
          flex: 1;
          padding: 1.15rem 1.25rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .chat-bubble-wrapper {
          display: flex;
          flex-direction: column;
          max-width: 85%;
        }
        .chat-bubble-wrapper.assistant {
          align-self: flex-start;
          align-items: flex-start;
        }
        .chat-bubble-wrapper.user {
          align-self: flex-end;
          align-items: flex-end;
        }

        .chat-bubble {
          padding: 0.7rem 0.95rem;
          border-radius: 12px;
          font-size: 0.85rem;
          line-height: 1.5;
        }
        .assistant .chat-bubble {
          background: #f8fafc;
          color: var(--text-bright);
          border: 1px solid var(--border);
          border-top-left-radius: 2px;
        }
        .user .chat-bubble {
          background: var(--primary);
          color: #ffffff;
          border-top-right-radius: 2px;
        }

        .chat-time {
          font-size: 0.65rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
          padding: 0 0.2rem;
        }

        .chat-presets-container {
          border-top: 1px solid var(--border);
          background: #f8fafc;
          padding: 0.65rem 0.9rem 0.8rem;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }
        .chat-presets-label {
          font-family: var(--font-space-grotesk), sans-serif;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--text-muted);
          padding: 0 0.15rem;
        }
        .chat-presets {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
          max-height: 148px;
          overflow-y: auto;
          padding-right: 0.15rem;
        }
        .preset-btn {
          font-family: var(--font-space-grotesk), sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--primary);
          background: #ffffff;
          border: 1px solid var(--border);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
          padding: 0.38rem 0.75rem;
          border-radius: 20px;
          cursor: pointer;
          text-align: left;
          transition: var(--transition-base);
        }
        .preset-btn:hover:not(:disabled) {
          background: linear-gradient(
            135deg,
            var(--primary) 0%,
            var(--secondary) 100%
          );
          border-color: transparent;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.25);
          transform: translateY(-1px);
        }
        .preset-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        /* Typing indicator dots */
        .typing span {
          display: inline-block;
          width: 6px;
          height: 6px;
          background: var(--text-muted);
          border-radius: 50%;
          margin-right: 3px;
          animation: chatTyping 1.4s infinite fill-mode;
        }
        .typing span:nth-child(2) {
          animation-delay: 0.2s;
        }
        .typing span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes chatTyping {
          0%,
          100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-4px);
            opacity: 1;
          }
        }

        @media (max-height: 640px) {
          .chatbot-window {
            height: calc(100dvh - 5.5rem);
            max-height: calc(100dvh - 5.5rem);
            bottom: 4.5rem;
          }
        }

        @media (max-width: 640px) {
          .chatbot-window {
            width: calc(100vw - 1.5rem);
            max-width: 390px;
            height: calc(100dvh - 7rem);
            max-height: 550px;
            bottom: 4.8rem;
            right: 0.75rem;
            left: 0.75rem;
            margin: 0 auto;
          }
          .chatbot-fab {
            bottom: 1rem;
            right: 1rem;
            width: 48px;
            height: 48px;
          }
        }
      `}</style>
    </>
  );
}
