import { DollarSign, Users, Package, ArrowUp, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

const StatCard = ({ title, value, icon, trend, trendType }) => (
  <motion.div
    className="glass-card rounded-2xl p-6 flex flex-col justify-between transform-gpu"
    whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
    transition={{ duration: 0.4 }}
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
  const cardData = [
    {
      title: "Total Revenue",
      value: "₹4,52,318.89",
      icon: <DollarSign className="h-6 w-6 text-muted-foreground" />,
      trend: "+20.1%",
      trendType: "increase",
    },
    {
      title: "Samitis",
      value: "+235",
      icon: <Users className="h-6 w-6 text-muted-foreground" />,
      trend: "+18.1%",
      trendType: "increase",
    },
    {
      title: "Products Sold",
      value: "+12,234",
      icon: <Package className="h-6 w-6 text-muted-foreground" />,
      trend: "+19%",
      trendType: "increase",
    },
    {
      title: "Distributors",
      value: "45",
      icon: <Users className="h-6 w-6 text-muted-foreground" />,
      trend: "-2%",
      trendType: "decrease",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cardData.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
};

export default AdminCards;
