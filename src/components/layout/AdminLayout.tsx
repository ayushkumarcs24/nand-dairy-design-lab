import { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminDesktop from "./AdminDesktop";
import AdminMobile from "./AdminMobile";

interface AdminLayoutProps {
    children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <AdminSidebar />
            <div className="flex flex-col">
                <AdminDesktop />
                <AdminMobile />
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-slate-50/50">
                    {children}
                </main>
            </div>
        </div>
    );
};
