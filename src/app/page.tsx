import { createClient } from "@/utils/supabase/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  TrendingUp, Users, BookOpen, Award, Play, ArrowRight,
  ShieldCheck, Globe, Zap, Target, Star, ChevronRight
} from "lucide-react";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();
  const { data: courses } = await supabase
    .from("courses")
    .select("id, title, description, price, slug, thumbnail_url, published")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(3);

  const stats = [
    { value: "10,000+", label: "Students Trained" },
    { value: "500+", label: "Live Sessions" },
    { value: "15,000+", label: "Community Members" },
    { value: "2,000+", label: "Success Stories" },
  ];

  const leaders = [
    { name: "Akshay Dr", role: "Managing Director", desc: "Expert in strategy and institutional trading mentorship.", initials: "AD" },
    { name: "Akash Dr", role: "Director", desc: "Specialist in technical analysis and market algorithms.", initials: "AK" },
    { name: "Anoop Gangan", role: "Director", desc: "Connecting aspiring traders with high-quality education.", initials: "AG" },
    { name: "Devagopal Nair", role: "Director", desc: "Driving ITTA's growth and operational excellence.", initials: "DN" },
  ];

  const edge = [
    { icon: Target, title: "Institutional Methods", desc: "Learn the same strategies used by professional fund managers and institutional desks." },
    { icon: Users, title: "Live Mentorship", desc: "Real-time sessions with expert traders covering live market analysis and trade execution." },
    { icon: ShieldCheck, title: "Risk-First Approach", desc: "Every course is built around capital protection and disciplined risk management." },
    { icon: Award, title: "Certified Curriculum", desc: "Industry-recognized certificates upon course completion to advance your career." },
    { icon: Globe, title: "Global Markets", desc: "Forex, equities, crypto — understand every major asset class with depth." },
    { icon: Zap, title: "Practical Focus", desc: "No theory fluff. Every lesson ties directly to real trade setups and market context." },
  ];

  const fallbackCourses = [
    { id: "1", title: "Forex Trading Masterclass", description: "Learn currency market fundamentals, price action, and live trading strategies.", price: 25000, slug: "forex-trading-masterclass" },
    { id: "2", title: "Stock Market Professional", description: "Understand investing, intraday trading, and portfolio management.", price: 25000, slug: "stock-market-professional" },
    { id: "3", title: "Crypto Trading Masterclass", description: "Master cryptocurrency markets, volatility management, and trading strategies.", price: 25000, slug: "crypto-trading-masterclass" },
  ];

  const displayCourses = (courses && courses.length > 0) ? courses : fallbackCourses;

  return (
    <main className="min-h-screen bg-[#060B17] text-white overflow-x-hidden">
      <Navbar />

      {/* ── HERO ────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#060B17] via-[#080D1E] to-[#060B17]" />
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-amber-500/8 rounded-full blur-[140px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <div className="relative z-10 container mx-auto px-6 md:px-12 text-center max-w-5xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-semibold tracking-widest uppercase mb-8">
            <Star size={11} fill="currentColor" /> India&apos;s Premier Trading Academy
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-none tracking-tight">
            Earning Starts{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">Here.</span>
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join ITTA and master the financial markets. We provide professional trading education,
            live mentorship, and institutional-level training that builds real careers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/courses"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-black text-base transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)", boxShadow: "0 0 40px rgba(245,158,11,0.35)" }}>
              Get Started Today
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/about"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white/80 border border-white/15 hover:bg-white/5 hover:border-white/30 transition-all text-base">
              <Play size={16} className="text-amber-400" /> View Programs
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-black text-amber-400 mb-1">{s.value}</div>
                <div className="text-xs text-white/40 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20 animate-bounce">
          <div className="w-px h-10 bg-gradient-to-b from-transparent to-white/20" />
        </div>
      </section>

      {/* ── COURSES ────────────────────────────────── */}
      <section className="py-28 border-t border-white/5" id="courses">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest">The Curriculum</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3 mb-4">A Structured Learning Path</h2>
            <p className="text-white/50 max-w-xl mx-auto">Designed to take you from beginner to professional institutional trader.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {displayCourses.map((course: any, i) => (
              <Link key={course.id} href={`/courses/${course.slug}`}
                className="group relative rounded-2xl p-6 border border-white/8 bg-gradient-to-br from-white/[0.03] to-transparent hover:border-amber-500/30 hover:from-amber-500/5 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center mb-4">
                  <BookOpen size={18} className="text-amber-400" />
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-amber-400 transition-colors">{course.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-5">{course.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-white">₹{Number(course.price).toLocaleString("en-IN")}</span>
                  <span className="flex items-center gap-1 text-amber-400 text-sm font-semibold group-hover:gap-2 transition-all">
                    Enroll <ChevronRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link href="/courses" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors border border-white/10 hover:border-white/25 px-6 py-3 rounded-xl">
              View Full Syllabus <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── THE ITTA EDGE ──────────────────────────── */}
      <section className="py-28 bg-gradient-to-b from-transparent via-white/[0.015] to-transparent">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest">Why ITTA</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3 mb-4">The ITTA Edge</h2>
            <p className="text-white/50 max-w-xl mx-auto">What makes us the first choice for professional trading education in India.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {edge.map((item, i) => (
              <div key={i} className="rounded-2xl p-6 border border-white/8 bg-white/[0.02] hover:border-amber-500/25 hover:bg-amber-500/[0.03] transition-all group">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                  <item.icon size={18} className="text-amber-400" />
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUOTE ──────────────────────────────────── */}
      <section className="py-20">
        <div className="container mx-auto px-6 md:px-12 max-w-3xl text-center">
          <div className="text-6xl text-amber-500/30 font-serif mb-6">&ldquo;</div>
          <blockquote className="text-2xl md:text-3xl font-bold leading-relaxed text-white/90 mb-6">
            In a world of noise, we focus on the signals. Trading is not a hobby; it&apos;s a craft that requires precision, patience, and professional-grade mentorship.
          </blockquote>
          <p className="text-amber-400 font-semibold text-sm uppercase tracking-widest">ITTA Academy</p>
        </div>
      </section>

      {/* ── LEADERSHIP ─────────────────────────────── */}
      <section className="py-28 border-t border-white/5">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest">The Team</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3 mb-4">ITTA Leadership</h2>
            <p className="text-white/50">The minds behind the movement.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {leaders.map((l, i) => (
              <div key={i} className="rounded-2xl p-6 border border-white/8 bg-white/[0.02] text-center hover:border-amber-500/25 transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/25 flex items-center justify-center mx-auto mb-4 text-amber-400 font-black text-lg group-hover:from-amber-500/30 transition-all">
                  {l.initials}
                </div>
                <h3 className="font-bold text-lg mb-0.5">{l.name}</h3>
                <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">{l.role}</p>
                <p className="text-white/45 text-sm leading-relaxed">{l.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────── */}
      <section className="py-28 border-t border-white/5">
        <div className="container mx-auto px-6 md:px-12 text-center max-w-3xl">
          <div className="rounded-3xl p-12 border border-amber-500/20 relative overflow-hidden"
            style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.12) 0%, transparent 70%)" }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
            <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest">Start Today</span>
            <h2 className="text-4xl md:text-5xl font-black mt-4 mb-4">Start Your Trading Journey</h2>
            <p className="text-white/60 mb-8">Don&apos;t wait for the perfect moment. Create it by learning from the best in the industry.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-black transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)", boxShadow: "0 0 30px rgba(245,158,11,0.3)" }}>
                Enroll Now <ArrowRight size={16} />
              </Link>
              <Link href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white/80 border border-white/15 hover:bg-white/5 transition-all">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
