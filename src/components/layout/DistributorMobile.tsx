import { Menu, Home, ShoppingBag, Package, Users, BarChart3 } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const DistributorMobile = () => {
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-4 rounded-xl px-3 py-3 text-sm font-medium ${
      isActive ? "text-[#0B3B2C] bg-[#0B3B2C]/5" : "text-slate-600 hover:text-[#0B3B2C]"
    }`;

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-white/80 px-4 lg:hidden shadow-sm">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="rounded-full">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col gap-6">
          <div className="flex items-center gap-3 mt-2">
            <div className="h-9 w-9 rounded-full bg-[#0B3B2C] text-white flex items-center justify-center text-sm font-semibold">
              ND
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-900">Nand Dairy</span>
              <span className="text-xs text-slate-500">Distributor Portal</span>
            </div>
          </div>
          <nav className="grid gap-3 text-sm font-medium">
            <NavLink to="/distributor/dashboard" className={navLinkClasses}>
              <Home className="h-5 w-5" />
              Dashboard
            </NavLink>
            <NavLink to="/distributor/orders" className={navLinkClasses}>
              <ShoppingBag className="h-5 w-5" />
              Orders
            </NavLink>
            <NavLink to="/distributor/products" className={navLinkClasses}>
              <Package className="h-5 w-5" />
              Products
            </NavLink>
            <NavLink to="/distributor/customers" className={navLinkClasses}>
              <Users className="h-5 w-5" />
              Customers
            </NavLink>
            <NavLink to="/distributor/reports" className={navLinkClasses}>
              <BarChart3 className="h-5 w-5" />
              Reports
            </NavLink>
          </nav>
        </SheetContent>
      </Sheet>

      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Input
              type="search"
              placeholder="Search orders, products..."
              className="w-full appearance-none bg-slate-50 pl-3 pr-3 h-9 text-sm"
            />
          </div>
        </form>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            <img
              src="/placeholder.svg"
              width={32}
              height={32}
              alt="Avatar"
              className="rounded-full"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default DistributorMobile;
