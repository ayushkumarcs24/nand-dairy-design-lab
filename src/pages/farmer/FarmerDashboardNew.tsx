import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Milk, IndianRupee, TrendingUp, Calendar as CalendarIcon, Sunrise, Sunset } from "lucide-react";
import { format } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import Sidebar from "@/components/layout/Sidebar";
import FarmerMobile from "@/components/layout/FarmerMobile";
import FarmerDesktop from "@/components/layout/FarmerDesktop";

interface SessionData {
    quantity: number;
    fat: number;
    snf: number;
    pricePerLitre: number;
    amount: number;
}

interface TodaySummary {
    morning: SessionData | null;
    evening: SessionData | null;
    totalMilk: number;
    totalAmount: number;
}

interface MilkEntry {
    id: number;
    date: string;
    session: "MORNING" | "EVENING";
    quantityLitre: number;
    fat: number;
    snf: number;
    pricePerLitre: number;
    totalAmount: number;
}

interface MonthlyPayout {
    totalMilk: number;
    totalAmount: number;
    status?: "PAID" | "UNPAID";
}

export default function FarmerDashboardNew() {
    const [selectedMonth, setSelectedMonth] = useState(() => new Date().getMonth() + 1);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

    // Fetch today's summary
    const { data: todaySummary } = useQuery<TodaySummary>({
        queryKey: ["farmer-today-summary"],
        queryFn: async () => {
            const res = await api.get<TodaySummary>("/farmer/today-summary");
            return res.data;
        },
        refetchInterval: 30000, // Refresh every 30 seconds
    });

    // Fetch current month's entries
    const { data: monthlyEntries = [] } = useQuery<MilkEntry[]>({
        queryKey: ["farmer-collections", selectedMonth],
        queryFn: async () => {
            const year = new Date().getFullYear(); // Use current year for real-time data
            const startDate = new Date(year, selectedMonth - 1, 1).toISOString();
            const endDate = new Date(year, selectedMonth, 0, 23, 59, 59).toISOString();
            const res = await api.get<MilkEntry[]>(`/farmer/collections?startDate=${startDate}&endDate=${endDate}`);
            return res.data;
        },
    });

    // Calculate monthly summary
    const monthlySummary: MonthlyPayout = {
        totalMilk: monthlyEntries.reduce((sum, e) => sum + e.quantityLitre, 0),
        totalAmount: monthlyEntries.reduce((sum, e) => sum + e.totalAmount, 0),
    };

    // Group entries by date for calendar
    const entriesByDate = monthlyEntries.reduce((acc, entry) => {
        // Convert UTC timestamp to IST date
        const utcDate = new Date(entry.date);
        // Add IST offset (5 hours 30 minutes = 330 minutes)
        const istDate = new Date(utcDate.getTime() + (330 * 60 * 1000));
        const dateStr = istDate.toISOString().split('T')[0];
        if (!acc[dateStr]) {
            acc[dateStr] = [];
        }
        acc[dateStr].push(entry);
        return acc;
    }, {} as Record<string, MilkEntry[]>);

    // Get selected date entries
    const selectedDateEntries = selectedDate
        ? entriesByDate[format(selectedDate, "yyyy-MM-dd")] || []
        : [];

    const selectedDateTotal = {
        milk: selectedDateEntries.reduce((sum, e) => sum + e.quantityLitre, 0),
        amount: selectedDateEntries.reduce((sum, e) => sum + e.totalAmount, 0),
    };

    // Prepare chart data (last 7 days)
    const chartData = Object.entries(entriesByDate)
        .slice(-7)
        .map(([date, entries]) => ({
            date: format(new Date(date), "MMM d"),
            milk: entries.reduce((sum, e) => sum + e.quantityLitre, 0),
        }));

    return (
        <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr] bg-gradient-to-br from-emerald-50 via-white to-green-50">
            <Sidebar />
            <div className="flex flex-col max-h-screen overflow-hidden">
                <FarmerMobile />
                <FarmerDesktop />
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mx-auto flex max-w-7xl flex-col gap-6"
                    >
                        {/* Header */}
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Farmer Dashboard</h1>
                            <p className="text-muted-foreground">View your milk supply and earnings</p>
                        </div>

                        {/* Today's Supply */}
                        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-green-700">
                                    <Milk className="h-5 w-5" />
                                    Today's Milk Supply
                                </CardTitle>
                                <CardDescription>Real-time updates from your Samiti</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    {/* Morning Session */}
                                    <div className="p-4 rounded-lg bg-white/60 border border-amber-200">
                                        <div className="flex items-center gap-2 text-amber-700 font-semibold mb-3">
                                            <Sunrise className="h-5 w-5" />
                                            <span>Morning Session</span>
                                        </div>
                                        {todaySummary?.morning ? (
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Quantity:</span>
                                                    <span className="font-semibold">{todaySummary.morning.quantity} L</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">FAT:</span>
                                                    <span className="font-medium">{todaySummary.morning.fat}%</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">SNF:</span>
                                                    <span className="font-medium">{todaySummary.morning.snf}%</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Rate/Litre:</span>
                                                    <span className="font-medium">₹{todaySummary.morning.pricePerLitre.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between pt-2 border-t">
                                                    <span className="font-semibold">Amount:</span>
                                                    <span className="font-bold text-green-600">₹{todaySummary.morning.amount.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">No entry yet</p>
                                        )}
                                    </div>

                                    {/* Evening Session */}
                                    <div className="p-4 rounded-lg bg-white/60 border border-blue-200">
                                        <div className="flex items-center gap-2 text-blue-700 font-semibold mb-3">
                                            <Sunset className="h-5 w-5" />
                                            <span>Evening Session</span>
                                        </div>
                                        {todaySummary?.evening ? (
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Quantity:</span>
                                                    <span className="font-semibold">{todaySummary.evening.quantity} L</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">FAT:</span>
                                                    <span className="font-medium">{todaySummary.evening.fat}%</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">SNF:</span>
                                                    <span className="font-medium">{todaySummary.evening.snf}%</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Rate/Litre:</span>
                                                    <span className="font-medium">₹{todaySummary.evening.pricePerLitre.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between pt-2 border-t">
                                                    <span className="font-semibold">Amount:</span>
                                                    <span className="font-bold text-green-600">₹{todaySummary.evening.amount.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">No entry yet</p>
                                        )}
                                    </div>
                                </div>

                                {/* Today's Total */}
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                    <div className="text-center p-3 bg-white rounded-lg">
                                        <div className="text-sm text-muted-foreground mb-1">Total Milk Today</div>
                                        <div className="text-2xl font-bold text-green-600">{todaySummary?.totalMilk.toFixed(1) || 0} L</div>
                                    </div>
                                    <div className="text-center p-3 bg-white rounded-lg">
                                        <div className="text-sm text-muted-foreground mb-1">Total Payout Today</div>
                                        <div className="text-2xl font-bold text-green-600">₹{todaySummary?.totalAmount.toFixed(2) || 0}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Calendar & Monthly Views */}
                        <div className="grid gap-6 lg:grid-cols-2">
                            {/* Calendar View */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CalendarIcon className="h-5 w-5" />
                                        Daily Milk & Payout
                                    </CardTitle>
                                    <CardDescription>Click a date to view details</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Select value={selectedMonth.toString()} onValueChange={(v) => setSelectedMonth(Number(v))}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.from({ length: 12 }, (_, i) => (
                                                <SelectItem key={i + 1} value={(i + 1).toString()}>
                                                    {format(new Date(new Date().getFullYear(), i, 1), "MMMM")}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={setSelectedDate}
                                        className="rounded-md border"
                                        modifiers={{
                                            hasData: (date) => {
                                                // Format date object to YYYY-MM-DD for comparison
                                                const dateStr = format(date, "yyyy-MM-dd");
                                                return !!entriesByDate[dateStr];
                                            },
                                        }}
                                        modifiersStyles={{
                                            hasData: {
                                                backgroundColor: "#dcfce7",
                                                fontWeight: "bold",
                                            },
                                        }}
                                    />

                                    {/* Selected Date Details */}
                                    {selectedDate && (
                                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                            <div className="font-semibold mb-2">{format(selectedDate, "MMMM d, yyyy")}</div>
                                            {selectedDateEntries.length > 0 ? (
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span>🥛 Total Milk:</span>
                                                        <span className="font-bold">{selectedDateTotal.milk.toFixed(1)} L</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>💰 Total Amount:</span>
                                                        <span className="font-bold text-green-600">₹{selectedDateTotal.amount.toFixed(2)}</span>
                                                    </div>
                                                    {selectedDateEntries.map((entry) => (
                                                        <div key={entry.id} className="pt-2 mt-2 border-t">
                                                            <div className="font-medium text-xs text-muted-foreground mb-1">
                                                                {entry.session === "MORNING" ? "🌅 Morning" : "🌆 Evening"}
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-1 text-xs">
                                                                <span>Qty: {entry.quantityLitre} L</span>
                                                                <span>FAT: {entry.fat}%</span>
                                                                <span>SNF: {entry.snf}%</span>
                                                                <span>₹{entry.pricePerLitre}/L</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-muted-foreground">No milk supplied on this date</p>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Monthly Summary & Chart */}
                            <div className="space-y-6">
                                {/* Monthly Summary */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <IndianRupee className="h-5 w-5" />
                                            Monthly Summary
                                        </CardTitle>
                                        <CardDescription>
                                            {format(new Date(new Date().getFullYear(), selectedMonth - 1, 1), "MMMM yyyy")}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                                                <div className="text-sm text-blue-700 mb-1">Total Milk Supplied</div>
                                                <div className="text-3xl font-bold text-blue-900">{monthlySummary.totalMilk.toFixed(1)} L</div>
                                            </div>
                                            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                                                <div className="text-sm text-green-700 mb-1">Total Payout</div>
                                                <div className="text-3xl font-bold text-green-900">₹{monthlySummary.totalAmount.toFixed(2)}</div>
                                            </div>
                                            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-center">
                                                <div className="text-sm font-medium text-amber-700">
                                                    Payment Status: <span className="font-bold">Pending</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1">Will be processed at month end</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Milk Supply Trend */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <TrendingUp className="h-5 w-5" />
                                            Supply Trend (Last 7 Days)
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {chartData.length > 0 ? (
                                            <ResponsiveContainer width="100%" height={200}>
                                                <LineChart data={chartData}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                                    <YAxis tick={{ fontSize: 12 }} />
                                                    <Tooltip />
                                                    <Line type="monotone" dataKey="milk" stroke="#10b981" strokeWidth={2} name="Milk (L)" />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                                                No data available for chart
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Trust Message */}
                        <Card className="border-green-200 bg-green-50/50">
                            <CardContent className="pt-6">
                                <div className="text-center space-y-2">
                                    <div className="text-sm font-semibold text-green-700">✓ 100% Transparent System</div>
                                    <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
                                        All data is entered by your Samiti. All prices are system-calculated based on FAT & SNF.
                                        Real-time updates ensure zero disputes and complete trust.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
