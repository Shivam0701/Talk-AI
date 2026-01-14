import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { pageTransition } from "../animations/motion";
import { GlassCard } from "../components/GlassCard";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { GoogleButton } from "../components/GoogleButton";
import { api } from "../services/api";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Auth() {
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const [mode, setMode] = useState("login"); // login | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const isLogin = mode === "login";

  const title = useMemo(() => (isLogin ? "Welcome back" : "Create your space"), [isLogin]);
  const subtitle = useMemo(
    () => (isLogin ? "Log in to continue the conversation." : "A quiet place, ready when you are."),
    [isLogin]
  );

  const emailValid = emailPattern.test(email.trim());

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const user = isLogin ? await login(email.trim(), password) : await signup(email.trim(), password);
      navigate(user.role === "admin" ? "/admin" : "/chat");
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function onGoogle(credential, isError) {
    if (isError) {
      setError("Google sign-in failed. Please try again.");
      return;
    }
    if (!credential) {
      setError("Google sign-in was cancelled.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      const { data } = await api.post("/auth/google", { credential });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate(data.user.role === "admin" ? "/admin" : "/chat");
      window.location.reload(); // ensure context picks up stored user token on first load
    } catch (err) {
      setError(err?.response?.data?.message || "Google authentication failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <motion.div {...pageTransition} className="app-bg min-h-[calc(100vh-56px)] flex items-center">
      <div className="mx-auto w-full max-w-md px-4 py-14">
        <GlassCard className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <div className="text-xl font-semibold">{title}</div>
              <div className="mt-2 text-sm text-slate-300">{subtitle}</div>

              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <Input
                  label="Email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />

                {error ? <div className="text-sm text-rose-300">{error}</div> : null}

                <Button disabled={busy || !emailValid} className="w-full">
                  {busy ? "Please wait…" : isLogin ? "Log in" : "Sign up"}
                </Button>
              </form>

              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/10" />
                <div className="text-xs text-slate-400">or</div>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <GoogleButton disabled={busy} onCredential={onGoogle} />

              <div className="mt-5 flex items-center justify-center gap-2 text-sm text-slate-300">
                <span>{isLogin ? "New here?" : "Already have an account?"}</span>
                <button
                  className="text-indigo-200 hover:text-indigo-100 transition-colors"
                  onClick={() => {
                    setError("");
                    setMode(isLogin ? "signup" : "login");
                  }}
                  type="button"
                >
                  {isLogin ? "Create account" : "Log in"}
                </button>
              </div>

              <div className="mt-6 text-xs text-slate-400 leading-relaxed">
                This is not therapy or medical advice. If you feel unsafe, please reach out to trusted people or local
                emergency services.
              </div>
            </motion.div>
          </AnimatePresence>
        </GlassCard>
      </div>
    </motion.div>
  );
}

