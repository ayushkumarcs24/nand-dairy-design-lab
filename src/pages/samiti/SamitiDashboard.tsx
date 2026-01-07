import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { SamitiLayout } from "@/components/layout/SamitiLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Calculator, TrendingUp, Users, Milk, IndianRupee, ArrowUpRight, Sunrise, Sunset } from "lucide-react";
import { motion } from "framer-motion";
import { SamitiAlerts } from "@/components/SamitiAlerts";

interface Farmer {
  id: number;
  farmerCode: string;
  user: {
    name: string;
    email: string;
  };
}

interface DailySummary {
  date: string;
  totalLitres: number;
  totalAmount: number;
  avgFat: number;
  avgSnf: number;
  entriesCount: number;
}

interface MonthlyPayout {
  farmerId: number;
  farmerCode: string;
  farmerName: string;
  farmerEmail: string;
  totalLitres: number;
  totalAmount: number;
  avgFat: number;
  avgSnf: number;
  entriesCount: number;
}

interface Totals {
  month: number;
  year: number;
  totalOwedToFarmers: number;
  totalFromDairy: number;
  pendingPayouts: number;
}

export default function SamitiDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddEntryOpen, setIsAddEntryOpen] = useState(false);

  // Form states for price calculation
  const [fat, setFat] = useState<string>("");
  const [snf, setSnf] = useState<string>("");
  const [qty, setQty] = useState<string>("");
  const [calculatedPrice, setCalculatedPrice] = useState<{ pricePerLitre: number; totalAmount: number } | null>(null);

  // Fetch farmers
  const { data: farmers = [] } = useQuery<Farmer[]>({
    queryKey: ["samiti-farmers"],
    queryFn: async () => {
      const res = await api.get<Farmer[]>("/samiti/farmers");
      return res.data;
    },
  });

  // Fetch daily summary
  const { data: dailySummary } = useQuery<DailySummary>({
    queryKey: ["samiti-daily-summary"],
    queryFn: async () => {
      const res = await api.get<DailySummary>("/samiti/summary/daily");
      return res.data;
    },
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

  // Fetch monthly payouts
  const { data: monthlyPayouts } = useQuery<{ month: number; year: number; farmers: MonthlyPayout[] }>({
    queryKey: ["samiti-monthly-payouts"],
    queryFn: async () => {
      const res = await api.get<{ month: number; year: number; farmers: MonthlyPayout[] }>("/samiti/summary/monthly-payouts");
      return res.data;
    },
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

  // Fetch totals
  const { data: totals } = useQuery<Totals>({
    queryKey: ["samiti-totals"],
    queryFn: async () => {
      const res = await api.get<Totals>("/samiti/summary/totals");
      return res.data;
    },
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

  // Auto-calculate price effect
  useEffect(() => {
    const calculate = async () => {
      if (!fat || !snf || !qty) return;
      try {
        const res = await api.post<{ pricePerLitre: number; totalAmount: number }>("/samiti/calculate-price", {
          fat: Number(fat),
          snf: Number(snf),
          quantityLitre: Number(qty),
        });
        setCalculatedPrice(res.data);
      } catch (e) {
        console.error("Calculation failed", e);
      }
    };

    const timer = setTimeout(calculate, 500);
    return () => clearTimeout(timer);
  }, [fat, snf, qty]);

  // Create milk entry mutation
  const createEntryMutation = useMutation({
    mutationFn: async (data: any) => {
      await api.post("/samiti/milk-collections", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["samiti-daily-summary"] });
      queryClient.invalidateQueries({ queryKey: ["samiti-monthly-payouts"] });
      queryClient.invalidateQueries({ queryKey: ["samiti-totals"] });
      queryClient.invalidateQueries({ queryKey: ["samiti-alerts"] });
      setIsAddEntryOpen(false);
      resetForm();
      toast({ title: "✅ Milk entry recorded successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to record entry", description: error.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFat("");
    setSnf("");
    setQty("");
    setCalculatedPrice(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      farmerId: Number(formData.get("farmerId")),
      quantityLitre: Number(formData.get("quantityLitre")),
      fat: Number(formData.get("fat")),
      snf: Number(formData.get("snf")),
      session: formData.get("session"),
      date: new Date().toISOString(),
    };
    createEntryMutation.mutate(data);
  };

  const monthName = new Date(0, (monthlyPayouts?.month || 1) - 1).toLocaleString('default', { month: 'long' });

  return (
    <SamitiLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Samiti Dashboard</h1>
            <p className="text-muted-foreground">Manage milk collection and farmer payouts</p>
          </div>
          <Dialog open={isAddEntryOpen} onOpenChange={(open) => { setIsAddEntryOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="bg-[#8B7355] text-white hover:bg-[#6D5A43]">
                <Plus className="mr-2 h-4 w-4" /> Add Milk Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Record Milk Collection</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="farmerId">Select Farmer</Label>
                  <Select name="farmerId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select farmer..." />
                    </SelectTrigger>
                    <SelectContent>
                      {farmers.map((farmer) => (
                        <SelectItem key={farmer.id} value={farmer.id.toString()}>
                          {farmer.user.name} ({farmer.farmerCode})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="session">Shift</Label>
                    <Select name="session" defaultValue="MORNING">
                      <SelectTrigger>
                        <SelectValue placeholder="Select shift" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MORNING">Morning</SelectItem>
                        <SelectItem value="EVENING">Evening</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantityLitre">Quantity (Litres)</Label>
                    <Input
                      id="quantityLitre"
                      name="quantityLitre"
                      type="number"
                      step="0.1"
                      required
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      placeholder="e.g., 10.5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fat">FAT (%)</Label>
                    <Input
                      id="fat"
                      name="fat"
                      type="number"
                      step="0.1"
                      required
                      value={fat}
                      onChange={(e) => setFat(e.target.value)}
                      placeholder="e.g., 4.5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="snf">SNF (%)</Label>
                    <Input
                      id="snf"
                      name="snf"
                      type="number"
                      step="0.1"
                      required
                      value={snf}
                      onChange={(e) => setSnf(e.target.value)}
                      placeholder="e.g., 8.5"
                    />
                  </div>
                </div>

                {/* Auto Price Calculation Display */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-[#FFF9ED] to-[#F5E6D3] p-4 rounded-lg border-2 border-[#8B7355]/20 space-y-2"
                >
                  <div className="flex items-center gap-2 text-[#8B7355] font-semibold">
                    <Calculator className="w-5 h-5" />
                    <span>Auto Price Calculation</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-white/60 rounded-md p-2">
                      <span className="text-gray-600 text-xs">Rate/Litre:</span>
                      <div className="font-bold text-lg text-[#8B7355]">
                        {calculatedPrice ? `₹${calculatedPrice.pricePerLitre.toFixed(2)}` : '—'}
                      </div>
                    </div>
                    <div className="bg-white/60 rounded-md p-2">
                      <span className="text-gray-600 text-xs">Total Amount:</span>
                      <div className="font-bold text-lg text-green-600">
                        {calculatedPrice ? `₹${calculatedPrice.totalAmount.toFixed(2)}` : '—'}
                      </div>
                    </div>
                  </div>
                </motion.div>

                <Button
                  type="submit"
                  className="w-full bg-[#8B7355] hover:bg-[#6D5A43]"
                  disabled={createEntryMutation.isPending}
                >
                  {createEntryMutation.isPending ? "Recording..." : "Record Entry"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Collection</CardTitle>
              <Milk className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dailySummary?.totalLitres.toFixed(1) || '0'} L</div>
              <p className="text-xs text-muted-foreground">
                {dailySummary?.entriesCount || 0} entries recorded
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Amount</CardTitle>
              <IndianRupee className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{dailySummary?.totalAmount.toFixed(2) || '0.00'}</div>
              <p className="text-xs text-muted-foreground">
                Avg FAT: {dailySummary?.avgFat.toFixed(1) || '0'}% | SNF: {dailySummary?.avgSnf.toFixed(1) || '0'}%
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Farmers</CardTitle>
              <Users className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{farmers.length}</div>
              <p className="text-xs text-muted-foreground">Total registered farmers</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Target</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totals?.totalOwedToFarmers.toFixed(0) || '0'}</div>
              <p className="text-xs text-muted-foreground">This month's collection</p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Section */}
        <SamitiAlerts />

        {/* Financial Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-2 border-red-200 bg-red-50/50">
            <CardHeader>
              <CardTitle className="text-red-700 flex items-center gap-2">
                <ArrowUpRight className="h-5 w-5 rotate-90" />
                Total Owed to Farmers
              </CardTitle>
              <CardDescription>Amount Samiti must pay to farmers ({monthName})</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-red-600">
                ₹{totals?.totalOwedToFarmers.toFixed(2) || '0.00'}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-green-50/50">
            <CardHeader>
              <CardTitle className="text-green-700 flex items-center gap-2">
                <ArrowUpRight className="h-5 w-5" />
                Total from Nand Dairy
              </CardTitle>
              <CardDescription>Pending invoices from Nand Dairy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-600">
                ₹{totals?.totalFromDairy.toFixed(2) || '0.00'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Payout Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Payout Summary - {monthName} {monthlyPayouts?.year}</CardTitle>
            <CardDescription>Farmer-wise milk collection and payment breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Farmer</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead className="text-right">Entries</TableHead>
                  <TableHead className="text-right">Total Litres</TableHead>
                  <TableHead className="text-right">Avg FAT</TableHead>
                  <TableHead className="text-right">Avg SNF</TableHead>
                  <TableHead className="text-right">Total Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlyPayouts?.farmers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No data for this month yet
                    </TableCell>
                  </TableRow>
                ) : (
                  monthlyPayouts?.farmers.map((payout) => (
                    <TableRow key={payout.farmerId}>
                      <TableCell className="font-medium">{payout.farmerName}</TableCell>
                      <TableCell className="text-muted-foreground">{payout.farmerCode}</TableCell>
                      <TableCell className="text-right">{payout.entriesCount}</TableCell>
                      <TableCell className="text-right">{payout.totalLitres.toFixed(1)} L</TableCell>
                      <TableCell className="text-right">{payout.avgFat.toFixed(1)}%</TableCell>
                      <TableCell className="text-right">{payout.avgSnf.toFixed(1)}%</TableCell>
                      <TableCell className="text-right font-bold text-green-600">
                        ₹{payout.totalAmount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Farmers List */}
        <Card>
          <CardHeader>
            <CardTitle>All Farmers</CardTitle>
            <CardDescription>List of farmers assigned to this Samiti</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Farmer Code</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {farmers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      No farmers assigned yet
                    </TableCell>
                  </TableRow>
                ) : (
                  farmers.map((farmer) => (
                    <TableRow key={farmer.id}>
                      <TableCell className="font-medium">{farmer.user.name}</TableCell>
                      <TableCell className="text-muted-foreground">{farmer.farmerCode}</TableCell>
                      <TableCell className="text-muted-foreground">{farmer.user.email}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </SamitiLayout>
  );
}
