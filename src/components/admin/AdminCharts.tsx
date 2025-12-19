import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';

const salesData = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 },
  { name: 'Apr', revenue: 4500 },
  { name: 'June', revenue: 6000 },
  { name: 'July', revenue: 5500 },
];

const productData = [
  { name: 'Milk', value: 400 },
  { name: 'Paneer', value: 300 },
  { name: 'Dahi', value: 300 },
  { name: 'Sweets', value: 200 },
];

const COLORS = ['#3B82F6', '#6366F1', '#8B5CF6', '#10B981'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-xl">
        <p className="font-semibold text-slate-700 dark:text-slate-200 mb-1">{label}</p>
        <p className="text-blue-600 dark:text-blue-400 font-bold">
          {payload[0].name === 'Revenue' ? `₹${payload[0].value}` : payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const AdminCharts = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-8">
      <motion.div
        className="lg:col-span-3 glass-card rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-xl text-slate-800 dark:text-white">Sales Trends</h3>
          <select className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-3 py-1 text-sm font-medium text-slate-600 dark:text-slate-300 focus:ring-2 focus:ring-blue-500">
            <option>Last 6 Months</option>
            <option>Last Year</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              fill="url(#colorRevenue)"
              radius={[6, 6, 0, 0]}
              barSize={40}
            >
              {salesData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3B82F6' : '#60A5FA'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        className="lg:col-span-2 glass-card rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="font-bold text-xl text-slate-800 dark:text-white mb-6">Product Distribution</h3>
        <div className="relative h-[350px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={productData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={110}
                paddingAngle={5}
                dataKey="value"
              >
                {productData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                formatter={(value) => <span className="text-slate-600 dark:text-slate-300 font-medium ml-1">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-slate-800 dark:text-white">1.2k</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">Total Units</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminCharts;
