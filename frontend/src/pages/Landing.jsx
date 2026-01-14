import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { fadeUp, pageTransition } from "../animations/motion";
import { GlassCard } from "../components/GlassCard";
import { Button } from "../components/Button";

export default function Landing() {
  return (
    <motion.div {...pageTransition} className="app-bg min-h-[calc(100vh-56px)]">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <motion.div {...fadeUp} className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
            Calm, private, non-judgmental
          </div>

          <h1 className="mt-6 text-3xl md:text-5xl font-semibold tracking-tight">
            A gentle place to{" "}
            <span className="bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
              talk and feel heard
            </span>
            .
          </h1>

          <p className="mt-5 text-base md:text-lg text-slate-300 leading-relaxed">
            Talk AI is an emotional companion — not a therapist — designed for lonely moments.
            Soft replies. Warm presence. No judgment.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link to="/auth">
              <Button className="w-full sm:w-auto">Start talking</Button>
            </Link>
            <a href="#how" className="w-full sm:w-auto">
              <Button className="w-full bg-white/5 from-transparent to-transparent shadow-none">
                How it works
              </Button>
            </a>
          </div>
        </motion.div>

        <motion.div id="how" {...fadeUp} className="mt-14 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Quiet, premium space",
              body: "Dark mode, glass cards, soft gradients. Nothing loud. Nothing pushy.",
            },
            {
              title: "Short, human replies",
              body: "The AI acknowledges feelings first and asks gentle follow-ups (2–4 lines).",
            },
            {
              title: "Private by design",
              body: "Your messages are stored to load history. Admin can’t read chats in V1.",
            },
          ].map((c) => (
            <GlassCard key={c.title} className="p-5">
              <div className="text-sm font-semibold">{c.title}</div>
              <div className="mt-2 text-sm text-slate-300 leading-relaxed">{c.body}</div>
            </GlassCard>
          ))}
        </motion.div>

        <motion.div {...fadeUp} className="mt-10">
          <GlassCard className="p-6">
            <div className="text-sm font-semibold">Important note</div>
            <div className="mt-2 text-sm text-slate-300 leading-relaxed">
              Talk AI is not a medical or therapy product. If you feel unsafe or in danger, please reach out to trusted
              people or local emergency services.
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  );
}

