"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { createClient } from "@/utils/supabase/client";
import { Globe, Save, Loader2, Plus, Trash2, Star, HelpCircle, Megaphone, Check, X } from "lucide-react";

type Section = "hero" | "testimonials" | "faqs" | "announcements";

export default function ContentPage() {
  const supabase = createClient();
  const [section, setSection] = useState<Section>("hero");
  const [hero, setHero] = useState({ headline: "", subheadline: "", cta_text: "", cta_link: "" });
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  const showMsg = (m: string) => { setToast(m); setTimeout(() => setToast(""), 3000); };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [{ data: h }, { data: t }, { data: f }, { data: a }] = await Promise.all([
        supabase.from("site_content").select("*").eq("key", "hero").single(),
        supabase.from("testimonials").select("*").order("created_at", { ascending: false }),
        supabase.from("faqs").select("*").order("order_index"),
        supabase.from("announcements").select("*").order("created_at", { ascending: false }),
      ]);
      if (h?.value) setHero(h.value);
      setTestimonials(t || []);
      setFaqs(f || []);
      setAnnouncements(a || []);
      setLoading(false);
    };
    load();
  }, []);

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/25 focus:outline-none focus:border-amber-500/50 text-sm";

  const tabs: { key: Section; label: string; icon: any }[] = [
    { key: "hero", label: "Hero Banner", icon: Globe },
    { key: "testimonials", label: "Testimonials", icon: Star },
    { key: "faqs", label: "FAQs", icon: HelpCircle },
    { key: "announcements", label: "Announcements", icon: Megaphone },
  ];

  return (
    <main className="min-h-screen bg-[#060B17]">
      {toast && <div className="fixed top-6 right-6 z-50 px-4 py-3 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-medium">{toast}</div>}
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 p-6 md:p-8 min-h-screen">
          <div className="mb-6">
            <h1 className="text-2xl font-bold flex items-center gap-2"><Globe size={22} className="text-amber-400" /> Site Content</h1>
            <p className="text-white/40 text-sm mt-0.5">Manage all dynamic website content without touching code</p>
          </div>

          <div className="flex gap-2 mb-6 flex-wrap">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setSection(t.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors ${section === t.key ? "bg-amber-500/15 text-amber-400 border border-amber-500/30" : "glass border border-white/10 text-white/50 hover:text-white"}`}>
                <t.icon size={14} /> {t.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-amber-400" size={28} /></div>
          ) : (
            <>
              {section === "hero" && (
                <div className="glass-card rounded-2xl p-6 border border-white/5 max-w-2xl space-y-4">
                  <h2 className="font-bold">Hero Banner</h2>
                  <div><label className="text-xs text-white/50 mb-1 block uppercase tracking-wider">Headline</label><input value={hero.headline} onChange={e => setHero(p => ({ ...p, headline: e.target.value }))} placeholder="Transform Your Career..." className={inputClass} /></div>
                  <div><label className="text-xs text-white/50 mb-1 block uppercase tracking-wider">Sub-headline</label><textarea value={hero.subheadline} onChange={e => setHero(p => ({ ...p, subheadline: e.target.value }))} rows={2} className={`${inputClass} resize-none`} /></div>
                  <div><label className="text-xs text-white/50 mb-1 block uppercase tracking-wider">CTA Button Text</label><input value={hero.cta_text} onChange={e => setHero(p => ({ ...p, cta_text: e.target.value }))} placeholder="Get Started" className={inputClass} /></div>
                  <div><label className="text-xs text-white/50 mb-1 block uppercase tracking-wider">CTA Link</label><input value={hero.cta_link} onChange={e => setHero(p => ({ ...p, cta_link: e.target.value }))} placeholder="/courses" className={inputClass} /></div>
                  <button onClick={async () => { setSaving(true); await supabase.from("site_content").upsert({ key: "hero", value: hero }, { onConflict: "key" }); showMsg("Saved!"); setSaving(false); }} disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-black rounded-xl text-sm font-bold hover:bg-amber-400 transition-colors disabled:opacity-50">
                    {saving ? <Loader2 className="animate-spin" size={15} /> : <Save size={15} />} Save Hero
                  </button>
                </div>
              )}

              {section === "testimonials" && (
                <div>
                  <div className="flex justify-end mb-4">
                    <button onClick={async () => { const { data } = await supabase.from("testimonials").insert({ name: "Student", role: "Student", content: "Great course!", rating: 5 }).select().single(); if (data) setTestimonials(p => [data, ...p]); }}
                      className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl text-xs font-semibold hover:bg-amber-500/20 transition-colors">
                      <Plus size={13} /> Add Testimonial
                    </button>
                  </div>
                  <div className="space-y-4">
                    {testimonials.map(t => (
                      <div key={t.id} className="glass-card rounded-2xl p-5 border border-white/5 space-y-2">
                        <div className="grid grid-cols-2 gap-3">
                          <input defaultValue={t.name} onBlur={async e => { await supabase.from("testimonials").update({ name: e.target.value }).eq("id", t.id); }} placeholder="Name" className={inputClass} />
                          <input defaultValue={t.role} onBlur={async e => { await supabase.from("testimonials").update({ role: e.target.value }).eq("id", t.id); }} placeholder="Role" className={inputClass} />
                        </div>
                        <textarea defaultValue={t.content} onBlur={async e => { await supabase.from("testimonials").update({ content: e.target.value }).eq("id", t.id); showMsg("Saved!"); }} rows={2} className={`${inputClass} resize-none`} />
                        <div className="flex items-center justify-between">
                          <div className="flex gap-1">{[1,2,3,4,5].map(s => <button key={s} onClick={async () => { await supabase.from("testimonials").update({ rating: s }).eq("id", t.id); setTestimonials(p => p.map(x => x.id === t.id ? { ...x, rating: s } : x)); }}><Star size={14} className={s <= (t.rating || 5) ? "text-amber-400 fill-amber-400" : "text-white/20"} /></button>)}</div>
                          <button onClick={async () => { await supabase.from("testimonials").delete().eq("id", t.id); setTestimonials(p => p.filter(x => x.id !== t.id)); }} className="p-1.5 text-white/30 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                        </div>
                      </div>
                    ))}
                    {testimonials.length === 0 && <p className="text-white/30 text-sm text-center py-10">No testimonials yet.</p>}
                  </div>
                </div>
              )}

              {section === "faqs" && (
                <div>
                  <div className="flex justify-end mb-4">
                    <button onClick={async () => { const { data } = await supabase.from("faqs").insert({ question: "New Question?", answer: "Answer here.", order_index: faqs.length + 1 }).select().single(); if (data) setFaqs(p => [...p, data]); }}
                      className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl text-xs font-semibold hover:bg-amber-500/20 transition-colors">
                      <Plus size={13} /> Add FAQ
                    </button>
                  </div>
                  <div className="space-y-3">
                    {faqs.map(f => (
                      <div key={f.id} className="glass-card rounded-2xl p-5 border border-white/5 space-y-2">
                        <input defaultValue={f.question} onBlur={async e => { await supabase.from("faqs").update({ question: e.target.value }).eq("id", f.id); }} placeholder="Question?" className={inputClass} />
                        <textarea defaultValue={f.answer} onBlur={async e => { await supabase.from("faqs").update({ answer: e.target.value }).eq("id", f.id); showMsg("Saved!"); }} rows={2} className={`${inputClass} resize-none`} />
                        <div className="flex justify-end"><button onClick={async () => { await supabase.from("faqs").delete().eq("id", f.id); setFaqs(p => p.filter(x => x.id !== f.id)); }} className="p-1.5 text-white/30 hover:text-red-400 transition-colors"><Trash2 size={13} /></button></div>
                      </div>
                    ))}
                    {faqs.length === 0 && <p className="text-white/30 text-sm text-center py-10">No FAQs yet.</p>}
                  </div>
                </div>
              )}

              {section === "announcements" && (
                <div>
                  <div className="flex justify-end mb-4">
                    <button onClick={async () => { const { data } = await supabase.from("announcements").insert({ title: "New Announcement", content: "Content here.", active: true }).select().single(); if (data) setAnnouncements(p => [data, ...p]); }}
                      className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl text-xs font-semibold hover:bg-amber-500/20 transition-colors">
                      <Plus size={13} /> Add Announcement
                    </button>
                  </div>
                  <div className="space-y-3">
                    {announcements.map(a => (
                      <div key={a.id} className="glass-card rounded-2xl p-5 border border-white/5 flex gap-4">
                        <div className="flex-1 space-y-2">
                          <input defaultValue={a.title} onBlur={async e => { await supabase.from("announcements").update({ title: e.target.value }).eq("id", a.id); }} placeholder="Title" className={inputClass} />
                          <textarea defaultValue={a.content} onBlur={async e => { await supabase.from("announcements").update({ content: e.target.value }).eq("id", a.id); showMsg("Saved!"); }} rows={2} className={`${inputClass} resize-none`} />
                        </div>
                        <div className="flex flex-col items-center gap-2 pt-1">
                          <button onClick={async () => { await supabase.from("announcements").update({ active: !a.active }).eq("id", a.id); setAnnouncements(p => p.map(x => x.id === a.id ? { ...x, active: !x.active } : x)); }}
                            className={`p-2 rounded-lg transition-colors ${a.active ? "bg-green-400/10 text-green-400" : "bg-white/5 text-white/30"}`}>
                            {a.active ? <Check size={14} /> : <X size={14} />}
                          </button>
                          <button onClick={async () => { await supabase.from("announcements").delete().eq("id", a.id); setAnnouncements(p => p.filter(x => x.id !== a.id)); }} className="p-2 text-white/30 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                        </div>
                      </div>
                    ))}
                    {announcements.length === 0 && <p className="text-white/30 text-sm text-center py-10">No announcements yet.</p>}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
