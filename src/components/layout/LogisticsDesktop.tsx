import { Bell, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

const LogisticsDesktop = () => {
  return (
    <header className="hidden lg:flex h-20 items-center justify-between border-b bg-white/80 px-10 sticky top-0 z-30 backdrop-blur-xl">
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
            ND
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-900">Nand Dairy</span>
            <span className="text-xs text-slate-500">Logistics Control Center</span>
          </div>
        </div>
        <nav className="flex items-center gap-8 text-sm font-medium text-slate-500">
          <button className="hover:text-slate-900 transition-colors">Dashboard</button>
          <button className="relative text-slate-900 font-semibold">
            Vehicles
            <span className="absolute inset-x-0 -bottom-2 h-0.5 rounded-full bg-indigo-500" />
          </button>
          <button className="hover:text-slate-900 transition-colors">Distributors</button>
          <button className="hover:text-slate-900 transition-colors">Reports</button>
        </nav>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <CalendarDays className="h-4 w-4" />
          <div className="flex flex-col leading-tight">
            <span>June 24, 2024</span>
            <span className="text-[11px] text-slate-400">10:30 AM</span>
          </div>
        </div>
        <Button variant="outline" size="icon" className="rounded-full border-slate-200">
          <Bell className="h-4 w-4" />
        </Button>
        <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-700">
          LG
        </div>
      </div>
    </header>
  );
};

export default LogisticsDesktop;
