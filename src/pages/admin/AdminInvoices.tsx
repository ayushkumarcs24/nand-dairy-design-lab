import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DataTable } from "@/components/ui/data-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { CheckCircle } from "lucide-react";

interface SamitiInvoice {
    id: number;
    invoiceNumber: string;
    startDate: string;
    endDate: string;
    totalAmount: number;
    status: "UNPAID" | "PAID";
    createdAt: string;
    samiti: {
        name: string;
        code: string;
    };
}

export default function AdminInvoices() {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: invoices = [], isLoading } = useQuery<SamitiInvoice[]>({
        queryKey: ["samiti-invoices"],
        queryFn: async () => {
            const res = await api.get<SamitiInvoice[]>("/owner/samiti-invoices");
            return res.data;
        },
    });

    const payMutation = useMutation({
        mutationFn: async (id: number) => {
            await api.put(`/owner/samiti-invoices/${id}/pay`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["samiti-invoices"] });
            toast({ title: "Invoice marked as paid" });
        },
        onError: () => {
            toast({ title: "Failed to update invoice", variant: "destructive" });
        },
    });

    const columns: ColumnDef<SamitiInvoice>[] = [
        {
            accessorKey: "invoiceNumber",
            header: "Invoice #",
        },
        {
            accessorKey: "samiti.name",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Samiti" />,
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
                const invoice = row.original;
                if (invoice.status === "PAID") return null;

                return (
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 border-green-200 hover:bg-green-50"
                        onClick={() => {
                            if (confirm(`Mark invoice ${invoice.invoiceNumber} as PAID?`)) {
                                payMutation.mutate(invoice.id);
                            }
                        }}
                    >
                        <CheckCircle className="mr-2 h-4 w-4" /> Mark Paid
                    </Button>
                );
            },
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight">Samiti Invoices</h1>
                </div>

                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    <DataTable columns={columns} data={invoices} searchKey="invoiceNumber" searchPlaceholder="Search invoice..." />
                )}
            </div>
        </AdminLayout>
    );
}
