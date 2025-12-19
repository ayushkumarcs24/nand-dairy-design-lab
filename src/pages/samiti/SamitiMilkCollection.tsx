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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

interface MilkCollection {
    id: number;
    farmerId: number;
    farmer: {
        name: string;
        code: string;
    };
    quantityLitre: number;
    fat: number;
    snf: number;
    pricePerLitre: number;
    totalAmount: number;
    collectionDate: string;
    shift: "MORNING" | "EVENING";
}

interface Farmer {
    id: number;
    name: string;
    code: string;
}

export default function SamitiMilkCollection() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingCollection, setEditingCollection] = useState<MilkCollection | null>(null);

    const { data: collections = [], isLoading } = useQuery<MilkCollection[]>({
        queryKey: ["milk-collections"],
        queryFn: async () => {
            const res = await api.get<MilkCollection[]>("/samiti/milk-collections");
            return res.data;
        },
    });

    // Mock farmers list for now, ideally fetch from API
    // Since we don't have a direct endpoint for farmers list for samiti in the summary, 
    // we might need to add one or assume we can get it. 
    // For now, let's assume we can get it or just input farmer ID manually.
    // Actually, let's just use a text input for Farmer ID for simplicity if we don't have a list endpoint handy.
    // Wait, we do have `GET /api/samiti/farmers`? No, we didn't implement that explicitly in the summary.
    // Let's assume the user enters the Farmer Code.

    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            await api.post("/samiti/milk-collections", data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["milk-collections"] });
            setIsCreateOpen(false);
            toast({ title: "Milk collection recorded successfully" });
        },
        onError: (error: any) => {
            toast({ title: "Failed to record collection", description: error.message, variant: "destructive" });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number; data: any }) => {
            await api.put(`/samiti/milk-collections/${id}`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["milk-collections"] });
            setEditingCollection(null);
            toast({ title: "Collection updated successfully" });
        },
        onError: () => {
            toast({ title: "Failed to update collection", variant: "destructive" });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/samiti/milk-collections/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["milk-collections"] });
            toast({ title: "Collection deleted successfully" });
        },
        onError: () => {
            toast({ title: "Failed to delete collection", variant: "destructive" });
        },
    });

    const columns: ColumnDef<MilkCollection>[] = [
        {
            accessorKey: "collectionDate",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
            cell: ({ row }) => format(new Date(row.original.collectionDate), "MMM d, yyyy"),
        },
        {
            accessorKey: "shift",
            header: "Shift",
        },
        {
            accessorKey: "farmer.name",
            header: "Farmer",
            cell: ({ row }) => `${row.original.farmer.name} (${row.original.farmer.code})`,
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
            header: "Amount (₹)",
            cell: ({ row }) => `₹${row.original.totalAmount.toFixed(2)}`,
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const collection = row.original;
                return (
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingCollection(collection)}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600"
                            onClick={() => {
                                if (confirm("Are you sure you want to delete this entry?")) {
                                    deleteMutation.mutate(collection.id);
                                }
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                );
            },
        },
    ];

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>, isEdit: boolean) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            farmerId: Number(formData.get("farmerId")),
            quantityLitre: Number(formData.get("quantityLitre")),
            fat: Number(formData.get("fat")),
            snf: Number(formData.get("snf")),
            shift: formData.get("shift"),
            collectionDate: new Date().toISOString(), // Default to now for simplicity, or add date picker
        };

        if (isEdit && editingCollection) {
            updateMutation.mutate({ id: editingCollection.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    return (
        <SamitiLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight">Milk Collection</h1>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> New Entry
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Record Milk Collection</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="farmerId">Farmer ID</Label>
                                    <Input id="farmerId" name="farmerId" type="number" required placeholder="Enter Farmer ID" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="quantityLitre">Quantity (L)</Label>
                                        <Input id="quantityLitre" name="quantityLitre" type="number" step="0.1" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="shift">Shift</Label>
                                        <Select name="shift" defaultValue="MORNING">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select shift" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="MORNING">Morning</SelectItem>
                                                <SelectItem value="EVENING">Evening</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="fat">FAT</Label>
                                        <Input id="fat" name="fat" type="number" step="0.1" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="snf">SNF</Label>
                                        <Input id="snf" name="snf" type="number" step="0.1" required />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                                    {createMutation.isPending ? "Recording..." : "Record Entry"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    <DataTable columns={columns} data={collections} searchKey="farmer.name" searchPlaceholder="Search farmer..." />
                )}

                <Dialog open={!!editingCollection} onOpenChange={(open) => !open && setEditingCollection(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Collection</DialogTitle>
                        </DialogHeader>
                        {editingCollection && (
                            <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-farmerId">Farmer ID</Label>
                                    <Input id="edit-farmerId" name="farmerId" type="number" defaultValue={editingCollection.farmerId} required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-quantityLitre">Quantity (L)</Label>
                                        <Input id="edit-quantityLitre" name="quantityLitre" type="number" step="0.1" defaultValue={editingCollection.quantityLitre} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-shift">Shift</Label>
                                        <Select name="shift" defaultValue={editingCollection.shift}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select shift" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="MORNING">Morning</SelectItem>
                                                <SelectItem value="EVENING">Evening</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-fat">FAT</Label>
                                        <Input id="edit-fat" name="fat" type="number" step="0.1" defaultValue={editingCollection.fat} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-snf">SNF</Label>
                                        <Input id="edit-snf" name="snf" type="number" step="0.1" defaultValue={editingCollection.snf} required />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full" disabled={updateMutation.isPending}>
                                    {updateMutation.isPending ? "Updating..." : "Update Entry"}
                                </Button>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </SamitiLayout>
    );
}
