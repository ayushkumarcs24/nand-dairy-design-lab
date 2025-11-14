import { Bell, Home, LineChart, Package, Package2, ShoppingCart, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="hidden border-r bg-white/30 backdrop-blur-lg md:block rounded-r-2xl shadow-lg">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <NavLink to="/admin/dashboard" className="flex items-center gap-2 font-semibold text-primary">
            <Package2 className="h-6 w-6" />
            <span>Nand Dairy</span>
          </NavLink>
        </div>
        <div className="flex-1 py-4">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-2">
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10 ${
                  isActive ? "bg-primary/10 text-primary" : ""
                }`
              }
            >
              <Home className="h-4 w-4" />
              Dashboard
            </NavLink>
            <NavLink
              to="/admin/samitis"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10 ${
                  isActive ? "bg-primary/10 text-primary" : ""
                }`
              }
            >
              <Users className="h-4 w-4" />
              Samitis
            </NavLink>
            <NavLink
              to="/admin/distributors"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10 ${
                  isActive ? "bg-primary/10 text-primary" : ""
                }`
              }
            >
              <ShoppingCart className="h-4 w-4" />
              Distributors
            </NavLink>
            <NavLink
              to="/admin/products"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10 ${
                  isActive ? "bg-primary/10 text-primary" : ""
                }`
              }
            >
              <Package className="h-4 w-4" />
              Products
            </NavLink>
            <NavLink
              to="/admin/analytics"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10 ${
                  isActive ? "bg-primary/10 text-primary" : ""
                }`
              }
            >
              <LineChart className="h-4 w-4" />
              Analytics & Reports
            </NavLink>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
