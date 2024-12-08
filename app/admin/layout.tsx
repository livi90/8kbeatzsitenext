import { AdminSidebar } from "@/components/admin/sidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.user_metadata.role !== "admin") {
    return redirect("/login");
  }
  // const { data: session, status } = useSession();

  // if (status === 'loading') {
  //   return <div>Loading...</div>;
  // }

  // if (!session?.user || session.user.role !== 'ADMIN') {
  //   redirect('/login');
  // }

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <main className="flex-1  bg-black p-8">{children}</main>
    </div>
  );
}
