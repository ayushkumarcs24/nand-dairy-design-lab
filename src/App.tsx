import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AdminLogin from "./pages/AdminLogin";
import SamitiLogin from "./pages/SamitiLogin";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import FarmerLogin from "./pages/FarmerLogin";
import DistributorLogin from "./pages/DistributorLogin";
import LogisticsLogin from "./pages/LogisticsLogin";
import FarmerDashboard from "./pages/FarmerDashboard";
import FarmerOrders from "./pages/farmer/FarmerOrders";
import FarmerProducts from "./pages/farmer/FarmerProducts";
import FarmerCustomers from "./pages/farmer/FarmerCustomers";
import FarmerAnalytics from "./pages/farmer/FarmerAnalytics";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/samiti-login" element={<SamitiLogin />} />
          <Route path="/farmer-login" element={<FarmerLogin />} />
          <Route path="/distributor-login" element={<DistributorLogin />} />
          <Route path="/logistics-login" element={<LogisticsLogin />} />
          <Route path="/index" element={<Index />} />
          <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
          <Route path="/farmer-orders" element={<FarmerOrders />} />
          <Route path="/farmer-products" element={<FarmerProducts />} />
          <Route path="/farmer-customers" element={<FarmerCustomers />} />
          <Route path="/farmer-analytics" element={<FarmerAnalytics />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
