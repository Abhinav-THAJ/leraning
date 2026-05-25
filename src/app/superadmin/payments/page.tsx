import { createClient } from "@/utils/supabase/server";
import { requireAdminAuth } from "@/utils/admin-auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import AdminSidebar from "@/components/AdminSidebar";
import PaymentsClient from "./PaymentsClient";

export const revalidate = 0;

export default async function AdminPaymentsPage() {
  const supabase = await createClient();
  await requireAdminAuth();

  const { data: payments } = await supabase
    .from("payments")
    .select("*, profiles(full_name, email)")
    .order("created_at", { ascending: false });

  const { data: stats } = await supabase
    .from("payments")
    .select("status, amount");

  const totalRevenue = stats?.filter(p => p.status === "completed").reduce((sum, p) => sum + Number(p.amount), 0) ?? 0;
  const completed = stats?.filter(p => p.status === "completed").length ?? 0;
  const failed = stats?.filter(p => p.status === "failed").length ?? 0;
  const pending = stats?.filter(p => p.status === "pending").length ?? 0;

  return (
    <main className="min-h-screen bg-[#060B17]">
      <Navbar />
      <div className="flex pt-16">
        <AdminSidebar />
        <div className="flex-1 p-6 md:p-10 overflow-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1">Payment Management</h1>
            <p className="text-white/50 text-sm">{payments?.length ?? 0} total transactions</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, color: "text-green-400" },
              { label: "Completed", value: completed, color: "text-green-400" },
              { label: "Pending", value: pending, color: "text-yellow-400" },
              { label: "Failed", value: failed, color: "text-red-400" },
            ].map((s, i) => (
              <div key={i} className="glass-card rounded-2xl p-5 border border-white/5">
                <div className="text-white/50 text-xs mb-2">{s.label}</div>
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              </div>
            ))}
          </div>

          <PaymentsClient payments={payments || []} />
        </div>
      </div>
    </main>
  );
}

