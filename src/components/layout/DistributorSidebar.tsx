import { Bell, Home, Package2, ShoppingCart, CreditCard } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

const DistributorSidebar = () => {
  const navLinkClasses = (
    {
      isActive,
    }: {
      isActive: boolean;
    }
  ) => `flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900 transition-all hover:text-gray-900 dark:text-gray-50 dark:hover:text-gray-50 ${isActive ? "bg-gray-100 dark:bg-gray-800" : "text-gray-500"
    }`;

  return (
    <div className="hidden border-r bg-gray-50 lg:block dark:bg-gray-900/40">
      <div className="flex h-full max-h-screen flex-col justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex h-[72px] items-center border-b bg-white/70 px-6 backdrop-blur-sm dark:bg-gray-900/60">
            <NavLink to="/distributor/dashboard" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6 text-blue-500" />
              <div className="flex flex-col leading-tight">
                <span className="text-sm text-gray-500">Nand Dairy</span>
                <span className="text-base font-semibold">Distributor</span>
              </div>
            </NavLink>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8 rounded-full">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1 overflow-auto py-4">
            <nav className="grid items-start gap-1 px-4 text-sm font-medium">
              <NavLink to="/distributor/dashboard" className={navLinkClasses}>
                <Home className="h-4 w-4" />
                Dashboard
              </NavLink>
              <NavLink to="/distributor/orders" className={navLinkClasses}>
                <ShoppingCart className="h-4 w-4" />
                My Orders
              </NavLink>
              <NavLink to="/distributor/payments" className={navLinkClasses}>
                <CreditCard className="h-4 w-4" />
                Payments
              </NavLink>
            </nav>
          </div>
        </div>
        <div className="border-t bg-white/60 px-4 py-4 text-xs text-gray-500 dark:bg-gray-900/80">
          <p className="font-medium text-gray-700 dark:text-gray-200">Profile</p>
          <p className="text-gray-400">Distributor ID #56789</p>
        </div>
      </div>
    </div>
  );
};

export default DistributorSidebar;
