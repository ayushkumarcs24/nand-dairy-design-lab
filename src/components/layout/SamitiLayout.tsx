import { ReactNode } from "react";
import SamitiSidebar from "./SamitiSidebar";
import AdminDesktop from "./AdminDesktop"; // Reusing AdminDesktop for now or create SamitiDesktop
import AdminMobile from "./AdminMobile"; // Reusing AdminMobile for now or create SamitiMobile

interface SamitiLayoutProps {
    children: ReactNode;
}

export const SamitiLayout = ({ children }: SamitiLayoutProps) => {
    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <SamitiSidebar />
            <div className="flex flex-col">
                {/* Ideally create separate headers for Samiti but reusing for speed if similar */}
                <AdminDesktop />
                <AdminMobile />
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-slate-50/50">
                    {children}
                </main>
            </div>
        </div>
    );
};
