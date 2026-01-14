import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./Button";
import { useAuth } from "../context/AuthContext";

export function TopBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-10 border-b border-white/5 bg-black/20 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-slate-800 border border-white/10" />
          <div className="text-sm font-semibold tracking-wide">Talkive</div>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden sm:block text-xs text-slate-300">{user.email}</div>
              <Button
                className="bg-white/5 from-transparent to-transparent shadow-none"
                onClick={() => {
                  logout();
                  navigate("/auth");
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button className="bg-white/5 from-transparent to-transparent shadow-none" onClick={() => navigate("/auth")}>
              Login
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

