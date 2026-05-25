"use client";

import { useState } from "react";
import { ShieldCheck, Loader2, CheckCircle2, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminSetupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secret, setSecret] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/superadmin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, secret }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ success: true, message: data.message });
      } else {
        setResult({ success: false, message: data.error });
      }
    } catch (err: any) {
      setResult({ success: false, message: err.message });
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#07090F] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Grid bg */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold tracking-wider uppercase">
            <ShieldCheck size={12} />
            One-Time Admin Setup
          </div>
        </div>

        <div className="rounded-2xl p-8 border border-white/8"
          style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)", backdropFilter: "blur(24px)", boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 32px 64px rgba(0,0,0,0.5)" }}>

          <div className="text-center mb-7">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-red-600/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={26} className="text-amber-400" />
            </div>
            <h1 className="text-xl font-bold text-white">Bootstrap Admin Account</h1>
            <p className="text-white/40 text-xs mt-2 leading-relaxed">
              Enter your credentials and the setup secret to grant admin access to your account.
            </p>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

          {result ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
              {result.success ? (
                <>
                  <CheckCircle2 size={40} className="text-green-400 mx-auto mb-3" />
                  <p className="text-green-400 font-semibold mb-1">Success!</p>
                  <p className="text-white/60 text-sm mb-6">{result.message}</p>
                  <a href="/superadmin/login"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-black rounded-xl text-sm font-bold hover:bg-amber-400 transition-colors">
                    <ShieldCheck size={15} /> Go to Admin Login
                  </a>
                </>
              ) : (
                <>
                  <AlertTriangle size={36} className="text-red-400 mx-auto mb-3" />
                  <p className="text-red-400 font-semibold mb-2">Error</p>
                  <p className="text-white/50 text-sm mb-5">{result.message}</p>
                  <button onClick={() => setResult(null)} className="px-5 py-2.5 glass border border-white/10 rounded-xl text-sm text-white/60 hover:text-white transition-colors">
                    Try Again
                  </button>
                </>
              )}
            </motion.div>
          ) : (
            <form onSubmit={handleSetup} className="space-y-4">
              <div>
                <label className="text-xs text-white/40 mb-1.5 block uppercase tracking-wider font-semibold">Admin Email</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-amber-500/60 transition-all text-sm" />
              </div>

              <div>
                <label className="text-xs text-white/40 mb-1.5 block uppercase tracking-wider font-semibold">Password</label>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-11 text-white placeholder-white/20 focus:outline-none focus:border-amber-500/60 transition-all text-sm" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-white/40 mb-1.5 block uppercase tracking-wider font-semibold">Setup Secret</label>
                <input type="password" required value={secret} onChange={e => setSecret(e.target.value)}
                  placeholder="Enter setup secret from .env.local"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-amber-500/60 transition-all text-sm" />
                <p className="text-white/20 text-[10px] mt-1.5">Value of ADMIN_SETUP_SECRET in your .env.local file</p>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-black flex items-center justify-center gap-2 mt-2 transition-all disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)", boxShadow: "0 4px 20px rgba(245,158,11,0.3)" }}>
                {loading ? <><Loader2 className="animate-spin" size={15} /> Granting Access...</> : <><ShieldCheck size={15} /> Grant Admin Access</>}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-white/15 text-[10px] mt-5">
          This page should be removed after setup is complete.
        </p>
      </motion.div>
    </main>
  );
}
