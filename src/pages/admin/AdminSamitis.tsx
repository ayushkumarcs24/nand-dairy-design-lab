import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getOwnerSamitis, OwnerSamitiSummary } from "@/lib/api";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminMobile from "@/components/layout/AdminMobile";
import AdminDesktop from "@/components/layout/AdminDesktop";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const PAGE_SIZE = 10;

const AdminSamitis = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["owner-samitis"],
    queryFn: getOwnerSamitis,
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const list = data ?? [];
    const term = search.trim().toLowerCase();
    if (!term) return list;
    return list.filter((s) =>
      [s.name, s.code, s.location, s.contactName, s.contactEmail]
        .join(" ")
        .toLowerCase()
        .includes(term),
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
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Samitis</h1>
                <p className="text-sm text-slate-500">Overview of all registered samiti partners.</p>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Search samitis by name, code, location..."
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
                        <TableHead>Code</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead className="text-right">Latest Payout</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pageItems.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="py-6 text-center text-sm text-slate-400">
                            No samitis found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        pageItems.map((s: OwnerSamitiSummary) => (
                          <TableRow key={s.id} className="hover:bg-slate-50/70">
                            <TableCell className="font-medium text-slate-900">{s.name}</TableCell>
                            <TableCell className="text-xs text-slate-500">{s.code}</TableCell>
                            <TableCell className="text-sm text-slate-700">{s.location}</TableCell>
                            <TableCell className="text-sm text-slate-700">
                              <div>{s.contactName}</div>
                              <div className="text-xs text-slate-500">{s.contactEmail}</div>
                            </TableCell>
                            <TableCell className="text-right text-sm">
                              {s.latestYear && s.latestMonth ? (
                                <div className="flex flex-col items-end">
                                  <span className="font-semibold">
                                    ₹ {s.latestTotalPayout.toFixed(2)}
                                  </span>
                                  <span className="text-xs text-slate-400">
                                    {s.latestMonth}/{s.latestYear}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-xs text-slate-400">No data</span>
                              )}
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

export default AdminSamitis;
