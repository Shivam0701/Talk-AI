import React from "react";

export function Input({ label, className = "", ...props }) {
  return (
    <label className="block">
      {label ? <div className="mb-2 text-xs text-slate-300">{label}</div> : null}
      <input
        className={[
          "w-full rounded-xl px-3 py-2 text-sm",
          "bg-white/5 border border-white/10",
          "placeholder:text-slate-500",
          "focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40",
          className,
        ].join(" ")}
        {...props}
      />
    </label>
  );
}

