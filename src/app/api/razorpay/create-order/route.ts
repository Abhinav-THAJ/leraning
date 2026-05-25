import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  // Validate keys before doing anything
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || keyId === "your_razorpay_key_id" || !keySecret || keySecret === "your_razorpay_key_secret") {
    return NextResponse.json(
      { error: "Razorpay keys not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env.local" },
      { status: 503 }
    );
  }

  try {
    const supabase = await createClient();

    // Ensure user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await req.json();

    // Fetch course price
    let price = 25000;
    if (courseId) {
      const { data: course } = await supabase
        .from("courses")
        .select("price")
        .eq("id", courseId)
        .single();
      if (course?.price) price = Number(course.price);
    }

    // Initialize Razorpay inside handler so env vars are definitely loaded
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    // Receipt max 40 chars
    const receipt = `rcpt_${Date.now()}`;

    const order = await razorpay.orders.create({
      amount: price * 100, // paise
      currency: "INR",
      receipt,
      notes: {
        userId: user.id,
        courseId: courseId || "all-access",
      },
    });

    // Create pending payment record in DB
    await supabase.from("payments").insert({
      user_id: user.id,
      razorpay_order_id: order.id,
      amount: price,
      currency: "INR",
      status: "pending",
    });

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { error: error?.description || error?.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
