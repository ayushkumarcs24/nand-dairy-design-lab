import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getOwnerDistributors, OwnerDistributorSummary } from "@/lib/api";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminMobile from "@/components/layout/AdminMobile";
import AdminDesktop from "@/components/layout/AdminDesktop";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const PAGE_SIZE = 10;

const AdminDistributors = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["owner-distributors"],
    queryFn: getOwnerDistributors,
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const list = data ?? [];
    const term = search.trim().toLowerCase();
    if (!term) return list;
    return list.filter((d) =>
      [d.name, d.email].join(" ").toLowerCase().includes(term),
    );
  }, [data, search]);

  const pageCount = Math.ceil((filtered.length || 1) / PAGE_SIZE);
  const pageItems = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handlePrev = () => setPage((p) => Math.max(0, p - 1));
  const handleNext = () => setPage((p) => Math.min(pageCount - 1, p + 1));

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr] bg-gradient-to-br from-blue-50 via-white to-blue-100 font-sans">
      <AdminSidebar />
      <div className="flex flex-col max-h-screen overflow-hidden">
        <AdminMobile />
        <AdminDesktop />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
          <div className="mx-auto flex max-w-6xl flex-col gap-6">
            <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Distributors</h1>
                <p className="text-sm text-slate-500">Track key partners and their total orders.</p>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Search distributors by name or email..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(0);
                  }}
                  className="w-64 bg-white/70 border-slate-200"
                />
              </div>
            </header>

            <section className="rounded-3xl bg-white/80 p-4 md:p-6 shadow-sm ring-1 ring-slate-100">
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-right">Total Orders</TableHead>
                        <TableHead className="text-right">Total Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pageItems.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="py-6 text-center text-sm text-slate-400">
                            No distributors found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        pageItems.map((d: OwnerDistributorSummary) => (
                          <TableRow key={d.id} className="hover:bg-slate-50/70">
                            <TableCell className="font-medium text-slate-900">{d.name}</TableCell>
                            <TableCell className="text-sm text-slate-700">{d.email}</TableCell>
                            <TableCell className="text-right text-sm">{d.totalOrders}</TableCell>
                            <TableCell className="text-right text-sm">
                              ₹ {d.totalValue.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Page {page + 1} of {pageCount || 1}
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handlePrev} disabled={page === 0}>
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNext}
                    disabled={page + 1 >= pageCount}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDistributors;
