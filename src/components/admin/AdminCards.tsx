import { DollarSign, Users, Package, ArrowUp, ArrowDown, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getOwnerDashboardSummary } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

const cardVariants = {
  hover: {
    y: -5,
    boxShadow: "0 20px 40px -10px rgba(59, 130, 246, 0.15)",
    transition: { duration: 0.3, ease: "easeOut" } as any,
  },
};

const StatCard = ({ title, value, icon, trend, trendType, color }: any) => (
  <motion.div
    className="glass-card rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group"
    variants={cardVariants}
    whileHover="hover"
  >
    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300`}>
      {icon}
    </div>

    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-white`}>
        {icon}
      </div>
      {trend && (
        <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${trendType === 'increase' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          }`}>
          {trendType === 'increase' ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
          {trend}
        </div>
      )}
    </div>

    <div>
      <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</p>
    </div>
  </motion.div>
);

const AdminCards = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["owner-dashboard-summary"],
    queryFn: getOwnerDashboardSummary,
  });

  const cardData = [
    {
      title: "Total Samitis",
      value: data?.samitiCount?.toString() ?? "0",
      icon: <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      trend: "+12%",
      trendType: "increase",
      color: "bg-blue-500",
    },
    {
      title: "Active Products",
      value: data?.productCount?.toString() ?? "0",
      icon: <Package className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
      trend: "+5%",
      trendType: "increase",
      color: "bg-indigo-500",
    },
    {
      title: "Distributors",
      value: data?.distributors?.toString() ?? "0",
      icon: <Users className="h-6 w-6 text-violet-600 dark:text-violet-400" />,
      trend: "+8%",
      trendType: "increase",
      color: "bg-violet-500",
    },
    {
      title: "Total Orders",
      value: data?.orders?.toString() ?? "0",
      icon: <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
      trend: "+24%",
      trendType: "increase",
      color: "bg-emerald-500",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {isLoading
        ? Array.from({ length: 4 }).map((_, idx) => (
          <Skeleton key={idx} className="h-40 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        ))
        : cardData.map((card, index) => <StatCard key={index} {...card} />)}
    </div>
  );
};

export default AdminCards;
