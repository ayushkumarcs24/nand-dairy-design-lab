import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const FarmerDailyAndSummary = () => {
  const navigate = useNavigate();

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_minmax(0,1fr)]">
      {/* Daily entries table */}
      <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100 md:p-6">
        <h2 className="text-base font-semibold text-slate-900">Daily Entries</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
                <th className="py-2 pr-6">Time</th>
                <th className="py-2 pr-6">Quantity (Ltr)</th>
                <th className="py-2 pr-6">FAT %</th>
                <th className="py-2 pr-6">SNF %</th>
                <th className="py-2 text-right">Earnings (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-50 text-slate-700">
                <td className="py-3 pr-6 text-xs font-medium text-slate-500">Morning Shift</td>
                <td className="py-3 pr-6 text-sm">45.0</td>
                <td className="py-3 pr-6 text-sm">4.2</td>
                <td className="py-3 pr-6 text-sm">8.8</td>
                <td className="py-3 text-right text-sm font-semibold">₹ 650.25</td>
              </tr>
              <tr className="text-slate-700">
                <td className="py-3 pr-6 text-xs font-medium text-slate-500">Evening Shift</td>
                <td className="py-3 pr-6 text-sm">40.5</td>
                <td className="py-3 pr-6 text-sm">4.1</td>
                <td className="py-3 pr-6 text-sm">8.7</td>
                <td className="py-3 text-right text-sm font-semibold">₹ 800.50</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Month-end summary */}
      <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100 md:p-6">
        <h2 className="text-base font-semibold text-slate-900">Month-End Summary</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-slate-500">Total Earnings (MTD)</dt>
            <dd className="text-lg font-extrabold text-slate-900">₹ 28,145.60</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-slate-500">Total Milk Supplied (MTD)</dt>
            <dd className="text-lg font-extrabold text-slate-900">1985.5 Ltrs</dd>
          </div>
        </dl>
        <Button
          type="button"
          className="mt-6 flex w-full items-center justify-center rounded-xl bg-[#2563eb] text-sm font-semibold text-white shadow-md hover:bg-[#1d4ed8]"
          onClick={() => navigate("/farmer/statements")}
        >
          Download Full Statement
        </Button>
      </div>
    </section>
  );
};

export default FarmerDailyAndSummary;
