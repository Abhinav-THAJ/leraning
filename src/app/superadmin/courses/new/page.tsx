"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import AdminSidebar from "@/components/AdminSidebar";
import { createClient } from "@/utils/supabase/client";
import { Loader2, Save } from "lucide-react";

export default function NewCoursePage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    price: 25000,
    thumbnail_url: "",
    published: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    // Auto-generate slug from title
    if (name === "title") {
      setForm(prev => ({
        ...prev,
        title: value,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { data, error } = await supabase.from("courses").insert({
      ...form,
      price: Number(form.price),
    }).select().single();
    if (error) { setError(error.message); setLoading(false); return; }
    // Redirect to edit page so user can immediately add modules + videos
    router.push(`/superadmin/courses/${data.id}/edit`);
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand-blue transition-colors";
  const labelClass = "block text-sm text-white/60 mb-2 font-medium";

  return (
    <main className="min-h-screen bg-[#060B17]">
      <Navbar />
      <div className="flex pt-16">
        <AdminSidebar />
        <div className="flex-1 p-6 md:p-10 max-w-2xl">
          <h1 className="text-2xl font-bold mb-2">Add New Course</h1>
          <p className="text-white/50 text-sm mb-8">Fill in the course details below.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={labelClass}>Course Title *</label>
              <input name="title" value={form.title} onChange={handleChange} required placeholder="e.g. International Trade Specialist" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Slug (URL)</label>
              <input name="slug" value={form.slug} onChange={handleChange} required placeholder="international-trade-specialist" className={inputClass} />
              <p className="text-xs text-white/30 mt-1">Auto-generated from title. URL: /courses/{form.slug}</p>
            </div>
            <div>
              <label className={labelClass}>Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange} required rows={4} placeholder="Describe what students will learn..." className={`${inputClass} resize-none`} />
            </div>
            <div>
              <label className={labelClass}>Price (₹)</label>
              <input name="price" type="number" value={form.price} onChange={handleChange} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Thumbnail URL</label>
              <input name="thumbnail_url" value={form.thumbnail_url} onChange={handleChange} placeholder="https://..." className={inputClass} />
            </div>
            <div className="flex items-center gap-3">
              <input
                id="published"
                name="published"
                type="checkbox"
                checked={form.published}
                onChange={handleChange}
                className="w-4 h-4 rounded accent-brand-blue"
              />
              <label htmlFor="published" className="text-sm text-white/70">Publish immediately</label>
            </div>

            {error && <p className="text-red-400 text-sm bg-red-400/10 rounded-xl p-3">{error}</p>}

            <div className="flex gap-4 pt-2">
              <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-3 bg-brand-blue rounded-xl font-semibold hover:bg-brand-blue/80 transition-colors disabled:opacity-50">
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                {loading ? "Saving..." : "Create Course"}
              </button>
              <button type="button" onClick={() => router.back()} className="px-6 py-3 glass border border-white/10 rounded-xl text-white/70 hover:text-white transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
