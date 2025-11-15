import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getFarmerDashboardSummary } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

const FarmerDailyAndSummary = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["farmer-dashboard-summary"],
    queryFn: getFarmerDashboardSummary,
  });

  const entries = data?.entries ?? [];
  const todayRows = entries.slice(0, 2);

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
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-4">
                    <Skeleton className="h-6 w-full" />
                  </td>
                </tr>
              ) : todayRows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-xs text-slate-400">
                    No entries yet. Submit your first daily entry.
                  </td>
                </tr>
              ) : (
                todayRows.map((entry) => (
                  <tr key={entry.id} className="border-b border-slate-50 text-slate-700 last:border-0">
                    <td className="py-3 pr-6 text-xs font-medium text-slate-500">
                      {entry.session === "MORNING" ? "Morning Shift" : "Evening Shift"}
                    </td>
                    <td className="py-3 pr-6 text-sm">{entry.quantityLitre.toFixed(1)}</td>
                    <td className="py-3 pr-6 text-sm">{entry.fat.toFixed(1)}</td>
                    <td className="py-3 pr-6 text-sm">{entry.snf.toFixed(1)}</td>
                    <td className="py-3 text-right text-sm font-semibold">
                      ₹ {entry.totalAmount.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
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
            <dd className="text-lg font-extrabold text-slate-900">
              {isLoading ? (
                <Skeleton className="h-5 w-24" />
              ) : (
                <>₹ {data?.totalEarnings.toFixed(2) ?? "0.00"}</>
              )}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-slate-500">Total Milk Supplied (MTD)</dt>
            <dd className="text-lg font-extrabold text-slate-900">
              {isLoading ? (
                <Skeleton className="h-5 w-24" />
              ) : (
                <>{data?.totalMilk.toFixed(1) ?? "0.0"} Ltrs</>
              )}
            </dd>
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
