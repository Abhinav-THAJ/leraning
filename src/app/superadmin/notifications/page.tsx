"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { createClient } from "@/utils/supabase/client";
import { Bell, Send, Loader2, Plus, Trash2, Users, CheckCircle2 } from "lucide-react";

export default function NotificationsPage() {
  const supabase = createClient();
  const [form, setForm] = useState({ title: "", message: "", target: "all" });
  const [sent, setSent] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  const showMsg = (m: string) => { setToast(m); setTimeout(() => setToast(""), 3000); };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [{ data: n }, { data: s }] = await Promise.all([
        supabase.from("notifications").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("id, full_name, email").eq("role", "student"),
      ]);
      setSent(n || []);
      setStudents(s || []);
      setLoading(false);
    };
    load();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const { error } = await supabase.from("notifications").insert({
      title: form.title,
      message: form.message,
      target: form.target,
      sent_at: new Date().toISOString(),
    });
    if (!error) {
      showMsg("Notification sent!");
      setForm({ title: "", message: "", target: "all" });
      const { data } = await supabase.from("notifications").select("*").order("created_at", { ascending: false });
      setSent(data || []);
    } else {
      showMsg("Error: " + error.message);
    }
    setSending(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("notifications").delete().eq("id", id);
    setSent(p => p.filter(n => n.id !== id));
    showMsg("Deleted");
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/25 focus:outline-none focus:border-amber-500/50 text-sm";

  return (
    <main className="min-h-screen bg-[#060B17]">
      {toast && <div className="fixed top-6 right-6 z-50 px-4 py-3 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-medium">{toast}</div>}
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 p-6 md:p-8 min-h-screen">
          <div className="mb-8">
            <h1 className="text-2xl font-bold flex items-center gap-2"><Bell size={22} className="text-amber-400" /> Notifications</h1>
            <p className="text-white/40 text-sm mt-0.5">Send announcements and alerts to students</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            {[
              { icon: Users, label: "Total Students", value: students.length, color: "text-brand-blue" },
              { icon: Bell, label: "Notifications Sent", value: sent.length, color: "text-amber-400" },
              { icon: CheckCircle2, label: "This Month", value: sent.filter(n => new Date(n.created_at).getMonth() === new Date().getMonth()).length, color: "text-green-400" },
            ].map((s, i) => (
              <div key={i} className="glass-card rounded-2xl p-5 border border-white/5 flex items-center gap-4">
                <s.icon size={20} className={s.color} />
                <div>
                  <div className="text-xl font-bold">{s.value}</div>
                  <div className="text-white/40 text-xs">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Compose */}
            <div className="glass-card rounded-2xl p-6 border border-white/5">
              <h2 className="font-bold mb-5 flex items-center gap-2"><Send size={16} className="text-amber-400" /> Send Notification</h2>
              <form onSubmit={handleSend} className="space-y-4">
                <div>
                  <label className="text-xs text-white/50 mb-1.5 block uppercase tracking-wider">Title *</label>
                  <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Notification title" className={inputClass} />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1.5 block uppercase tracking-wider">Message *</label>
                  <textarea required value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} rows={4} placeholder="Write your message..." className={`${inputClass} resize-none`} />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1.5 block uppercase tracking-wider">Target</label>
                  <select value={form.target} onChange={e => setForm(p => ({ ...p, target: e.target.value }))} className={inputClass}>
                    <option value="all">All Students</option>
                    <option value="paid">Paid Students Only</option>
                    <option value="free">Free (No Access)</option>
                  </select>
                </div>
                <button type="submit" disabled={sending} className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 text-black rounded-xl text-sm font-bold hover:bg-amber-400 transition-colors disabled:opacity-50">
                  {sending ? <Loader2 className="animate-spin" size={15} /> : <Send size={15} />}
                  {sending ? "Sending..." : "Send Notification"}
                </button>
              </form>
            </div>

            {/* History */}
            <div className="glass-card rounded-2xl p-6 border border-white/5">
              <h2 className="font-bold mb-5">Sent History</h2>
              {loading ? (
                <div className="flex items-center justify-center py-10"><Loader2 className="animate-spin text-amber-400" size={22} /></div>
              ) : sent.length === 0 ? (
                <p className="text-white/30 text-sm text-center py-10">No notifications sent yet.</p>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {sent.map(n => (
                    <div key={n.id} className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="font-semibold text-sm">{n.title}</div>
                        <button onClick={() => handleDelete(n.id)} className="p-1 text-white/20 hover:text-red-400 transition-colors flex-shrink-0"><Trash2 size={12} /></button>
                      </div>
                      <p className="text-white/50 text-xs mb-2 line-clamp-2">{n.message}</p>
                      <div className="flex items-center gap-3 text-[10px] text-white/30">
                        <span className="px-1.5 py-0.5 bg-white/5 rounded">{n.target}</span>
                        <span>{new Date(n.created_at).toLocaleDateString("en-IN")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
