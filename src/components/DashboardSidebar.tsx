"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { BookOpen, Trophy, Clock, Settings, LogOut, LayoutDashboard, CreditCard } from "lucide-react";
import clsx from "clsx";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: BookOpen, label: "My Courses", href: "/dashboard/courses" },
  { icon: Trophy, label: "Certificates", href: "/dashboard/certificates" },
  { icon: Clock, label: "Watch History", href: "/dashboard/history" },
  { icon: CreditCard, label: "Payments", href: "/dashboard/payments" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function DashboardSidebar({ userEmail, hasAccess }: { userEmail: string; hasAccess: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <aside className="hidden md:flex flex-col w-64 min-h-[calc(100vh-4rem)] bg-white/[0.02] border-r border-white/5 p-4">
      {/* User Badge */}
      <div className="glass rounded-xl p-4 mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-center text-white font-bold text-lg mb-2">
          {userEmail.charAt(0).toUpperCase()}
        </div>
        <p className="text-sm font-medium truncate text-white/90">{userEmail}</p>
        {hasAccess ? (
          <span className="text-xs text-green-400 font-semibold">✦ All-Access</span>
        ) : (
          <span className="text-xs text-white/40">Free Member</span>
        )}
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
              pathname === item.href
                ? "bg-white/10 text-white"
                : "text-white/50 hover:bg-white/5 hover:text-white"
            )}
          >
            <item.icon size={17} />
            {item.label}
          </Link>
        ))}
      </nav>

      <button
        onClick={handleSignOut}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400/70 hover:bg-red-400/10 hover:text-red-400 transition-colors mt-4 w-full"
      >
        <LogOut size={17} />
        Sign Out
      </button>
    </aside>
  );
}
