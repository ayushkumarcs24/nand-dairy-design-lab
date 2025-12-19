import { ReactNode } from "react";
import DistributorSidebar from "./DistributorSidebar";
import AdminDesktop from "./AdminDesktop"; // Reusing AdminDesktop for now
import AdminMobile from "./AdminMobile"; // Reusing AdminMobile for now

interface DistributorLayoutProps {
    children: ReactNode;
}

export const DistributorLayout = ({ children }: DistributorLayoutProps) => {
    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <DistributorSidebar />
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
