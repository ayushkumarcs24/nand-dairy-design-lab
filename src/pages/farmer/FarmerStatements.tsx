import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { IndianRupee, Calendar, FileText } from "lucide-react";

interface FarmerPayout {
  id: number;
  payoutNumber: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: "PAID" | "UNPAID";
  createdAt: string;
}

export default function FarmerStatements() {
  const { data: payouts = [], isLoading } = useQuery<FarmerPayout[]>({
    queryKey: ["farmer-payouts"],
    queryFn: async () => {
      const res = await api.get<FarmerPayout[]>("/farmer/payouts");
      return res.data;
    },
  });

  const columns: ColumnDef<FarmerPayout>[] = [
    {
      accessorKey: "payoutNumber",
      header: "Statement #",
    },
    {
      accessorKey: "startDate",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Period Start" />,
      cell: ({ row }) => format(new Date(row.original.startDate), "MMM d, yyyy"),
    },
    {
      accessorKey: "endDate",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Period End" />,
      cell: ({ row }) => format(new Date(row.original.endDate), "MMM d, yyyy"),
    },
    {
      accessorKey: "totalAmount",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Amount (₹)" />,
      cell: ({ row }) => `₹${row.original.totalAmount.toFixed(2)}`,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${row.original.status === "PAID" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
            }`}
        >
          {row.original.status}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Generated On",
      cell: ({ row }) => format(new Date(row.original.createdAt), "MMM d, yyyy"),
    },
  ];

  const totalPaid = payouts
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + p.totalAmount, 0);

  const totalUnpaid = payouts
    .filter((p) => p.status === "UNPAID")
    .reduce((sum, p) => sum + p.totalAmount, 0);

  return (
    <div className="flex min-h-screen w-full bg-gray-50/50 dark:bg-gray-900/50">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center gap-4">
            <h1 className="font-semibold text-lg md:text-2xl">Monthly Statements</h1>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{totalPaid.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Payment</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{totalUnpaid.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Statements</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{payouts.length}</div>
              </CardContent>
            </Card>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              {isLoading ? (
                <div>Loading...</div>
              ) : (
                <DataTable columns={columns} data={payouts} searchKey="payoutNumber" searchPlaceholder="Search statement..." />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
