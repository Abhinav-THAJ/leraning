"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Send, Loader2, CheckCircle2, MessageSquare } from "lucide-react";

const contactInfo = [
  {
    icon: Phone, label: "Call Us", value: "+91 7907409671",
    sub: "Mon – Sat, 9 AM – 6 PM",
    href: "tel:+917907409671", color: "text-green-400", bg: "bg-green-400/10 border-green-400/20"
  },
  {
    icon: Mail, label: "Email Us", value: "ittaacademy03@gmail.com",
    sub: "We reply within 24 hours",
    href: "mailto:ittaacademy03@gmail.com", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20"
  },
  {
    icon: MapPin, label: "Visit Us", value: "Relcon Plaza, Pattom",
    sub: "Opposite LIC, Thiruvananthapuram, Kerala 695004",
    href: "https://maps.google.com/?q=Relcon+Plaza+Pattom+Thiruvananthapuram", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20"
  },
  {
    icon: Clock, label: "Open Hours", value: "Mon – Sat",
    sub: "9:00 AM – 6:00 PM IST",
    href: null, color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/20"
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate send (replace with actual API call if needed)
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSent(true);
  };

  return (
    <main className="min-h-screen bg-[#060B17] text-white overflow-x-hidden">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-[500px] h-[350px] bg-amber-500/8 rounded-full blur-[130px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-blue-500/8 rounded-full blur-[110px]" />
        </div>
        <div className="relative z-10 container mx-auto px-6 md:px-12 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase tracking-widest mb-8">
            <MessageSquare size={11} /> Get In Touch
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-5 leading-tight">
            Talk to{" "}
            <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">Us</span>
          </h1>
          <p className="text-lg text-white/55 leading-relaxed">
            Ready to elevate your trading career? Reach out to our expert mentors for guidance and support.
          </p>
        </div>
      </section>

      {/* ── CONTACT CARDS ────────────────────────────── */}
      <section className="py-12 border-t border-white/5">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {contactInfo.map((c, i) => {
              const inner = (
                <div className={`rounded-2xl p-6 border ${c.bg} hover:scale-[1.02] transition-all group h-full`}>
                  <div className={`w-10 h-10 rounded-xl ${c.bg} border flex items-center justify-center mb-4`}>
                    <c.icon size={18} className={c.color} />
                  </div>
                  <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-1">{c.label}</p>
                  <p className={`font-bold text-base mb-1 ${c.color}`}>{c.value}</p>
                  <p className="text-white/45 text-sm leading-relaxed">{c.sub}</p>
                </div>
              );
              return c.href ? (
                <a key={i} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{inner}</a>
              ) : (
                <div key={i}>{inner}</div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FORM + MAP ───────────────────────────────── */}
      <section className="py-20">
        <div className="container mx-auto px-6 md:px-12 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="rounded-3xl p-8 border border-white/8 bg-white/[0.02]">
                <h2 className="text-2xl font-black mb-1">Direct Message</h2>
                <p className="text-white/45 text-sm mb-7">Send us a message and we&apos;ll respond within 24 hours.</p>

                {sent ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <CheckCircle2 size={48} className="text-green-400 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                    <p className="text-white/50 text-sm mb-6">Our team will get back to you within 24 hours.</p>
                    <button onClick={() => { setSent(false); setForm({ name: "", email: "", phone: "", message: "" }); }}
                      className="text-amber-400 text-sm hover:text-amber-300 transition-colors">
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-white/40 uppercase tracking-wider font-semibold block mb-2">Full Name</label>
                        <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                          placeholder="Your name"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-amber-500/50 transition-all text-sm" />
                      </div>
                      <div>
                        <label className="text-xs text-white/40 uppercase tracking-wider font-semibold block mb-2">Phone Number</label>
                        <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                          placeholder="+91 XXXXX XXXXX"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-amber-500/50 transition-all text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-white/40 uppercase tracking-wider font-semibold block mb-2">Email Address</label>
                      <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder="your@email.com"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-amber-500/50 transition-all text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-white/40 uppercase tracking-wider font-semibold block mb-2">Message</label>
                      <textarea required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                        rows={5} placeholder="Tell us about yourself and your trading goals..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-amber-500/50 transition-all text-sm resize-none" />
                    </div>
                    <button type="submit" disabled={loading}
                      className="w-full py-4 rounded-xl font-bold text-black flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-60"
                      style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)", boxShadow: "0 4px 24px rgba(245,158,11,0.3)" }}>
                      {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={16} />}
                      {loading ? "Sending…" : "Send Message"}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Map + Info */}
            <div className="lg:col-span-2 space-y-5">
              {/* Map embed */}
              <div className="rounded-2xl overflow-hidden border border-white/8 aspect-[4/3]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3945.5!2d76.9466!3d8.5241!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOCIzMScyNi44Ik4gNzYiNTYnNDcuOCJF!5e0!3m2!1sen!2sin!4v1"
                  width="100%" height="100%" style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                  allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Address card */}
              <div className="rounded-2xl p-6 border border-amber-500/20 bg-amber-500/5">
                <div className="flex items-start gap-3 mb-4">
                  <MapPin size={18} className="text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-sm mb-1">Visit The Academy</p>
                    <p className="text-white/55 text-sm leading-relaxed">
                      1st Floor, Relcon Plaza,<br />
                      Opposite LIC, Pattom,<br />
                      Thiruvananthapuram, Kerala 695004
                    </p>
                  </div>
                </div>
                <a href="https://maps.google.com/?q=Relcon+Plaza+Pattom+Thiruvananthapuram"
                  target="_blank" rel="noreferrer"
                  className="text-amber-400 text-xs font-semibold hover:text-amber-300 transition-colors">
                  Get Directions →
                </a>
              </div>

              {/* Social Links */}
              <div className="rounded-2xl p-6 border border-white/8 bg-white/[0.02]">
                <h3 className="font-bold text-sm mb-4">Join The Community</h3>
                <p className="text-white/45 text-xs mb-4">Follow our success across the digital landscape.</p>
                <div className="flex gap-3">
                  {["Telegram", "Instagram", "YouTube", "WhatsApp"].map(s => (
                    <div key={s} className="flex-1 py-2 rounded-xl bg-white/5 border border-white/8 text-center text-[10px] text-white/40 hover:text-white/70 hover:bg-white/10 transition-all cursor-pointer">
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
