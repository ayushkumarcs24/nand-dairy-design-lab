import { Bell, Home, LineChart, Package, Package2, ShoppingCart, Users, Truck, FileText } from "lucide-react";
import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="hidden border-r border-white/20 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl md:block shadow-xl z-50">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-16 items-center border-b border-white/10 px-6">
          <NavLink to="/admin/dashboard" className="flex items-center gap-3 font-bold text-xl text-blue-600 dark:text-blue-400 tracking-tight">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <Package2 className="h-5 w-5" />
            </div>
            <span>Nand Dairy</span>
          </NavLink>
        </div>
        <div className="flex-1 py-6 px-4 overflow-y-auto">
          <nav className="grid items-start gap-2 text-sm font-medium">
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 group ${isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
                }`
              }
            >
              <Home className="h-5 w-5" />
              Dashboard
            </NavLink>

            <div className="my-2 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Management
            </div>

            <NavLink
              to="/admin/samitis"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 group ${isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
                }`
              }
            >
              <Users className="h-5 w-5" />
              Samitis
            </NavLink>
            <NavLink
              to="/admin/distributors"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 group ${isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
                }`
              }
            >
              <ShoppingCart className="h-5 w-5" />
              Distributors
            </NavLink>
            <NavLink
              to="/admin/products"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 group ${isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
                }`
              }
            >
              <Package className="h-5 w-5" />
              Products
            </NavLink>

            <div className="my-2 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Logistics & Finance
            </div>

            <NavLink
              to="/admin/vehicles"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 group ${isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
                }`
              }
            >
              <Truck className="h-5 w-5" />
              Vehicles
            </NavLink>
            <NavLink
              to="/admin/invoices"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 group ${isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
                }`
              }
            >
              <FileText className="h-5 w-5" />
              Invoices
            </NavLink>
            <NavLink
              to="/admin/analytics"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 group ${isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
                }`
              }
            >
              <LineChart className="h-5 w-5" />
              Analytics
            </NavLink>
          </nav>
        </div>
        <div className="p-4 border-t border-white/10">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white shadow-lg">
            <h4 className="font-bold text-sm mb-1">Pro Tip</h4>
            <p className="text-xs text-blue-100 opacity-90">Check analytics daily for better insights.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
