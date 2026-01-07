import { useState, useEffect } from "react";
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
import { Plus, Pencil, Trash2, Calculator } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

interface MilkCollection {
    id: number;
    farmerId: number;
    farmer: {
        name: string;
        farmerCode: string;
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
    farmerCode: string;
    user: {
        name: string;
    };
}

export default function SamitiMilkCollection() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingCollection, setEditingCollection] = useState<MilkCollection | null>(null);

    // Form states for calculation
    const [fat, setFat] = useState<string>("");
    const [snf, setSnf] = useState<string>("");
    const [qty, setQty] = useState<string>("");
    const [calculatedPrice, setCalculatedPrice] = useState<{ pricePerLitre: number, totalAmount: number } | null>(null);

    const { data: collections = [], isLoading } = useQuery<MilkCollection[]>({
        queryKey: ["milk-collections"],
        queryFn: async () => {
            const res = await api.get<MilkCollection[]>("/samiti/milk-collections");
            return res.data;
        },
    });

    const { data: farmers = [] } = useQuery<Farmer[]>({
        queryKey: ["samiti-farmers"],
        queryFn: async () => {
            const res = await api.get<Farmer[]>("/samiti/farmers");
            return res.data;
        },
    });

    // Auto-calculate effect
    useEffect(() => {
        const calculate = async () => {
            if (!fat || !snf || !qty) return;
            try {
                const res = await api.post<{ pricePerLitre: number, totalAmount: number }>("/samiti/calculate-price", {
                    fat: Number(fat),
                    snf: Number(snf),
                    quantityLitre: Number(qty)
                });
                setCalculatedPrice(res.data);
            } catch (e) {
                console.error("Calculation failed", e);
            }
        };

        const timer = setTimeout(calculate, 500); // 500ms debounce
        return () => clearTimeout(timer);
    }, [fat, snf, qty]);


    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            await api.post("/samiti/milk-collections", data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["milk-collections"] });
            // Invalidate dashboard queries so the dashboard updates
            queryClient.invalidateQueries({ queryKey: ["samiti-daily-summary"] });
            queryClient.invalidateQueries({ queryKey: ["samiti-monthly-payouts"] });
            queryClient.invalidateQueries({ queryKey: ["samiti-totals"] });
            queryClient.invalidateQueries({ queryKey: ["samiti-alerts"] });
            setIsCreateOpen(false);
            resetForm();
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
            resetForm();
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

    const resetForm = () => {
        setFat(""); setSnf(""); setQty(""); setCalculatedPrice(null);
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
        },
        {
            accessorKey: "farmer.user.name",
            header: "Farmer",
            cell: ({ row }) => `${row.original.farmer.name} (${row.original.farmer.farmerCode})`,
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
                            onClick={() => {
                                setEditingCollection(collection);
                                setFat(collection.fat.toString());
                                setSnf(collection.snf.toString());
                                setQty(collection.quantityLitre.toString());
                            }}
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
            collectionDate: new Date().toISOString(),
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
                    <Dialog open={isCreateOpen} onOpenChange={(open) => { setIsCreateOpen(open); if (!open) resetForm(); }}>
                        <DialogTrigger asChild>
                            <Button className="bg-[#8B7355] text-white hover:bg-[#6D5A43]">
                                <Plus className="mr-2 h-4 w-4" /> New Entry
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Record Milk Collection</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
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
                                    <div className="space-y-2">
                                        <Label htmlFor="quantityLitre">Quantity (L)</Label>
                                        <Input
                                            id="quantityLitre" name="quantityLitre" type="number" step="0.1" required
                                            value={qty} onChange={(e) => setQty(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="fat">FAT (%)</Label>
                                        <Input
                                            id="fat" name="fat" type="number" step="0.1" required
                                            value={fat} onChange={(e) => setFat(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="snf">SNF (%)</Label>
                                        <Input
                                            id="snf" name="snf" type="number" step="0.1" required
                                            value={snf} onChange={(e) => setSnf(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Calculated Price Preview */}
                                <div className="bg-[#FFF9ED] p-4 rounded-lg border border-[#F5E6D3] space-y-2">
                                    <div className="flex items-center gap-2 text-[#8B7355] font-semibold">
                                        <Calculator className="w-4 h-4" />
                                        <span>Estimated Price</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-500">Rate/Litre:</span>
                                            <span className="ml-2 font-medium">
                                                {calculatedPrice ? `₹${calculatedPrice.pricePerLitre.toFixed(2)}` : '--'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Total:</span>
                                            <span className="ml-2 font-bold text-lg text-green-600">
                                                {calculatedPrice ? `₹${calculatedPrice.totalAmount.toFixed(2)}` : '--'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <Button type="submit" className="w-full bg-[#8B7355] hover:bg-[#6D5A43]" disabled={createMutation.isPending}>
                                    {createMutation.isPending ? "Recording..." : "Record Entry"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    <DataTable columns={columns} data={collections} searchKey="farmer.user.name" searchPlaceholder="Search farmer..." />
                )}

                <Dialog open={!!editingCollection} onOpenChange={(open) => !open && setEditingCollection(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Collection</DialogTitle>
                        </DialogHeader>
                        {editingCollection && (
                            <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-4">
                                {/* Similar form field structure as Create, but with defaults */}
                                {/* Simplified edit form for brevity, ideally reuse component */}
                                <div className="space-y-2">
                                    <Label>Farmer</Label>
                                    <div className="p-2 bg-gray-100 rounded">{editingCollection.farmer.name} ({editingCollection.farmer.farmerCode})</div>
                                    <input type="hidden" name="farmerId" value={editingCollection.farmerId} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-shift">Shift</Label>
                                        <Select name="shift" defaultValue={editingCollection.shift}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="MORNING">Morning</SelectItem>
                                                <SelectItem value="EVENING">Evening</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-qty">Quantity</Label>
                                        <Input id="edit-qty" name="quantityLitre" type="number" step="0.1" defaultValue={editingCollection.quantityLitre} required />
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
