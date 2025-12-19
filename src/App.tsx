import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSamitis from "./pages/admin/AdminSamitis";
import AdminDistributors from "./pages/admin/AdminDistributors";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminVehicles from "./pages/admin/AdminVehicles";
import AdminInvoices from "./pages/admin/AdminInvoices";
import SamitiDashboard from "./pages/samiti/SamitiDashboard";
import SamitiMilkCollection from "./pages/samiti/SamitiMilkCollection";
import SamitiInvoices from "./pages/samiti/SamitiInvoices";
import SamitiPayouts from "./pages/samiti/SamitiPayouts";
import FarmerDashboard from "./pages/farmer/FarmerDashboard";
import FarmerDailyEntry from "./pages/farmer/FarmerDailyEntry";
import FarmerStatements from "./pages/farmer/FarmerStatements";
import FarmerAnalytics from "./pages/farmer/FarmerAnalytics";
import DistributorDashboard from "./pages/distributor/DistributorDashboard";
import DistributorOrders from "./pages/distributor/DistributorOrders";
import DistributorPayments from "./pages/distributor/DistributorPayments";
import LogisticsDashboard from "./pages/logistics/LogisticsDashboard";
import LogisticsVehicles from "./pages/logistics/LogisticsVehicles";
import LogisticsRoutes from "./pages/logistics/LogisticsRoutes";
import LogisticsDispatches from "./pages/logistics/LogisticsDispatches";
import RoleLogin from "./pages/RoleLogin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />

            {/* Role Login Routes */}
            <Route path="/admin-login" element={<RoleLogin role="OWNER" title="Owner" />} />
            <Route path="/samiti-login" element={<RoleLogin role="SAMITI" title="Samiti" />} />
            <Route path="/farmer-login" element={<RoleLogin role="FARMER" title="Farmer" />} />
            <Route path="/distributor-login" element={<RoleLogin role="DISTRIBUTOR" title="Distributor" />} />
            <Route path="/logistics-login" element={<RoleLogin role="LOGISTICS" title="Logistics" />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["OWNER"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/samitis" element={<ProtectedRoute allowedRoles={["OWNER"]}><AdminSamitis /></ProtectedRoute>} />
            <Route path="/admin/distributors" element={<ProtectedRoute allowedRoles={["OWNER"]}><AdminDistributors /></ProtectedRoute>} />
            <Route path="/admin/products" element={<ProtectedRoute allowedRoles={["OWNER"]}><AdminProducts /></ProtectedRoute>} />
            <Route path="/admin/vehicles" element={<ProtectedRoute allowedRoles={["OWNER"]}><AdminVehicles /></ProtectedRoute>} />
            <Route path="/admin/invoices" element={<ProtectedRoute allowedRoles={["OWNER"]}><AdminInvoices /></ProtectedRoute>} />

            {/* Samiti Routes */}
            <Route path="/samiti/dashboard" element={<ProtectedRoute allowedRoles={["SAMITI"]}><SamitiDashboard /></ProtectedRoute>} />
            <Route path="/samiti/milk-collection" element={<ProtectedRoute allowedRoles={["SAMITI"]}><SamitiMilkCollection /></ProtectedRoute>} />
            <Route path="/samiti/invoices" element={<ProtectedRoute allowedRoles={["SAMITI"]}><SamitiInvoices /></ProtectedRoute>} />
            <Route path="/samiti/payouts" element={<ProtectedRoute allowedRoles={["SAMITI"]}><SamitiPayouts /></ProtectedRoute>} />

            {/* Farmer Routes */}
            <Route path="/farmer/dashboard" element={<ProtectedRoute allowedRoles={["FARMER"]}><FarmerDashboard /></ProtectedRoute>} />
            <Route path="/farmer/daily-entry" element={<ProtectedRoute allowedRoles={["FARMER"]}><FarmerDailyEntry /></ProtectedRoute>} />
            <Route path="/farmer/statements" element={<ProtectedRoute allowedRoles={["FARMER"]}><FarmerStatements /></ProtectedRoute>} />
            <Route path="/farmer-analytics" element={<ProtectedRoute allowedRoles={["FARMER"]}><FarmerAnalytics /></ProtectedRoute>} />

            {/* Distributor Routes */}
            <Route path="/distributor/dashboard" element={<ProtectedRoute allowedRoles={["DISTRIBUTOR"]}><DistributorDashboard /></ProtectedRoute>} />
            <Route path="/distributor/orders" element={<ProtectedRoute allowedRoles={["DISTRIBUTOR"]}><DistributorOrders /></ProtectedRoute>} />
            <Route path="/distributor/payments" element={<ProtectedRoute allowedRoles={["DISTRIBUTOR"]}><DistributorPayments /></ProtectedRoute>} />

            {/* Logistics Routes */}
            <Route path="/logistics/dashboard" element={<ProtectedRoute allowedRoles={["LOGISTICS"]}><LogisticsDashboard /></ProtectedRoute>} />
            <Route path="/logistics/vehicles" element={<ProtectedRoute allowedRoles={["LOGISTICS"]}><LogisticsVehicles /></ProtectedRoute>} />
            <Route path="/logistics/routes" element={<ProtectedRoute allowedRoles={["LOGISTICS"]}><LogisticsRoutes /></ProtectedRoute>} />
            <Route path="/logistics/dispatches" element={<ProtectedRoute allowedRoles={["LOGISTICS"]}><LogisticsDispatches /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
