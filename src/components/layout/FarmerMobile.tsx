import { Bell, Home, LineChart, Package, Package2, PanelLeft, Search, ShoppingCart, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const FarmerMobile = () => {
  const navLinkClasses = (
    {
      isActive
    }: {
      isActive: boolean
    }
  ) => `flex items-center gap-4 px-2.5 dark:hover:text-gray-50 ${
    isActive ? "text-gray-900 dark:text-gray-50" : "text-gray-500 hover:text-gray-900"
  }`;

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40 lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="lg:hidden">
            <PanelLeft className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="lg:hidden">
          <NavLink to="/" className="flex items-center gap-2 font-semibold mb-4">
            <Package2 className="h-6 w-6" />
            <span className="">Nandini</span>
          </NavLink>
          <nav className="grid gap-6 text-lg font-medium">
            <NavLink to="/farmer-dashboard" className={navLinkClasses}>
              <Home className="h-5 w-5" />
              Dashboard
            </NavLink>
            <NavLink to="/farmer-orders" className={navLinkClasses}>
              <ShoppingCart className="h-5 w-5" />
              Orders
            </NavLink>
            <NavLink to="/farmer-products" className={navLinkClasses}>
              <Package className="h-5 w-5" />
              Products
            </NavLink>
            <NavLink to="/farmer-customers" className={navLinkClasses}>
              <Users className="h-5 w-5" />
              Customers
            </NavLink>
            <NavLink to="/farmer-analytics" className={navLinkClasses}>
              <LineChart className="h-5 w-5" />
              Analytics
            </NavLink>
          </nav>
        </SheetContent>
      </Sheet>

      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full bg-white shadow-none appearance-none pl-8 md:w-2/3 lg:w-1/3 dark:bg-gray-950"
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
              width={36}
              height={36}
              alt="Avatar"
              className="overflow-hidden rounded-full"
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
  )
}

export default FarmerMobile;