import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { requireAdminAuth } from "@/utils/admin-auth";
import {
  Users, BookOpen, CreditCard, Activity, TrendingUp,
  UserCheck, ArrowUpRight, Clock, ShieldCheck,
} from "lucide-react";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  await requireAdminAuth();

  const supabase = await createClient();
  const adminName = process.env.SUPERADMIN_EMAIL || "Admin";

  // --- Fetch all analytics in parallel ---
  const [
    { count: totalStudents },
    { count: totalCourses },
    { count: totalPublished },
    { data: allPayments },
    { count: totalLessonsCompleted },
    { data: recentStudents },
    { data: recentPayments },
    { data: courseProgress },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "student"),
    supabase.from("courses").select("*", { count: "exact", head: true }),
    supabase.from("courses").select("*", { count: "exact", head: true }).eq("published", true),
    supabase.from("payments").select("amount, status, created_at"),
    supabase.from("progress").select("*", { count: "exact", head: true }).eq("completed", true),
    supabase.from("profiles").select("id, full_name, email, created_at, all_access").eq("role", "student").order("created_at", { ascending: false }).limit(5),
    supabase.from("payments").select("*, profiles(full_name, email)").eq("status", "completed").order("created_at", { ascending: false }).limit(8),
    supabase.from("courses").select("id, title, slug").eq("published", true).limit(6),
  ]);

  const completedPayments = allPayments?.filter(p => p.status === "completed") ?? [];
  const totalRevenue = completedPayments.reduce((s, p) => s + Number(p.amount), 0);
  const studentsWithAccess = (await supabase.from("profiles").select("*", { count: "exact", head: true }).eq("all_access", true)).count ?? 0;

  // Monthly revenue (last 6 months)
  const now = new Date();
  const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const label = d.toLocaleString("en-IN", { month: "short" });
    const rev = completedPayments
      .filter(p => {
        const pd = new Date(p.created_at);
        return pd.getMonth() === d.getMonth() && pd.getFullYear() === d.getFullYear();
      })
      .reduce((s, p) => s + Number(p.amount), 0);
    return { label, rev };
  });
  const maxRev = Math.max(...monthlyRevenue.map(m => m.rev), 1);

  const stats = [
    { label: "Total Students", value: totalStudents ?? 0, icon: Users, color: "text-brand-blue", bg: "from-brand-blue/15 to-brand-blue/5", border: "border-brand-blue/20" },
    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, icon: CreditCard, color: "text-green-400", bg: "from-green-500/15 to-green-500/5", border: "border-green-500/20" },
    { label: "Published Courses", value: totalPublished ?? 0, icon: BookOpen, color: "text-brand-purple", bg: "from-brand-purple/15 to-brand-purple/5", border: "border-brand-purple/20" },
    { label: "Lessons Completed", value: totalLessonsCompleted ?? 0, icon: Activity, color: "text-amber-400", bg: "from-amber-500/15 to-amber-500/5", border: "border-amber-500/20" },
    { label: "Students with Access", value: studentsWithAccess, icon: UserCheck, color: "text-cyan-400", bg: "from-cyan-500/15 to-cyan-500/5", border: "border-cyan-500/20" },
    { label: "Total Transactions", value: allPayments?.length ?? 0, icon: TrendingUp, color: "text-pink-400", bg: "from-pink-500/15 to-pink-500/5", border: "border-pink-500/20" },
  ];

  return (
    <main className="min-h-screen bg-[#060B17]">
      <div className="flex">
        <AdminSidebar />

        <div className="flex-1 p-6 md:p-8 overflow-y-auto min-h-screen">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck size={16} className="text-amber-400" />
                <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">Super Admin</span>
              </div>
              <h1 className="text-2xl font-bold">Dashboard Overview</h1>
              <p className="text-white/40 text-sm mt-0.5">Welcome back, {adminName}</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/30 glass border border-white/5 px-3 py-2 rounded-xl">
              <Clock size={13} />
              {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
            {stats.map((stat, i) => (
              <div key={i} className={`glass-card rounded-2xl p-5 bg-gradient-to-br ${stat.bg} border ${stat.border}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2.5 rounded-xl bg-white/5`}>
                    <stat.icon size={18} className={stat.color} />
                  </div>
                  <ArrowUpRight size={14} className="text-white/20" />
                </div>
                <div className="text-2xl font-bold mb-0.5">{stat.value}</div>
                <div className="text-white/40 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Revenue Chart + Recent Students */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            {/* Revenue Bar Chart */}
            <div className="xl:col-span-2 glass-card rounded-2xl p-6 border border-white/5">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-bold text-white">Revenue Overview</h2>
                  <p className="text-white/40 text-xs mt-0.5">Last 6 months</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-400">₹{totalRevenue.toLocaleString("en-IN")}</div>
                  <div className="text-xs text-white/30">Total</div>
                </div>
              </div>
              <div className="flex items-end gap-3 h-36">
                {monthlyRevenue.map((m, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-amber-500/60 to-amber-400/20 hover:from-amber-500/80 transition-all relative group"
                      style={{ height: `${Math.max((m.rev / maxRev) * 100, 4)}%` }}
                    >
                      {m.rev > 0 && (
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#1a1f2e] border border-white/10 rounded px-1.5 py-0.5 text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                          ₹{m.rev.toLocaleString("en-IN")}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-white/30">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Signups */}
            <div className="glass-card rounded-2xl p-6 border border-white/5">
              <h2 className="font-bold text-white mb-4">Recent Signups</h2>
              <div className="space-y-3">
                {recentStudents?.length === 0 && (
                  <p className="text-white/30 text-xs text-center py-6">No students yet</p>
                )}
                {recentStudents?.map((s: any) => (
                  <div key={s.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {(s.full_name || s.email || "?").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">{s.full_name || "—"}</div>
                      <div className="text-[10px] text-white/30 truncate">{s.email}</div>
                    </div>
                    {s.all_access && (
                      <span className="text-[10px] bg-green-400/10 text-green-400 px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0">Paid</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Payments */}
          <div className="glass rounded-2xl border border-white/5 overflow-hidden">
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="font-bold">Recent Payments</h2>
                <p className="text-white/40 text-xs mt-0.5">Latest successful transactions</p>
              </div>
              <a href="/superadmin/payments" className="text-xs text-amber-400 hover:underline">View all →</a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-white/30">
                    <th className="text-left p-4 font-medium text-xs">Student</th>
                    <th className="text-left p-4 font-medium text-xs">Amount</th>
                    <th className="text-left p-4 font-medium text-xs">Order ID</th>
                    <th className="text-left p-4 font-medium text-xs">Date</th>
                    <th className="text-left p-4 font-medium text-xs">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayments?.length === 0 && (
                    <tr><td colSpan={5} className="p-10 text-center text-white/30 text-sm">No payments yet</td></tr>
                  )}
                  {recentPayments?.map((p: any) => (
                    <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-sm">{p.profiles?.full_name || "—"}</div>
                        <div className="text-white/30 text-xs">{p.profiles?.email}</div>
                      </td>
                      <td className="p-4 font-bold text-green-400">₹{Number(p.amount).toLocaleString("en-IN")}</td>
                      <td className="p-4 font-mono text-xs text-white/40">{p.razorpay_order_id?.slice(0, 20)}...</td>
                      <td className="p-4 text-white/40 text-xs">{new Date(p.created_at).toLocaleDateString("en-IN")}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-400/10 text-green-400">{p.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
