import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DistributorLayout } from "@/components/layout/DistributorLayout";
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
import { Plus, CreditCard } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

interface DistributorPayment {
    id: number;
    amount: number;
    paymentDate: string;
    paymentMethod: string;
    status: "PENDING" | "COMPLETED" | "FAILED";
    referenceId?: string;
}

export default function DistributorPayments() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const { data: payments = [], isLoading } = useQuery<DistributorPayment[]>({
        queryKey: ["distributor-payments"],
        queryFn: async () => {
            const res = await api.get<DistributorPayment[]>("/distributor/payments");
            return res.data;
        },
    });

    const createMutation = useMutation({
        mutationFn: async (data: { amount: number; paymentMethod: string; referenceId?: string }) => {
            await api.post("/distributor/payments", data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["distributor-payments"] });
            setIsCreateOpen(false);
            toast({ title: "Payment recorded successfully" });
        },
        onError: (error: any) => {
            toast({ title: "Failed to record payment", description: error.message, variant: "destructive" });
        },
    });

    const columns: ColumnDef<DistributorPayment>[] = [
        {
            accessorKey: "paymentDate",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
            cell: ({ row }) => format(new Date(row.original.paymentDate), "MMM d, yyyy"),
        },
        {
            accessorKey: "amount",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Amount (₹)" />,
            cell: ({ row }) => `₹${row.original.amount.toFixed(2)}`,
        },
        {
            accessorKey: "paymentMethod",
            header: "Method",
        },
        {
            accessorKey: "referenceId",
            header: "Reference ID",
            cell: ({ row }) => row.original.referenceId || "-",
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const statusColors = {
                    PENDING: "text-amber-600 bg-amber-50",
                    COMPLETED: "text-green-600 bg-green-50",
                    FAILED: "text-red-600 bg-red-50",
                };
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[row.original.status]}`}>
                        {row.original.status}
                    </span>
                );
            },
        },
    ];

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        createMutation.mutate({
            amount: Number(formData.get("amount")),
            paymentMethod: formData.get("paymentMethod") as string,
            referenceId: formData.get("referenceId") as string,
        });
    };

    return (
        <DistributorLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Record Payment
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Record New Payment</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="amount">Amount (₹)</Label>
                                    <Input id="amount" name="amount" type="number" step="0.01" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="paymentMethod">Payment Method</Label>
                                    <Input id="paymentMethod" name="paymentMethod" placeholder="e.g., UPI, Bank Transfer" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="referenceId">Reference ID (Optional)</Label>
                                    <Input id="referenceId" name="referenceId" placeholder="Transaction ID" />
                                </div>
                                <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                                    {createMutation.isPending ? "Recording..." : "Record Payment"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    <DataTable columns={columns} data={payments} searchKey="referenceId" searchPlaceholder="Search reference ID..." />
                )}
            </div>
        </DistributorLayout>
    );
}
