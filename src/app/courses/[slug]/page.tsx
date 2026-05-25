import { createClient } from "@/utils/supabase/server";
import { redirect, notFound } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import CheckoutButton from "@/components/CheckoutButton";
import { CheckCircle2, PlayCircle, Clock, BookOpen, GraduationCap } from "lucide-react";

// Safe image src — Next.js Image throws on null/empty/invalid URLs
function getImgSrc(url: string | null | undefined, fallback = "/course_hero_bg.png"): string {
  if (!url) return fallback;
  const t = url.trim();
  if (!t) return fallback;
  if (t.startsWith("http://") || t.startsWith("https://") || t.startsWith("/")) return t;
  return fallback;
}

export const revalidate = 0;

// Known slugs — if these can't load, it's a DB issue not a 404
const KNOWN_SLUGS = ["export-import-certificate", "international-trade-specialist"];

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createClient();
  const { slug } = await params;

  let course: any = null;
  let modules: any[] = [];

  // Fetch course from Supabase
  const { data: courseData, error: courseError } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  // DB/schema error — redirect to setup page
  if (courseError) {
    console.error('Course fetch error:', courseError.message);
    redirect('/setup');
  }

  // No data — if it's a known slug it means DB needs seeding; redirect to setup
  if (!courseData) {
    if (KNOWN_SLUGS.includes(slug)) {
      redirect('/setup');
    }
    notFound();
  }

  course = courseData;

  // Fetch modules + lessons
  const { data: modulesData } = await supabase
    .from('modules')
    .select('*, lessons(*)')
    .eq('course_id', course.id)
    .order('order_index', { ascending: true });

  if (modulesData) modules = modulesData;


  return (
    <main className="min-h-screen bg-[#060B17]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={getImgSrc(course.thumbnail_url)}
            alt={course.title || "Course"}
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060B17] via-[#060B17]/80 to-transparent" />
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            
            <div className="lg:col-span-2">
              <span className="inline-block py-1 px-3 rounded-full border border-brand-purple/30 bg-brand-purple/10 text-brand-purple text-xs font-semibold uppercase tracking-wider mb-6">
                Premium Certification
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {course.title}
              </h1>
              <p className="text-lg text-white/70 mb-8 max-w-2xl leading-relaxed">
                {course.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <Clock className="text-brand-blue" size={18} />
                  <span>24 Hours of Content</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="text-brand-purple" size={18} />
                  <span>{modules.length} Modules</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="text-green-400" size={18} />
                  <span>Official Certificate</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="glass-card p-6 md:p-8 rounded-2xl sticky top-32">
                <h3 className="text-2xl font-bold mb-2">Lifetime Access</h3>
                <p className="text-white/60 text-sm mb-6">Unlock this course and all other premium content with one payment.</p>
                
                <div className="text-4xl font-bold mb-8">
                  ₹{course.price.toLocaleString('en-IN')}
                </div>

                <CheckoutButton courseId={course.id} price={course.price} />

                <div className="mt-6 space-y-3">
                  {[
                    "Full lifetime access to ALL courses",
                    "Downloadable resources & templates",
                    "Official digital certificate",
                    "Access on mobile and TV"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-white/70">
                      <CheckCircle2 size={16} className="text-brand-blue flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section className="py-24">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          <div className="mb-12 flex items-center justify-between">
            <h2 className="text-3xl font-bold">Course Curriculum</h2>
          </div>

          <div className="space-y-6">
            {modules.map((module: any, mIdx: number) => (
              <div key={module.id} className="glass rounded-2xl overflow-hidden border border-white/5">
                <div className="p-6 bg-white/[0.02]">
                  <h3 className="text-xl font-bold flex items-center gap-4">
                    <span className="text-brand-blue/50 text-sm font-mono">{(mIdx + 1).toString().padStart(2, '0')}</span>
                    {module.title}
                  </h3>
                </div>
                
                <div className="divide-y divide-white/5">
                  {module.lessons?.sort((a: any, b: any) => a.order_index - b.order_index).map((lesson: any, lIdx: number) => (
                    <div key={lesson.id} className="p-4 px-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-4">
                        <PlayCircle size={20} className={lesson.is_free_preview ? "text-brand-blue" : "text-white/20"} />
                        <span className="text-white/80">{lesson.title}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        {lesson.is_free_preview && (
                          <span className="text-xs font-semibold text-brand-blue bg-brand-blue/10 px-2 py-1 rounded-full">
                            Preview
                          </span>
                        )}
                        <span className="text-white/40 text-sm font-mono">
                          {Math.floor(lesson.duration_seconds / 60)}:{Math.floor(lesson.duration_seconds % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
