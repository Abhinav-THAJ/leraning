"use client";

import { useState } from "react";
import { Search, Download, CheckCircle2, XCircle, Clock, Filter } from "lucide-react";

type Payment = {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  profiles: { full_name: string; email: string } | null;
};

export default function PaymentsClient({ payments }: { payments: Payment[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "failed" | "pending">("all");

  const filtered = payments.filter(p => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      p.profiles?.email?.toLowerCase().includes(q) ||
      p.profiles?.full_name?.toLowerCase().includes(q) ||
      p.razorpay_order_id?.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const downloadCSV = () => {
    const rows = [
      ["Name", "Email", "Amount", "Status", "Order ID", "Payment ID", "Date"],
      ...filtered.map(p => [
        p.profiles?.full_name || "",
        p.profiles?.email || "",
        p.amount,
        p.status,
        p.razorpay_order_id || "",
        p.razorpay_payment_id || "",
        new Date(p.created_at).toLocaleDateString("en-IN"),
      ]),
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "payments.csv"; a.click();
  };

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email or order ID..."
            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={13} className="text-white/30" />
          {(["all", "completed", "failed", "pending"] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors capitalize ${statusFilter === s ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "glass border border-white/10 text-white/50 hover:text-white"}`}>
              {s}
            </button>
          ))}
        </div>
        <button onClick={downloadCSV}
          className="flex items-center gap-2 px-4 py-2 glass border border-white/10 rounded-xl text-xs text-white/60 hover:text-white transition-colors">
          <Download size={13} /> Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-white/30">
                {["Student", "Amount", "Status", "Order ID", "Payment ID", "Date"].map(h => (
                  <th key={h} className="text-left p-4 font-medium text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="p-12 text-center text-white/30 text-sm">No payments found</td></tr>
              )}
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="font-medium">{p.profiles?.full_name || "—"}</div>
                    <div className="text-white/30 text-xs">{p.profiles?.email}</div>
                  </td>
                  <td className="p-4 font-bold text-green-400">₹{Number(p.amount).toLocaleString("en-IN")}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                      p.status === "completed" ? "bg-green-400/10 text-green-400" :
                      p.status === "failed" ? "bg-red-400/10 text-red-400" :
                      "bg-yellow-400/10 text-yellow-400"
                    }`}>
                      {p.status === "completed" ? <CheckCircle2 size={10} /> : p.status === "failed" ? <XCircle size={10} /> : <Clock size={10} />}
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-xs text-white/40">{p.razorpay_order_id?.slice(0, 18) || "—"}</td>
                  <td className="p-4 font-mono text-xs text-white/40">{p.razorpay_payment_id?.slice(0, 18) || "—"}</td>
                  <td className="p-4 text-white/40 text-xs">{new Date(p.created_at).toLocaleDateString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-3 border-t border-white/5 text-xs text-white/30 text-right">
          Showing {filtered.length} of {payments.length} transactions
        </div>
      </div>
    </div>
  );
}
