import { ArrowUpRight, ArrowDownRight, MapPin, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const samitis = [
  { name: "Radha Krishna Dugdha Samiti", revenue: "₹1,20,000", location: "Anand, Gujarat", status: "Active" },
  { name: "Gokul Dugdha Utpadak Sahakari Mandali", revenue: "₹98,500", location: "Kolhapur, Maharashtra", status: "Active" },
  { name: "Amul Dairy Cooperative Society", revenue: "₹2,50,000", location: "Anand, Gujarat", status: "Active" },
  { name: "Shreeja Mahila Milk Producer Company", revenue: "₹85,000", location: "Tirupati, Andhra Pradesh", status: "Pending" },
  { name: "Warana Dairy", revenue: "₹76,000", location: "Warana Nagar, Maharashtra", status: "Active" },
];

const distributors = [
  { name: "Krishna Distributors", sales: "₹5,40,000", location: "Mumbai, Maharashtra", performance: "up", change: "+12%" },
  { name: "Radhe Dairy", sales: "₹4,80,000", location: "Pune, Maharashtra", performance: "up", change: "+8%" },
  { name: "Gopal Dairy Products", sales: "₹4,20,000", location: "Ahmedabad, Gujarat", performance: "down", change: "-3%" },
  { name: "Nandini Milk Agency", sales: "₹3,90,000", location: "Bengaluru, Karnataka", performance: "up", change: "+5%" },
  { name: "Modern Dairy", sales: "₹3,50,000", location: "Delhi", performance: "down", change: "-1%" },
];

const AdminLists = () => {
  return (
    <motion.div
      className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      {/* Recent Samitis */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-xl text-slate-800 dark:text-white">Recent Samitis</h3>
          <Button
            variant="ghost"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
            onClick={() => (window.location.href = "/admin/samitis")}
          >
            View All
          </Button>
        </div>
        <div className="space-y-4">
          {samitis.map((samiti, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-all duration-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 shadow-sm hover:shadow-md group">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg">
                  {samiti.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{samiti.name}</p>
                  <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    <MapPin className="h-3 w-3 mr-1" />
                    {samiti.location}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-800 dark:text-white">{samiti.revenue}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${samiti.status === 'Active'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                  {samiti.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Distributors */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-xl text-slate-800 dark:text-white">Top Distributors</h3>
          <Button
            variant="ghost"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
            onClick={() => (window.location.href = "/admin/distributors")}
          >
            View All
          </Button>
        </div>
        <div className="space-y-4">
          {distributors.map((distributor, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-all duration-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 shadow-sm hover:shadow-md group">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg">
                  {distributor.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{distributor.name}</p>
                  <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    <MapPin className="h-3 w-3 mr-1" />
                    {distributor.location}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-800 dark:text-white">{distributor.sales}</p>
                <div className={`flex items-center justify-end text-xs font-medium mt-0.5 ${distributor.performance === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                  {distributor.performance === 'up' ?
                    <ArrowUpRight className="h-3 w-3 mr-1" /> :
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  }
                  {distributor.change}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminLists;
