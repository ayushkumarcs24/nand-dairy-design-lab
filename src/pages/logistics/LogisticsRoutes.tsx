import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { LogisticsLayout } from "@/components/layout/LogisticsLayout";
import { DataTable } from "@/components/ui/data-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";

interface Route {
    id: number;
    name: string;
    startLocation: string;
    endLocation: string;
    distanceKm: number;
}

export default function LogisticsRoutes() {
    const { data: routes = [], isLoading } = useQuery<Route[]>({
        queryKey: ["logistics-routes"],
        queryFn: async () => {
            const res = await api.get<Route[]>("/logistics/routes");
            return res.data;
        },
    });

    const columns: ColumnDef<Route>[] = [
        {
            accessorKey: "name",
            header: "Route Name",
        },
        {
            accessorKey: "startLocation",
            header: "Start Location",
        },
        {
            accessorKey: "endLocation",
            header: "End Location",
        },
        {
            accessorKey: "distanceKm",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Distance (km)" />,
        },
    ];

    return (
        <LogisticsLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight">Routes</h1>
                </div>

                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    <DataTable columns={columns} data={routes} searchKey="name" searchPlaceholder="Search route..." />
                )}
            </div>
        </LogisticsLayout>
    );
}
