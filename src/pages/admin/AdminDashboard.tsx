import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminMobile from "@/components/layout/AdminMobile";
import AdminDesktop from "@/components/layout/AdminDesktop";
import AdminCards from "@/components/admin/AdminCards";
import AdminCharts from "@/components/admin/AdminCharts";
import AdminLists from "@/components/admin/AdminLists";
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr] bg-gradient-to-br from-blue-50 via-white to-blue-100 font-sans">
      <AdminSidebar />
      <div className="flex flex-col max-h-screen overflow-hidden">
        <AdminMobile />
        <AdminDesktop />
        <main className="flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 lg:p-12 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-bold text-3xl md:text-4xl text-foreground">Welcome Back, Admin!</h1>
                <p className="text-muted-foreground mt-1">Here's a snapshot of your dairy business today.</p>
              </div>
            </div>
            <AdminCards />
            <AdminCharts />
            <AdminLists />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
