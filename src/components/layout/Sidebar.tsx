import { Bell, Home, LineChart, Package, Package2, ShoppingCart, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  const navLinkClasses = (
    {
      isActive
    }: {
      isActive: boolean
    }
  ) => `flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900 transition-all hover:text-gray-900 dark:text-gray-50 dark:hover:text-gray-50 ${
    isActive ? "bg-gray-100 dark:bg-gray-800" : "text-gray-500"
  }`;
  return (
    <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-[60px] items-center border-b px-6">
          <NavLink to="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">Nandini</span>
          </NavLink>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium">
            <NavLink to="/farmer-dashboard" className={navLinkClasses}>
              <Home className="h-4 w-4" />
              Dashboard
            </NavLink>
            <NavLink to="/farmer-orders" className={navLinkClasses}>
              <ShoppingCart className="h-4 w-4" />
              Orders
            </NavLink>
            <NavLink to="/farmer-products" className={navLinkClasses}>
              <Package className="h-4 w-4" />
              Products
            </NavLink>
            <NavLink to="/farmer-customers" className={navLinkClasses}>
              <Users className="h-4 w-4" />
              Customers
            </NavLink>
            <NavLink to="/farmer-analytics" className={navLinkClasses}>
              <LineChart className="h-4 w-4" />
              Analytics
            </NavLink>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Sidebar;