import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { AdminLayout } from "@/components/layout/AdminLayout";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Pencil, Trash2, Ban } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    unit: string;
    inventory: number;
    isActive: boolean;
}

export default function AdminProducts() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const { data: products = [], isLoading } = useQuery<Product[]>({
        queryKey: ["products"],
        queryFn: async () => {
            const res = await api.get<Product[]>("/owner/products");
            return res.data;
        },
    });

    const createMutation = useMutation({
        mutationFn: async (data: Partial<Product>) => {
            await api.post("/owner/products", data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            setIsCreateOpen(false);
            toast({ title: "Product created successfully" });
        },
        onError: () => {
            toast({ title: "Failed to create product", variant: "destructive" });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number; data: Partial<Product> }) => {
            await api.put(`/owner/products/${id}`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            setEditingProduct(null);
            toast({ title: "Product updated successfully" });
        },
        onError: () => {
            toast({ title: "Failed to update product", variant: "destructive" });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/owner/products/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            toast({ title: "Product deleted successfully" });
        },
        onError: () => {
            toast({ title: "Failed to delete product", variant: "destructive" });
        },
    });

    const columns: ColumnDef<Product>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
        },
        {
            accessorKey: "description",
            header: "Description",
        },
        {
            accessorKey: "price",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Price (₹)" />,
            cell: ({ row }) => `₹${row.original.price}`,
        },
        {
            accessorKey: "unit",
            header: "Unit",
        },
        {
            accessorKey: "inventory",
            header: "Inventory",
        },
        {
            accessorKey: "isActive",
            header: "Status",
            cell: ({ row }) => (
                <span className={row.original.isActive ? "text-green-600" : "text-red-600"}>
                    {row.original.isActive ? "Active" : "Discontinued"}
                </span>
            ),
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const product = row.original;
                return (
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingProduct(product)}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600"
                            onClick={() => {
                                if (confirm("Are you sure you want to delete this product?")) {
                                    deleteMutation.mutate(product.id);
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
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            price: Number(formData.get("price")),
            unit: formData.get("unit") as string,
            inventory: Number(formData.get("inventory")),
            isActive: isEdit ? (formData.get("isActive") === "on") : true,
        };

        if (isEdit && editingProduct) {
            updateMutation.mutate({ id: editingProduct.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Add Product
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Product</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" name="name" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" name="description" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Price (₹)</Label>
                                        <Input id="price" name="price" type="number" step="0.01" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="unit">Unit</Label>
                                        <Input id="unit" name="unit" defaultValue="L" required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="inventory">Initial Inventory</Label>
                                    <Input id="inventory" name="inventory" type="number" defaultValue="0" />
                                </div>
                                <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                                    {createMutation.isPending ? "Creating..." : "Create Product"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    <DataTable columns={columns} data={products} searchKey="name" />
                )}

                <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Product</DialogTitle>
                        </DialogHeader>
                        {editingProduct && (
                            <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-name">Name</Label>
                                    <Input id="edit-name" name="name" defaultValue={editingProduct.name} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-description">Description</Label>
                                    <Textarea id="edit-description" name="description" defaultValue={editingProduct.description} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-price">Price (₹)</Label>
                                        <Input id="edit-price" name="price" type="number" step="0.01" defaultValue={editingProduct.price} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-unit">Unit</Label>
                                        <Input id="edit-unit" name="unit" defaultValue={editingProduct.unit} required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-inventory">Inventory</Label>
                                    <Input id="edit-inventory" name="inventory" type="number" defaultValue={editingProduct.inventory} />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="edit-isActive"
                                        name="isActive"
                                        defaultChecked={editingProduct.isActive}
                                        className="h-4 w-4 rounded border-gray-300"
                                    />
                                    <Label htmlFor="edit-isActive">Active</Label>
                                </div>
                                <Button type="submit" className="w-full" disabled={updateMutation.isPending}>
                                    {updateMutation.isPending ? "Updating..." : "Update Product"}
                                </Button>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
