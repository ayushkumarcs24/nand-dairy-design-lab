import Sidebar from "@/components/layout/Sidebar";
import FarmerMobile from "@/components/layout/FarmerMobile";
import FarmerDesktop from "@/components/layout/FarmerDesktop";
import FarmerSummaryCards from "@/components/farmer/FarmerSummaryCards";
import FarmerDailyAndSummary from "@/components/farmer/FarmerDailyAndSummary";
import FarmerPerformance from "@/components/farmer/FarmerPerformance";
import { motion } from "framer-motion";

const FarmerDashboard = () => {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr] bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Sidebar />
      <div className="flex flex-col max-h-screen overflow-hidden">
        <FarmerMobile />
        <FarmerDesktop />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto flex max-w-6xl flex-col"
          >
            <FarmerSummaryCards />
            <FarmerDailyAndSummary />
            <FarmerPerformance />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default FarmerDashboard;
