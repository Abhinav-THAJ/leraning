import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { PlayCircle, CheckCircle2, BookOpen, Trophy, Clock, TrendingUp } from "lucide-react";

export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Admins should be in the admin panel, not the student dashboard
  if (profile?.role === 'admin') redirect("/superadmin");

  let courses: any[] = [];
  let paymentHistory: any[] = [];

  if (profile?.all_access) {
    const { data } = await supabase.from('courses').select('*').eq('published', true);
    if (data) courses = data;
  }

  const { data: payments } = await supabase
    .from('payments')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .order('created_at', { ascending: false });
  if (payments) paymentHistory = payments;

  const { data: progressData } = await supabase
    .from('progress')
    .select('*, lessons(title, modules(courses(title)))')
    .eq('user_id', user.id)
    .eq('completed', true);

  const completedLessons = progressData?.length ?? 0;

  const displayName = profile?.full_name || user.email?.split('@')[0] || 'Student';
  const hasAccess = profile?.all_access ?? false;

  return (
    <main className="min-h-screen bg-[#060B17]">
      <Navbar />

      <div className="flex pt-16">
        <DashboardSidebar userEmail={user.email!} hasAccess={hasAccess} />

        <div className="flex-1 p-6 md:p-10 overflow-y-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-1">Welcome back, {displayName} 👋</h1>
            <p className="text-white/60">
              {hasAccess
                ? "You have lifetime access to all courses."
                : "Purchase any course to unlock everything."}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { label: "Courses Unlocked", value: hasAccess ? courses.length : 0, icon: BookOpen, color: "text-brand-blue" },
              { label: "Lessons Completed", value: completedLessons, icon: CheckCircle2, color: "text-green-400" },
              { label: "Certificates", value: completedLessons > 10 ? 1 : 0, icon: Trophy, color: "text-yellow-400" },
              { label: "Hours Learned", value: Math.floor(completedLessons * 0.5), icon: Clock, color: "text-brand-purple" },
            ].map((stat, i) => (
              <div key={i} className="glass-card rounded-2xl p-5">
                <div className={`${stat.color} mb-3`}><stat.icon size={22} /></div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-white/50 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Access Banner */}
          {!hasAccess && (
            <div className="glass-card rounded-2xl p-8 mb-10 border border-brand-blue/30 bg-brand-blue/5 text-center">
              <TrendingUp size={40} className="text-brand-blue mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Unlock Full Platform Access</h2>
              <p className="text-white/60 mb-6 max-w-md mx-auto">
                One payment of ₹25,000 gives you lifetime access to all courses, certificates, and future content.
              </p>
              <Link href="/courses" className="inline-block px-8 py-3 bg-gradient-to-r from-brand-blue to-brand-purple rounded-xl font-semibold hover:opacity-90 transition-opacity">
                Browse & Purchase Courses
              </Link>
            </div>
          )}

          {/* My Courses */}
          <div>
            <h2 className="text-xl font-bold mb-6">My Courses</h2>
            {courses.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center border border-white/5">
                <p className="text-white/50">No courses unlocked yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {courses.map((course: any) => {
                  const courseCompleted = progressData?.filter(
                    (p: any) => p.lessons?.modules?.courses?.id === course.id && p.completed
                  ).length ?? 0;

                  return (
                    <Link key={course.id} href={`/learn/${course.slug}`} className="glass-card rounded-2xl overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                      <div className="relative h-44">
                        <Image
                          src={course.thumbnail_url || "/course_hero_bg.png"}
                          alt={course.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-[#060B17]/50 group-hover:bg-[#060B17]/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <PlayCircle size={24} className="ml-1" />
                          </div>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-semibold mb-4 line-clamp-2 text-sm">{course.title}</h3>
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs text-white/50">
                            <span>Progress</span><span>{courseCompleted} lessons done</span>
                          </div>
                          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-brand-blue to-brand-purple rounded-full" style={{ width: `${Math.min(courseCompleted * 10, 100)}%` }} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Payment History */}
          {paymentHistory.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold mb-6">Payment History</h2>
              <div className="glass rounded-2xl border border-white/5 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5 text-white/50">
                      <th className="text-left p-4">Order ID</th>
                      <th className="text-left p-4">Amount</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentHistory.map((p: any) => (
                      <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="p-4 font-mono text-xs text-white/60">{p.razorpay_order_id}</td>
                        <td className="p-4 font-semibold">₹{Number(p.amount).toLocaleString('en-IN')}</td>
                        <td className="p-4">
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-400/10 text-green-400">
                            {p.status}
                          </span>
                        </td>
                        <td className="p-4 text-white/50">{new Date(p.created_at).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
