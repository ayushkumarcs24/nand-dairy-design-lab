import Sidebar from "@/components/layout/Sidebar";
import FarmerMobile from "@/components/layout/FarmerMobile";
import FarmerDesktop from "@/components/layout/FarmerDesktop";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { motion } from "framer-motion";

const MOCK_ROWS = [
  { date: "Oct 01, 2023", quantity: "150 L", fat: "4.1%", rate: "₹35.00", total: "₹5,250" },
  { date: "Oct 02, 2023", quantity: "145 L", fat: "4.3%", rate: "₹35.50", total: "₹5,147.50" },
  { date: "Oct 03, 2023", quantity: "152 L", fat: "4.2%", rate: "₹35.20", total: "₹5,350.40" },
  { date: "Oct 04, 2023", quantity: "148 L", fat: "4.0%", rate: "₹34.80", total: "₹5,150.40" },
  { date: "Oct 05, 2023", quantity: "155 L", fat: "4.4%", rate: "₹35.80", total: "₹5,549" },
];

const FarmerStatements = () => {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr] bg-[#fdfaf3]">
      <Sidebar />
      <div className="flex flex-col max-h-screen overflow-hidden">
        <FarmerMobile />
        <FarmerDesktop />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mx-auto flex max-w-6xl flex-col gap-8"
          >
            <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">
                  Nand Dairy Statement
                </p>
                <h1 className="mt-1 text-3xl font-extrabold text-slate-900 md:text-4xl">
                  Your October 2023 Statement
                </h1>
                <p className="mt-2 max-w-xl text-sm text-slate-500">
                  Here's a summary of your milk supply and earnings for the selected month.
                </p>
              </div>
              <div className="inline-flex items-center gap-3 rounded-full bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-amber-100">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span>October 2023</span>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </header>

            <section className="grid gap-4 md:grid-cols-4">
              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-amber-100">
                <p className="text-xs font-medium text-slate-500">Total Milk Supplied</p>
                <p className="mt-3 text-2xl font-bold text-slate-900">4,510 Liters</p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-amber-100">
                <p className="text-xs font-medium text-slate-500">Average Fat Content</p>
                <p className="mt-3 text-2xl font-bold text-slate-900">4.2%</p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-amber-100">
                <p className="text-xs font-medium text-slate-500">Total Earnings</p>
                <p className="mt-3 text-2xl font-bold text-slate-900">₹157,850</p>
              </div>
              <div className="rounded-2xl bg-[#e6f0ff] p-4 shadow-sm ring-1 ring-blue-100">
                <p className="text-xs font-medium text-slate-600">Net Payout</p>
                <p className="mt-3 text-2xl font-extrabold text-[#0053c7]">₹142,350</p>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.7fr_minmax(0,1fr)]">
              <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-amber-100 md:p-6">
                <h2 className="text-base font-semibold text-slate-900">Daily Milk Submissions</h2>
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-amber-100 text-xs uppercase tracking-wide text-slate-500">
                        <th className="py-2 pr-6">Date</th>
                        <th className="py-2 pr-6">Quantity</th>
                        <th className="py-2 pr-6">Fat %</th>
                        <th className="py-2 pr-6">Rate</th>
                        <th className="py-2 text-right">Daily Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_ROWS.map((row) => (
                        <tr key={row.date} className="border-b border-amber-50 text-slate-700 last:border-0">
                          <td className="py-2 pr-6 text-sm">{row.date}</td>
                          <td className="py-2 pr-6 text-sm">{row.quantity}</td>
                          <td className="py-2 pr-6 text-sm">{row.fat}</td>
                          <td className="py-2 pr-6 text-sm">{row.rate}</td>
                          <td className="py-2 text-right text-sm font-medium">{row.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-amber-100">
                  <h2 className="text-base font-semibold text-slate-900">Earnings &amp; Deductions</h2>
                  <dl className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <dt className="text-slate-500">Total Earnings</dt>
                      <dd className="font-semibold text-slate-900">₹157,850.00</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-slate-500">Feed Supply</dt>
                      <dd className="font-semibold text-red-500">- ₹12,500.00</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-slate-500">Advance Payment</dt>
                      <dd className="font-semibold text-red-500">- ₹3,000.00</dd>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-amber-100 pt-3">
                      <dt className="text-sm font-semibold text-slate-900">Net Payout</dt>
                      <dd className="text-lg font-extrabold text-[#0053c7]">₹142,350.00</dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-2xl bg-[#0053c7] p-5 text-white shadow-md shadow-blue-300">
                  <p className="text-sm font-medium">Need a copy for your records?</p>
                  <p className="mt-1 text-xs text-blue-100">
                    Download a detailed receipt of this month's statement.
                  </p>
                  <Button
                    type="button"
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-semibold text-[#0053c7] hover:bg-blue-50"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Receipt</span>
                  </Button>
                </div>
              </div>
            </section>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default FarmerStatements;
