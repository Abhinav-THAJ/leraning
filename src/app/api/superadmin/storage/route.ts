import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

function getAdmin() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function ensureBucket(admin: ReturnType<typeof getAdmin>) {
  const { data: buckets } = await admin.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === "course-videos");
  if (!exists) {
    await admin.storage.createBucket("course-videos", {
      public: true,
      allowedMimeTypes: ["video/*"],
    });
  }
}

// GET /api/superadmin/storage?filename=xxx&type=video/mp4
// Returns a signed upload URL so the browser uploads DIRECTLY to Supabase (no Next.js size limit)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const filename = searchParams.get("filename") || "video.mp4";
  const contentType = searchParams.get("type") || "video/mp4";

  const admin = getAdmin();
  await ensureBucket(admin);

  const ext = filename.split(".").pop() || "mp4";
  const path = `lessons/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { data, error } = await admin.storage
    .from("course-videos")
    .createSignedUploadUrl(path);

  if (error || !data) {
    return NextResponse.json({ error: error?.message || "Failed to create upload URL" }, { status: 500 });
  }

  const { data: publicData } = admin.storage.from("course-videos").getPublicUrl(path);

  return NextResponse.json({
    signedUrl: data.signedUrl,
    token: data.token,
    path,
    publicUrl: publicData.publicUrl,
  });
}

// DELETE /api/superadmin/storage — remove a video by storage path
export async function DELETE(req: Request) {
  try {
    const { path } = await req.json();
    if (!path) return NextResponse.json({ error: "No path provided" }, { status: 400 });

    const admin = getAdmin();
    const { error } = await admin.storage.from("course-videos").remove([path]);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
