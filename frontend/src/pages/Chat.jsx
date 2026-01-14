import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { pageTransition } from "../animations/motion";
import { GlassCard } from "../components/GlassCard";
import { Button } from "../components/Button";
import { TypingIndicator } from "../components/TypingIndicator";
import { MessageBubble } from "../components/MessageBubble";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [aiTyping, setAiTyping] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  function scrollToBottom() {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoadingHistory(true);
      setError("");
      try {
        const { data } = await api.get("/chat/history");
        if (!cancelled) setMessages(data.messages || []);
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || "Could not load chat history.");
      } finally {
        if (!cancelled) setLoadingHistory(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, aiTyping, loadingHistory]);

  async function send() {
    const text = input.trim();
    if (!text || aiTyping) return;

    setError("");
    setInput("");

    const optimistic = {
      _id: `local-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((m) => [...m, optimistic]);
    setAiTyping(true);

    try {
      const { data } = await api.post("/chat", { message: text });
      setMessages((m) => [...m.filter((x) => x._id !== optimistic._id), data.userMessage, data.aiMessage]);
    } catch (err) {
      setMessages((m) => m.filter((x) => x._id !== optimistic._id));
      setError(err?.response?.data?.message || "Message failed. Please try again.");
    } finally {
      setAiTyping(false);
    }
  }

  return (
    <motion.div {...pageTransition} className="app-bg min-h-[calc(100vh-56px)]">
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">Chat</div>
            <div className="text-xs text-slate-400">A quiet space for your thoughts.</div>
          </div>
          <div className="text-xs text-slate-400 hidden sm:block">{user?.email}</div>
        </div>

        <GlassCard className="flex h-[70vh] flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loadingHistory ? (
              <div className="text-sm text-slate-300">Loading your conversation…</div>
            ) : null}

            {error ? <div className="text-sm text-rose-300">{error}</div> : null}

            {!loadingHistory && messages.length === 0 ? (
              <div className="text-sm text-slate-300 leading-relaxed">
                Start with something small. For example:
                <div className="mt-2 text-slate-200">“I feel a bit heavy today.”</div>
              </div>
            ) : null}

            {messages.map((m) => (
              <MessageBubble key={m._id} role={m.role} content={m.content} />
            ))}

            {aiTyping ? (
              <div className="flex justify-start">
                <div className="rounded-2xl px-4 py-3 bg-white/5 border border-white/10">
                  <TypingIndicator />
                </div>
              </div>
            ) : null}

            <div ref={bottomRef} />
          </div>

          <div className="border-t border-white/5 p-3">
            <div className="flex gap-2">
              <input
                className={[
                  "flex-1 rounded-xl px-3 py-2 text-sm",
                  "bg-white/5 border border-white/10",
                  "focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40",
                  "placeholder:text-slate-500",
                ].join(" ")}
                placeholder={aiTyping ? "AI is listening…" : "Type a message…"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                disabled={aiTyping}
              />
              <Button onClick={send} disabled={aiTyping || !input.trim()}>
                Send
              </Button>
            </div>
            <div className="mt-2 text-[11px] text-slate-400">
              Tip: Press Enter to send. Shift+Enter for a new line.
            </div>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
}

