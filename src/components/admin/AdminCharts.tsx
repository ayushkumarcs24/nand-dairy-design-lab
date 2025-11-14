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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminCharts = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-8">
      <motion.div 
        className="lg:col-span-3 glass-card rounded-2xl p-6" 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="font-semibold text-lg text-foreground mb-4">Sales Trends (Last 6 Months)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.1)" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#6B7280' }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6B7280' }} tickFormatter={(value) => `₹${value / 1000}k`} />
            <Tooltip 
              cursor={{ fill: 'rgba(63, 131, 248, 0.1)' }}
              contentStyle={{ 
                border: 'none',
                borderRadius: '12px',
              }}
            />
            <Legend iconType="circle" />
            <Bar dataKey="revenue" fill="#3B82F6" name="Revenue" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
      <motion.div 
        className="lg:col-span-2 glass-card rounded-2xl p-6" 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="font-semibold text-lg text-foreground mb-4">Product Category Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={productData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
            >
              {productData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                border: 'none',
                borderRadius: '12px',
              }}
            />
            <Legend iconType="circle"/>
          </PieChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default AdminCharts;
