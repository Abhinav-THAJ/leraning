import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Call this at the top of any admin server page.
 * Checks the sa_admin cookie against ADMIN_SESSION_TOKEN env var.
 * Redirects to login if missing or invalid.
 */
export async function requireAdminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("sa_admin")?.value;
  const expected = process.env.ADMIN_SESSION_TOKEN;

  if (!token || !expected || token !== expected) {
    redirect("/superadmin/login");
  }
}
