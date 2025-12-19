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
import { useToast } from "@/components/ui/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

interface Vehicle {
    id: number;
    vehicleCode: string;
    plateNumber: string;
    capacityLitre: number;
    driverName: string;
    isActive: boolean;
}

export default function AdminVehicles() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

    const { data: vehicles = [], isLoading } = useQuery<Vehicle[]>({
        queryKey: ["vehicles"],
        queryFn: async () => {
            const res = await api.get<Vehicle[]>("/owner/vehicles");
            return res.data;
        },
    });

    const createMutation = useMutation({
        mutationFn: async (data: Partial<Vehicle>) => {
            await api.post("/owner/vehicles", data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vehicles"] });
            setIsCreateOpen(false);
            toast({ title: "Vehicle created successfully" });
        },
        onError: () => {
            toast({ title: "Failed to create vehicle", variant: "destructive" });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number; data: Partial<Vehicle> }) => {
            await api.put(`/owner/vehicles/${id}`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vehicles"] });
            setEditingVehicle(null);
            toast({ title: "Vehicle updated successfully" });
        },
        onError: () => {
            toast({ title: "Failed to update vehicle", variant: "destructive" });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/owner/vehicles/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vehicles"] });
            toast({ title: "Vehicle deleted successfully" });
        },
        onError: () => {
            toast({ title: "Failed to delete vehicle", variant: "destructive" });
        },
    });

    const columns: ColumnDef<Vehicle>[] = [
        {
            accessorKey: "vehicleCode",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Code" />,
        },
        {
            accessorKey: "plateNumber",
            header: "Plate Number",
        },
        {
            accessorKey: "capacityLitre",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Capacity (L)" />,
        },
        {
            accessorKey: "driverName",
            header: "Driver",
        },
        {
            accessorKey: "isActive",
            header: "Status",
            cell: ({ row }) => (
                <span className={row.original.isActive ? "text-green-600" : "text-red-600"}>
                    {row.original.isActive ? "Active" : "Inactive"}
                </span>
            ),
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const vehicle = row.original;
                return (
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingVehicle(vehicle)}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600"
                            onClick={() => {
                                if (confirm("Are you sure you want to delete this vehicle?")) {
                                    deleteMutation.mutate(vehicle.id);
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
            vehicleCode: formData.get("vehicleCode") as string,
            plateNumber: formData.get("plateNumber") as string,
            capacityLitre: Number(formData.get("capacityLitre")),
            driverName: formData.get("driverName") as string,
            isActive: isEdit ? (formData.get("isActive") === "on") : true,
        };

        if (isEdit && editingVehicle) {
            updateMutation.mutate({ id: editingVehicle.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight">Vehicles</h1>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Add Vehicle
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Vehicle</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="vehicleCode">Vehicle Code</Label>
                                    <Input id="vehicleCode" name="vehicleCode" required placeholder="TRK-001" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="plateNumber">Plate Number</Label>
                                    <Input id="plateNumber" name="plateNumber" required placeholder="GJ-01-AB-1234" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="capacityLitre">Capacity (L)</Label>
                                    <Input id="capacityLitre" name="capacityLitre" type="number" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="driverName">Driver Name</Label>
                                    <Input id="driverName" name="driverName" required />
                                </div>
                                <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                                    {createMutation.isPending ? "Creating..." : "Create Vehicle"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    <DataTable columns={columns} data={vehicles} searchKey="plateNumber" searchPlaceholder="Search by plate number..." />
                )}

                <Dialog open={!!editingVehicle} onOpenChange={(open) => !open && setEditingVehicle(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Vehicle</DialogTitle>
                        </DialogHeader>
                        {editingVehicle && (
                            <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-vehicleCode">Vehicle Code</Label>
                                    <Input id="edit-vehicleCode" name="vehicleCode" defaultValue={editingVehicle.vehicleCode} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-plateNumber">Plate Number</Label>
                                    <Input id="edit-plateNumber" name="plateNumber" defaultValue={editingVehicle.plateNumber} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-capacityLitre">Capacity (L)</Label>
                                    <Input id="edit-capacityLitre" name="capacityLitre" type="number" defaultValue={editingVehicle.capacityLitre} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-driverName">Driver Name</Label>
                                    <Input id="edit-driverName" name="driverName" defaultValue={editingVehicle.driverName} required />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="edit-isActive"
                                        name="isActive"
                                        defaultChecked={editingVehicle.isActive}
                                        className="h-4 w-4 rounded border-gray-300"
                                    />
                                    <Label htmlFor="edit-isActive">Active</Label>
                                </div>
                                <Button type="submit" className="w-full" disabled={updateMutation.isPending}>
                                    {updateMutation.isPending ? "Updating..." : "Update Vehicle"}
                                </Button>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
