import { createClient } from "@/utils/supabase/server";
import { requireAdminAuth } from "@/utils/admin-auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { BarChart2, TrendingUp, Users, CreditCard, BookOpen, Activity } from "lucide-react";

export const revalidate = 0;

export default async function AnalyticsPage() {
  await requireAdminAuth();

  const supabase = await createClient();

  const [
    { data: allPayments },
    { data: students },
    { data: courses },
    { count: lessonsCompleted },
    { data: progress },
  ] = await Promise.all([
    supabase.from("payments").select("amount, status, created_at"),
    supabase.from("profiles").select("id, created_at, all_access").eq("role", "student").order("created_at", { ascending: true }),
    supabase.from("courses").select("id, title, slug, published"),
    supabase.from("progress").select("*", { count: "exact", head: true }).eq("completed", true),
    supabase.from("progress").select("lesson_id, completed, lessons(module_id, modules(course_id, courses(title)))"),
  ]);

  const completedPayments = allPayments?.filter(p => p.status === "completed") ?? [];
  const totalRevenue = completedPayments.reduce((s, p) => s + Number(p.amount), 0);
  const conversionRate = students?.length ? ((students.filter(s => s.all_access).length / students.length) * 100).toFixed(1) : "0";

  // Monthly revenue + signups (last 6 months)
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      label: d.toLocaleString("en-IN", { month: "short" }),
      month: d.getMonth(),
      year: d.getFullYear(),
      rev: completedPayments.filter(p => {
        const pd = new Date(p.created_at);
        return pd.getMonth() === d.getMonth() && pd.getFullYear() === d.getFullYear();
      }).reduce((s, p) => s + Number(p.amount), 0),
      signups: students?.filter(s => {
        const sd = new Date(s.created_at);
        return sd.getMonth() === d.getMonth() && sd.getFullYear() === d.getFullYear();
      }).length ?? 0,
    };
  });

  const maxRev = Math.max(...months.map(m => m.rev), 1);
  const maxSignups = Math.max(...months.map(m => m.signups), 1);

  // Course completion rates
  const courseCompletionMap: Record<string, { title: string; count: number }> = {};
  progress?.forEach((p: any) => {
    if (!p.completed) return;
    const title = p.lessons?.modules?.courses?.title;
    const cid = p.lessons?.modules?.course_id;
    if (title && cid) {
      if (!courseCompletionMap[cid]) courseCompletionMap[cid] = { title, count: 0 };
      courseCompletionMap[cid].count++;
    }
  });
  const topCourses = Object.values(courseCompletionMap).sort((a, b) => b.count - a.count).slice(0, 5);

  return (
    <main className="min-h-screen bg-[#060B17]">
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 p-6 md:p-8 overflow-y-auto min-h-screen">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
              <BarChart2 size={22} className="text-amber-400" />
              Analytics
            </h1>
            <p className="text-white/40 text-sm">Business performance and growth insights</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, icon: CreditCard, color: "text-green-400", sub: `${completedPayments.length} transactions` },
              { label: "Total Students", value: students?.length ?? 0, icon: Users, color: "text-brand-blue", sub: `${students?.filter(s => s.all_access).length ?? 0} paid` },
              { label: "Conversion Rate", value: `${conversionRate}%`, icon: TrendingUp, color: "text-amber-400", sub: "visitors to paid" },
              { label: "Lessons Done", value: lessonsCompleted ?? 0, icon: Activity, color: "text-brand-purple", sub: "across all courses" },
            ].map((k, i) => (
              <div key={i} className="glass-card rounded-2xl p-5 border border-white/5">
                <k.icon size={18} className={`${k.color} mb-3`} />
                <div className="text-xl font-bold mb-0.5">{k.value}</div>
                <div className="text-white/50 text-xs">{k.label}</div>
                <div className="text-white/25 text-[10px] mt-1">{k.sub}</div>
              </div>
            ))}
          </div>

          {/* Revenue + Signups Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            {/* Revenue Chart */}
            <div className="glass-card rounded-2xl p-6 border border-white/5">
              <h2 className="font-bold mb-1">Monthly Revenue</h2>
              <p className="text-white/30 text-xs mb-5">Last 6 months</p>
              <div className="flex items-end gap-2 h-40">
                {months.map((m, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div className="relative group w-full flex items-end justify-center" style={{ height: "120px" }}>
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-amber-600/70 to-amber-400/30 hover:from-amber-500 hover:to-amber-300/50 transition-all cursor-default"
                        style={{ height: `${Math.max((m.rev / maxRev) * 100, 3)}%` }}
                      />
                      {m.rev > 0 && (
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1a1f2e] border border-white/10 rounded px-2 py-1 text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          ₹{m.rev.toLocaleString("en-IN")}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-white/30">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Signups Chart */}
            <div className="glass-card rounded-2xl p-6 border border-white/5">
              <h2 className="font-bold mb-1">Student Signups</h2>
              <p className="text-white/30 text-xs mb-5">Last 6 months</p>
              <div className="flex items-end gap-2 h-40">
                {months.map((m, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div className="relative group w-full flex items-end justify-center" style={{ height: "120px" }}>
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-brand-blue/70 to-brand-blue/20 hover:from-brand-blue hover:to-brand-blue/40 transition-all cursor-default"
                        style={{ height: `${Math.max((m.signups / maxSignups) * 100, 3)}%` }}
                      />
                      {m.signups > 0 && (
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1a1f2e] border border-white/10 rounded px-2 py-1 text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          {m.signups} signups
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-white/30">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Course performance + Course list */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Top Courses by Completion */}
            <div className="glass-card rounded-2xl p-6 border border-white/5">
              <h2 className="font-bold mb-5 flex items-center gap-2">
                <BookOpen size={16} className="text-brand-purple" /> Top Courses by Engagement
              </h2>
              <div className="space-y-4">
                {topCourses.length === 0 && <p className="text-white/30 text-xs text-center py-6">No progress data yet</p>}
                {topCourses.map((c, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-white/70 truncate">{c.title}</span>
                      <span className="text-white/40 ml-2 flex-shrink-0">{c.count} lessons</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full">
                      <div
                        className="h-full bg-gradient-to-r from-brand-purple to-brand-blue rounded-full"
                        style={{ width: `${(c.count / (topCourses[0]?.count || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Course publish status */}
            <div className="glass-card rounded-2xl p-6 border border-white/5">
              <h2 className="font-bold mb-5">Course Status</h2>
              <div className="space-y-2">
                {courses?.slice(0, 8).map((c: any) => (
                  <div key={c.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <span className="text-sm text-white/70 truncate">{c.title}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${c.published ? "bg-green-400/10 text-green-400" : "bg-yellow-400/10 text-yellow-400"}`}>
                      {c.published ? "Published" : "Draft"}
                    </span>
                  </div>
                ))}
                {(courses?.length ?? 0) === 0 && <p className="text-white/30 text-xs text-center py-6">No courses yet</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
