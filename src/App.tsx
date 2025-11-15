import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/api";
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
import AdminDashboard from "./pages/admin/AdminDashboard";
import FarmerOrders from "./pages/farmer/FarmerOrders";
import FarmerProducts from "./pages/farmer/FarmerProducts";
import FarmerCustomers from "./pages/farmer/FarmerCustomers";
import FarmerAnalytics from "./pages/farmer/FarmerAnalytics";
import FarmerDailyEntry from "./pages/farmer/FarmerDailyEntry";
import FarmerStatements from "./pages/farmer/FarmerStatements";
import SamitiDashboard from "./pages/samiti/SamitiDashboard";
import DistributorDashboard from "./pages/distributor/DistributorDashboard";
import DistributorOrders from "./pages/distributor/DistributorOrders";
import LogisticsDashboard from "./pages/logistics/LogisticsDashboard";

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
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/samiti/dashboard" element={<SamitiDashboard />} />
          <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
          <Route path="/farmer/daily-entry" element={<FarmerDailyEntry />} />
          <Route path="/farmer/statements" element={<FarmerStatements />} />
          <Route path="/farmer-orders" element={<FarmerOrders />} />
          <Route path="/farmer-products" element={<FarmerProducts />} />
          <Route path="/farmer-customers" element={<FarmerCustomers />} />
          <Route path="/farmer-analytics" element={<FarmerAnalytics />} />
          <Route path="/distributor/dashboard" element={<DistributorDashboard />} />
          <Route path="/distributor/orders" element={<DistributorOrders />} />
          <Route path="/logistics/dashboard" element={<LogisticsDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTe */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
