import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const samitis = [
  { name: "Radha Krishna Dugdha Samiti", revenue: "₹1,20,000", location: "Anand, Gujarat" },
  { name: "Gokul Dugdha Utpadak Sahakari Mandali", revenue: "₹98,500", location: "Kolhapur, Maharashtra" },
  { name: "Amul Dairy Cooperative Society", revenue: "₹2,50,000", location: "Anand, Gujarat" },
  { name: "Shreeja Mahila Milk Producer Company", revenue: "₹85,000", location: "Tirupati, Andhra Pradesh" },
  { name: "Warana Dairy", revenue: "₹76,000", location: "Warana Nagar, Maharashtra" },
];

const distributors = [
  { name: "Krishna Distributors", sales: "₹5,40,000", location: "Mumbai, Maharashtra", performance: "up" },
  { name: "Radhe Dairy", sales: "₹4,80,000", location: "Pune, Maharashtra", performance: "up" },
  { name: "Gopal Dairy Products", sales: "₹4,20,000", location: "Ahmedabad, Gujarat", performance: "down" },
  { name: "Nandini Milk Agency", sales: "₹3,90,000", location: "Bengaluru, Karnataka", performance: "up" },
  { name: "Modern Dairy", sales: "₹3,50,000", location: "Delhi", performance: "down" },
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
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-foreground">Recent Samitis</h3>
          <Button
            variant="ghost"
            className="text-blue-500 hover:bg-blue-500/10"
            onClick={() => (window.location.href = "/admin/samitis")}
          >
            View All
          </Button>
        </div>
        <div className="space-y-4">
          {samitis.map((samiti, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100/50 transition-colors">
              <div>
                <p className="font-medium text-foreground">{samiti.name}</p>
                <p className="text-sm text-muted-foreground">{samiti.location}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground">{samiti.revenue}</p>
                <p className="text-sm text-muted-foreground">Revenue</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Distributors */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-foreground">Top Distributors</h3>
          <Button
            variant="ghost"
            className="text-blue-500 hover:bg-blue-500/10"
            onClick={() => (window.location.href = "/admin/distributors")}
          >
            View All
          </Button>
        </div>
        <div className="space-y-4">
          {distributors.map((distributor, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100/50 transition-colors">
              <div>
                <p className="font-medium text-foreground">{distributor.name}</p>
                <p className="text-sm text-muted-foreground">{distributor.location}</p>
              </div>
              <div className="text-right flex items-center">
                <p className="font-semibold text-foreground mr-2">{distributor.sales}</p>
                {distributor.performance === 'up' ? 
                  <ArrowUpRight className="h-5 w-5 text-green-500" /> :
                  <ArrowDownRight className="h-5 w-5 text-red-500" />
                }
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminLists;
