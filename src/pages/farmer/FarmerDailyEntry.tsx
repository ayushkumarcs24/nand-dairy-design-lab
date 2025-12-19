import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Droplet, TrendingUp, IndianRupee } from "lucide-react";

interface MilkCollection {
  id: number;
  quantityLitre: number;
  fat: number;
  snf: number;
  totalAmount: number;
  collectionDate: string;
  shift: "MORNING" | "EVENING";
}

export default function FarmerDailyEntry() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [session, setSession] = useState<"MORNING" | "EVENING">("MORNING");
  const [quantity, setQuantity] = useState("");
  const [fat, setFat] = useState("");
  const [snf, setSnf] = useState("");

  const { data: collections = [], isLoading } = useQuery<MilkCollection[]>({
    queryKey: ["farmer-collections"],
    queryFn: async () => {
      const res = await api.get<MilkCollection[]>("/farmer/collections");
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: {
      session: "MORNING" | "EVENING";
      quantityLitre: number;
      fat: number;
      snf: number;
    }) => {
      await api.post("/farmer/collections", data);
    },
    onSuccess: () => {
      toast({ title: "Milk entry recorded successfully" });
      setQuantity("");
      setFat("");
      setSnf("");
      queryClient.invalidateQueries({ queryKey: ["farmer-dashboard-summary"] });
      queryClient.invalidateQueries({ queryKey: ["farmer-collections"] });
    },
    onError: (error: any) => {
      toast({ title: "Failed to record entry", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(quantity);
    const fatVal = parseFloat(fat);
    const snfVal = parseFloat(snf);

    if (!qty || !fatVal || !snfVal) {
      toast({ title: "Please fill all fields correctly", variant: "destructive" });
      return;
    }

    createMutation.mutate({
      session,
      quantityLitre: qty,
      fat: fatVal,
      snf: snfVal,
    });
  };

  const columns: ColumnDef<MilkCollection>[] = [
    {
      accessorKey: "collectionDate",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
      cell: ({ row }) => format(new Date(row.original.collectionDate), "MMM d, yyyy"),
    },
    {
      accessorKey: "shift",
      header: "Shift",
      cell: ({ row }) => (
        <span className={row.original.shift === "MORNING" ? "text-orange-500" : "text-blue-500"}>
          {row.original.shift}
        </span>
      ),
    },
    {
      accessorKey: "quantityLitre",
      header: "Qty (L)",
    },
    {
      accessorKey: "fat",
      header: "FAT",
    },
    {
      accessorKey: "snf",
      header: "SNF",
    },
    {
      accessorKey: "totalAmount",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Amount (₹)" />,
      cell: ({ row }) => `₹${row.original.totalAmount.toFixed(2)}`,
    },
  ];

  const totalMilk = collections.reduce((sum, c) => sum + c.quantityLitre, 0);
  const totalAmount = collections.reduce((sum, c) => sum + c.totalAmount, 0);
  const avgFat = collections.length ? collections.reduce((sum, c) => sum + c.fat, 0) / collections.length : 0;

  return (
    <div className="flex min-h-screen w-full bg-gray-50/50 dark:bg-gray-900/50">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center gap-4">
            <h1 className="font-semibold text-lg md:text-2xl">Daily Milk Entries</h1>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Milk (This Month)</CardTitle>
                <Droplet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalMilk.toFixed(1)} L</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{totalAmount.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg FAT</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgFat.toFixed(1)}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <section className="lg:col-span-2">
              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                <h2 className="text-lg font-semibold text-slate-800">New Milk Entry</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Record today's milk collection details.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <Label htmlFor="session" className="mb-2 block text-sm font-medium text-slate-700">
                      Session
                    </Label>
                    <Select
                      value={session}
                      onValueChange={(val: "MORNING" | "EVENING") => setSession(val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select session" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MORNING">Morning</SelectItem>
                        <SelectItem value="EVENING">Evening</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <Label htmlFor="quantity">Quantity (L)</Label>
                      <Input
                        id="quantity"
                        type="number"
                        step="0.1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="0.0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fat">FAT (%)</Label>
                      <Input
                        id="fat"
                        type="number"
                        step="0.1"
                        value={fat}
                        onChange={(e) => setFat(e.target.value)}
                        placeholder="0.0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="snf">SNF (%)</Label>
                      <Input
                        id="snf"
                        type="number"
                        step="0.1"
                        value={snf}
                        onChange={(e) => setSnf(e.target.value)}
                        placeholder="0.0"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                      {createMutation.isPending ? "Recording..." : "Record Entry"}
                    </Button>
                  </div>
                </form>
              </div>
            </section>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              {isLoading ? (
                <div>Loading...</div>
              ) : (
                <DataTable columns={columns} data={collections} searchKey="shift" searchPlaceholder="Search..." />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
