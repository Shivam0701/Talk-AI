import React from "react";
import { motion } from "framer-motion";

export function MessageBubble({ role, content }) {
  const isUser = role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={["flex", isUser ? "justify-end" : "justify-start"].join(" ")}
    >
      <div
        className={[
          "max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "bg-gradient-to-b from-indigo-500/25 to-violet-600/15 border border-white/10"
            : "bg-white/5 border border-white/10",
        ].join(" ")}
      >
        <div className="whitespace-pre-wrap text-slate-100">{content}</div>
      </div>
    </motion.div>
  );
}

