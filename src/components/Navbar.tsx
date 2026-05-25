"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight, LayoutDashboard, LogOut, User } from "lucide-react";
import clsx from "clsx";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        supabase.from("profiles").select("full_name, role").eq("id", user.id).single()
          .then(({ data }) => setProfile(data));
      }
      setLoading(false);
    });

    // Listen for auth changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        supabase.from("profiles").select("full_name, role").eq("id", u.id).single()
          .then(({ data }) => setProfile(data));
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setShowDropdown(false);
    setIsMobileMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { name: "Courses", href: "/courses" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "Account";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <>
      <header
        className={clsx(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled ? "py-4 glass border-b border-white/5" : "py-6 bg-transparent"
        )}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative z-50 flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-center text-white font-bold text-lg shadow-lg">
              I
            </div>
            <span className="text-xl font-bold tracking-tight text-white">ITTA Academy</span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Area */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-center text-white font-bold text-sm">
                    {initials}
                  </div>
                  <span className="text-sm font-medium text-white/80 max-w-[120px] truncate">{displayName}</span>
                </button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 glass-card rounded-xl border border-white/10 overflow-hidden shadow-xl"
                    >
                      <div className="px-4 py-3 border-b border-white/10">
                        <div className="text-xs text-white/40">Signed in as</div>
                        <div className="text-sm font-medium truncate">{user.email}</div>
                      </div>
                      <div className="p-1.5">
                        <Link href="/dashboard" onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 text-sm text-white/80 hover:text-white transition-colors">
                          <LayoutDashboard size={15} /> Dashboard
                        </Link>
                        {profile?.role === "admin" && (
                          <Link href="/superadmin" onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 text-sm text-brand-purple hover:text-white transition-colors">
                            <User size={15} /> Admin Panel
                          </Link>
                        )}
                        <button onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/10 text-sm text-red-400/70 hover:text-red-400 transition-colors">
                          <LogOut size={15} /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors px-4 py-2">
                  Sign In
                </Link>
                <Link href="/signup" className="relative overflow-hidden group px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300">
                  <span className="relative z-10 text-sm font-medium text-white group-hover:text-[#060B17] transition-colors duration-300">
                    Get Started
                  </span>
                  <div className="absolute inset-0 h-full w-0 bg-white group-hover:w-full transition-all duration-300 ease-out" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden relative z-50 p-2 text-white/70 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
      )}

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-[#060B17]/97 backdrop-blur-xl pt-24 pb-8 px-6 flex flex-col md:hidden"
          >
            <nav className="flex flex-col gap-6 flex-1">
              {navLinks.map((link, i) => (
                <motion.div key={link.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <Link href={link.href} className="text-2xl font-medium text-white/80 hover:text-white flex items-center justify-between"
                    onClick={() => setIsMobileMenuOpen(false)}>
                    {link.name}
                    <ChevronRight className="text-white/30" />
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="flex flex-col gap-3 mt-auto">
              {user ? (
                <>
                  <Link href="/dashboard" className="w-full py-4 text-center text-white bg-gradient-to-r from-brand-blue to-brand-purple rounded-xl font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}>
                    Go to Dashboard
                  </Link>
                  <button onClick={handleSignOut} className="w-full py-4 text-center text-red-400 border border-red-400/20 rounded-xl hover:bg-red-400/10 transition-colors">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="w-full py-4 text-center text-white border border-white/10 rounded-xl hover:bg-white/5 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}>
                    Sign In
                  </Link>
                  <Link href="/signup" className="w-full py-4 text-center text-white bg-gradient-to-r from-brand-blue to-brand-purple rounded-xl hover:opacity-90 transition-opacity font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}>
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
