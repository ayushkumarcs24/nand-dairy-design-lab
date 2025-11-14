import { Home, ShoppingBag, Package, Users, BarChart3 } from "lucide-react";
import { NavLink } from "react-router-dom";

const DistributorSidebar = () => {
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all hover:bg-[#0B3B2C]/5 hover:text-[#0B3B2C] ${
      isActive ? "bg-[#0B3B2C]/5 text-[#0B3B2C]" : "text-slate-600"
    }`;

  return (
    <aside className="hidden md:block h-screen bg-[#0B3B2C] text-white rounded-r-3xl overflow-hidden shadow-xl">
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
          <div className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center">
            <span className="text-sm font-semibold">ND</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Nand Dairy</span>
            <span className="text-xs text-emerald-100/80">Distributor</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
          <NavLink to="/distributor/dashboard" className={navLinkClasses}>
            <Home className="h-4 w-4" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/distributor/orders" className={navLinkClasses}>
            <ShoppingBag className="h-4 w-4" />
            <span>Orders</span>
          </NavLink>
          <NavLink to="/distributor/products" className={navLinkClasses}>
            <Package className="h-4 w-4" />
            <span>Products</span>
          </NavLink>
          <NavLink to="/distributor/customers" className={navLinkClasses}>
            <Users className="h-4 w-4" />
            <span>Customers</span>
          </NavLink>
          <NavLink to="/distributor/reports" className={navLinkClasses}>
            <BarChart3 className="h-4 w-4" />
            <span>Reports</span>
          </NavLink>
        </nav>
      </div>
    </aside>
  );
};

export default DistributorSidebar;
