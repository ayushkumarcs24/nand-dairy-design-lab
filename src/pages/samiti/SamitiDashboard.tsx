import { motion } from "framer-motion";
import { ChevronDown, Download, ArrowUpRight } from "lucide-react";

const days = [
  1, 2, 3, 4, 5,
  6, 7, 8, 9, 10,
  11, 12, 13, 14, 15,
  16, 17, 18, 19, 20,
  21, 22, 23, 24, 25,
  26, 27, 28, 29, 30, 31,
];

const weeklyTabs = ["W1", "W2", "W3", "W4"];

const topProducers = [
  { name: "Ramesh Patel", volume: "4,210 Ltr" },
  { name: "Vikram Singh", volume: "3,985 Ltr" },
  { name: "Priya Devi", volume: "3,850 Ltr" },
  { name: "Arjun Kumar", volume: "3,760 Ltr" },
];

const SamitiDashboard = () => {
  return (
    <div className="min-h-screen w-full bg-[#FFF9ED] text-[#1F2933]">
      {/* Top navigation */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white text-sm font-semibold">
            ND
          </div>
          <span className="text-base font-semibold tracking-tight">Nand Dairy</span>
        </div>
        <nav className="hidden items-center gap-8 text-sm text-neutral-500 md:flex">
          <button className="text-neutral-900 font-medium">Dashboard</button>
          <button className="hover:text-neutral-900">Reports</button>
          <button className="hover:text-neutral-900">Profile</button>
        </nav>
        <div className="flex items-center gap-3 text-right">
          <div>
            <p className="text-xs text-neutral-400">Samiti Head</p>
            <p className="text-sm font-semibold">Sunita Sharma</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-[url('https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg')] bg-cover bg-center" />
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-10 pt-4 lg:flex-row">
        {/* Left: Monthly payout overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1"
        >
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-1">
                Monthly Payout Overview
              </h1>
              <p className="text-sm text-neutral-500 max-w-md">
                View your daily milk collection and estimated earnings for October 2024.
              </p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium shadow-sm">
              October 2024
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          {/* Summary cards */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl bg-white p-4 sm:p-5 shadow-sm">
              <p className="text-xs font-medium text-neutral-400 mb-2">Total Milk Collected</p>
              <p className="text-2xl font-semibold tracking-tight">35,678 <span className="text-sm font-medium text-neutral-400">Ltr</span></p>
              <p className="mt-3 text-xs font-medium text-emerald-600">+5.2% vs last month</p>
            </div>
            <div className="rounded-3xl bg-white p-4 sm:p-5 shadow-sm">
              <p className="text-xs font-medium text-neutral-400 mb-2">Estimated Payout</p>
              <p className="text-2xl font-semibold tracking-tight">₹1,24,870</p>
              <p className="mt-3 text-xs font-medium text-emerald-600">+4.8% vs last month</p>
            </div>
            <div className="rounded-3xl bg-white p-4 sm:p-5 shadow-sm">
              <p className="text-xs font-medium text-neutral-400 mb-2">Average Fat %</p>
              <p className="text-2xl font-semibold tracking-tight">4.2%</p>
              <p className="mt-3 text-xs font-medium text-rose-500">-0.1% vs last month</p>
            </div>
            <div className="rounded-3xl bg-white p-4 sm:p-5 shadow-sm">
              <p className="text-xs font-medium text-neutral-400 mb-2">Total SNF</p>
              <p className="text-2xl font-semibold tracking-tight">3,141 <span className="text-sm font-medium text-neutral-400">Kg</span></p>
              <p className="mt-3 text-xs font-medium text-emerald-600">+5.1% vs last month</p>
            </div>
          </div>

          {/* Calendar grid */}
          <div className="rounded-3xl bg-white p-4 sm:p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between text-xs font-medium text-neutral-400">
              <div className="flex gap-6">
                <span>SUN</span>
                <span>MON</span>
                <span>TUE</span>
                <span>WED</span>
                <span>THU</span>
                <span>FRI</span>
                <span>SAT</span>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2 text-xs">
              {days.map((day) => (
                <div
                  key={day}
                  className="flex flex-col items-center justify-center rounded-2xl bg-[#FBF2DF] px-2 py-3 text-[11px] font-medium text-neutral-600 shadow-[0_1px_0_rgba(0,0,0,0.02)]"
                >
                  <span className="mb-1 text-[10px] text-neutral-400">{day}</span>
                  <span>{(1100 + day * 3.7).toFixed(1)} </span>
                  <span className="mt-0.5 text-[10px] text-neutral-400">Ltr</span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Right: Monthly summary card */}
        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full max-w-md shrink-0"
        >
          <div className="rounded-3xl bg-white p-5 shadow-sm lg:sticky lg:top-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold tracking-tight">Monthly Summary</h2>
                <p className="text-xs text-neutral-400 mt-1">Weekly Collection Trend</p>
              </div>
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>

            {/* Weekly tabs placeholder */}
            <div className="mb-6 inline-flex rounded-full bg-neutral-100 p-1 text-xs font-medium">
              {weeklyTabs.map((tab, index) => (
                <button
                  key={tab}
                  className={`rounded-full px-3 py-1 ${
                    index === 1 ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Placeholder mini chart */}
            <div className="mb-6 h-24 w-full rounded-2xl bg-gradient-to-r from-amber-100 via-amber-50 to-emerald-50" />

            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Top Producers</h3>
              <span className="text-xs text-neutral-400">This month</span>
            </div>

            <div className="space-y-3">
              {topProducers.map((producer, idx) => (
                <div key={producer.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-[11px] font-semibold">
                      {producer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="font-medium text-neutral-800">{producer.name}</p>
                      <p className="text-[11px] text-neutral-400">Farmer #{1024 + idx}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-neutral-800">{producer.volume}</p>
                </div>
              ))}
            </div>

            <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#F5C521] py-2.5 text-sm font-semibold text-neutral-900 shadow-md hover:bg-[#F2B800] transition-colors">
              <Download className="h-4 w-4" />
              Generate Report
            </button>
          </div>
        </motion.aside>
      </main>
    </div>
  );
};

export default SamitiDashboard;
