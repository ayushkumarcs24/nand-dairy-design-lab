import DistributorSidebar from "@/components/layout/DistributorSidebar";
import DistributorMobile from "@/components/layout/DistributorMobile";
import DistributorDesktop from "@/components/layout/DistributorDesktop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const featuredProducts = [
  {
    name: "Fresh Milk Pack",
    description: "Rich and full-cream milk",
    price: 3.0,
  },
  {
    name: "Malai Paneer",
    description: "Soft and fresh cottage cheese",
    price: 6.5,
  },
  {
    name: "Creamy Dahi",
    description: "Thick and creamy curd",
    price: 2.5,
  },
];

const catalogueProducts = [
  {
    name: "Pure Cow Ghee (500ml)",
    priceLabel: "$12.50",
  },
  {
    name: "Table Butter (200g)",
    priceLabel: "$4.00",
  },
  {
    name: "Mango Lassi (1L)",
    priceLabel: "$5.50",
  },
  {
    name: "Sweet Lassi (1L)",
    priceLabel: "$4.80",
  },
];

const DistributorOrders = () => {
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
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-semibold text-slate-900">
                  Create Your Next Order
                </h2>
                <p className="mt-2 text-slate-500 text-sm md:text-base max-w-xl">
                  Select from our premium range of dairy products.
                </p>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)] items-start">
              {/* Left column: featured cards & catalogue */}
              <div className="space-y-8">
                <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {featuredProducts.map((product) => (
                    <div
                      key={product.name}
                      className="rounded-2xl bg-white shadow-sm border border-amber-50 flex flex-col overflow-hidden"
                    >
                      <div className="h-36 bg-gradient-to-br from-amber-100 via-white to-amber-50" />
                      <div className="p-4 flex flex-col gap-2 flex-1">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {product.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {product.description}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          className="mt-auto rounded-full bg-[#E5B75C] hover:bg-[#d5a84e] text-slate-900 text-xs font-semibold"
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  ))}
                </section>

                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Full Product Catalogue
                    </h3>
                  </div>
                  <div className="relative max-w-md">
                    <Input
                      placeholder="Search by product name..."
                      className="bg-white border border-amber-100 shadow-sm text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {catalogueProducts.map((product) => (
                      <div
                        key={product.name}
                        className="rounded-2xl bg-white border border-amber-50 p-4 flex flex-col gap-2"
                      >
                        <div className="h-28 rounded-xl bg-amber-50 mb-2" />
                        <p className="text-sm font-semibold text-slate-900">
                          {product.name}
                        </p>
                        <p className="text-xs text-amber-600 font-medium">
                          {product.priceLabel}
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-auto rounded-full border-amber-200 text-xs"
                        >
                          Add to Cart
                        </Button>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Right column: order summary */}
              <aside className="rounded-2xl bg-white border border-amber-50 shadow-sm p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Your Order</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Review quantities and pricing before placing the order.
                  </p>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Fresh Milk Pack</p>
                      <p className="text-xs text-slate-500">Qty: 2</p>
                    </div>
                    <p className="font-semibold text-slate-900">$3.00</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Malai Paneer</p>
                      <p className="text-xs text-slate-500">Qty: 1</p>
                    </div>
                    <p className="font-semibold text-slate-900">$6.50</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>$9.50</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Taxes</span>
                    <span>$0.85</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Pending Dues</span>
                    <span>$55.00</span>
                  </div>
                  <div className="flex items-center justify-between font-semibold text-slate-900 text-base mt-2">
                    <span>Total</span>
                    <span>$65.35</span>
                  </div>
                </div>

                <Button className="w-full rounded-full bg-[#E5B75C] hover:bg-[#d5a84e] text-slate-900 font-semibold">
                  Place Order
                </Button>
              </aside>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DistributorOrders;
