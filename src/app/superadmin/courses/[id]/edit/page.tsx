"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import AdminSidebar from "@/components/AdminSidebar";
import { createClient } from "@/utils/supabase/client";
import {
  Loader2, Save, Trash2, Plus, Video, BookOpen,
  ChevronDown, ChevronUp, AlertTriangle, Check, X, GripVertical,
} from "lucide-react";
import VideoUpload from "@/components/VideoUpload";

const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand-blue transition-colors text-sm";
const labelClass = "block text-sm text-white/60 mb-1.5 font-medium";

type Lesson = { id: string; title: string; description: string; video_url: string; storage_path?: string; is_free_preview: boolean; order_index: number; isNew?: boolean };
type Module = { id: string; title: string; order_index: number; lessons: Lesson[]; isNew?: boolean };

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const courseId = params.id as string;

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "", slug: "", description: "", price: 25000, thumbnail_url: "", published: false,
  });
  const [modules, setModules] = useState<Module[]>([]);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    async function load() {
      const { data: course } = await supabase.from("courses").select("*").eq("id", courseId).single();
      if (!course) { router.push("/superadmin/courses"); return; }
      setForm({ title: course.title, slug: course.slug, description: course.description || "", price: course.price, thumbnail_url: course.thumbnail_url || "", published: course.published });

      const { data: mods } = await supabase.from("modules").select("*, lessons(*)").eq("course_id", courseId).order("order_index");
      if (mods) {
        setModules(mods.map((m: any) => ({
          ...m,
          lessons: (m.lessons || []).sort((a: any, b: any) => a.order_index - b.order_index),
        })));
      }
      setLoading(false);
    }
    load();
  }, [courseId]);

  // ─── Course Save ────────────────────────────────────────────
  const saveCourse = async () => {
    setSaving(true);
    const { error } = await supabase.from("courses").update({
      title: form.title, slug: form.slug, description: form.description,
      price: Number(form.price), thumbnail_url: form.thumbnail_url, published: form.published,
    }).eq("id", courseId);
    if (error) { showToast("Failed to save: " + error.message, "error"); }
    else { showToast("Course saved!"); }
    setSaving(false);
  };

  // ─── Course Delete ──────────────────────────────────────────
  const deleteCourse = async () => {
    setDeleting(true);
    const res = await fetch(`/api/superadmin/courses/${courseId}`, { method: "DELETE" });
    if (res.ok) { router.push("/superadmin/courses"); }
    else { showToast("Failed to delete course", "error"); setDeleting(false); }
  };

  // ─── Module CRUD ────────────────────────────────────────────
  const addModule = () => {
    const newMod: Module = {
      id: `new-${Date.now()}`, title: "New Module", order_index: modules.length + 1, lessons: [], isNew: true,
    };
    setModules(prev => [...prev, newMod]);
    setExpandedModule(newMod.id);
  };

  const saveModule = async (mod: Module) => {
    if (mod.isNew) {
      const { data, error } = await supabase.from("modules").insert({ course_id: courseId, title: mod.title, order_index: mod.order_index }).select().single();
      if (error) { showToast("Failed to save module", "error"); return; }
      setModules(prev => prev.map(m => m.id === mod.id ? { ...m, id: data.id, isNew: false } : m));
      showToast("Module added!");
    } else {
      const { error } = await supabase.from("modules").update({ title: mod.title, order_index: mod.order_index }).eq("id", mod.id);
      if (error) { showToast("Failed to update module", "error"); return; }
      showToast("Module saved!");
    }
  };

  const deleteModule = async (modId: string) => {
    const mod = modules.find(m => m.id === modId);
    if (mod?.isNew) { setModules(prev => prev.filter(m => m.id !== modId)); return; }
    const res = await fetch(`/api/superadmin/modules/${modId}`, { method: "DELETE" });
    if (res.ok) { setModules(prev => prev.filter(m => m.id !== modId)); showToast("Module deleted!"); }
    else { showToast("Failed to delete module", "error"); }
  };

  const updateModuleTitle = (modId: string, title: string) => {
    setModules(prev => prev.map(m => m.id === modId ? { ...m, title } : m));
  };

  // ─── Lesson CRUD ────────────────────────────────────────────
  const addLesson = (modId: string) => {
    const mod = modules.find(m => m.id === modId);
    if (!mod) return;
    const newLesson: Lesson = {
      id: `new-${Date.now()}`, title: "New Lesson", description: "", video_url: "",
      storage_path: "", is_free_preview: false, order_index: (mod.lessons?.length || 0) + 1, isNew: true,
    };
    setModules(prev => prev.map(m => m.id === modId ? { ...m, lessons: [...(m.lessons || []), newLesson] } : m));
  };

  const updateLesson = (modId: string, lessonId: string, field: string, value: any) => {
    setModules(prev => prev.map(m => m.id !== modId ? m : {
      ...m, lessons: m.lessons.map(l => l.id === lessonId ? { ...l, [field]: value } : l)
    }));
  };

  const saveLesson = async (modId: string, lesson: Lesson) => {
    if (lesson.isNew) {
      const realMod = modules.find(m => m.id === modId);
      if (!realMod || realMod.isNew) { showToast("Save the module first before adding lessons", "error"); return; }
      const { data, error } = await supabase.from("lessons").insert({
        module_id: modId, title: lesson.title, description: lesson.description,
        video_url: lesson.video_url, is_free_preview: lesson.is_free_preview, order_index: lesson.order_index,
      }).select().single();
      if (error) { showToast("Failed to save lesson", "error"); return; }
      setModules(prev => prev.map(m => m.id !== modId ? m : {
        ...m, lessons: m.lessons.map(l => l.id === lesson.id ? { ...l, id: data.id, isNew: false } : l)
      }));
      showToast("Lesson saved!");
    } else {
      const { error } = await supabase.from("lessons").update({
        title: lesson.title, description: lesson.description, video_url: lesson.video_url,
        is_free_preview: lesson.is_free_preview, order_index: lesson.order_index,
      }).eq("id", lesson.id);
      if (error) { showToast("Failed to update lesson", "error"); return; }
      showToast("Lesson saved!");
    }
  };

  const deleteLesson = async (modId: string, lesson: Lesson) => {
    if (lesson.isNew) {
      setModules(prev => prev.map(m => m.id !== modId ? m : { ...m, lessons: m.lessons.filter(l => l.id !== lesson.id) }));
      return;
    }
    const res = await fetch(`/api/superadmin/lessons/${lesson.id}`, { method: "DELETE" });
    if (res.ok) {
      setModules(prev => prev.map(m => m.id !== modId ? m : { ...m, lessons: m.lessons.filter(l => l.id !== lesson.id) }));
      showToast("Lesson deleted!");
    } else { showToast("Failed to delete lesson", "error"); }
  };

  if (loading) return (
    <main className="min-h-screen bg-[#060B17] flex items-center justify-center">
      <Loader2 className="animate-spin text-brand-blue" size={32} />
    </main>
  );

  return (
    <main className="min-h-screen bg-[#060B17]">
      <Navbar />

      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-sm font-medium transition-all ${toast.type === "success" ? "bg-green-500/20 border border-green-500/30 text-green-400" : "bg-red-500/20 border border-red-500/30 text-red-400"}`}>
          {toast.type === "success" ? <Check size={16} /> : <AlertTriangle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="glass-card rounded-2xl p-8 max-w-md w-full border border-red-500/20">
            <AlertTriangle size={40} className="text-red-400 mb-4" />
            <h2 className="text-xl font-bold mb-2">Delete this course?</h2>
            <p className="text-white/60 text-sm mb-6">This will permanently delete the course, all its modules, lessons, and student progress. This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-3 glass border border-white/10 rounded-xl font-medium hover:bg-white/5 transition-colors">Cancel</button>
              <button onClick={deleteCourse} disabled={deleting} className="flex-1 py-3 bg-red-500 hover:bg-red-600 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                {deleting ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                {deleting ? "Deleting..." : "Delete Course"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex pt-16">
        <AdminSidebar />

        <div className="flex-1 p-6 md:p-10 max-w-4xl overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">Edit Course</h1>
              <p className="text-white/50 text-sm">{form.title}</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium">
                <Trash2 size={15} /> Delete Course
              </button>
              <button onClick={saveCourse} disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-brand-blue rounded-xl font-semibold text-sm hover:bg-brand-blue/80 transition-colors disabled:opacity-50">
                {saving ? <Loader2 className="animate-spin" size={15} /> : <Save size={15} />}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          {/* ── Course Details ── */}
          <section className="glass-card rounded-2xl p-6 mb-6 space-y-5">
            <h2 className="text-lg font-bold flex items-center gap-2"><BookOpen size={18} className="text-brand-blue" /> Course Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className={labelClass}>Course Title *</label>
                <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className={inputClass} placeholder="Course title" />
              </div>
              <div>
                <label className={labelClass}>Slug (URL)</label>
                <input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} className={inputClass} placeholder="course-slug" />
                <p className="text-xs text-white/30 mt-1">/courses/{form.slug}</p>
              </div>
              <div>
                <label className={labelClass}>Price (₹)</label>
                <input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: Number(e.target.value) }))} className={inputClass} />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Description</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={4} className={`${inputClass} resize-none`} placeholder="Course description..." />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Thumbnail URL</label>
                <input value={form.thumbnail_url} onChange={e => setForm(p => ({ ...p, thumbnail_url: e.target.value }))} className={inputClass} placeholder="https://..." />
              </div>
              <div className="flex items-center gap-3 md:col-span-2">
                <input id="pub" type="checkbox" checked={form.published} onChange={e => setForm(p => ({ ...p, published: e.target.checked }))} className="w-4 h-4 rounded accent-brand-blue" />
                <label htmlFor="pub" className="text-sm text-white/70">Published (visible to students)</label>
              </div>
            </div>
          </section>

          {/* ── Curriculum ── */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2"><Video size={18} className="text-brand-purple" /> Curriculum & Videos</h2>
              <button onClick={addModule} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm hover:bg-white/10 transition-colors font-medium">
                <Plus size={15} /> Add Module
              </button>
            </div>

            {modules.length === 0 && (
              <div className="glass rounded-2xl p-12 text-center border border-white/5 text-white/30">
                No modules yet. Click "Add Module" to start building the curriculum.
              </div>
            )}

            {modules.map((mod, mIdx) => (
              <div key={mod.id} className="glass rounded-2xl border border-white/5 overflow-hidden">
                {/* Module Header */}
                <div className="p-4 flex items-center gap-3 bg-white/[0.02] border-b border-white/5">
                  <GripVertical size={16} className="text-white/20" />
                  <span className="text-xs font-mono text-brand-blue/50 flex-shrink-0">{String(mIdx + 1).padStart(2, "0")}</span>
                  <input
                    value={mod.title}
                    onChange={e => updateModuleTitle(mod.id, e.target.value)}
                    className="flex-1 bg-transparent text-white font-semibold focus:outline-none text-sm placeholder-white/30"
                    placeholder="Module title"
                  />
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => saveModule(mod)} className="p-1.5 rounded-lg hover:bg-green-400/10 text-white/40 hover:text-green-400 transition-colors" title="Save module">
                      <Save size={14} />
                    </button>
                    <button onClick={() => deleteModule(mod.id)} className="p-1.5 rounded-lg hover:bg-red-400/10 text-white/40 hover:text-red-400 transition-colors" title="Delete module">
                      <Trash2 size={14} />
                    </button>
                    <button onClick={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                      {expandedModule === mod.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Lessons */}
                {expandedModule === mod.id && (
                  <div className="p-4 space-y-3">
                    {(mod.lessons || []).map((lesson, lIdx) => (
                      <div key={lesson.id} className="bg-white/[0.03] rounded-xl border border-white/5 p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-white/30 font-mono">{String(lIdx + 1).padStart(2, "0")}</span>
                          <input
                            value={lesson.title}
                            onChange={e => updateLesson(mod.id, lesson.id, "title", e.target.value)}
                            className="flex-1 bg-transparent text-white text-sm font-medium focus:outline-none placeholder-white/30 border-b border-white/10 pb-1"
                            placeholder="Lesson title"
                          />
                          <button onClick={() => saveLesson(mod.id, lesson)} className="p-1.5 rounded-lg hover:bg-green-400/10 text-white/30 hover:text-green-400 transition-colors flex-shrink-0" title="Save lesson">
                            <Save size={14} />
                          </button>
                          <button onClick={() => deleteLesson(mod.id, lesson)} className="p-1.5 rounded-lg hover:bg-red-400/10 text-white/30 hover:text-red-400 transition-colors flex-shrink-0" title="Delete lesson">
                            <Trash2 size={14} />
                          </button>
                        </div>

                        {/* Video Upload */}
                        <div>
                          <label className="text-xs text-white/40 mb-2 block">
                            🎬 Video — Upload file or paste URL
                          </label>
                          <VideoUpload
                            value={lesson.video_url || ""}
                            storagePath={lesson.storage_path}
                            onChange={(url, path) => {
                              updateLesson(mod.id, lesson.id, "video_url", url);
                              updateLesson(mod.id, lesson.id, "storage_path", path || "");
                            }}
                            onDelete={() => {
                              updateLesson(mod.id, lesson.id, "video_url", "");
                              updateLesson(mod.id, lesson.id, "storage_path", "");
                            }}
                          />
                        </div>

                        {/* Description */}
                        <div>
                          <label className="text-xs text-white/40 mb-1 block">Lesson description (optional)</label>
                          <textarea
                            value={lesson.description || ""}
                            onChange={e => updateLesson(mod.id, lesson.id, "description", e.target.value)}
                            rows={2}
                            placeholder="What students will learn in this lesson..."
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder-white/25 focus:outline-none focus:border-brand-blue resize-none"
                          />
                        </div>

                        {/* Options */}
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 text-xs text-white/50 cursor-pointer">
                            <input type="checkbox" checked={lesson.is_free_preview || false}
                              onChange={e => updateLesson(mod.id, lesson.id, "is_free_preview", e.target.checked)}
                              className="w-3.5 h-3.5 rounded accent-brand-blue" />
                            Free preview
                          </label>
                          <label className="flex items-center gap-2 text-xs text-white/50">
                            Order:
                            <input type="number" value={lesson.order_index} min={1}
                              onChange={e => updateLesson(mod.id, lesson.id, "order_index", Number(e.target.value))}
                              className="w-14 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white text-xs focus:outline-none text-center" />
                          </label>
                        </div>
                      </div>
                    ))}

                    <button onClick={() => addLesson(mod.id)}
                      className="w-full py-3 border border-dashed border-white/10 rounded-xl text-white/40 hover:text-white hover:border-white/20 transition-colors text-sm flex items-center justify-center gap-2">
                      <Plus size={15} /> Add Lesson
                    </button>
                  </div>
                )}
              </div>
            ))}
          </section>
        </div>
      </div>
    </main>
  );
}
