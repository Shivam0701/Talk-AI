import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { pageTransition } from "../animations/motion";
import { GlassCard } from "../components/GlassCard";
import { Button } from "../components/Button";
import { api } from "../services/api";

export default function Admin() {
  const [overview, setOverview] = useState({ totalUsers: 0, totalMessagesToday: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [o, u] = await Promise.all([api.get("/admin/overview"), api.get("/admin/users")]);
      setOverview(o.data);
      setUsers(u.data.users || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Could not load admin dashboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleBlock(userId, isBlocked) {
    try {
      await api.patch(`/admin/users/${userId}/block`, { isBlocked: !isBlocked });
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || "Update failed.");
    }
  }

  return (
    <motion.div {...pageTransition} className="app-bg min-h-[calc(100vh-56px)]">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6">
          <div className="text-sm font-semibold">Admin Dashboard</div>
          <div className="text-xs text-slate-400">Minimal V1 overview. No chat reading.</div>
        </div>

        {error ? <div className="mb-4 text-sm text-rose-300">{error}</div> : null}

        <div className="grid gap-4 md:grid-cols-2">
          <GlassCard className="p-5">
            <div className="text-xs text-slate-400">Total users</div>
            <div className="mt-2 text-2xl font-semibold">{overview.totalUsers}</div>
          </GlassCard>
          <GlassCard className="p-5">
            <div className="text-xs text-slate-400">Messages sent today</div>
            <div className="mt-2 text-2xl font-semibold">{overview.totalMessagesToday}</div>
          </GlassCard>
        </div>

        <div className="mt-6">
          <GlassCard className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">Users</div>
                <div className="text-xs text-slate-400">Email • Messages used today • Block</div>
              </div>
              <Button
                className="bg-white/5 from-transparent to-transparent shadow-none"
                onClick={load}
                disabled={loading}
              >
                Refresh
              </Button>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-400">
                    <th className="py-2 pr-4 font-medium">Email</th>
                    <th className="py-2 pr-4 font-medium">Used today</th>
                    <th className="py-2 pr-4 font-medium">Status</th>
                    <th className="py-2 pr-4 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td className="py-3 text-slate-300" colSpan={4}>
                        Loading…
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td className="py-3 text-slate-300" colSpan={4}>
                        No users yet.
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u._id} className="border-t border-white/5">
                        <td className="py-3 pr-4">{u.email}</td>
                        <td className="py-3 pr-4 text-slate-300">{u.messagesUsedToday ?? 0}</td>
                        <td className="py-3 pr-4">
                          <span
                            className={[
                              "inline-flex rounded-full px-2 py-1 text-xs border",
                              u.isBlocked
                                ? "border-rose-400/20 bg-rose-400/10 text-rose-200"
                                : "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
                            ].join(" ")}
                          >
                            {u.isBlocked ? "Blocked" : "Active"}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <Button
                            className={[
                              "bg-white/5 from-transparent to-transparent shadow-none",
                              u.isBlocked ? "text-emerald-200" : "text-rose-200",
                            ].join(" ")}
                            onClick={() => toggleBlock(u._id, u.isBlocked)}
                          >
                            {u.isBlocked ? "Unblock" : "Block"}
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
}

