"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { CheckCircle2 } from "lucide-react";

interface Props {
  lessonId: string;
  lessonTitle: string;
  lessonDescription: string | null;
  videoUrl: string | null;
  userId: string;
  initialSeconds: number;
}

export default function VideoPlayer({ lessonId, lessonTitle, lessonDescription, videoUrl, userId, initialSeconds }: Props) {
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const markComplete = async () => {
    setSaving(true);
    await supabase.from('progress').upsert({
      user_id: userId,
      lesson_id: lessonId,
      completed: true,
      last_watched_seconds: 0,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,lesson_id' });
    setCompleted(true);
    setSaving(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Video Area */}
      <div className="bg-black aspect-video w-full flex items-center justify-center">
        {videoUrl ? (
          // Vimeo / Bunny.net embed iframe
          videoUrl.includes('vimeo') ? (
            <iframe
              src={`https://player.vimeo.com/video/${videoUrl.split('/').pop()}?autoplay=0&texttrack=en`}
              className="w-full h-full"
              allowFullScreen
              allow="autoplay; fullscreen; picture-in-picture"
            />
          ) : videoUrl.includes('bunny') || videoUrl.includes('iframe') ? (
            <iframe
              src={videoUrl}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            />
          ) : (
            <video src={videoUrl} controls className="w-full h-full" />
          )
        ) : (
          <div className="flex flex-col items-center justify-center text-white/30 gap-3">
            <svg width="64" height="64" fill="none" viewBox="0 0 24 24" className="text-white/10">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M10 8l6 4-6 4V8z" fill="currentColor"/>
            </svg>
            <p className="text-sm">Video will appear here once added by admin</p>
          </div>
        )}
      </div>

      {/* Lesson Info */}
      <div className="p-6 md:p-8 max-w-4xl">
        <div className="flex items-start justify-between gap-6 mb-6 flex-wrap">
          <div>
            <h1 className="text-xl md:text-2xl font-bold mb-2">{lessonTitle}</h1>
            {lessonDescription && (
              <p className="text-white/60 text-sm leading-relaxed">{lessonDescription}</p>
            )}
          </div>

          <button
            onClick={markComplete}
            disabled={completed || saving}
            className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              completed
                ? "bg-green-400/20 text-green-400 border border-green-400/30"
                : "bg-white/5 border border-white/10 hover:bg-white/10 text-white"
            }`}
          >
            <CheckCircle2 size={16} />
            {completed ? "Completed!" : saving ? "Saving..." : "Mark as Complete"}
          </button>
        </div>
      </div>
    </div>
  );
}
