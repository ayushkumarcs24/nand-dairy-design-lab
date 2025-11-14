import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import FarmerMobile from "@/components/layout/FarmerMobile";
import FarmerDesktop from "@/components/layout/FarmerDesktop";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const FarmerDailyEntry = () => {
  const [session, setSession] = useState<"morning" | "evening">("morning");
  const [farmerId, setFarmerId] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now just log the values; can be wired to API later.
    console.log("Daily milk entry submitted", { session, farmerId, quantity });
  };

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr] bg-[#f5f7fb]">
      <Sidebar />
      <div className="flex flex-col max-h-screen overflow-hidden">
        <FarmerMobile />
        <FarmerDesktop />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row"
          >
            <section className="flex-1">
              <header className="mb-6">
                <p className="text-sm font-medium text-blue-500">Nand Dairy · Farmer Portal</p>
                <h1 className="mt-1 text-3xl font-bold text-slate-900 md:text-4xl">
                  Daily Milk Entry
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  Enter today's collection data to see your earnings and quality insights instantly.
                </p>
              </header>

              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 md:p-8">
                <div className="mb-6 flex rounded-full bg-slate-50 p-1 text-sm font-medium text-slate-500">
                  <button
                    type="button"
                    onClick={() => setSession("morning")}
                    className={`flex-1 rounded-full px-4 py-2 transition-all ${
                      session === "morning" ? "bg-white text-slate-900 shadow-sm" : "hover:text-slate-700"
                    }`}
                  >
                    Morning
                  </button>
                  <button
                    type="button"
                    onClick={() => setSession("evening")}
                    className={`flex-1 rounded-full px-4 py-2 transition-all ${
                      session === "evening" ? "bg-white text-slate-900 shadow-sm" : "hover:text-slate-700"
                    }`}
                  >
                    Evening
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700" htmlFor="farmerId">
                      Farmer ID
                    </label>
                    <Input
                      id="farmerId"
                      value={farmerId}
                      onChange={(e) => setFarmerId(e.target.value)}
                      placeholder="Enter your Farmer ID"
                      className="h-11 rounded-xl border-slate-200 bg-slate-50/60 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700" htmlFor="quantity">
                      Milk Quantity (Liters)
                    </label>
                    <Input
                      id="quantity"
                      type="number"
                      min="0"
                      step="0.1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="e.g., 25.5"
                      className="h-11 rounded-xl border-slate-200 bg-slate-50/60 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-200"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#008cff] text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:bg-[#0074d9] hover:shadow-lg"
                  >
                    <span className="text-base">▶</span>
                    <span>Submit Data</span>
                  </Button>
                </form>
              </div>
            </section>

            <aside className="mt-4 w-full space-y-4 lg:mt-10 lg:w-80">
              <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                <h2 className="text-sm font-semibold text-slate-700">Today's Analysis &amp; Earnings</h2>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-50 p-4">
                    <span className="text-xs font-medium text-slate-500">FAT</span>
                    <span className="mt-1 text-2xl font-bold text-slate-900">4.2%</span>
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-50 p-4">
                    <span className="text-xs font-medium text-slate-500">SNF</span>
                    <span className="mt-1 text-2xl font-bold text-slate-900">8.5%</span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-[#fef7e8] p-6 shadow-sm ring-1 ring-amber-100">
                <p className="text-xs font-medium uppercase tracking-wide text-amber-700">
                  Today's Earnings
                </p>
                <p className="mt-3 text-4xl font-extrabold text-[#008cff]">
                  ₹918
                </p>
                <p className="mt-1 text-xs text-amber-700/80">
                  Based on today's milk quantity and quality. Actual payout may vary.
                </p>
              </div>
            </aside>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default FarmerDailyEntry;
