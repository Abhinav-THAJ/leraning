"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, BookOpen, Users, CreditCard, LogOut,
  PlusCircle, UserCheck, Bell, BarChart2, Settings,
  FolderOpen, Globe, ChevronLeft, ChevronRight, ShieldCheck,
} from "lucide-react";
import clsx from "clsx";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const navGroups = [
  {
    label: "Overview",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/superadmin", exact: true },
      { icon: BarChart2, label: "Analytics", href: "/superadmin/analytics" },
    ],
  },
  {
    label: "Content",
    items: [
      { icon: BookOpen, label: "Courses", href: "/superadmin/courses" },
      { icon: FolderOpen, label: "Resources", href: "/superadmin/resources" },
      { icon: Globe, label: "Site Content", href: "/superadmin/content" },
    ],
  },
  {
    label: "Users",
    items: [
      { icon: Users, label: "Students", href: "/superadmin/students" },
      { icon: UserCheck, label: "Enrollments", href: "/superadmin/enrollments" },
    ],
  },
  {
    label: "Revenue",
    items: [
      { icon: CreditCard, label: "Payments", href: "/superadmin/payments" },
    ],
  },
  {
    label: "System",
    items: [
      { icon: Bell, label: "Notifications", href: "/superadmin/notifications" },
      { icon: Settings, label: "Settings", href: "/superadmin/settings" },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [collapsed, setCollapsed] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/superadmin/login");
    router.refresh();
  };

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={clsx(
        "hidden md:flex flex-col min-h-[calc(100vh-4rem)] bg-[#080D1A] border-r border-white/5 flex-shrink-0 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Brand + collapse */}
      <div className={clsx("flex items-center justify-between p-4 border-b border-white/5", collapsed && "justify-center")}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Image src="/Logo.png" alt="ITTA Logo" width={32} height={32} className="object-contain h-8 w-auto drop-shadow-sm" />
            <div>
              <div className="text-xs font-bold text-white">Super Admin</div>
              <div className="text-[10px] text-white/30">ITTA Academy</div>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Add course CTA */}
      {!collapsed && (
        <div className="p-3">
          <Link
            href="/superadmin/courses/new"
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold hover:bg-amber-500/20 transition-colors"
          >
            <PlusCircle size={14} />
            Add New Course
          </Link>
        </div>
      )}

      {/* Nav Groups */}
      <nav className="flex-1 overflow-y-auto py-2 space-y-4 px-2">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <div className="text-[10px] font-semibold text-white/20 uppercase tracking-widest px-3 mb-1">
                {group.label}
              </div>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all",
                    collapsed && "justify-center",
                    isActive(item.href, item.exact)
                      ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                      : "text-white/50 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon size={16} className="flex-shrink-0" />
                  {!collapsed && item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-white/5">
        {!collapsed && (
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-white/30 hover:bg-white/5 hover:text-white transition-colors mb-1"
          >
            ← Back to Site
          </Link>
        )}
        <button
          onClick={handleSignOut}
          title={collapsed ? "Sign Out" : undefined}
          className={clsx(
            "flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-red-400/60 hover:bg-red-400/10 hover:text-red-400 transition-colors w-full",
            collapsed && "justify-center"
          )}
        >
          <LogOut size={15} className="flex-shrink-0" />
          {!collapsed && "Sign Out"}
        </button>
      </div>
    </aside>
  );
}
