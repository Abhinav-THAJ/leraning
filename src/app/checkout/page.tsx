"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import Script from "next/script";
import Link from "next/link";
import {
  CheckCircle2,
  ShieldCheck,
  Lock,
  Loader2,
  ArrowLeft,
  Globe,
  BookOpen,
  Clock,
  Award,
} from "lucide-react";

const INCLUDED_FEATURES = [
  "Lifetime access to ALL current courses",
  "Access to all future courses added",
  "Official digital certificates",
  "Downloadable resources & templates",
  "Study on any device, anytime",
  "Priority support",
];

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#060B17] flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-blue" size={32} />
      </main>
    }>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams.get("courseId");

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [alreadyHasAccess, setAlreadyHasAccess] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      // Get user session
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("all_access")
          .eq("id", user.id)
          .single();
        if (profile?.all_access) {
          setAlreadyHasAccess(true);
        }
      }

      // Get course info
      if (courseId) {
        const { data } = await supabase
          .from("courses")
          .select("*")
          .eq("id", courseId)
          .single();
        setCourse(data);
      } else {
        // Fallback: show generic platform access
        setCourse({
          id: courseId || "all-access",
          title: "Full Platform Access",
          price: 25000,
        });
      }
      setLoading(false);
    }
    load();
  }, [courseId]);

  const handlePay = async () => {
    if (!user) {
      router.push(`/login?redirect=/checkout?courseId=${courseId}`);
      return;
    }

    setPaying(true);
    try {
      // Step 1: Create Razorpay order
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course?.id }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to create order. Please check Razorpay keys in .env.local");
        setPaying(false);
        return;
      }

      const order = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "ITTA Academy",
        description: "Lifetime Access — All Courses",
        image: "/icon.png",
        order_id: order.id,
        // Step 2: Verify payment server-side before granting access
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (verifyRes.ok) {
              router.push("/dashboard?payment=success");
            } else {
              const err = await verifyRes.json();
              alert("Payment received but verification failed: " + (err.error || "Please contact support"));
              setPaying(false);
            }
          } catch {
            // Payment succeeded on Razorpay side — redirect anyway
            router.push("/dashboard?payment=success");
          }
        },
        prefill: {
          name: user?.user_metadata?.full_name || "",
          email: user?.email || "",
        },
        theme: { color: "#2563EB" },
        modal: {
          ondismiss: () => setPaying(false),
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", (response: any) => {
        alert("Payment failed: " + (response.error?.description || "Please try again."));
        setPaying(false);
      });
      rzp.open();
    } catch (err) {
      alert("Something went wrong. Please try again.");
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#060B17] flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-blue" size={32} />
      </main>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <main className="min-h-screen bg-[#060B17]">
        {/* Background blobs */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-blue/10 rounded-full blur-[130px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-brand-purple/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8 md:py-16 max-w-5xl">
          {/* Back link */}
          <Link
            href={courseId ? `/courses` : "/courses"}
            className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Courses
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

            {/* LEFT — Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-3 space-y-6"
            >
              {/* Header */}
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-brand-purple bg-brand-purple/10 border border-brand-purple/20 mb-4">
                  One-Time Payment
                </span>
                <h1 className="text-3xl md:text-4xl font-bold mb-3">
                  Complete Your Purchase
                </h1>
                <p className="text-white/60">
                  One payment gives you lifetime access to the entire ITTA Academy catalog.
                </p>
              </div>

              {/* Course Card */}
              <div className="glass-card rounded-2xl p-6 border border-brand-blue/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center flex-shrink-0">
                    <Globe size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1">You&apos;re purchasing</p>
                    <h2 className="text-lg font-bold">{course?.title}</h2>
                    <p className="text-white/50 text-sm mt-1">+ Full access to all other courses</p>
                  </div>
                </div>
              </div>

              {/* What's included */}
              <div className="glass rounded-2xl p-6 border border-white/5">
                <h3 className="font-semibold mb-5 text-white/80">What&apos;s included</h3>
                <div className="space-y-3">
                  {INCLUDED_FEATURES.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-white/70">
                      <CheckCircle2 size={16} className="text-green-400 flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: BookOpen, label: "All Courses", value: "Lifetime" },
                  { icon: Clock, label: "Content", value: "100+ hrs" },
                  { icon: Award, label: "Certificates", value: "Included" },
                ].map((s, i) => (
                  <div key={i} className="glass rounded-xl p-4 text-center border border-white/5">
                    <s.icon size={20} className="text-brand-blue mx-auto mb-2" />
                    <div className="text-sm font-bold">{s.value}</div>
                    <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* RIGHT — Payment Box */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2 lg:sticky lg:top-8"
            >
              <div className="glass-card rounded-2xl p-6 border border-white/10">
                {/* Price */}
                <div className="text-center py-6 border-b border-white/10 mb-6">
                  <p className="text-white/50 text-sm mb-2">Total amount</p>
                  <div className="text-5xl font-bold mb-1">
                    ₹{Number(course?.price || 25000).toLocaleString("en-IN")}
                  </div>
                  <p className="text-white/40 text-xs">One-time • No subscription</p>
                </div>

                {/* Order summary */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Platform Access</span>
                    <span className="font-semibold">₹{Number(course?.price || 25000).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">All Courses Included</span>
                    <span className="text-green-400 font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Certificates</span>
                    <span className="text-green-400 font-semibold">FREE</span>
                  </div>
                  <div className="h-px bg-white/10 my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹{Number(course?.price || 25000).toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {alreadyHasAccess ? (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-green-400 font-semibold mb-4">
                      <CheckCircle2 size={20} />
                      You already have full access!
                    </div>
                    <Link
                      href="/dashboard"
                      className="block w-full py-4 bg-white/10 hover:bg-white/20 rounded-xl font-semibold text-center transition-colors"
                    >
                      Go to Dashboard
                    </Link>
                  </div>
                ) : !user ? (
                  <div className="space-y-3">
                    <Link
                      href={`/login?redirect=/checkout?courseId=${courseId}`}
                      className="block w-full py-4 bg-gradient-to-r from-brand-blue to-brand-purple rounded-xl font-bold text-white text-center hover:opacity-90 transition-opacity"
                    >
                      Sign In to Purchase
                    </Link>
                    <Link
                      href={`/signup?redirect=/checkout?courseId=${courseId}`}
                      className="block w-full py-3.5 glass border border-white/10 rounded-xl font-medium text-white text-center hover:bg-white/5 transition-colors"
                    >
                      Create Free Account
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={handlePay}
                    disabled={paying}
                    className="w-full py-4 bg-gradient-to-r from-brand-blue to-brand-purple rounded-xl font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {paying ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        <Lock size={18} />
                        Pay ₹{Number(course?.price || 25000).toLocaleString("en-IN")} Securely
                      </>
                    )}
                  </button>
                )}

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-3 mt-5 text-white/30 text-xs">
                  <div className="flex items-center gap-1">
                    <ShieldCheck size={13} />
                    <span>Secure</span>
                  </div>
                  <div className="w-px h-3 bg-white/20" />
                  <span>Powered by Razorpay</span>
                  <div className="w-px h-3 bg-white/20" />
                  <span>256-bit SSL</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </main>
    </>
  );
}
