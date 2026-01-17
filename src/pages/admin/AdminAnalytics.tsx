import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminMobile from "@/components/layout/AdminMobile";
import AdminDesktop from "@/components/layout/AdminDesktop";
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, DollarSign, Package, Users, ShoppingCart } from 'lucide-react';

const COLORS = ['#3B82F6', '#6366F1', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#14B8A6'];

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
        } as any
    }
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-xl">
                <p className="font-semibold text-slate-700 dark:text-slate-200 mb-1">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} className="text-blue-600 dark:text-blue-400 font-bold">
                        {entry.name}: {typeof entry.value === 'number' && entry.name.toLowerCase().includes('revenue') ? `₹${entry.value}` : entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const StatCard = ({ title, value, icon, trend, trendType, color }: any) => (
    <motion.div
        className="glass-card rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group"
        variants={itemVariants}
        whileHover={{ y: -5, boxShadow: "0 20px 40px -10px rgba(59, 130, 246, 0.15)" }}
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
                    {trendType === 'increase' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
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

const AdminAnalytics = () => {
    // Fetch analytics data
    const { data: monthlyRevenue, isLoading: loadingRevenue } = useQuery({
        queryKey: ['analytics-monthly-revenue'],
        queryFn: async () => {
            const response = await api.get<any[]>('/owner/analytics/monthly-revenue');
            return response.data;
        },
    });

    const { data: productDistribution, isLoading: loadingProducts } = useQuery({
        queryKey: ['analytics-product-distribution'],
        queryFn: async () => {
            const response = await api.get<any[]>('/owner/analytics/product-distribution');
            return response.data;
        },
    });

    const { data: milkTrends, isLoading: loadingMilk } = useQuery({
        queryKey: ['analytics-milk-trends'],
        queryFn: async () => {
            const response = await api.get<any[]>('/owner/analytics/milk-trends');
            return response.data;
        },
    });

    // Sample stats for demo
    const stats = [
        {
            title: "Total Revenue",
            value: `₹${monthlyRevenue?.reduce((sum: number, item: any) => sum + item.revenue, 0)?.toLocaleString() || '0'}`,
            icon: <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
            trend: "+24%",
            trendType: "increase",
            color: "bg-emerald-500",
        },
        {
            title: "Products Sold",
            value: productDistribution?.reduce((sum: number, item: any) => sum + item.value, 0) || 0,
            icon: <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
            trend: "+12%",
            trendType: "increase",
            color: "bg-blue-500",
        },
        {
            title: "Active Distributors",
            value: "15",
            icon: <Users className="h-6 w-6 text-violet-600 dark:text-violet-400" />,
            trend: "+5%",
            trendType: "increase",
            color: "bg-violet-500",
        },
        {
            title: "Total Orders",
            value: "248",
            icon: <ShoppingCart className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
            trend: "+18%",
            trendType: "increase",
            color: "bg-indigo-500",
        },
    ];

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
                                    Analytics
                                </h1>
                                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                                    Comprehensive business insights and performance metrics.
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

                        {/* Key Metrics */}
                        <motion.div variants={itemVariants}>
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                                {stats.map((stat, index) => (
                                    <StatCard key={index} {...stat} />
                                ))}
                            </div>
                        </motion.div>

                        {/* Revenue Trends */}
                        <motion.div variants={itemVariants}>
                            <div className="glass-card rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold text-xl text-slate-800 dark:text-white">Monthly Revenue Trends</h3>
                                    <select className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-3 py-1 text-sm font-medium text-slate-600 dark:text-slate-300 focus:ring-2 focus:ring-blue-500">
                                        <option>Last 6 Months</option>
                                        <option>Last Year</option>
                                    </select>
                                </div>
                                {loadingRevenue ? (
                                    <Skeleton className="h-[350px] w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
                                ) : (
                                    <ResponsiveContainer width="100%" height={350}>
                                        <BarChart data={monthlyRevenue || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                                            <XAxis
                                                dataKey="name"
                                                tickLine={false}
                                                axisLine={false}
                                                tick={{ fill: '#64748B', fontSize: 12 }}
                                                dy={10}
                                            />
                                            <YAxis
                                                tickLine={false}
                                                axisLine={false}
                                                tick={{ fill: '#64748B', fontSize: 12 }}
                                                tickFormatter={(value) => `₹${value / 1000}k`}
                                            />
                                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} />
                                            <Bar
                                                dataKey="revenue"
                                                radius={[6, 6, 0, 0]}
                                                barSize={40}
                                            >
                                                {(monthlyRevenue || []).map((entry: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3B82F6' : '#60A5FA'} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </motion.div>

                        {/* Product Distribution and Milk Trends */}
                        <motion.div variants={itemVariants}>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Product Distribution */}
                                <div className="glass-card rounded-2xl p-6">
                                    <h3 className="font-bold text-xl text-slate-800 dark:text-white mb-6">Product Distribution</h3>
                                    {loadingProducts ? (
                                        <Skeleton className="h-[350px] w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
                                    ) : productDistribution && productDistribution.length > 0 ? (
                                        <div className="relative h-[350px] w-full flex items-center justify-center">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={productDistribution}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={70}
                                                        outerRadius={100}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                    >
                                                        {productDistribution.map((entry: any, index: number) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip content={<CustomTooltip />} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                                <span className="text-3xl font-bold text-slate-800 dark:text-white">
                                                    {productDistribution.reduce((sum: number, item: any) => sum + item.value, 0)}
                                                </span>
                                                <span className="text-sm text-slate-500 dark:text-slate-400">Total Units</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-[350px] flex items-center justify-center">
                                            <p className="text-slate-500 dark:text-slate-400">No product data available</p>
                                        </div>
                                    )}
                                </div>

                                {/* Milk Collection Trends */}
                                <div className="glass-card rounded-2xl p-6">
                                    <h3 className="font-bold text-xl text-slate-800 dark:text-white mb-6">Milk Collection Trends</h3>
                                    {loadingMilk ? (
                                        <Skeleton className="h-[350px] w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
                                    ) : (
                                        <ResponsiveContainer width="100%" height={350}>
                                            <LineChart data={milkTrends || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                                                <XAxis
                                                    dataKey="name"
                                                    tickLine={false}
                                                    axisLine={false}
                                                    tick={{ fill: '#64748B', fontSize: 12 }}
                                                    dy={10}
                                                />
                                                <YAxis
                                                    tickLine={false}
                                                    axisLine={false}
                                                    tick={{ fill: '#64748B', fontSize: 12 }}
                                                    tickFormatter={(value) => `${value}L`}
                                                />
                                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(59, 130, 246, 0.1)', strokeWidth: 2 }} />
                                                <Line
                                                    type="monotone"
                                                    dataKey="litres"
                                                    stroke="#3B82F6"
                                                    strokeWidth={3}
                                                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                                                    activeDot={{ r: 6 }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default AdminAnalytics;
