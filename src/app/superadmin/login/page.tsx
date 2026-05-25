"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { Eye, EyeOff, Loader2, ShieldCheck, AlertTriangle } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/superadmin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Access denied. Invalid credentials.");
      setLoading(false);
      return;
    }

    // Set cookie directly in browser (most reliable method)
    document.cookie = `sa_admin=${data.token}; path=/; max-age=${7 * 24 * 3600}; SameSite=Lax`;

    // Short delay to ensure cookie is written before navigation
    setTimeout(() => {
      window.location.replace("/superadmin");
    }, 100);
  };

  return (
    <main className="min-h-screen bg-[#07090F] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-red-900/20 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-widest uppercase">
            <ShieldCheck size={13} />
            Restricted Access
          </div>
        </div>

        <div
          className="rounded-2xl p-8 md:p-10 border border-white/8"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
            backdropFilter: "blur(24px)",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 32px 64px rgba(0,0,0,0.5)",
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={26} className="text-amber-400" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Admin Portal</h1>
            <p className="text-white/40 text-sm mt-1.5">ITTA Academy — Administrative Access</p>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-7" />

          <form onSubmit={handleAdminLogin} className="space-y-5">
            <div>
              <label className="text-xs text-white/50 mb-2 block font-semibold uppercase tracking-wider">
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@ittaacademy.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-amber-500/60 focus:bg-amber-500/5 transition-all text-sm"
              />
            </div>

            <div>
              <label className="text-xs text-white/50 mb-2 block font-semibold uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-white/20 focus:outline-none focus:border-amber-500/60 focus:bg-amber-500/5 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2.5 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl p-3.5"
              >
                <AlertTriangle size={15} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-sm text-black flex items-center justify-center gap-2 mt-2 transition-all disabled:opacity-60"
              style={{
                background: loading
                  ? "rgba(245,158,11,0.5)"
                  : "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                boxShadow: loading ? "none" : "0 4px 24px rgba(245,158,11,0.35)",
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Verifying…
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  Access Admin Panel
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <p className="text-center text-white/20 text-xs mt-7">
            Not an admin?{" "}
            <a href="/login" className="text-white/40 hover:text-white/70 underline underline-offset-2 transition-colors">
              Go to student login
            </a>
          </p>
        </div>

        <p className="text-center text-white/15 text-xs mt-5">
          All access attempts are logged and monitored.
        </p>
      </motion.div>
    </main>
  );
}
