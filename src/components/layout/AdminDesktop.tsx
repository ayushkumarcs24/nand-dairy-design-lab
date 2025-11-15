import { CircleUser, Menu, Package2, Search, Activity, ArrowUp, CreditCard, DollarSign, Users } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"


const AdminDesktop = () => {
    return (
        <header className="hidden h-14 items-center gap-4 border-b bg-white/30 backdrop-blur-lg px-4 lg:h-[60px] lg:px-6 md:flex sticky top-0 z-30 rounded-b-2xl shadow-lg">
        <div className="w-full flex-1">
          <form>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products, distributors, samitis..."
                className="w-full appearance-none bg-transparent pl-8 shadow-none md:w-2/3 lg:w-1/3 border-0 focus-visible:ring-0"
              />
            </div>
          </form>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full bg-transparent border-0 hover:bg-primary/10">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white/50 backdrop-blur-xl">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => (window.location.href = "/admin/settings")}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                window.location.href = "mailto:support@nanddairy.com";
              }}
            >
              Support
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                fetch("http://localhost:4000/api/auth/logout", {
                  method: "POST",
                  credentials: "include",
                }).finally(() => {
                  window.location.href = "/admin-login";
                });
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
    )
}

export default AdminDesktop;