import { Menu, Truck, Map, Users, BarChart3 } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const LogisticsMobile = () => {
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-4 rounded-xl px-3 py-3 text-sm font-medium ${
      isActive ? "text-indigo-700 bg-indigo-50" : "text-slate-600 hover:text-indigo-700"
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
            <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
              ND
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-900">Nand Dairy</span>
              <span className="text-xs text-slate-500">Logistics Portal</span>
            </div>
          </div>
          <nav className="grid gap-3 text-sm font-medium">
            <NavLink to="/logistics/dashboard" className={navLinkClasses}>
              <Truck className="h-5 w-5" />
              Vehicle Dispatch
            </NavLink>
            <NavLink to="#" className={navLinkClasses}>
              <Map className="h-5 w-5" />
              Route Planning
            </NavLink>
            <NavLink to="#" className={navLinkClasses}>
              <Users className="h-5 w-5" />
              Distributors
            </NavLink>
            <NavLink to="#" className={navLinkClasses}>
              <BarChart3 className="h-5 w-5" />
              Reports
            </NavLink>
          </nav>
        </SheetContent>
      </Sheet>

      <div className="flex-1">
        <p className="text-xs text-slate-400">Today</p>
        <p className="text-sm font-semibold text-slate-900">Vehicle Assignment & Dispatch</p>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            <span className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-700">
              LG
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Logistics Lead</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default LogisticsMobile;
