import { createClient } from "@/utils/supabase/server";
import { requireAdminAuth } from "@/utils/admin-auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import AdminSidebar from "@/components/AdminSidebar";
import { Users, CheckCircle2, BookOpen, Award } from "lucide-react";

export const revalidate = 0;

export default async function AdminEnrollmentsPage() {
  const supabase = await createClient();
  await requireAdminAuth();

  const { data: students, count: totalStudents } = await supabase
    .from("profiles")
    .select("id, full_name, email, all_access, created_at", { count: "exact" })
    .eq("role", "student");

  const { data: payments } = await supabase
    .from("payments")
    .select("user_id, status, amount, created_at, profiles(full_name, email)")
    .eq("status", "completed")
    .order("created_at", { ascending: false });

  const { data: courses } = await supabase.from("courses").select("id, title, slug").eq("published", true);

  const accessCount = students?.filter(s => s.all_access).length ?? 0;

  return (
    <main className="min-h-screen bg-[#060B17]">
      <Navbar />
      <div className="flex pt-16">
        <AdminSidebar />
        <div className="flex-1 p-6 md:p-10 overflow-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1">Enrollment Management</h1>
            <p className="text-white/50 text-sm">Track student access and course enrollments</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Users, label: "Total Students", value: totalStudents ?? 0, color: "text-brand-blue" },
              { icon: CheckCircle2, label: "Full Access", value: accessCount, color: "text-green-400" },
              { icon: BookOpen, label: "Published Courses", value: courses?.length ?? 0, color: "text-brand-purple" },
              { icon: Award, label: "Paid Enrollments", value: payments?.length ?? 0, color: "text-yellow-400" },
            ].map((s, i) => (
              <div key={i} className="glass-card rounded-2xl p-5 border border-white/5">
                <s.icon size={18} className={`${s.color} mb-3`} />
                <div className="text-white/50 text-xs mb-1">{s.label}</div>
                <div className="text-2xl font-bold">{s.value}</div>
              </div>
            ))}
          </div>

          {/* All Access Students */}
          <div className="glass rounded-2xl border border-white/5 overflow-hidden mb-6">
            <div className="p-5 border-b border-white/5">
              <h2 className="font-bold">Students with Full Access</h2>
              <p className="text-white/40 text-xs mt-1">These students have purchased lifetime access</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-white/40">
                    <th className="text-left p-4 font-medium">Student</th>
                    <th className="text-left p-4 font-medium">Joined</th>
                    <th className="text-left p-4 font-medium">Access</th>
                    <th className="text-left p-4 font-medium">Courses Available</th>
                  </tr>
                </thead>
                <tbody>
                  {students?.filter(s => s.all_access).length === 0 ? (
                    <tr><td colSpan={4} className="p-10 text-center text-white/30">No students with full access yet</td></tr>
                  ) : students?.filter(s => s.all_access).map(s => (
                    <tr key={s.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-center text-xs font-bold">
                            {(s.full_name || s.email || "?").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">{s.full_name || "—"}</div>
                            <div className="text-white/40 text-xs">{s.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-white/50 text-xs">
                        {new Date(s.created_at).toLocaleDateString("en-IN")}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded-full text-xs bg-green-400/10 text-green-400 font-semibold">
                          Lifetime Access
                        </span>
                      </td>
                      <td className="p-4 text-white/60 text-sm">{courses?.length ?? 0} courses</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Paid Enrollments */}
          <div className="glass rounded-2xl border border-white/5 overflow-hidden">
            <div className="p-5 border-b border-white/5">
              <h2 className="font-bold">Recent Paid Enrollments</h2>
              <p className="text-white/40 text-xs mt-1">Latest successful payments</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-white/40">
                    <th className="text-left p-4 font-medium">Student</th>
                    <th className="text-left p-4 font-medium">Amount Paid</th>
                    <th className="text-left p-4 font-medium">Date</th>
                    <th className="text-left p-4 font-medium">Access Granted</th>
                  </tr>
                </thead>
                <tbody>
                  {!payments?.length ? (
                    <tr><td colSpan={4} className="p-10 text-center text-white/30">No payments yet</td></tr>
                  ) : payments.slice(0, 20).map(p => (
                    <tr key={p.user_id + p.created_at} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="p-4">
                        <div className="font-medium">{(p.profiles as any)?.full_name || "—"}</div>
                        <div className="text-white/40 text-xs">{(p.profiles as any)?.email}</div>
                      </td>
                      <td className="p-4 font-bold text-green-400">₹{Number(p.amount).toLocaleString("en-IN")}</td>
                      <td className="p-4 text-white/50 text-xs">{new Date(p.created_at).toLocaleDateString("en-IN")}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded-full text-xs bg-green-400/10 text-green-400 font-semibold">
                          All Courses
                        </span>
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

