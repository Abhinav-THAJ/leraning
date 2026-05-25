"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { CheckCircle2, PlayCircle, BarChart3, Lock } from "lucide-react";

export default function Features() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section ref={containerRef} className="py-32 relative z-10 bg-[#060B17]">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Content */}
          <div className="flex-1 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                A Modern Approach to <br/>
                <span className="text-gradient">Trade Finance</span>
              </h2>
              <p className="text-lg text-white/70 max-w-xl">
                Experience a revolutionary learning platform designed specifically for the complexities of global trade. Interactive dashboards, real-world case studies, and enterprise-grade tools.
              </p>
            </motion.div>

            <div className="space-y-6 pt-4">
              {[
                { icon: PlayCircle, title: "Cinematic Video Lessons", desc: "4K quality instruction from industry veterans." },
                { icon: BarChart3, title: "Interactive Dashboards", desc: "Learn with real-world trade finance tools." },
                { icon: Lock, title: "Lifetime Access Model", desc: "Unlock all courses forever with a single purchase." }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: i * 0.2 }}
                  className="flex items-start gap-4"
                >
                  <div className="mt-1 w-10 h-10 rounded-full bg-brand-purple/20 flex flex-shrink-0 items-center justify-center text-brand-purple border border-brand-purple/30">
                    <feature.icon size={20} />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-1">{feature.title}</h4>
                    <p className="text-white/60">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Image */}
          <motion.div
            style={{ y }}
            className="flex-1 relative w-full aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden glass border-white/10"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/20 to-brand-purple/20 mix-blend-overlay z-10" />
            <Image
              src="/trade_finance_dashboard.png"
              alt="Trade Finance Dashboard"
              fill
              className="object-cover"
            />
            
            {/* Floating Elements */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 -left-10 md:-left-16 glass-card p-4 rounded-xl z-20 flex items-center gap-3 w-48 hidden md:flex"
            >
              <CheckCircle2 className="text-green-400" />
              <div>
                <div className="text-sm font-semibold">Module Passed</div>
                <div className="text-xs text-white/60">Incoterms 2020</div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
