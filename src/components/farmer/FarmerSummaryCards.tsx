import { IndianRupee, Droplets, Gauge } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getFarmerDashboardSummary } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

const cardVariants = {
  hover: {
    y: -6,
    boxShadow: "0 20px 40px -16px rgba(15, 23, 42, 0.2)",
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const StatCard = ({
  title,
  value,
  helper,
  trend,
  trendType,
  icon,
}: {
  title: string;
  value: string;
  helper: string;
  trend: string;
  trendType: "up" | "down" | "neutral";
  icon: React.ReactNode;
}) => (
  <motion.div
    className="flex flex-col justify-between rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-slate-100"
    variants={cardVariants}
    whileHover="hover"
  >
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
          {title}
        </p>
        <p className="mt-2 text-2xl font-extrabold text-slate-900">{value}</p>
        <p className="mt-1 text-xs text-slate-400">{helper}</p>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-500">
        {icon}
      </div>
    </div>
    <p
      className={`mt-2 text-xs font-medium ${
        trendType === "up"
          ? "text-emerald-500"
          : trendType === "down"
          ? "text-rose-500"
          : "text-slate-400"
      }`}
    >
      {trend}
    </p>
  </motion.div>
);

const FarmerSummaryCards = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["farmer-dashboard-summary"],
    queryFn: getFarmerDashboardSummary,
  });

  const totalMilk = data?.totalMilk ?? 0;
  const totalEarnings = data?.totalEarnings ?? 0;
  const avgFat = data?.avgFat ?? 0;
  const avgSnf = data?.avgSnf ?? 0;

  const stats = [
    {
      title: "This Month's Earnings",
      value: `₹ ${totalEarnings.toFixed(2)}`,
      helper: "Calculated from submitted entries",
      trend: "Based on current month data",
      trendType: "up" as const,
      icon: <IndianRupee className="h-5 w-5" />,
    },
    {
      title: "Total Milk (MTD)",
      value: `${totalMilk.toFixed(1)} Ltrs`,
      helper: "All sessions this month",
      trend: "Updated after each entry",
      trendType: "neutral" as const,
      icon: <Droplets className="h-5 w-5" />,
    },
    {
      title: "Avg Quality (FAT/SNF)",
      value: `${avgFat.toFixed(1)}% / ${avgSnf.toFixed(1)}%`,
      helper: "From your actual records",
      trend: "Higher quality yields better price",
      trendType: "neutral" as const,
      icon: <Gauge className="h-5 w-5" />,
    },
  ];

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Dashboard
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Welcome, Farmer John
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Here is your daily performance summary.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            className="rounded-full border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Contact Support
          </Button>
          <Button className="rounded-full bg-[#2563eb] px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-[#1d4ed8]">
            View Detailed Reports
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton key={idx} className="h-32 rounded-2xl" />
            ))
          : stats.map((s) => <StatCard key={s.title} {...s} />)}
      </div>
    </section>
  );
};

export default FarmerSummaryCards;
