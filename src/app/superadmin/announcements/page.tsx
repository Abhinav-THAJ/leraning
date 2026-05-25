"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import AdminSidebar from "@/components/AdminSidebar";
import { createClient } from "@/utils/supabase/client";
import { Bell, Send, Trash2, Loader2, CheckCircle2, Megaphone } from "lucide-react";

type Announcement = {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success";
  created_at: string;
};

export default function AdminAnnouncementsPage() {
  const supabase = createClient();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [form, setForm] = useState({ title: "", message: "", type: "info" as "info" | "warning" | "success" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const fetch = async () => {
    setLoading(true);
    const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
    setAnnouncements(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const send = async () => {
    if (!form.title.trim() || !form.message.trim()) return;
    setSaving(true);
    const { error } = await supabase.from("announcements").insert({ title: form.title, message: form.message, type: form.type });
    if (!error) {
      setForm({ title: "", message: "", type: "info" });
      showToast("Announcement sent to all students!");
      fetch();
    } else {
      // Table might not exist yet - show migration note
      showToast("Run the announcements migration in Supabase SQL Editor first.");
    }
    setSaving(false);
  };

  const deleteAnn = async (id: string) => {
    await supabase.from("announcements").delete().eq("id", id);
    showToast("Announcement deleted");
    fetch();
  };

  const typeColors: Record<string, string> = {
    info: "text-brand-blue bg-brand-blue/10 border-brand-blue/20",
    warning: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    success: "text-green-400 bg-green-400/10 border-green-400/20",
  };

  return (
    <main className="min-h-screen bg-[#060B17]">
      <Navbar />
      {toast && (
        <div className="fixed top-20 right-6 z-50 px-5 py-3 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 text-sm">
          {toast}
        </div>
      )}
      <div className="flex pt-16">
        <AdminSidebar />
        <div className="flex-1 p-6 md:p-10 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1">Announcements</h1>
            <p className="text-white/50 text-sm">Send notifications and updates to all students</p>
          </div>

          {/* SQL migration note */}
          <div className="glass rounded-xl border border-yellow-400/20 p-4 mb-6 text-sm">
            <div className="flex items-start gap-3">
              <Bell size={16} className="text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-yellow-400 mb-1">One-time setup required</div>
                <p className="text-white/60 text-xs">Run this in your <a href="https://supabase.com/dashboard/project/kiebjlvcmntulmddhkrm/sql/new" target="_blank" className="text-brand-blue underline">Supabase SQL Editor</a> first:</p>
                <code className="block mt-2 bg-white/5 rounded-lg p-2 text-xs text-white/70 font-mono">
                  CREATE TABLE IF NOT EXISTS public.announcements (id uuid DEFAULT uuid_generate_v4() PRIMARY KEY, title TEXT NOT NULL, message TEXT NOT NULL, type TEXT DEFAULT &apos;info&apos;, created_at TIMESTAMPTZ DEFAULT NOW()); ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY; CREATE POLICY &quot;Anyone can read announcements&quot; ON public.announcements FOR SELECT USING (true);
                </code>
              </div>
            </div>
          </div>

          {/* Compose */}
          <div className="glass-card rounded-2xl p-6 mb-8 border border-white/5">
            <h2 className="font-bold mb-5 flex items-center gap-2"><Megaphone size={18} className="text-brand-purple" /> New Announcement</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Title *</label>
                <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="Announcement title..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-blue" />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Message *</label>
                <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  rows={4} placeholder="Write your announcement..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-blue resize-none" />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Type</label>
                <div className="flex gap-3">
                  {(["info", "warning", "success"] as const).map(t => (
                    <button key={t} onClick={() => setForm(p => ({ ...p, type: t }))}
                      className={`px-4 py-2 rounded-xl text-xs font-medium capitalize border transition-colors ${form.type === t ? typeColors[t] : "glass border-white/10 text-white/50"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={send} disabled={saving || !form.title || !form.message}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-blue to-brand-purple rounded-xl font-semibold text-sm disabled:opacity-50 hover:opacity-90 transition-opacity">
                {saving ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                Send Announcement
              </button>
            </div>
          </div>

          {/* History */}
          <div className="space-y-3">
            <h2 className="font-bold text-white/80">Sent Announcements</h2>
            {loading ? (
              <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-brand-blue" size={24} /></div>
            ) : announcements.length === 0 ? (
              <div className="glass rounded-2xl border border-white/5 p-10 text-center text-white/30">No announcements sent yet</div>
            ) : announcements.map(a => (
              <div key={a.id} className={`glass rounded-xl border p-4 ${typeColors[a.type] || typeColors.info}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 size={14} />
                      <span className="font-semibold text-sm">{a.title}</span>
                      <span className="text-xs opacity-60 capitalize ml-auto">{a.type}</span>
                    </div>
                    <p className="text-sm opacity-80">{a.message}</p>
                    <p className="text-xs opacity-50 mt-2">{new Date(a.created_at).toLocaleString("en-IN")}</p>
                  </div>
                  <button onClick={() => deleteAnn(a.id)} className="p-1.5 rounded-lg hover:bg-red-400/10 text-current opacity-50 hover:opacity-100 transition-all flex-shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
