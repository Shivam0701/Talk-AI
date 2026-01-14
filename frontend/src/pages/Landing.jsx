import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { fadeUp, pageTransition } from "../animations/motion";
import { GlassCard } from "../components/GlassCard";
import { Button } from "../components/Button";

export default function Landing() {
  const year = new Date().getFullYear();

  return (
    <motion.div {...pageTransition} className="app-bg min-h-[calc(100vh-56px)]">
      <div className="mx-auto max-w-6xl px-4 py-14">
        
        {/* Hero */}
        <motion.div {...fadeUp} className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
            Calm • Private • Judgment-free
          </div>

          <h1 className="mt-6 text-3xl md:text-5xl font-semibold tracking-tight">
            A gentle place to{" "}
            <span className="bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
              talk and feel heard
            </span>
            .
          </h1>

          <p className="mt-5 text-base md:text-lg text-slate-300 leading-relaxed">
            Talkive is a calm emotional companion — not a therapist — made for moments
            when you just need to talk.
            <br />
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

        {/* How it works */}
        <motion.div id="how" {...fadeUp} className="mt-14 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Quiet, premium space",
              body: "Dark mode, glass cards, soft gradients. Nothing loud. Nothing pushy.",
            },
            {
              title: "Short, human replies",
              body: "Talkive listens first, acknowledges your feelings, and responds in 2–4 gentle lines.",
            },
            {
              title: "Private by design",
              body: "Your messages are stored only to load your history. Admins can’t access personal chats in V1.",
            },
          ].map((c) => (
            <GlassCard key={c.title} className="p-5">
              <div className="text-sm font-semibold">{c.title}</div>
              <div className="mt-2 text-sm text-slate-300 leading-relaxed">
                {c.body}
              </div>
            </GlassCard>
          ))}
        </motion.div>

        {/* Disclaimer */}
        <motion.div {...fadeUp} className="mt-10">
          <GlassCard className="p-6">
            <div className="text-sm font-semibold">Important note</div>
            <div className="mt-2 text-sm text-slate-300 leading-relaxed">
              Talkive is not a medical or therapy product. If you feel unsafe or in danger,
              please reach out to trusted people or local emergency services.
            </div>
          </GlassCard>
        </motion.div>

        {/* Footer */}
        <footer className="mt-16 border-t border-white/10 pt-6 text-center text-xs text-slate-400 space-y-2">
          <div>
            © {year} Talkive · powered by{" "}
            <a
              href="https://shiraai.in"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-indigo-300 hover:text-indigo-200 transition"
            >
              SHIRA AI
            </a>
          </div>

          <div className="text-slate-500">
            If you face any issue, you can reach out via{" "}
            <a
              href="https://shiraai.in/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-slate-300 transition"
            >
              SHIRA AI contact form
            </a>
            .
          </div>
        </footer>
      </div>
    </motion.div>
  );
}
