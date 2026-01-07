import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { SamitiLayout } from "@/components/layout/SamitiLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Calendar } from "lucide-react";
import { format } from "date-fns";

interface FarmerReport {
    farmerId: number;
    farmerCode: string;
    farmerName: string;
    farmerVillage: string;
    totalLitres: number;
    totalAmount: number;
    avgFat: number;
    avgSnf: number;
    entriesCount: number;
}

interface DateWiseReport {
    date: string;
    morningLitres: number;
    eveningLitres: number;
    totalLitres: number;
    totalAmount: number;
    avgFat: number;
    avgSnf: number;
}

export default function SamitiReports() {
    const [reportType, setReportType] = useState<"farmer" | "date" | "payment">("farmer");
    const [startDate, setStartDate] = useState(() => {
        const date = new Date();
        date.setDate(1); // First day of current month
        return date.toISOString().split("T")[0];
    });
    const [endDate, setEndDate] = useState(() => {
        const date = new Date();
        return date.toISOString().split("T")[0];
    });

    const [selectedFarmerId, setSelectedFarmerId] = useState<number | null>(null);

    // Fetch farmer list
    const { data: farmers = [] } = useQuery<Array<{ id: number; farmerCode: string; village: string; user: { name: string } }>>({
        queryKey: ["samiti-farmers"],
        queryFn: async () => {
            const res = await api.get<Array<{ id: number; farmerCode: string; village: string; user: { name: string } }>>("/samiti/farmers");
            return res.data;
        },
    });

    // Fetch monthly payout summary (reusing existing endpoint)
    const { data: paymentReport, isLoading: paymentLoading } = useQuery<{ month: number; year: number; farmers: FarmerReport[] }>({
        queryKey: ["payment-report", startDate, endDate],
        queryFn: async () => {
            const res = await api.get<{ month: number; year: number; farmers: FarmerReport[] }>("/samiti/summary/monthly-payouts");
            return res.data;
        },
        enabled: reportType === "payment",
    });

    const handleExport = (type: "pdf" | "excel") => {
        // In a real app, this would call an API endpoint to generate the export
        alert(`Exporting as ${type.toUpperCase()}... (Feature to be implemented with server-side export library)`);
    };

    return (
        <SamitiLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
                        <p className="text-muted-foreground">Generate comprehensive reports for your Samiti</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => handleExport("pdf")}>
                            <Download className="mr-2 h-4 w-4" />
                            Export PDF
                        </Button>
                        <Button variant="outline" onClick={() => handleExport("excel")}>
                            <Download className="mr-2 h-4 w-4" />
                            Export Excel
                        </Button>
                    </div>
                </div>

                <Tabs value={reportType} onValueChange={(v) => setReportType(v as any)} className="space-y-4">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="farmer">Farmer-wise Report</TabsTrigger>
                        <TabsTrigger value="date">Date-wise Report</TabsTrigger>
                        <TabsTrigger value="payment">Monthly Payment Report</TabsTrigger>
                    </TabsList>

                    {/* Farmer-wise Report */}
                    <TabsContent value="farmer" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-[#8B7355]" />
                                    Farmer-wise Milk Collection Report
                                </CardTitle>
                                <CardDescription>Detailed milk collection by each farmer</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="start-date" className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            Start Date
                                        </Label>
                                        <Input
                                            id="start-date"
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="end-date" className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            End Date
                                        </Label>
                                        <Input
                                            id="end-date"
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <Button className="w-full bg-[#8B7355] hover:bg-[#6D5A43]">
                                            Generate Report
                                        </Button>
                                    </div>
                                </div>

                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Code</TableHead>
                                            <TableHead>Farmer Name</TableHead>
                                            <TableHead>Village</TableHead>
                                            <TableHead className="text-right">Entries</TableHead>
                                            <TableHead className="text-right">Total Litres</TableHead>
                                            <TableHead className="text-right">Avg FAT</TableHead>
                                            <TableHead className="text-right">Avg SNF</TableHead>
                                            <TableHead className="text-right">Total Amount</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {farmers.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={8} className="text-center text-muted-foreground">
                                                    No data available for the selected period
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            farmers.map((farmer) => (
                                                <TableRow key={farmer.id}>
                                                    <TableCell className="font-medium">{farmer.farmerCode}</TableCell>
                                                    <TableCell>{farmer.user.name}</TableCell>
                                                    <TableCell>{farmer.village || "—"}</TableCell>
                                                    <TableCell className="text-right">—</TableCell>
                                                    <TableCell className="text-right">—</TableCell>
                                                    <TableCell className="text-right">—</TableCell>
                                                    <TableCell className="text-right">—</TableCell>
                                                    <TableCell className="text-right font-semibold text-green-600">—</TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Date-wise Report */}
                    <TabsContent value="date" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-[#8B7355]" />
                                    Date-wise Collection Report
                                </CardTitle>
                                <CardDescription>Daily milk collection breakdown by session</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="date-start">Start Date</Label>
                                        <Input
                                            id="date-start"
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="date-end">End Date</Label>
                                        <Input
                                            id="date-end"
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <Button className="w-full bg-[#8B7355] hover:bg-[#6D5A43]">
                                            Generate Report
                                        </Button>
                                    </div>
                                </div>

                                <div className="border rounded-lg p-4 text-center text-muted-foreground">
                                    Select date range and click "Generate Report" to view data
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Monthly Payment Report */}
                    <TabsContent value="payment" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-[#8B7355]" />
                                    Monthly Payment Report
                                </CardTitle>
                                <CardDescription>
                                    Farmer payment summary for {paymentReport ? format(new Date(paymentReport.year, paymentReport.month - 1), "MMMM yyyy") : "current month"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {paymentLoading ? (
                                    <div className="text-center py-8">Loading...</div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Farmer Code</TableHead>
                                                <TableHead>Name</TableHead>
                                                <TableHead className="text-right">Entries</TableHead>
                                                <TableHead className="text-right">Total Litres</TableHead>
                                                <TableHead className="text-right">Avg FAT</TableHead>
                                                <TableHead className="text-right">Avg SNF</TableHead>
                                                <TableHead className="text-right">Total Amount</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paymentReport?.farmers.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                                                        No payment data for this month
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                paymentReport?.farmers.map((farmer) => (
                                                    <TableRow key={farmer.farmerId}>
                                                        <TableCell className="font-medium">{farmer.farmerCode}</TableCell>
                                                        <TableCell>{farmer.farmerName}</TableCell>
                                                        <TableCell className="text-right">{farmer.entriesCount}</TableCell>
                                                        <TableCell className="text-right">{farmer.totalLitres.toFixed(1)} L</TableCell>
                                                        <TableCell className="text-right">{farmer.avgFat.toFixed(1)}%</TableCell>
                                                        <TableCell className="text-right">{farmer.avgSnf.toFixed(1)}%</TableCell>
                                                        <TableCell className="text-right font-semibold text-green-600">
                                                            ₹{farmer.totalAmount.toFixed(2)}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </SamitiLayout>
    );
}
