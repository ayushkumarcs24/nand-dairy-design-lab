import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { LogisticsLayout } from "@/components/layout/LogisticsLayout";
import { DataTable } from "@/components/ui/data-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";

interface Vehicle {
    id: number;
    vehicleNumber: string;
    type: string;
    capacityLitre: number;
    status: "AVAILABLE" | "IN_TRANSIT" | "MAINTENANCE";
}

export default function LogisticsVehicles() {
    const { data: vehicles = [], isLoading } = useQuery<Vehicle[]>({
        queryKey: ["logistics-vehicles"],
        queryFn: async () => {
            const res = await api.get<Vehicle[]>("/logistics/vehicles");
            return res.data;
        },
    });

    const columns: ColumnDef<Vehicle>[] = [
        {
            accessorKey: "vehicleNumber",
            header: "Vehicle #",
        },
        {
            accessorKey: "type",
            header: "Type",
        },
        {
            accessorKey: "capacityLitre",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Capacity (L)" />,
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const statusColors = {
                    AVAILABLE: "text-green-600 bg-green-50",
                    IN_TRANSIT: "text-blue-600 bg-blue-50",
                    MAINTENANCE: "text-red-600 bg-red-50",
                };
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[row.original.status]}`}>
                        {row.original.status}
                    </span>
                );
            },
        },
    ];

    return (
        <LogisticsLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight">Vehicles</h1>
                </div>

                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    <DataTable columns={columns} data={vehicles} searchKey="vehicleNumber" searchPlaceholder="Search vehicle..." />
                )}
            </div>
        </LogisticsLayout>
    );
}
