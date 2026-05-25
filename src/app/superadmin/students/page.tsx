"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import AdminSidebar from "@/components/AdminSidebar";
import { createClient } from "@/utils/supabase/client";
import {
  Search, Filter, ShieldCheck, ShieldOff, CheckCircle2,
  XCircle, Loader2, Users, UserCheck, UserX, ChevronLeft, ChevronRight,
} from "lucide-react";

const PAGE_SIZE = 15;

export default function AdminStudentsPage() {
  const supabase = createClient();
  const router = useRouter();
  const [students, setStudents] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "access" | "noaccess">("all");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("profiles")
      .select("*", { count: "exact" })
      .eq("role", "student")
      .order("created_at", { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    if (search.trim()) query = query.ilike("email", `%${search}%`);
    if (filter === "access") query = query.eq("all_access", true);
    if (filter === "noaccess") query = query.eq("all_access", false);

    const { data, count } = await query;
    setStudents(data || []);
    setTotal(count || 0);
    setLoading(false);
  }, [page, search, filter]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const toggleAccess = async (student: any) => {
    setActionLoading(student.id);
    const { error } = await supabase
      .from("profiles")
      .update({ all_access: !student.all_access })
      .eq("id", student.id);
    if (!error) {
      showToast(`Access ${!student.all_access ? "granted" : "revoked"} for ${student.email}`);
      fetchStudents();
    }
    setActionLoading(null);
  };

  const toggleBlock = async (student: any) => {
    setActionLoading(`block-${student.id}`);
    const newRole = student.role === "blocked" ? "student" : "blocked";
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", student.id);
    if (!error) {
      showToast(`User ${newRole === "blocked" ? "blocked" : "unblocked"}`);
      fetchStudents();
    }
    setActionLoading(null);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <main className="min-h-screen bg-[#060B17]">
      <Navbar />
      {toast && (
        <div className="fixed top-20 right-6 z-50 px-5 py-3 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-medium">
          {toast}
        </div>
      )}
      <div className="flex pt-16">
        <AdminSidebar />
        <div className="flex-1 p-6 md:p-10 overflow-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">Student Management</h1>
              <p className="text-white/50 text-sm">{total} total students</p>
            </div>
            {/* Stats */}
            <div className="flex gap-3">
              <div className="glass px-4 py-2 rounded-xl border border-white/5 text-sm flex items-center gap-2">
                <Users size={14} className="text-brand-blue" /> {total} Total
              </div>
              <div className="glass px-4 py-2 rounded-xl border border-white/5 text-sm flex items-center gap-2">
                <UserCheck size={14} className="text-green-400" /> With Access
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(0); }}
                placeholder="Search by email..."
                className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-blue"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-white/40" />
              {(["all", "access", "noaccess"] as const).map(f => (
                <button key={f} onClick={() => { setFilter(f); setPage(0); }}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${filter === f ? "bg-brand-blue text-white" : "glass border border-white/10 text-white/60 hover:text-white"}`}>
                  {f === "all" ? "All" : f === "access" ? "Has Access" : "No Access"}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="glass rounded-2xl border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-white/40">
                    <th className="text-left p-4 font-medium">Student</th>
                    <th className="text-left p-4 font-medium">Joined</th>
                    <th className="text-left p-4 font-medium">Access</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={5} className="p-12 text-center"><Loader2 className="animate-spin mx-auto text-brand-blue" size={24} /></td></tr>
                  ) : students.length === 0 ? (
                    <tr><td colSpan={5} className="p-12 text-center text-white/30">No students found</td></tr>
                  ) : students.map(s => (
                    <tr key={s.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {(s.full_name || s.email || "?").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">{s.full_name || "—"}</div>
                            <div className="text-white/40 text-xs">{s.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-white/50 text-xs">
                        {s.created_at ? new Date(s.created_at).toLocaleDateString("en-IN") : "—"}
                      </td>
                      <td className="p-4">
                        {s.all_access ? (
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-green-400">
                            <CheckCircle2 size={13} /> Full Access
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-xs text-white/40">
                            <XCircle size={13} /> No Access
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${s.role === "blocked" ? "bg-red-400/10 text-red-400" : "bg-green-400/10 text-green-400"}`}>
                          {s.role === "blocked" ? "Blocked" : "Active"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {/* Toggle access */}
                          <button
                            onClick={() => toggleAccess(s)}
                            disabled={!!actionLoading}
                            title={s.all_access ? "Revoke Access" : "Grant Access"}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${s.all_access ? "bg-orange-400/10 text-orange-400 hover:bg-orange-400/20" : "bg-green-400/10 text-green-400 hover:bg-green-400/20"}`}
                          >
                            {actionLoading === s.id ? <Loader2 className="animate-spin" size={12} /> :
                              s.all_access ? <><ShieldOff size={12} /> Revoke</> : <><ShieldCheck size={12} /> Grant</>}
                          </button>
                          {/* Block/unblock */}
                          <button
                            onClick={() => toggleBlock(s)}
                            disabled={!!actionLoading}
                            title={s.role === "blocked" ? "Unblock" : "Block"}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${s.role === "blocked" ? "bg-white/10 text-white/60 hover:bg-white/20" : "bg-red-400/10 text-red-400 hover:bg-red-400/20"}`}
                          >
                            {actionLoading === `block-${s.id}` ? <Loader2 className="animate-spin" size={12} /> :
                              s.role === "blocked" ? <><UserCheck size={12} /> Unblock</> : <><UserX size={12} /> Block</>}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-white/5">
                <span className="text-xs text-white/40">Page {page + 1} of {totalPages}</span>
                <div className="flex gap-2">
                  <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                    className="p-2 rounded-lg glass border border-white/10 disabled:opacity-30 hover:bg-white/10 transition-colors">
                    <ChevronLeft size={14} />
                  </button>
                  <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                    className="p-2 rounded-lg glass border border-white/10 disabled:opacity-30 hover:bg-white/10 transition-colors">
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
