import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { LogisticsLayout } from "@/components/layout/LogisticsLayout";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Truck } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";

interface LogisticsDispatch {
    id: number;
    dispatchDate: string;
    status: "PENDING" | "IN_TRANSIT" | "DELIVERED";
    vehicle: {
        vehicleNumber: string;
    };
    route: {
        name: string;
    };
    orders: {
        id: number;
    }[];
}

interface Vehicle {
    id: number;
    vehicleNumber: string;
    status: string;
}

interface Route {
    id: number;
    name: string;
}

interface PendingOrder {
    id: number;
    totalAmount: number;
    createdAt: string;
}

export default function LogisticsDispatches() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const { data: dispatches = [], isLoading } = useQuery<LogisticsDispatch[]>({
        queryKey: ["logistics-dispatches"],
        queryFn: async () => {
            const res = await api.get<LogisticsDispatch[]>("/logistics/dispatches");
            return res.data;
        },
    });

    const { data: vehicles = [] } = useQuery<Vehicle[]>({
        queryKey: ["available-vehicles"],
        queryFn: async () => {
            const res = await api.get<Vehicle[]>("/logistics/vehicles");
            return res.data.filter((v) => v.status === "AVAILABLE");
        },
    });

    const { data: routes = [] } = useQuery<Route[]>({
        queryKey: ["routes-list"],
        queryFn: async () => {
            const res = await api.get<Route[]>("/logistics/routes");
            return res.data;
        },
    });

    const { data: pendingOrders = [] } = useQuery<PendingOrder[]>({
        queryKey: ["pending-orders"],
        queryFn: async () => {
            const res = await api.get<PendingOrder[]>("/logistics/pending-orders");
            return res.data;
        },
    });

    const createMutation = useMutation({
        mutationFn: async (data: { vehicleId: number; routeId: number; orderIds: number[] }) => {
            await api.post("/logistics/dispatches", data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["logistics-dispatches"] });
            queryClient.invalidateQueries({ queryKey: ["available-vehicles"] });
            queryClient.invalidateQueries({ queryKey: ["pending-orders"] });
            setIsCreateOpen(false);
            toast({ title: "Dispatch created successfully" });
        },
        onError: (error: any) => {
            toast({ title: "Failed to create dispatch", description: error.message, variant: "destructive" });
        },
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: number; status: string }) => {
            await api.put(`/logistics/dispatches/${id}/status`, { status });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["logistics-dispatches"] });
            toast({ title: "Status updated successfully" });
        },
        onError: () => {
            toast({ title: "Failed to update status", variant: "destructive" });
        },
    });

    const columns: ColumnDef<LogisticsDispatch>[] = [
        {
            accessorKey: "id",
            header: "Dispatch #",
            cell: ({ row }) => `#${row.original.id}`,
        },
        {
            accessorKey: "dispatchDate",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
            cell: ({ row }) => format(new Date(row.original.dispatchDate), "MMM d, yyyy"),
        },
        {
            accessorKey: "vehicle.vehicleNumber",
            header: "Vehicle",
        },
        {
            accessorKey: "route.name",
            header: "Route",
        },
        {
            accessorKey: "orders",
            header: "Orders",
            cell: ({ row }) => row.original.orders.length,
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const statusColors = {
                    PENDING: "text-amber-600 bg-amber-50",
                    IN_TRANSIT: "text-blue-600 bg-blue-50",
                    DELIVERED: "text-green-600 bg-green-50",
                };
                return (
                    <Select
                        defaultValue={row.original.status}
                        onValueChange={(val) => updateStatusMutation.mutate({ id: row.original.id, status: val })}
                    >
                        <SelectTrigger className={`w-[130px] h-8 text-xs font-medium border-0 ${statusColors[row.original.status]}`}>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                            <SelectItem value="DELIVERED">Delivered</SelectItem>
                        </SelectContent>
                    </Select>
                );
            },
        },
    ];

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const orderIds = Array.from(formData.getAll("orderIds")).map(Number);

        createMutation.mutate({
            vehicleId: Number(formData.get("vehicleId")),
            routeId: Number(formData.get("routeId")),
            orderIds,
        });
    };

    return (
        <LogisticsLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight">Dispatches</h1>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> New Dispatch
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Create New Dispatch</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="vehicleId">Vehicle</Label>
                                    <Select name="vehicleId" required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select vehicle" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {vehicles.map((vehicle) => (
                                                <SelectItem key={vehicle.id} value={String(vehicle.id)}>
                                                    {vehicle.vehicleNumber}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="routeId">Route</Label>
                                    <Select name="routeId" required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select route" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {routes.map((route) => (
                                                <SelectItem key={route.id} value={String(route.id)}>
                                                    {route.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Select Orders</Label>
                                    <div className="border rounded-md p-4 max-h-48 overflow-y-auto space-y-2">
                                        {pendingOrders.length === 0 ? (
                                            <p className="text-sm text-muted-foreground">No pending orders available.</p>
                                        ) : (
                                            pendingOrders.map((order) => (
                                                <div key={order.id} className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        name="orderIds"
                                                        value={order.id}
                                                        id={`order-${order.id}`}
                                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <label htmlFor={`order-${order.id}`} className="text-sm">
                                                        Order #{order.id} - ₹{order.totalAmount} ({format(new Date(order.createdAt), "MMM d")})
                                                    </label>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                                <Button type="submit" className="w-full" disabled={createMutation.isPending || pendingOrders.length === 0}>
                                    {createMutation.isPending ? "Creating..." : "Create Dispatch"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    <DataTable columns={columns} data={dispatches} searchKey="id" searchPlaceholder="Search dispatch ID..." />
                )}
            </div>
        </LogisticsLayout>
    );
}
