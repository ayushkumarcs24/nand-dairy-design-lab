import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplet, TrendingUp, IndianRupee } from "lucide-react";

interface FarmerSummary {
    totalMilk: number;
    totalEarnings: number;
    avgFat: number;
}

export default function FarmerDashboard() {
    const { data: summary, isLoading } = useQuery<FarmerSummary>({
        queryKey: ["farmer-summary"],
        queryFn: async () => {
            const res = await api.get<FarmerSummary>("/farmer/summary");
            return res.data;
        },
    });

    return (
        <div className="flex min-h-screen w-full bg-gray-50/50 dark:bg-gray-900/50">
            <Sidebar />
            <div className="flex flex-1 flex-col">
                <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                    <div className="flex items-center gap-4">
                        <h1 className="font-semibold text-lg md:text-2xl">Dashboard</h1>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Milk (This Month)</CardTitle>
                                <Droplet className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {isLoading ? "..." : `${summary?.totalMilk.toFixed(1) || 0} L`}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                                <IndianRupee className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {isLoading ? "..." : `₹${summary?.totalEarnings.toFixed(2) || 0}`}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Avg FAT</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {isLoading ? "..." : summary?.avgFat.toFixed(1) || 0}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}
