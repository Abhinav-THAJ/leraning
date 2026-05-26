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
    { name: "Akshay Dr", role: "Managing Director", desc: "Expert in strategy and institutional trading mentorship.", image: "https://api.dicebear.com/9.x/avataaars/svg?seed=AkshayDr&backgroundColor=b6e3f4&clothingColor=262e33&accessories=prescription01&clothingGraphic=bear&eyes=default&eyebrows=defaultNatural&mouth=smile&skinColor=ae5d29" },
    { name: "Akash Dr", role: "Director", desc: "Specialist in technical analysis and market algorithms.", image: "https://api.dicebear.com/9.x/avataaars/svg?seed=AkashDr2&backgroundColor=c0aede&clothingColor=3c4f5c&accessories=prescription02&eyes=happy&eyebrows=raisedExcitedNatural&mouth=smile&skinColor=614335" },
    { name: "Anoop Gangan", role: "Director", desc: "Connecting aspiring traders with high-quality education.", image: "https://api.dicebear.com/9.x/avataaars/svg?seed=AnoopGangan&backgroundColor=d1d4f9&clothingColor=1a1a2e&accessories=kurt&eyes=default&eyebrows=defaultNatural&mouth=twinkle&skinColor=ae5d29" },
    { name: "Dev Nair", role: "Director", desc: "Driving ITTA's growth and operational excellence.", image: "https://api.dicebear.com/9.x/avataaars/svg?seed=DevagopalNair&backgroundColor=ffd5dc&clothingColor=3d2c8d&accessories=sunglasses&eyes=winkWacky&eyebrows=raisedExcited&mouth=smile&skinColor=614335" },
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
    { id: "1", title: "Forex Trading Masterclass", description: "Learn currency market fundamentals, price action, and live trading strategies.", price: 25000, slug: "forex-trading-masterclass", img: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=600&auto=format&fit=crop&q=60" },
    { id: "2", title: "Stock Market Professional", description: "Understand investing, intraday trading, and portfolio management.", price: 25000, slug: "stock-market-professional", img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=60" },
    { id: "3", title: "Crypto Trading Masterclass", description: "Master cryptocurrency markets, volatility management, and trading strategies.", price: 25000, slug: "crypto-trading-masterclass", img: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=600&auto=format&fit=crop&q=60" },
  ];

  const displayCourses = (courses && courses.length > 0) ? courses : fallbackCourses;

  return (
    <main className="min-h-screen bg-[#060B17] text-white overflow-x-hidden">
      <Navbar />

      {/* ── HERO ────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop"
            alt="Trading Academy"
            className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#060B17]/95 via-[#080D1E]/80 to-[#060B17]" />
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-amber-500/15 rounded-full blur-[140px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px]" />
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <div className="relative z-10 container mx-auto px-6 md:px-12 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-semibold tracking-widest uppercase mb-8">
                <Star size={11} fill="currentColor" /> India&apos;s Premier Trading Academy
              </div>
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-none tracking-tight">
                Earning Starts{" "}
                <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">Here.</span>
              </h1>
              <p className="text-lg md:text-xl text-white/60 max-w-xl mb-10 leading-relaxed">
                Join ITTA and master the financial markets. We provide professional trading education,
                live mentorship, and institutional-level training that builds real careers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-black text-amber-400 mb-1">{s.value}</div>
                    <div className="text-xs text-white/40 uppercase tracking-wider">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Hero image */}
            <div className="hidden lg:block relative">
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-amber-500/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=80"
                  alt="Professional Trader"
                  className="w-full h-[480px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060B17]/80 via-transparent to-transparent" />
                {/* Floating stat card */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                      <TrendingUp size={18} className="text-amber-400" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">Live Market Sessions</p>
                      <p className="text-white/50 text-xs">500+ sessions completed by our experts</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative glow */}
              <div className="absolute -top-6 -right-6 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20 animate-bounce">
          <div className="w-px h-10 bg-gradient-to-b from-transparent to-white/20" />
        </div>
      </section>

      {/* ── WHY ITTA BANNER ─────────────────────────── */}
      <section className="py-16 border-y border-white/5 bg-white/[0.015]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-2xl overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=800&auto=format&fit=crop&q=80"
                alt="Trading classroom"
                className="w-full h-64 md:h-80 object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#060B17]/60 to-transparent rounded-2xl" />
              <div className="absolute bottom-5 left-5 bg-amber-500/90 backdrop-blur text-black px-4 py-2 rounded-xl font-bold text-sm">
                ⭐ India&apos;s #1 Trading Academy
              </div>
            </div>
            <div>
              <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest">Why Choose ITTA</span>
              <h2 className="text-3xl md:text-4xl font-black mt-3 mb-4">Institutional Trading, <br/>Made Accessible</h2>
              <p className="text-white/55 mb-6 leading-relaxed">ITTA Academy brings the same strategies, discipline, and execution methods used by professional trading desks directly to you — structured, practical, and results-driven.</p>
              <Link href="/about" className="inline-flex items-center gap-2 text-amber-400 font-semibold hover:gap-3 transition-all">
                Learn More About Us <ArrowRight size={16} />
              </Link>
            </div>
          </div>
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
                className="group relative rounded-2xl overflow-hidden border border-white/8 hover:border-amber-500/30 transition-all duration-300">
                {/* Course image */}
                <div className="relative h-44 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={(course as any).img || `https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=60`}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060B17] via-[#060B17]/40 to-transparent" />
                </div>
                <div className="p-6 bg-gradient-to-br from-white/[0.03] to-transparent hover:from-amber-500/5 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/20 flex items-center justify-center mb-3">
                    <BookOpen size={15} className="text-amber-400" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-amber-400 transition-colors">{course.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-5">{course.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-white">₹{Number(course.price).toLocaleString("en-IN")}</span>
                    <span className="flex items-center gap-1 text-amber-400 text-sm font-semibold group-hover:gap-2 transition-all">
                      Enroll <ChevronRight size={14} />
                    </span>
                  </div>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
            <div className="relative hidden lg:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80"
                alt="Trading analysis"
                className="rounded-3xl w-full h-[500px] object-cover border border-white/10"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#060B17]/40 rounded-3xl" />
              {/* Overlay badge */}
              <div className="absolute top-6 left-6 bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 max-w-[200px]">
                <p className="text-amber-400 font-black text-2xl mb-0.5">94%</p>
                <p className="text-white/70 text-xs">Student placement success rate</p>
              </div>
            </div>
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
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/25 flex items-center justify-center mx-auto mb-4 overflow-hidden group-hover:from-amber-500/30 transition-all p-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={l.image} alt={l.name} className="w-full h-full object-cover drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
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
