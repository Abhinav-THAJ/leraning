import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { ArrowRight, BookOpen, Clock } from "lucide-react";

export const revalidate = 0;

// Safe image src — Next.js Image throws if src is null/empty/invalid
function getImgSrc(url: string | null | undefined): string {
  if (!url) return "/international_trade_classroom.png";
  const trimmed = url.trim();
  if (!trimmed) return "/international_trade_classroom.png";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/")) {
    return trimmed;
  }
  return "/international_trade_classroom.png";
}

export default async function CoursesPage() {
  const supabase = await createClient();
  
  let courses: any[] = [];
  let dbError = false;

  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    if (data) courses = data;
  } catch (e) {
    dbError = true;
    console.error("Failed to fetch courses from DB:", e);
  }

  return (
    <main className="min-h-screen bg-[#060B17] pt-24 pb-16">
      <Navbar />
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 pt-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Premium <span className="text-gradient">Certifications</span>
          </h1>
          <p className="text-lg text-white/70">
            Unlock your potential with our industry-leading programs. 
            <strong> Purchase one course, unlock full access to our entire catalog forever.</strong>
          </p>
        </div>

        {dbError ? (
          <div className="text-center py-20 text-white/40">
            <p className="text-lg mb-2">Could not connect to the database.</p>
            <a href="/setup" className="text-brand-blue underline text-sm">Run database setup →</a>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📚</div>
            <p className="text-white/50 text-lg mb-2">No courses published yet.</p>
            <p className="text-white/30 text-sm">Courses marked as Published in the admin panel will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course: any) => (
              <div key={course.id} className="glass-card rounded-2xl overflow-hidden group hover:-translate-y-2 transition-transform duration-300 flex flex-col">
                <div className="relative h-64 w-full">
                  <Image
                    src={getImgSrc(course.thumbnail_url)}
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060B17] to-transparent opacity-80" />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <span className="glass px-3 py-1 rounded-full text-xs font-semibold text-brand-blue">
                      Certification
                    </span>
                    <span className="text-xl font-bold text-white">
                      ₹{course.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-brand-blue transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-white/60 text-sm mb-6 line-clamp-3">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-white/50 mb-6">
                    <div className="flex items-center gap-1">
                      <BookOpen size={14} />
                      <span>12 Modules</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>24 Hours</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-white/10">
                    <Link
                      href={`/courses/${course.slug}`}
                      className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors font-medium"
                    >
                      View Details
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
