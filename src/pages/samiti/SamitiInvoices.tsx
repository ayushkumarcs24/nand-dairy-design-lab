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
import { Plus, FileText } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

interface SamitiInvoice {
    id: number;
    invoiceNumber: string;
    startDate: string;
    endDate: string;
    totalAmount: number;
    status: "UNPAID" | "PAID";
    createdAt: string;
}

export default function SamitiInvoices() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isGenerateOpen, setIsGenerateOpen] = useState(false);

    const { data: invoices = [], isLoading } = useQuery<SamitiInvoice[]>({
        queryKey: ["samiti-invoices-list"],
        queryFn: async () => {
            const res = await api.get<SamitiInvoice[]>("/samiti/invoices");
            return res.data;
        },
    });

    const generateMutation = useMutation({
        mutationFn: async (data: { startDate: string; endDate: string }) => {
            await api.post("/samiti/invoices/generate", data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["samiti-invoices-list"] });
            setIsGenerateOpen(false);
            toast({ title: "Invoice generated successfully" });
        },
        onError: (error: any) => {
            toast({ title: "Failed to generate invoice", description: error.message, variant: "destructive" });
        },
    });

    const columns: ColumnDef<SamitiInvoice>[] = [
        {
            accessorKey: "invoiceNumber",
            header: "Invoice #",
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
            accessorKey: "createdAt",
            header: "Generated On",
            cell: ({ row }) => format(new Date(row.original.createdAt), "MMM d, yyyy"),
        },
    ];

    const handleGenerate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        generateMutation.mutate({
            startDate: formData.get("startDate") as string,
            endDate: formData.get("endDate") as string,
        });
    };

    return (
        <SamitiLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
                    <Dialog open={isGenerateOpen} onOpenChange={setIsGenerateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Generate Invoice
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Generate New Invoice</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleGenerate} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="startDate">Start Date</Label>
                                    <Input id="startDate" name="startDate" type="date" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endDate">End Date</Label>
                                    <Input id="endDate" name="endDate" type="date" required />
                                </div>
                                <Button type="submit" className="w-full" disabled={generateMutation.isPending}>
                                    {generateMutation.isPending ? "Generating..." : "Generate Invoice"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    <DataTable columns={columns} data={invoices} searchKey="invoiceNumber" searchPlaceholder="Search invoice..." />
                )}
            </div>
        </SamitiLayout>
    );
}
