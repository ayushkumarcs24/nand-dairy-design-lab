import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminMobile from "@/components/layout/AdminMobile";
import AdminDesktop from "@/components/layout/AdminDesktop";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

const AdminSettings = () => {
  const { data, isLoading } = useQuery({ queryKey: ["me"], queryFn: getMe });

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr] bg-gradient-to-br from-blue-50 via-white to-blue-100 font-sans">
      <AdminSidebar />
      <div className="flex flex-col max-h-screen overflow-hidden">
        <AdminMobile />
        <AdminDesktop />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
          <div className="mx-auto flex max-w-3xl flex-col gap-6 rounded-3xl bg-white/80 p-6 shadow-sm ring-1 ring-slate-100">
            <h1 className="text-2xl font-bold text-slate-900">Admin Settings</h1>
            {isLoading || !data ? (
              <Skeleton className="h-32 w-full" />
            ) : (
              <div className="space-y-4 text-sm text-slate-700">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Name</div>
                  <div className="mt-1 text-base font-medium">{data.name}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Email</div>
                  <div className="mt-1 text-base font-medium">{data.email}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Role</div>
                  <div className="mt-1 text-base font-medium">{data.role}</div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminSettings;
