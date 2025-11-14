import { Search, Bell, CircleUser } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DistributorDesktop = () => {
  return (
    <header className="hidden lg:flex h-16 items-center gap-4 border-b bg-white/80 px-8 sticky top-0 z-30 backdrop-blur-xl">
      <div className="flex flex-col">
        <p className="text-xs text-slate-400">Welcome back, Ankit!</p>
        <h1 className="text-xl font-semibold text-slate-900">Distributor Dashboard</h1>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <form className="w-full max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder="Search orders, products..."
              className="w-full pl-9 bg-slate-50 border-0 shadow-none"
            />
          </div>
        </form>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" className="rounded-full border-slate-200">
          <Bell className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full overflow-hidden border-slate-200">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Open user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-xl">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DistributorDesktop;
