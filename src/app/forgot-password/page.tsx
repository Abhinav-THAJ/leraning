"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/reset-password`,
    });
    if (error) { setError(error.message); setLoading(false); return; }
    setSuccess(true);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#060B17] flex items-center justify-center px-4">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[120px]" />
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md">
        <div className="glass-card rounded-2xl p-8 md:p-10">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <Image src="/Logo.png" alt="ITTA Logo" width={140} height={40} className="object-contain h-10 w-auto" />
            </Link>
            <h1 className="text-2xl font-bold mb-2">Forgot password?</h1>
            <p className="text-white/60 text-sm">Enter your email and we'll send a reset link</p>
          </div>

          {success ? (
            <div className="text-center">
              <CheckCircle2 size={48} className="text-green-400 mx-auto mb-4" />
              <p className="text-white/70">Check your inbox for a password reset link.</p>
              <Link href="/login" className="inline-block mt-6 px-6 py-3 bg-brand-blue rounded-xl font-medium hover:opacity-90 transition-opacity">Back to Sign In</Link>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="text-sm text-white/70 mb-2 block">Email address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand-blue transition-colors" />
              </div>
              {error && <p className="text-red-400 text-sm bg-red-400/10 rounded-xl p-3">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-brand-blue to-brand-purple rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin" size={18} /> : "Send Reset Link"}
              </button>
              <p className="text-center text-white/50 text-sm">
                <Link href="/login" className="text-brand-blue hover:underline">Back to Sign In</Link>
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </main>
  );
}
