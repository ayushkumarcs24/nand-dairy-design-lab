import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { SamitiLayout } from "@/components/layout/SamitiLayout";
import { DataTable } from "@/components/ui/data-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Plus, CheckCircle } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

interface FarmerPayout {
    id: number;
    payoutNumber: string;
    startDate: string;
    endDate: string;
    totalAmount: number;
    status: "UNPAID" | "PAID";
    createdAt: string;
    farmer: {
        name: string;
        code: string;
    };
}

export default function SamitiPayouts() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const { data: payouts = [], isLoading } = useQuery<FarmerPayout[]>({
        queryKey: ["samiti-payouts"],
        queryFn: async () => {
            const res = await api.get<FarmerPayout[]>("/samiti/payouts");
            return res.data;
        },
    });

    const createMutation = useMutation({
        mutationFn: async (data: { farmerId: number; startDate: string; endDate: string }) => {
            await api.post("/samiti/payouts", data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["samiti-payouts"] });
            setIsCreateOpen(false);
            toast({ title: "Payout created successfully" });
        },
        onError: (error: any) => {
            toast({ title: "Failed to create payout", description: error.message, variant: "destructive" });
        },
    });

    const payMutation = useMutation({
        mutationFn: async (id: number) => {
            await api.put(`/samiti/payouts/${id}/pay`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["samiti-payouts"] });
            toast({ title: "Payout marked as paid" });
        },
        onError: () => {
            toast({ title: "Failed to update payout", variant: "destructive" });
        },
    });

    const columns: ColumnDef<FarmerPayout>[] = [
        {
            accessorKey: "payoutNumber",
            header: "Payout #",
        },
        {
            accessorKey: "farmer.name",
            header: "Farmer",
            cell: ({ row }) => `${row.original.farmer.name} (${row.original.farmer.code})`,
        },
        {
            accessorKey: "startDate",
            header: "Period",
            cell: ({ row }) => {
                const start = format(new Date(row.original.startDate), "MMM d");
                const end = format(new Date(row.original.endDate), "MMM d, yyyy");
                return `${start} - ${end}`;
            },
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
                <span className={row.original.status === "PAID" ? "text-green-600 font-medium" : "text-amber-600 font-medium"}>
                    {row.original.status}
                </span>
            ),
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const payout = row.original;
                if (payout.status === "PAID") return null;

                return (
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 border-green-200 hover:bg-green-50"
                        onClick={() => {
                            if (confirm(`Mark payout ${payout.payoutNumber} as PAID?`)) {
                                payMutation.mutate(payout.id);
                            }
                        }}
                    >
                        <CheckCircle className="mr-2 h-4 w-4" /> Mark Paid
                    </Button>
                );
            },
        },
    ];

    const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        createMutation.mutate({
            farmerId: Number(formData.get("farmerId")),
            startDate: formData.get("startDate") as string,
            endDate: formData.get("endDate") as string,
        });
    };

    return (
        <SamitiLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight">Farmer Payouts</h1>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Create Payout
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create Farmer Payout</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="farmerId">Farmer ID</Label>
                                    <Input id="farmerId" name="farmerId" type="number" required placeholder="Enter Farmer ID" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="startDate">Start Date</Label>
                                    <Input id="startDate" name="startDate" type="date" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endDate">End Date</Label>
                                    <Input id="endDate" name="endDate" type="date" required />
                                </div>
                                <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                                    {createMutation.isPending ? "Creating..." : "Create Payout"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    <DataTable columns={columns} data={payouts} searchKey="farmer.name" searchPlaceholder="Search farmer..." />
                )}
            </div>
        </SamitiLayout>
    );
}
