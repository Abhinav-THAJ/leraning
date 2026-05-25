import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight, Target, Globe, Flame, Users, BookOpen, Award, TrendingUp, ShieldCheck, Zap } from "lucide-react";

export const metadata = {
  title: "About Us | ITTA Academy",
  description: "ITTA – International Trading Training Academy. Pioneering financial freedom through institutional-grade trading education since our founding in Thiruvananthapuram, Kerala.",
};

const stats = [
  { value: "10,000+", label: "Students Trained" },
  { value: "500+", label: "Live Sessions" },
  { value: "15,000+", label: "Community Members" },
  { value: "2,000+", label: "Success Stories" },
];

const leaders = [
  { name: "Akshay Dr", role: "Managing Director", desc: "Expert in strategy and institutional trading mentorship. Leads the vision and execution of ITTA Academy.", initials: "AD", color: "from-amber-500/25 to-orange-600/10" },
  { name: "Akash Dr", role: "Director", desc: "Specialist in technical analysis and market algorithms. Architects ITTA's core trading curriculum.", initials: "AK", color: "from-blue-500/20 to-blue-700/10" },
  { name: "Anoop Gangan", role: "Director", desc: "Connecting aspiring traders with high-quality education and bridging the gap between theory and markets.", initials: "AG", color: "from-purple-500/20 to-purple-700/10" },
  { name: "Devagopal Nair", role: "Director", desc: "Driving ITTA's growth, operations, and student success outcomes across all programs.", initials: "DN", color: "from-green-500/20 to-emerald-700/10" },
];

const edge = [
  { icon: Target, title: "Institutional Methods", desc: "Learn the same strategies used by professional fund managers and institutional trading desks worldwide." },
  { icon: Users, title: "Live Mentorship", desc: "Real-time sessions with expert traders covering live market analysis and trade execution." },
  { icon: ShieldCheck, title: "Risk-First Approach", desc: "Every course is built around capital protection and disciplined risk management above all else." },
  { icon: Award, title: "Certified Curriculum", desc: "Industry-recognized certificates upon completion to advance your professional trading career." },
  { icon: Globe, title: "Global Markets", desc: "Forex, equities, crypto — understand every major asset class with the depth of a professional." },
  { icon: Zap, title: "Practical Focus", desc: "No theory fluff. Every lesson ties directly to real trade setups and live market context." },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#060B17] text-white overflow-x-hidden">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative pt-36 pb-28 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-[600px] h-[400px] bg-amber-500/8 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 right-1/3 w-[400px] h-[300px] bg-blue-600/8 rounded-full blur-[120px]" />
          <div className="absolute inset-0 opacity-[0.02]"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>
        <div className="relative z-10 container mx-auto px-6 md:px-12 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase tracking-widest mb-8">
            <Flame size={11} /> Our Story
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Pioneering{" "}
            <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
              Financial Freedom
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/60 leading-relaxed max-w-3xl mx-auto">
            ITTA Academy is more than just a school — it&apos;s an ecosystem designed to cultivate
            institutional-grade traders who understand the heartbeat of the global markets.
          </p>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────── */}
      <section className="py-16 border-y border-white/5">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-black text-amber-400 mb-2">{s.value}</div>
                <div className="text-white/40 text-sm uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION & VISION ─────────────────────────── */}
      <section className="py-28">
        <div className="container mx-auto px-6 md:px-12 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-3xl p-8 md:p-10 border border-amber-500/20 relative overflow-hidden"
              style={{ background: "radial-gradient(ellipse at 0% 0%, rgba(245,158,11,0.08) 0%, transparent 70%)" }}>
              <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-amber-500/60 via-amber-500/20 to-transparent rounded-full" />
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center mb-6">
                <Target size={22} className="text-amber-400" />
              </div>
              <h2 className="text-2xl font-black mb-4 text-amber-400 uppercase tracking-wide">The Mission</h2>
              <p className="text-white/70 leading-relaxed text-lg">
                To democratize institutional-grade trading knowledge and build a community of disciplined,
                professional traders who prioritize risk management and logical execution above all.
              </p>
            </div>

            <div className="rounded-3xl p-8 md:p-10 border border-blue-500/20 relative overflow-hidden"
              style={{ background: "radial-gradient(ellipse at 0% 0%, rgba(59,130,246,0.06) 0%, transparent 70%)" }}>
              <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-blue-500/60 via-blue-500/20 to-transparent rounded-full" />
              <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center mb-6">
                <Globe size={22} className="text-blue-400" />
              </div>
              <h2 className="text-2xl font-black mb-4 text-blue-400 uppercase tracking-wide">The Vision</h2>
              <p className="text-white/70 leading-relaxed text-lg">
                To set the gold standard in financial education across Asia, fostering an environment
                where aspiring traders can transition into full-time market professionals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUOTE ────────────────────────────────────── */}
      <section className="py-16 border-y border-white/5">
        <div className="container mx-auto px-6 md:px-12 max-w-3xl text-center">
          <div className="text-6xl text-amber-500/25 font-serif mb-4">&ldquo;</div>
          <blockquote className="text-xl md:text-2xl font-bold leading-relaxed text-white/85 mb-5">
            In a world of noise, we focus on the signals. Trading is not a hobby — it&apos;s a craft
            that requires precision, patience, and professional-grade mentorship.
          </blockquote>
          <p className="text-amber-400 font-semibold text-xs uppercase tracking-widest">Discipline Is Everything — ITTA Academy</p>
        </div>
      </section>

      {/* ── THE ITTA EDGE ────────────────────────────── */}
      <section className="py-28">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest">Why Choose ITTA</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3 mb-4">The ITTA Edge</h2>
            <p className="text-white/50 max-w-xl mx-auto">What makes us the first choice for professional trading education.</p>
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

      {/* ── LEADERSHIP ───────────────────────────────── */}
      <section className="py-28 border-t border-white/5">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest">The Team</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3 mb-4">ITTA Leadership</h2>
            <p className="text-white/50">Leading the vision and execution of ITTA Academy.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {leaders.map((l, i) => (
              <div key={i} className="rounded-2xl p-6 border border-white/8 bg-white/[0.02] text-center hover:border-amber-500/25 transition-all group">
                <div className={`w-18 h-18 w-[72px] h-[72px] rounded-2xl bg-gradient-to-br ${l.color} border border-white/10 flex items-center justify-center mx-auto mb-4 text-white font-black text-xl group-hover:scale-105 transition-transform`}>
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

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="py-24 border-t border-white/5">
        <div className="container mx-auto px-6 md:px-12 max-w-2xl text-center">
          <h2 className="text-4xl font-black mb-4">Ready to Begin?</h2>
          <p className="text-white/50 mb-8">Join thousands of students already mastering the markets with ITTA Academy.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-black transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)", boxShadow: "0 0 30px rgba(245,158,11,0.3)" }}>
              Explore Courses <ArrowRight size={16} />
            </Link>
            <Link href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold border border-white/15 hover:bg-white/5 transition-all">
              Talk to Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
