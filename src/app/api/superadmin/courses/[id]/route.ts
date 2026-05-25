import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// PATCH — toggle publish status
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  const serviceClient = getServiceClient();
  const { error } = await serviceClient
    .from("courses")
    .update({ published: body.published, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

// DELETE — cascade delete course + all children
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const serviceClient = getServiceClient();

  // Delete in order: progress → lessons → modules → payments → course
  const { data: modules } = await serviceClient.from("modules").select("id").eq("course_id", id);
  if (modules?.length) {
    const moduleIds = modules.map((m: any) => m.id);
    const { data: lessons } = await serviceClient.from("lessons").select("id").in("module_id", moduleIds);
    if (lessons?.length) {
      const lessonIds = lessons.map((l: any) => l.id);
      await serviceClient.from("progress").delete().in("lesson_id", lessonIds);
      await serviceClient.from("lessons").delete().in("module_id", moduleIds);
    }
    await serviceClient.from("modules").delete().eq("course_id", id);
  }
  await serviceClient.from("payments").delete().eq("course_id", id);
  const { error } = await serviceClient.from("courses").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
