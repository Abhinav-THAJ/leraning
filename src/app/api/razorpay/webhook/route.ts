import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js"; // Use service role for webhooks

export async function POST(req: Request) {
  try {
    const text = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(text)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(text);

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      
      // We stored userId in notes during order creation
      const userId = payment.notes.userId;
      
      if (!userId) {
        return NextResponse.json({ error: "User ID not found in payment notes" }, { status: 400 });
      }

      // We need a Service Role client here to bypass RLS for server-side updates
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      // 1. Update payment status
      await supabase
        .from("payments")
        .update({ 
          status: "completed", 
          razorpay_payment_id: payment.id 
        })
        .eq("razorpay_order_id", payment.order_id);

      // 2. IMPORTANT BUSINESS LOGIC: Unlock all access
      const { error } = await supabase
        .from("profiles")
        .update({ all_access: true })
        .eq("id", userId);

      if (error) {
        console.error("Failed to update user access:", error);
        return NextResponse.json({ error: "Failed to update user access" }, { status: 500 });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
