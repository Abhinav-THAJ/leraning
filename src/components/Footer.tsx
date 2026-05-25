import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Courses", href: "/courses" },
  { label: "Student Portal", href: "/dashboard" },
  { label: "Contact", href: "/contact" },
];

const popularCourses = [
  { label: "Forex Trading Masterclass", href: "/courses" },
  { label: "Stock Market Program", href: "/courses" },
  { label: "Crypto Trading Masterclass", href: "/courses" },
  { label: "Technical Analysis", href: "/courses" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#040810]">
      {/* Top section */}
      <div className="container mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-black font-black text-sm">I</div>
              <span className="font-black text-lg tracking-tight text-white">ITTA<span className="text-amber-400">.</span></span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              ITTA – International Trading Training Academy is a premier institution dedicated to providing
              professional financial market education and practical trading mentorship.
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              {["TG", "IG", "YT", "WA"].map((s) => (
                <div key={s}
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-white/30 text-[10px] font-bold hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-400 transition-all cursor-pointer">
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}
                    className="text-white/45 text-sm hover:text-amber-400 transition-colors flex items-center gap-1.5 group">
                    <span className="w-0 group-hover:w-2 h-px bg-amber-400 transition-all duration-200" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Courses */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-5">Popular Courses</h4>
            <ul className="space-y-3">
              {popularCourses.map((c) => (
                <li key={c.label}>
                  <Link href={c.href}
                    className="text-white/45 text-sm hover:text-amber-400 transition-colors flex items-center gap-1.5 group">
                    <span className="w-0 group-hover:w-2 h-px bg-amber-400 transition-all duration-200" />
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-5">Get in Touch</h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:+917907409671" className="flex items-start gap-3 group">
                  <Phone size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white/45 text-sm group-hover:text-white/70 transition-colors">+91 7907409671</span>
                </a>
              </li>
              <li>
                <a href="mailto:ittaacademy03@gmail.com" className="flex items-start gap-3 group">
                  <Mail size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white/45 text-sm group-hover:text-white/70 transition-colors">ittaacademy03@gmail.com</span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
                <span className="text-white/45 text-sm leading-relaxed">
                  1st Floor, Relcon Plaza,<br />
                  Opposite LIC, Pattom,<br />
                  Thiruvananthapuram, Kerala
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
                <span className="text-white/45 text-sm">Mon – Sat: 9:00 AM – 6:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="container mx-auto px-6 md:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/25 text-xs">
            © 2026 ITTA – International Trading Training Academy. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-white/25 text-xs hover:text-white/50 transition-colors">Privacy Policy</Link>
            <div className="w-px h-3 bg-white/10" />
            <Link href="/terms" className="text-white/25 text-xs hover:text-white/50 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
