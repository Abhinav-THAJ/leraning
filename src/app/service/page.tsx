import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight, Briefcase, BookOpen, Layers, BarChart3, TrendingUp, MonitorPlay } from "lucide-react";

export const metadata = {
  title: "Services | ITTA Academy",
  description: "Explore the professional trading services, courses, and mentorship programs offered by ITTA Academy.",
};

const services = [
  {
    icon: BookOpen,
    title: "Comprehensive Curriculum",
    desc: "From beginner concepts to advanced institutional strategies, our curriculum covers Forex, Crypto, and Equities comprehensively.",
    color: "from-amber-500/20 to-orange-600/10",
    iconColor: "text-amber-400",
    img: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=70"
  },
  {
    icon: MonitorPlay,
    title: "Live Market Sessions",
    desc: "Watch our professional traders execute real trades in the live market. See theory applied directly to current price action.",
    color: "from-blue-500/20 to-blue-700/10",
    iconColor: "text-blue-400",
    img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=70"
  },
  {
    icon: TrendingUp,
    title: "1-on-1 Mentorship",
    desc: "Personalized guidance to refine your trading psychology, risk management, and strategy execution.",
    color: "from-purple-500/20 to-purple-700/10",
    iconColor: "text-purple-400",
    img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=70"
  },
  {
    icon: Layers,
    title: "Funded Account Prep",
    desc: "Specialized training designed to help you pass proprietary firm evaluations and secure institutional funding.",
    color: "from-green-500/20 to-emerald-700/10",
    iconColor: "text-green-400",
    img: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=600&auto=format&fit=crop&q=70"
  },
  {
    icon: BarChart3,
    title: "Trading Toolkits",
    desc: "Access our proprietary indicators, risk management calculators, and trade journaling software.",
    color: "from-rose-500/20 to-rose-700/10",
    iconColor: "text-rose-400",
    img: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=600&auto=format&fit=crop&q=70"
  },
  {
    icon: Briefcase,
    title: "Career Placement",
    desc: "Top performers get connected with proprietary trading desks, hedge funds, and investment firms in our network.",
    color: "from-cyan-500/20 to-cyan-700/10",
    iconColor: "text-cyan-400",
    img: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&auto=format&fit=crop&q=70"
  }
];

export default function ServicePage() {
  return (
    <main className="min-h-screen bg-[#060B17] text-white overflow-x-hidden">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative pt-36 pb-28 overflow-hidden">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=2070&auto=format&fit=crop" alt="ITTA Services" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-screen" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#060B17]/95 via-[#080D1E]/80 to-[#060B17]" />
          <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-amber-500/10 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] bg-blue-600/10 rounded-full blur-[130px]" />
        </div>
        <div className="relative z-10 container mx-auto px-6 md:px-12 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase tracking-widest mb-8">
            <Layers size={11} /> Our Services
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Institutional-Grade{" "}
            <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
              Training & Services
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/60 leading-relaxed max-w-3xl mx-auto">
            We provide everything you need to transition from retail speculation to professional trading. Master the markets with our structured programs.
          </p>
        </div>
      </section>

      {/* ── SERVICES GRID ────────────────────────────── */}
      <section className="py-20 border-t border-white/5 relative z-10">
        <div className="container mx-auto px-6 md:px-12 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <div key={i} className="rounded-3xl overflow-hidden border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all group hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/10">
                {/* Service image */}
                <div className="relative h-44 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.img}
                    alt={s.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060B17] via-[#060B17]/40 to-transparent" />
                  <div className={`absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center`}>
                    <s.icon size={18} className={s.iconColor} />
                  </div>
                </div>
                {/* Service content */}
                <div className="p-6 relative">
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${s.color} rounded-bl-full opacity-20 group-hover:opacity-40 transition-opacity`} />
                  <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW WE WORK ──────────────────────────────── */}
      <section className="py-24 border-t border-white/5">
        <div className="container mx-auto px-6 md:px-12 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest">Our Approach</span>
              <h2 className="text-4xl font-black mt-3 mb-6">From Knowledge to <br/><span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">Real Results</span></h2>
              <p className="text-white/55 mb-8 leading-relaxed">Our programs are built on a foundation of institutional methodology, hands-on practice, and one-on-one mentorship. Every student is guided from theory to live-market execution.</p>
              <div className="space-y-4">
                {["Learn proven institutional strategies", "Practice on live simulated markets", "Trade with real capital confidence", "Get certified & launch your career"].map((step, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black text-sm flex-shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-white/70 text-sm">{step}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=800&auto=format&fit=crop&q=80"
                alt="Trading classroom"
                className="rounded-3xl w-full h-[420px] object-cover border border-white/10"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#060B17]/30 rounded-3xl" />
              <div className="absolute bottom-6 right-6 bg-amber-500/90 backdrop-blur text-black px-4 py-3 rounded-2xl">
                <p className="font-black text-xl">500+</p>
                <p className="text-xs font-semibold">Live sessions completed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="py-24 border-t border-white/5">
        <div className="container mx-auto px-6 md:px-12 max-w-3xl text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">Start Your Journey Today</h2>
          <p className="text-white/60 mb-10 text-lg">Whether you are starting from scratch or looking to refine your institutional edge, we have the right program for you.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-black transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)", boxShadow: "0 0 30px rgba(245,158,11,0.3)" }}>
              View Our Courses <ArrowRight size={16} />
            </Link>
            <Link href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold border border-white/15 hover:bg-white/5 transition-all">
              Contact an Advisor
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
