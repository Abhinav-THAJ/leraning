"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Eye, Trash2, Loader2, AlertTriangle, Globe, EyeOff } from "lucide-react";

export default function AdminCourseActions({
  courseId,
  courseSlug,
  published,
}: {
  courseId: string;
  courseSlug: string;
  published: boolean;
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(published);
  const router = useRouter();

  const handleTogglePublish = async () => {
    setPublishing(true);
    const res = await fetch(`/api/superadmin/courses/${courseId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !isPublished }),
    });
    if (res.ok) {
      setIsPublished(!isPublished);
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(`Failed to update course: ${data.error || res.statusText || "Make sure SUPABASE_SERVICE_ROLE_KEY is set in your production environment variables."}`);
    }
    setPublishing(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    const res = await fetch(`/api/superadmin/courses/${courseId}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(`Failed to delete course: ${data.error || res.statusText || "Make sure SUPABASE_SERVICE_ROLE_KEY is set in your production environment variables."}`);
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-1">
        {/* Publish / Unpublish toggle */}
        <button
          onClick={handleTogglePublish}
          disabled={publishing}
          className={`p-2 rounded-lg transition-colors ${
            isPublished
              ? "hover:bg-yellow-400/10 text-green-400 hover:text-yellow-400"
              : "hover:bg-green-400/10 text-white/40 hover:text-green-400"
          }`}
          title={isPublished ? "Unpublish course" : "Publish course"}
        >
          {publishing ? (
            <Loader2 size={15} className="animate-spin" />
          ) : isPublished ? (
            <Globe size={15} />
          ) : (
            <EyeOff size={15} />
          )}
        </button>

        <Link
          href={`/superadmin/courses/${courseId}/edit`}
          className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
          title="Edit course"
        >
          <Edit size={15} />
        </Link>
        <Link
          href={`/courses/${courseSlug}`}
          className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
          target="_blank"
          title="Preview course"
        >
          <Eye size={15} />
        </Link>
        <button
          onClick={() => setShowConfirm(true)}
          className="p-2 rounded-lg hover:bg-red-400/10 text-white/50 hover:text-red-400 transition-colors"
          title="Delete course"
        >
          <Trash2 size={15} />
        </button>
      </div>

      {/* Inline confirm dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="glass-card rounded-2xl p-8 max-w-sm w-full border border-red-500/20 shadow-2xl">
            <AlertTriangle size={36} className="text-red-400 mb-4" />
            <h3 className="text-lg font-bold mb-2">Delete Course?</h3>
            <p className="text-white/60 text-sm mb-6">
              This permanently deletes the course, all modules, all lessons, and student progress. Cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 glass border border-white/10 rounded-xl text-sm font-medium hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
              >
                {deleting ? <Loader2 className="animate-spin" size={15} /> : <Trash2 size={15} />}
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
