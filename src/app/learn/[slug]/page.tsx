import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import VideoPlayer from "@/components/VideoPlayer";
import { CheckCircle2, Lock, ChevronLeft, ChevronRight } from "lucide-react";

export const revalidate = 0;

export default async function LearnPage({ params }: { params: Promise<{ slug: string; lessonId?: string }> }) {
  const supabase = await createClient();
  const { slug } = await params;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Check access
  const { data: profile } = await supabase.from('profiles').select('all_access').eq('id', user.id).single();
  if (!profile?.all_access) redirect("/courses");

  const { data: course } = await supabase
    .from('courses')
    .select('*, modules(*, lessons(*))')
    .eq('slug', slug)
    .single();

  if (!course) notFound();

  // Flatten lessons
  const allLessons = course.modules
    ?.sort((a: any, b: any) => a.order_index - b.order_index)
    .flatMap((m: any) => m.lessons?.sort((a: any, b: any) => a.order_index - b.order_index) ?? []) ?? [];

  // Get progress
  const { data: progressRows } = await supabase
    .from('progress')
    .select('lesson_id, completed, last_watched_seconds')
    .eq('user_id', user.id);
  const progressMap = Object.fromEntries(progressRows?.map(p => [p.lesson_id, p]) ?? []);

  // Find last watched or first lesson
  const firstLesson = allLessons[0];

  return (
    <main className="min-h-screen bg-[#060B17] flex flex-col">
      <Navbar />

      <div className="flex flex-1 pt-16">
        {/* Sidebar - curriculum */}
        <aside className="hidden lg:flex flex-col w-80 bg-white/[0.02] border-r border-white/5 overflow-y-auto max-h-[calc(100vh-4rem)]">
          <div className="p-5 border-b border-white/5 sticky top-0 bg-[#060B17] z-10">
            <Link href="/dashboard" className="flex items-center gap-2 text-white/60 hover:text-white text-sm mb-3 transition-colors">
              <ChevronLeft size={16} /> Dashboard
            </Link>
            <h2 className="font-bold text-sm line-clamp-2">{course.title}</h2>
            <div className="mt-2 text-xs text-white/50">
              {progressRows?.filter(p => p.completed).length ?? 0} / {allLessons.length} lessons complete
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-blue to-brand-purple rounded-full"
                style={{ width: `${((progressRows?.filter(p => p.completed).length ?? 0) / Math.max(allLessons.length, 1)) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-3">
            {course.modules?.sort((a: any, b: any) => a.order_index - b.order_index).map((module: any) => (
              <div key={module.id} className="mb-4">
                <div className="text-xs font-semibold text-white/40 uppercase tracking-wider px-3 py-2">{module.title}</div>
                {module.lessons?.sort((a: any, b: any) => a.order_index - b.order_index).map((lesson: any) => {
                  const done = progressMap[lesson.id]?.completed;
                  return (
                    <Link
                      key={lesson.id}
                      href={`/learn/${slug}/${lesson.id}`}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-sm group"
                    >
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${done ? 'text-green-400' : 'text-white/20'}`}>
                        {done ? <CheckCircle2 size={16} /> : <div className="w-2.5 h-2.5 rounded-full bg-white/20 group-hover:bg-white/40 transition-colors" />}
                      </div>
                      <span className={`line-clamp-2 ${done ? 'text-white/50' : 'text-white/80'}`}>{lesson.title}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {firstLesson ? (
            <VideoPlayer
              lessonId={firstLesson.id}
              lessonTitle={firstLesson.title}
              lessonDescription={firstLesson.description}
              videoUrl={firstLesson.video_url}
              userId={user.id}
              initialSeconds={progressMap[firstLesson.id]?.last_watched_seconds ?? 0}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Lock size={40} className="text-white/20 mx-auto mb-4" />
                <p className="text-white/50">No lessons available yet for this course.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
