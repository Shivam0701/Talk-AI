import React from "react";
import { motion } from "framer-motion";

export function Button({ children, className = "", disabled, ...props }) {
  return (
    <motion.button
      whileHover={disabled ? undefined : { y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      disabled={disabled}
      className={[
        "rounded-xl px-4 py-2 text-sm font-medium",
        "bg-indigo-500/80 hover:bg-indigo-400/90",
        "shadow-[0_8px_24px_rgba(15,23,42,0.8)]",
        "border border-white/10",
        "transition-opacity",
        disabled ? "opacity-50 cursor-not-allowed" : "opacity-100",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </motion.button>
  );
}

