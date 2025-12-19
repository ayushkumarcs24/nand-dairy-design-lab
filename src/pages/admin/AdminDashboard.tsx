import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminMobile from "@/components/layout/AdminMobile";
import AdminDesktop from "@/components/layout/AdminDesktop";
import AdminCards from "@/components/admin/AdminCards";
import AdminCharts from "@/components/admin/AdminCharts";
import AdminLists from "@/components/admin/AdminLists";
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    } as any // Cast to any to avoid strict type checking issues with framer-motion versions
  }
};

const AdminDashboard = () => {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-sans dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <AdminSidebar />
      <div className="flex flex-col max-h-screen overflow-hidden">
        <AdminMobile />
        <AdminDesktop />
        <main className="flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8 lg:p-12 overflow-y-auto scrollbar-hide">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="flex items-center justify-between">
              <div>
                <h1 className="font-bold text-4xl md:text-5xl text-slate-900 dark:text-white tracking-tight">
                  Dashboard
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                  Overview of your dairy business performance.
                </p>
              </div>
              <div className="hidden md:block">
                <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 shadow-sm">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <AdminCards />
            </motion.div>

            <motion.div variants={itemVariants}>
              <AdminCharts />
            </motion.div>

            <motion.div variants={itemVariants}>
              <AdminLists />
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
