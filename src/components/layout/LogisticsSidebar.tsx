import { Truck, Map, Users, BarChart3 } from "lucide-react";
import { NavLink } from "react-router-dom";

const LogisticsSidebar = () => {
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all hover:bg-indigo-50 hover:text-indigo-700 ${
      isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-600"
    }`;

  return (
    <aside className="hidden md:block h-screen bg-white/80 backdrop-blur-xl rounded-r-3xl shadow-xl border border-indigo-50">
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-100/80">
          <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
            ND
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-900">Nand Dairy</span>
            <span className="text-xs text-slate-500">Logistics</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
          <NavLink to="/logistics/dashboard" className={navLinkClasses}>
            <Truck className="h-4 w-4" />
            <span>Vehicle Dispatch</span>
          </NavLink>
          <NavLink to="#" className={navLinkClasses}>
            <Map className="h-4 w-4" />
            <span>Route Planning</span>
          </NavLink>
          <NavLink to="#" className={navLinkClasses}>
            <Users className="h-4 w-4" />
            <span>Distributors</span>
          </NavLink>
          <NavLink to="#" className={navLinkClasses}>
            <BarChart3 className="h-4 w-4" />
            <span>Reports</span>
          </NavLink>
        </nav>
      </div>
    </aside>
  );
};

export default LogisticsSidebar;
