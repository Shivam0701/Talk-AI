import React from "react";

export function GlassCard({ children, className = "" }) {
  return <div className={["glass rounded-2xl", className].join(" ")}>{children}</div>;
}

