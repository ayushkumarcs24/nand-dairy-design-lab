import { DollarSign, Users, Package, ArrowUp, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getOwnerDashboardSummary } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

const cardVariants = {
  hover: {
    y: -10,
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const StatCard = ({ title, value, icon, trend, trendType }) => (
  <motion.div
    className="glass-card rounded-2xl p-6 flex flex-col justify-between transform-gpu"
    variants={cardVariants}
    whileHover="hover"
  >
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-medium text-muted-foreground">{title}</h3>
      {icon}
    </div>
    <div className="mt-4">
      <p className="text-3xl font-bold text-foreground">{value}</p>
      <div className="flex items-center text-sm mt-1">
        <span className={`flex items-center ${trendType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
          {trendType === 'increase' ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
          {trend} vs last month
        </span>
      </div>
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
      title: "Samitis",
      value: data?.samitiCount?.toString() ?? "0",
      icon: <Users className="h-6 w-6 text-muted-foreground" />,
      trend: "+0%",
      trendType: "increase",
    },
    {
      title: "Products",
      value: data?.productCount?.toString() ?? "0",
      icon: <Package className="h-6 w-6 text-muted-foreground" />,
      trend: "+0%",
      trendType: "increase",
    },
    {
      title: "Distributors",
      value: data?.distributors?.toString() ?? "0",
      icon: <Users className="h-6 w-6 text-muted-foreground" />,
      trend: "+0%",
      trendType: "increase",
    },
    {
      title: "Total Orders",
      value: data?.orders?.toString() ?? "0",
      icon: <DollarSign className="h-6 w-6 text-muted-foreground" />,
      trend: "+0%",
      trendType: "increase",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {isLoading
        ? Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-32 rounded-2xl" />
          ))
        : cardData.map((card, index) => <StatCard key={index} {...card} />)}
    </div>
  );
};

export default AdminCards;
