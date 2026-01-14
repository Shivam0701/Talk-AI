import React from "react";
import { motion } from "framer-motion";

export function TypingIndicator({ text = "AI is listening…" }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-2 w-2 rounded-full bg-white/60"
            animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.12 }}
          />
        ))}
      </div>
      <div className="text-xs text-slate-300">{text}</div>
    </div>
  );
}

