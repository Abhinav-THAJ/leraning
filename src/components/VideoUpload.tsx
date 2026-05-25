"use client";

import { useState, useRef } from "react";
import { Upload, Trash2, Loader2, Video, Check, ExternalLink, AlertCircle } from "lucide-react";

interface VideoUploadProps {
  value: string;
  storagePath?: string;
  onChange: (url: string, storagePath?: string) => void;
  onDelete?: () => void;
}

export default function VideoUpload({ value, storagePath, onChange, onDelete }: VideoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"upload" | "url">(value ? "url" : "upload");
  const fileRef = useRef<HTMLInputElement>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);
    setProgress(0);

    try {
      // Step 1: Get signed upload URL from server (tiny request, no size limit)
      const signedRes = await fetch(
        `/api/superadmin/storage?filename=${encodeURIComponent(file.name)}&type=${encodeURIComponent(file.type)}`
      );

      if (!signedRes.ok) {
        let errMsg = "Failed to get upload URL";
        try { errMsg = (await signedRes.json()).error || errMsg; } catch {}
        throw new Error(errMsg);
      }

      const { signedUrl, path, publicUrl } = await signedRes.json();

      // Step 2: Upload DIRECTLY to Supabase Storage via XHR (bypasses Next.js, real progress)
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhrRef.current = xhr;

        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            setProgress(Math.round((event.loaded / event.total) * 100));
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });

        xhr.addEventListener("error", () => reject(new Error("Network error during upload")));
        xhr.addEventListener("abort", () => reject(new Error("Upload cancelled")));

        xhr.open("PUT", signedUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });

      // Step 3: Confirm — set the public URL and storage path
      onChange(publicUrl, path);
      setTab("url");
    } catch (err: any) {
      setError(err.message || "Upload failed. Check SUPABASE_SERVICE_ROLE_KEY in .env.local");
    } finally {
      setUploading(false);
      // Reset file input so same file can be re-selected
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const cancelUpload = () => {
    xhrRef.current?.abort();
    setUploading(false);
    setProgress(0);
  };

  const handleDeleteStorage = async () => {
    if (!storagePath) {
      onChange("", undefined);
      onDelete?.();
      setTab("upload");
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch("/api/superadmin/storage", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: storagePath }),
      });
      if (!res.ok) {
        try { console.warn("Delete warning:", (await res.json()).error); } catch {}
      }
    } catch {
      // Even on error, clear the field locally
    } finally {
      onChange("", undefined);
      onDelete?.();
      setTab("upload");
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 rounded-lg p-1 w-fit">
        <button
          type="button"
          onClick={() => setTab("upload")}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            tab === "upload" ? "bg-amber-500 text-black" : "text-white/50 hover:text-white"
          }`}
        >
          📁 Upload File
        </button>
        <button
          type="button"
          onClick={() => setTab("url")}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            tab === "url" ? "bg-amber-500 text-black" : "text-white/50 hover:text-white"
          }`}
        >
          🔗 Paste URL
        </button>
      </div>

      {/* Upload Tab */}
      {tab === "upload" && (
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />

          {uploading ? (
            /* Progress UI */
            <div className="border-2 border-dashed border-amber-500/30 rounded-xl p-6 flex flex-col items-center gap-3">
              <Loader2 size={28} className="text-amber-400 animate-spin" />
              <div className="w-full max-w-xs space-y-2">
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-white/40">
                  <span>Uploading to Supabase...</span>
                  <span>{progress}%</span>
                </div>
              </div>
              <button
                type="button"
                onClick={cancelUpload}
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            /* Drop zone */
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full border-2 border-dashed border-white/15 hover:border-amber-500/40 rounded-xl p-8 flex flex-col items-center gap-3 transition-all group"
            >
              <Upload size={32} className="text-white/30 group-hover:text-amber-400 transition-colors" />
              <div className="text-center">
                <p className="text-sm font-medium text-white/60 group-hover:text-white/80">
                  Click to upload video
                </p>
                <p className="text-xs text-white/30 mt-1">
                  MP4, WebM, MOV — any size (direct Supabase upload)
                </p>
              </div>
            </button>
          )}

          {error && (
            <div className="flex items-start gap-2 text-xs text-red-400 bg-red-400/10 border border-red-400/20 px-3 py-2.5 rounded-lg mt-2">
              <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>
      )}

      {/* URL Paste Tab */}
      {tab === "url" && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              value={value}
              onChange={(e) => onChange(e.target.value, undefined)}
              placeholder="https://vimeo.com/123456 or https://youtu.be/abc or Supabase URL"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-xs placeholder-white/25 focus:outline-none focus:border-amber-500 transition-colors font-mono"
            />
            {value && (
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white/5 border border-white/10 rounded-lg text-white/40 hover:text-white transition-colors"
                title="Preview in new tab"
              >
                <ExternalLink size={14} />
              </a>
            )}
          </div>
          <p className="text-xs text-white/25">YouTube, Vimeo, Bunny.net, or any direct video URL</p>
        </div>
      )}

      {/* Current video badge + delete */}
      {value && (
        <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2.5">
          <div className="flex items-center gap-2 text-green-400 text-xs font-medium min-w-0">
            <Check size={14} className="flex-shrink-0" />
            <Video size={12} className="flex-shrink-0" />
            <span className="truncate text-white/60 font-mono">
              {storagePath ? value.split("/").pop() : value.length > 50 ? value.slice(0, 47) + "…" : value}
            </span>
          </div>
          <button
            type="button"
            onClick={handleDeleteStorage}
            disabled={deleting}
            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors ml-3 flex-shrink-0 bg-red-400/10 hover:bg-red-400/20 px-2.5 py-1 rounded-lg"
          >
            {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
            {deleting ? "Removing…" : "Remove"}
          </button>
        </div>
      )}
    </div>
  );
}
