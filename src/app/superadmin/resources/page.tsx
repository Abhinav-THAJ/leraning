"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { createClient } from "@/utils/supabase/client";
import { FolderOpen, Upload, Trash2, Link2, Loader2, FileText, Plus, ExternalLink } from "lucide-react";

export default function ResourcesPage() {
  const supabase = createClient();
  const [resources, setResources] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", url: "", type: "pdf", lesson_id: "", course_id: "" });
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState("");

  const showMsg = (m: string) => { setToast(m); setTimeout(() => setToast(""), 3000); };

  const load = async () => {
    setLoading(true);
    const [{ data: r }, { data: c }] = await Promise.all([
      supabase.from("resources").select("*, lessons(title, modules(courses(title)))").order("created_at", { ascending: false }),
      supabase.from("courses").select("id, title").eq("published", true),
    ]);
    setResources(r || []);
    setCourses(c || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const loadLessons = async (courseId: string) => {
    const { data } = await supabase.from("lessons").select("id, title, modules!inner(course_id)").eq("modules.course_id", courseId);
    setLessons(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("resources").insert({
      title: form.title, url: form.url, type: form.type,
      lesson_id: form.lesson_id || null,
    });
    if (!error) { showMsg("Resource added!"); setShowForm(false); setForm({ title: "", url: "", type: "pdf", lesson_id: "", course_id: "" }); load(); }
    else showMsg("Error: " + error.message);
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("resources").delete().eq("id", id);
    showMsg("Resource deleted");
    load();
  };

  return (
    <main className="min-h-screen bg-[#060B17]">
      {toast && <div className="fixed top-6 right-6 z-50 px-4 py-3 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-medium">{toast}</div>}
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 p-6 md:p-8 min-h-screen">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2"><FolderOpen size={22} className="text-amber-400" /> Resources</h1>
              <p className="text-white/40 text-sm mt-0.5">Manage downloadable files and links for lessons</p>
            </div>
            <button onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl text-sm font-semibold hover:bg-amber-500/20 transition-colors">
              <Plus size={15} /> Add Resource
            </button>
          </div>

          {/* Add Form */}
          {showForm && (
            <div className="glass-card rounded-2xl p-6 border border-amber-500/20 mb-6">
              <h2 className="font-bold mb-5">Add New Resource</h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/50 mb-1.5 block font-semibold uppercase tracking-wider">Title *</label>
                  <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                    placeholder="e.g. Module 1 Notes PDF"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/25 focus:outline-none focus:border-amber-500/50 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1.5 block font-semibold uppercase tracking-wider">URL / Link *</label>
                  <input required value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))}
                    placeholder="https://drive.google.com/..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/25 focus:outline-none focus:border-amber-500/50 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1.5 block font-semibold uppercase tracking-wider">Type</label>
                  <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500/50 text-sm">
                    <option value="pdf">PDF</option>
                    <option value="video">Video</option>
                    <option value="link">Link</option>
                    <option value="doc">Document</option>
                    <option value="zip">ZIP</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1.5 block font-semibold uppercase tracking-wider">Course (optional)</label>
                  <select value={form.course_id} onChange={e => { setForm(p => ({ ...p, course_id: e.target.value, lesson_id: "" })); loadLessons(e.target.value); }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500/50 text-sm">
                    <option value="">— Select course —</option>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                </div>
                {lessons.length > 0 && (
                  <div className="md:col-span-2">
                    <label className="text-xs text-white/50 mb-1.5 block font-semibold uppercase tracking-wider">Attach to Lesson</label>
                    <select value={form.lesson_id} onChange={e => setForm(p => ({ ...p, lesson_id: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500/50 text-sm">
                      <option value="">— Select lesson —</option>
                      {lessons.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}
                    </select>
                  </div>
                )}
                <div className="md:col-span-2 flex gap-3">
                  <button type="submit" disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-black rounded-xl text-sm font-bold hover:bg-amber-400 transition-colors disabled:opacity-50">
                    {saving ? <Loader2 className="animate-spin" size={15} /> : <Upload size={15} />}
                    {saving ? "Saving..." : "Save Resource"}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)}
                    className="px-5 py-2.5 glass border border-white/10 rounded-xl text-sm text-white/60 hover:text-white transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Resources Table */}
          <div className="glass rounded-2xl border border-white/5 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-white/30">
                  {["Resource", "Type", "Attached To", "Actions"].map(h => (
                    <th key={h} className="text-left p-4 font-medium text-xs">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} className="p-12 text-center"><Loader2 className="animate-spin mx-auto text-amber-400" size={22} /></td></tr>
                ) : resources.length === 0 ? (
                  <tr><td colSpan={4} className="p-12 text-center text-white/30">No resources yet. Add your first one above.</td></tr>
                ) : resources.map((r: any) => (
                  <tr key={r.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-amber-400" />
                        <div>
                          <div className="font-medium">{r.title}</div>
                          <div className="text-white/30 text-xs font-mono truncate max-w-[200px]">{r.url}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-xs bg-white/5 text-white/50 uppercase font-mono">{r.type}</span>
                    </td>
                    <td className="p-4 text-white/50 text-xs">
                      {r.lessons?.modules?.courses?.title
                        ? `${r.lessons.modules.courses.title} › ${r.lessons.title}`
                        : "—"}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <a href={r.url} target="_blank" rel="noopener noreferrer"
                          className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                          <ExternalLink size={13} />
                        </a>
                        <button onClick={() => handleDelete(r.id)}
                          className="p-1.5 rounded-lg hover:bg-red-400/10 text-white/40 hover:text-red-400 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
