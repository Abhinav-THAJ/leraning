import { createClient } from "@/utils/supabase/server";
import { requireAdminAuth } from "@/utils/admin-auth";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import AdminCourseActions from "@/components/AdminCourseActions";
import { PlusCircle } from "lucide-react";

export const revalidate = 0;

export default async function AdminCoursesPage() {
  await requireAdminAuth();

  const supabase = await createClient();
  const { data: courses } = await supabase
    .from('courses')
    .select('*, modules(count)')
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-[#060B17]">
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 p-6 md:p-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold mb-1">Course Management</h1>
              <p className="text-white/50 text-sm">{courses?.length ?? 0} total courses</p>
            </div>
            <Link href="/superadmin/courses/new" className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-black rounded-xl font-semibold text-sm hover:bg-amber-400 transition-colors">
              <PlusCircle size={16} />
              Add Course
            </Link>
          </div>

          <div className="glass rounded-2xl border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-white/40">
                    <th className="text-left p-4 font-medium">Course</th>
                    <th className="text-left p-4 font-medium">Price</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Modules</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses?.length === 0 && (
                    <tr><td colSpan={5} className="p-12 text-center text-white/30">No courses yet. Add your first course.</td></tr>
                  )}
                  {courses?.map((course: any) => (
                    <tr key={course.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="p-4">
                        <div className="font-semibold">{course.title}</div>
                        <div className="text-white/40 text-xs mt-1">/{course.slug}</div>
                      </td>
                      <td className="p-4 font-bold">₹{Number(course.price).toLocaleString('en-IN')}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          course.published ? 'bg-green-400/10 text-green-400' : 'bg-yellow-400/10 text-yellow-400'
                        }`}>
                          {course.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="p-4 text-white/60">{course.modules?.[0]?.count ?? 0} modules</td>
                      <td className="p-4">
                      <AdminCourseActions courseId={course.id} courseSlug={course.slug} published={course.published} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
