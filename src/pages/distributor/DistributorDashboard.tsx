import { motion } from "framer-motion";
import DistributorSidebar from "@/components/layout/DistributorSidebar";
import DistributorMobile from "@/components/layout/DistributorMobile";
import DistributorDesktop from "@/components/layout/DistributorDesktop";
import { ArrowUpRight, ArrowDownRight, IndianRupee, ShoppingBag, Boxes, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const summaryCards = [
  {
    title: "Total Pending Dues",
    value: "₹1,25,430",
    change: "+5.2%",
    positive: true,
  },
  {
    title: "Orders This Week",
    value: "82",
    change: "-1.5%",
    positive: false,
  },
  {
    title: "Top Selling Product",
    value: "Organic Milk",
    change: "+12%",
    positive: true,
  },
];

const orders = [
  { id: "#NDB456", customer: "Rohan Sharma", amount: "₹1,250", status: "Pending" },
  { id: "#NDB455", customer: "Priya Patel", amount: "₹875", status: "Paid" },
  { id: "#NDB454", customer: "Amit Singh", amount: "₹2,100", status: "Delivered" },
  { id: "#NDB453", customer: "Sunita Gupta", amount: "₹550", status: "Pending" },
  { id: "#NDB452", customer: "Vikram Kumar", amount: "₹3,420", status: "Paid" },
];

const catalog = [
  {
    name: "Organic Whole Milk",
    price: "₹70 / litre",
    image: "/images/distributor/organic-milk.jpg",
  },
  {
    name: "Artisanal Cheese",
    price: "₹450 / block",
    image: "/images/distributor/artisanal-cheese.jpg",
  },
  {
    name: "Fresh Cream",
    price: "₹120 / 250ml",
    image: "/images/distributor/fresh-cream.jpg",
  },
  {
    name: "Greek Yogurt",
    price: "₹95 / cup",
    image: "/images/distributor/greek-yogurt.jpg",
  },
];

const statusStyles: Record<string, string> = {
  Pending: "bg-amber-50 text-amber-700 border border-amber-200",
  Paid: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Delivered: "bg-sky-50 text-sky-700 border border-sky-200",
};

const DistributorDashboard = () => {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[260px_1fr] bg-[#FFF9F0]">
      <DistributorSidebar />
      <div className="flex flex-col max-h-screen overflow-hidden">
        <DistributorMobile />
        <DistributorDesktop />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mx-auto flex max-w-6xl flex-col gap-8"
          >
            {/* Header */}
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl md:text-4xl font-semibold text-slate-900">
                Welcome back, Ankit!
              </h2>
              <p className="text-slate-500 text-sm md:text-base">
                Here’s a summary of your activity today.
              </p>
            </div>

            {/* Summary cards */}
            <div className="grid gap-4 md:grid-cols-3">
              {summaryCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl bg-white shadow-sm border border-amber-50 px-5 py-4 flex flex-col justify-between"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    {card.title}
                  </p>
                  <div className="mt-3 flex items-end justify-between gap-2">
                    <div>
                      <p className="text-2xl md:text-3xl font-semibold text-slate-900">
                        {card.value}
                      </p>
                      <div className="mt-1 flex items-center gap-1 text-xs">
                        {card.positive ? (
                          <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 text-rose-500" />
                        )}
                        <span
                          className={card.positive ? "text-emerald-600" : "text-rose-600"}
                        >
                          {card.change}
                        </span>
                        <span className="text-slate-400">vs last week</span>
                      </div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-700">
                      {card.title.includes("Dues") && (
                        <IndianRupee className="h-4 w-4" />
                      )}
                      {card.title.includes("Orders") && (
                        <ShoppingBag className="h-4 w-4" />
                      )}
                      {card.title.includes("Product") && (
                        <TrendingUp className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Content grid */}
            <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)] items-start">
              {/* Pending payments & recent orders */}
              <section className="rounded-2xl bg-white border border-amber-50 shadow-sm">
                <header className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-base md:text-lg font-semibold text-slate-900">
                      Pending Payments & Recent Orders
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Track dues and fulfillment status at a glance.
                    </p>
                  </div>
                  <Button size="sm" variant="outline" className="rounded-full text-xs">
                    View All Orders
                  </Button>
                </header>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-xs text-slate-500">
                        <th className="text-left px-6 py-3 font-medium">Order ID</th>
                        <th className="text-left px-4 py-3 font-medium">Customer Name</th>
                        <th className="text-right px-4 py-3 font-medium">Due Amount</th>
                        <th className="text-left px-6 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order, index) => (
                        <tr
                          key={order.id}
                          className={index % 2 === 0 ? "bg-white" : "bg-slate-50/60"}
                        >
                          <td className="px-6 py-3 text-slate-900 font-medium">
                            {order.id}
                          </td>
                          <td className="px-4 py-3 text-slate-700">{order.customer}</td>
                          <td className="px-4 py-3 text-right text-slate-900 font-medium">
                            {order.amount}
                          </td>
                          <td className="px-6 py-3">
                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                              statusStyles[order.status]
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Product catalog */}
              <section className="rounded-2xl bg-white border border-amber-50 shadow-sm flex flex-col">
                <header className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-base md:text-lg font-semibold text-slate-900">
                      Explore Product Catalog
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Quick access to your top products.
                    </p>
                  </div>
                  <Button size="sm" className="rounded-full bg-[#0B3B2C] hover:bg-[#09422F] text-xs">
                    Add New Product
                  </Button>
                </header>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-6 py-5">
                  {catalog.map((item) => (
                    <div
                      key={item.name}
                      className="rounded-2xl border border-slate-100 bg-slate-50/40 overflow-hidden flex flex-col"
                    >
                      <div className="aspect-[4/3] w-full bg-slate-200 overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>
                      <div className="px-4 py-3 flex flex-col gap-1">
                        <p className="text-sm font-semibold text-slate-900">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-500">{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DistributorDashboard;
