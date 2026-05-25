"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Globe, TrendingUp, ShieldCheck } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#060B17] z-10 opacity-60 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060B17] via-transparent to-[#060B17] z-10" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-blue/20 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-brand-purple/20 rounded-full blur-[150px] -z-10" />
        
        <Image
          src="/hero_global_trade.png"
          alt="Global Trade"
          fill
          className="object-cover opacity-30 object-center"
          priority
        />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block py-1.5 px-4 rounded-full border border-white/10 glass text-brand-blue font-medium text-sm mb-6 tracking-wide uppercase">
              The Standard in Global Trade Education
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 leading-tight"
          >
            Master Global Trade with <br className="hidden md:block" />
            <span className="text-gradient">Industry Experts</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-lg md:text-2xl text-white/70 mb-12 max-w-3xl mx-auto font-light leading-relaxed"
          >
            Premium online certification programs in international trade, export-import management, logistics, trade finance, and global business.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link
              href="/courses"
              className="group relative px-8 py-4 bg-white text-[#060B17] rounded-full font-semibold text-lg overflow-hidden transition-transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white via-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center gap-2">
                Explore Courses
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            
            <Link
              href="/signup"
              className="group px-8 py-4 glass border border-white/10 rounded-full font-semibold text-lg text-white hover:bg-white/5 transition-all flex items-center gap-2"
            >
              Start Learning Today
            </Link>
          </motion.div>
        </div>

        {/* Stats / Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {[
            { icon: Globe, title: "Global Recognition", desc: "Certified in 150+ countries" },
            { icon: ShieldCheck, title: "Industry Standard", desc: "ICC aligned curriculum" },
            { icon: TrendingUp, title: "Career Growth", desc: "94% placement success" }
          ].map((stat, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-brand-blue/20 flex items-center justify-center mb-4 text-brand-blue">
                <stat.icon size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{stat.title}</h3>
              <p className="text-white/60">{stat.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
