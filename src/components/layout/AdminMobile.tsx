import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Home, LineChart, Menu, Package, Package2, ShoppingCart, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

const AdminMobile = () => {
    return (
        <header className="flex h-14 items-center gap-4 border-b bg-white/30 backdrop-blur-lg px-4 lg:h-[60px] lg:px-6 md:hidden sticky top-0 z-30 rounded-b-2xl shadow-lg">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden bg-transparent border-0 hover:bg-primary/10"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col bg-white/50 backdrop-blur-xl">
            <nav className="grid gap-2 text-lg font-medium">
              <NavLink
                to="/admin/dashboard"
                className="flex items-center gap-2 text-lg font-semibold mb-4"
              >
                <Package2 className="h-6 w-6" />
                <span className="sr-only">Nand Dairy</span>
              </NavLink>
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                    `flex items-center gap-4 rounded-xl px-3 py-3 text-muted-foreground hover:text-primary transition-all ${
                        isActive ? "bg-primary/10 text-primary" : ""
                    }`
                }
              >
                <Home className="h-5 w-5" />
                Dashboard
              </NavLink>
              <NavLink
                to="/admin/samitis"
                className={({ isActive }) =>
                    `flex items-center gap-4 rounded-xl px-3 py-3 text-muted-foreground hover:text-primary transition-all ${
                        isActive ? "bg-primary/10 text-primary" : ""
                    }`
                }
              >
                <Users className="h-5 w-5" />
                Samitis
              </NavLink>
              <NavLink
                to="/admin/distributors"
                className={({ isActive }) =>
                    `flex items-center gap-4 rounded-xl px-3 py-3 text-muted-foreground hover:text-primary transition-all ${
                        isActive ? "bg-primary/10 text-primary" : ""
                    }`
                }
              >
                <ShoppingCart className="h-5 w-5" />
                Distributors
              </NavLink>
              <NavLink
                to="/admin/products"
                className={({ isActive }) =>
                    `flex items-center gap-4 rounded-xl px-3 py-3 text-muted-foreground hover:text-primary transition-all ${
                        isActive ? "bg-primary/10 text-primary" : ""
                    }`
                }
              >
                <Package className="h-5 w-5" />
                Products
              </NavLink>
              <NavLink
                to="/admin/analytics"
                className={({ isActive }) =>
                    `flex items-center gap-4 rounded-xl px-3 py-3 text-muted-foreground hover:text-primary transition-all ${
                        isActive ? "bg-primary/10 text-primary" : ""
                    }`
                }
              >
                <LineChart className="h-5 w-5" />
                Analytics
              </NavLink>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="w-full flex-1">
            <h1 className="font-semibold text-lg">Dashboard</h1>
        </div>
      </header>
    )
}

export default AdminMobile
