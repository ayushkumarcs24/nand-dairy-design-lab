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
import { Plus, Trash2, Bell } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

interface Farmer {
    id: number;
    farmerCode: string;
    village: string;
    userId: number;
    user: {
        name: string;
        email: string;
    };
}

export default function SamitiFarmers() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);

    const { data: farmers = [], isLoading } = useQuery<Farmer[]>({
        queryKey: ["samiti-farmers"],
        queryFn: async () => {
            const res = await api.get<Farmer[]>("/samiti/farmers");
            return res.data;
        },
    });

    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            await api.post("/samiti/farmers", data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["samiti-farmers"] });
            setIsCreateOpen(false);
            toast({ title: "Farmer added successfully" });
        },
        onError: (error: any) => {
            toast({ title: "Failed to add farmer", description: error.message, variant: "destructive" });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/samiti/farmers/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["samiti-farmers"] });
            toast({ title: "Farmer removed successfully" });
        },
        onError: (error: any) => {
            toast({ title: "Failed to remove farmer", description: "This farmer may have associated records.", variant: "destructive" });
        },
    });

    const notificationMutation = useMutation({
        mutationFn: async (data: { userId: number; title: string; message: string; type: string }) => {
            await api.post("/samiti/notifications/send", data);
        },
        onSuccess: () => {
            setNotificationOpen(false);
            setSelectedFarmer(null);
            toast({ title: "Notification sent successfully" });
        },
        onError: () => {
            toast({ title: "Failed to send notification", variant: "destructive" });
        },
    });

    const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        createMutation.mutate({
            name: formData.get("name"),
            email: formData.get("email"),
            farmerCode: formData.get("farmerCode"),
            village: formData.get("village"),
        });
    };

    const handleSendNotification = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedFarmer) return;
        const formData = new FormData(e.currentTarget);
        notificationMutation.mutate({
            userId: selectedFarmer.userId,
            title: formData.get("title") as string,
            message: formData.get("message") as string,
            type: "GENERAL",
        });
    };

    const columns: ColumnDef<Farmer>[] = [
        {
            accessorKey: "farmerCode",
            header: "Code",
        },
        {
            accessorKey: "user.name",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
        },
        {
            accessorKey: "village",
            header: "Village",
        },
        {
            accessorKey: "user.email",
            header: "Email",
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const farmer = row.original;
                return (
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                setSelectedFarmer(farmer);
                                setNotificationOpen(true);
                            }}
                            title="Send Notification"
                        >
                            <Bell className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600"
                            onClick={() => {
                                if (confirm("Are you sure you want to remove this farmer?")) {
                                    deleteMutation.mutate(farmer.id);
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

    return (
        <SamitiLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight">Farmers Management</h1>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-[#8B7355] hover:bg-[#6D5A43] text-white">
                                <Plus className="mr-2 h-4 w-4" /> Add Farmer
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Farmer</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" name="name" required placeholder="e.g. Ramesh Patel" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" name="email" type="email" required placeholder="farmer@example.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="farmerCode">Farmer Code</Label>
                                    <Input id="farmerCode" name="farmerCode" required placeholder="e.g. F-1001" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="village">Village</Label>
                                    <Input id="village" name="village" required placeholder="e.g. Patel Nagar" />
                                </div>
                                <Button type="submit" className="w-full bg-[#8B7355] text-white" disabled={createMutation.isPending}>
                                    {createMutation.isPending ? "Adding..." : "Add Farmer"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    <DataTable columns={columns} data={farmers} searchKey="user.name" searchPlaceholder="Search farmer..." />
                )}

                <Dialog open={notificationOpen} onOpenChange={setNotificationOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Send Notification to {selectedFarmer?.user.name}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSendNotification} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" name="title" required placeholder="Notification Title" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Input id="message" name="message" required placeholder="Enter message here..." />
                            </div>
                            <Button type="submit" className="w-full" disabled={notificationMutation.isPending}>
                                {notificationMutation.isPending ? "Sending..." : "Send Notification"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </SamitiLayout>
    );
}
