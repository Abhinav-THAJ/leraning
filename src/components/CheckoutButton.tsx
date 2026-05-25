"use client";

import Link from "next/link";
import { LockOpen } from "lucide-react";

export default function CheckoutButton({ courseId, price }: { courseId: string; price: number }) {
  return (
    <>
      <Link
        href={`/checkout?courseId=${courseId}`}
        className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-brand-blue to-brand-purple rounded-xl font-bold text-white hover:opacity-90 transition-opacity text-center"
      >
        <LockOpen size={20} />
        Unlock Lifetime Access (₹{price.toLocaleString("en-IN")})
      </Link>
      <p className="text-center text-xs text-white/50 mt-3">
        * One-time payment unlocks all platform courses forever
      </p>
    </>
  );
}
