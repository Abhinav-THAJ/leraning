"use client";
import { useState } from "react";
import { CheckCircle2, XCircle, Loader2, ExternalLink, Key, Database, Rocket } from "lucide-react";

type StepStatus = "pending" | "running" | "done" | "error";

interface Result {
  success: boolean;
  message?: string;
  error?: string;
}

export default function SetupPage() {
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<StepStatus>("pending");
  const [result, setResult] = useState<Result | null>(null);

  async function runSetup() {
    if (!token.trim()) return;
    setStatus("running");
    setResult(null);

    try {
      const res = await fetch("/api/setup-db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token.trim() }),
      });
      const data = await res.json();
      setResult(data);
      setStatus(data.success ? "done" : "error");
    } catch (err: any) {
      setResult({ success: false, error: err.message });
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen bg-[#060B17] flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 mb-6">
            <Database className="text-blue-400" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Database Setup</h1>
          <p className="text-white/50 text-sm">
            Initialize your ITTA Academy database with one click
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-3 mb-8">
          {[
            { n: 1, label: "Get your Supabase Access Token", sub: "Personal token — not service role key" },
            { n: 2, label: "Paste it below and click Run", sub: "Safe: only used server-side" },
            { n: 3, label: "Visit your course pages", sub: "Everything will work immediately" },
          ].map(({ n, label, sub }) => (
            <div
              key={n}
              className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02]"
            >
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold flex items-center justify-center mt-0.5">
                {n}
              </span>
              <div>
                <p className="text-white/90 text-sm font-medium">{label}</p>
                <p className="text-white/40 text-xs mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Token link */}
        <a
          href="https://supabase.com/dashboard/account/tokens"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between w-full p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 transition-colors mb-6 group"
        >
          <div className="flex items-center gap-3">
            <Key size={16} className="text-blue-400" />
            <span className="text-sm text-blue-300 font-medium">
              supabase.com/dashboard/account/tokens
            </span>
          </div>
          <ExternalLink size={14} className="text-blue-400/60 group-hover:text-blue-400 transition-colors" />
        </a>

        {/* Token input */}
        <div className="mb-4">
          <label className="block text-xs text-white/50 mb-2 font-medium uppercase tracking-wider">
            Access Token
          </label>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runSetup()}
            placeholder="sbp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.06] transition-all font-mono"
          />
        </div>

        {/* Run button */}
        <button
          onClick={runSetup}
          disabled={!token.trim() || status === "running"}
          className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background:
              status === "done"
                ? "linear-gradient(135deg, #22c55e, #16a34a)"
                : "linear-gradient(135deg, #3b82f6, #8b5cf6)",
          }}
        >
          {status === "running" ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Initializing database…
            </>
          ) : status === "done" ? (
            <>
              <CheckCircle2 size={16} />
              Done! Database is ready
            </>
          ) : (
            <>
              <Rocket size={16} />
              Run Migration
            </>
          )}
        </button>

        {/* Result */}
        {result && (
          <div
            className={`mt-4 p-4 rounded-xl border text-sm ${
              result.success
                ? "bg-green-500/10 border-green-500/20 text-green-300"
                : "bg-red-500/10 border-red-500/20 text-red-300"
            }`}
          >
            <div className="flex items-start gap-3">
              {result.success ? (
                <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle size={16} className="flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-medium">{result.message || result.error}</p>
                {result.success && (
                  <div className="mt-3 space-y-1.5 text-xs text-green-400/80">
                    <p>✓ Tables: profiles, courses, modules, lessons, payments, progress</p>
                    <p>✓ Row Level Security enabled on all tables</p>
                    <p>✓ Auth trigger for automatic profile creation</p>
                    <p>✓ Seed data: 2 courses, 4 modules, 6 lessons</p>
                  </div>
                )}
                {result.success && (
                  <div className="mt-4 flex gap-2">
                    <a
                      href="/courses/export-import-certificate"
                      className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-green-500/20 hover:bg-green-500/30 transition-colors"
                    >
                      <ExternalLink size={12} />
                      View Export/Import Course
                    </a>
                    <a
                      href="/courses/international-trade-specialist"
                      className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-green-500/20 hover:bg-green-500/30 transition-colors"
                    >
                      <ExternalLink size={12} />
                      View ITS Course
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <p className="text-center text-white/20 text-xs mt-8">
          This page can be deleted after setup is complete.
        </p>
      </div>
    </main>
  );
}
