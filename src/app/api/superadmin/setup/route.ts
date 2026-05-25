import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const { email, password, secret } = await request.json();

    // Validate setup secret
    const setupSecret = process.env.ADMIN_SETUP_SECRET;
    if (!setupSecret || secret !== setupSecret) {
      return NextResponse.json({ error: "Invalid setup secret" }, { status: 403 });
    }

    // We need service role to bypass RLS - try with service role first
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

    if (!serviceKey || serviceKey === "your_supabase_service_role_key") {
      // No service role key — try using the anon key with user's own credentials
      // Sign in the user first, then update their own profile (RLS allows self-update)
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const supabase = createClient(supabaseUrl, anonKey);

      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        return NextResponse.json({ error: "Login failed: " + signInError.message }, { status: 401 });
      }

      // Update own profile role
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ role: "admin" })
        .eq("id", authData.user.id);

      if (updateError) {
        return NextResponse.json({
          error: "Could not update role (RLS blocked it). Please add your SUPABASE_SERVICE_ROLE_KEY to .env.local and try again. Error: " + updateError.message
        }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: "Admin role set successfully! You can now login at /superadmin/login" });
    }

    // Service role key IS set — use it to bypass RLS entirely
    const adminClient = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Find user by email
    const { data: users, error: usersError } = await adminClient.auth.admin.listUsers();
    if (usersError) {
      return NextResponse.json({ error: "Could not list users: " + usersError.message }, { status: 500 });
    }

    const targetUser = users.users.find(u => u.email === email);
    if (!targetUser) {
      return NextResponse.json({ error: "No user found with that email. Please sign up first." }, { status: 404 });
    }

    // Upsert profile with admin role
    const { error: profileError } = await adminClient
      .from("profiles")
      .upsert({ id: targetUser.id, email: targetUser.email, role: "admin" }, { onConflict: "id" });

    if (profileError) {
      return NextResponse.json({ error: "Failed to set role: " + profileError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Admin role set successfully! You can now login at /superadmin/login" });

  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
