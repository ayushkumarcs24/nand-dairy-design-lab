import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DistributorLayout } from "@/components/layout/DistributorLayout";
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
import { Plus } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

interface Product {
  id: number;
  name: string;
  price: number;
}

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  totalPrice: number;
  product: Product;
}

interface DistributorOrder {
  id: number;
  createdAt: string;
  status: "PENDING" | "APPROVED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  totalAmount: number;
  items: OrderItem[];
}

export default function DistributorOrders() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: orders = [], isLoading } = useQuery<DistributorOrder[]>({
    queryKey: ["distributor-orders"],
    queryFn: async () => {
      const res = await api.get<DistributorOrder[]>("/distributor/orders");
      return res.data;
    },
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["products-list"],
    queryFn: async () => {
      const res = await api.get<Product[]>("/distributor/products");
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: { productId: number; quantity: number }) => {
      await api.post("/distributor/orders", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["distributor-orders"] });
      setIsCreateOpen(false);
      toast({ title: "Order placed successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to place order", description: error.message, variant: "destructive" });
    },
  });

  const columns: ColumnDef<DistributorOrder>[] = [
    {
      accessorKey: "id",
      header: "Order #",
      cell: ({ row }) => `#${row.original.id}`,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
      cell: ({ row }) => format(new Date(row.original.createdAt), "MMM d, yyyy"),
    },
    {
      accessorKey: "items",
      header: "Items",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          {row.original.items.map((item) => (
            <span key={item.id} className="text-sm">
              {item.product.name} x {item.quantity}
            </span>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "totalAmount",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Total (₹)" />,
      cell: ({ row }) => `₹${row.original.totalAmount.toFixed(2)}`,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const statusColors = {
          PENDING: "text-amber-600 bg-amber-50",
          APPROVED: "text-blue-600 bg-blue-50",
          SHIPPED: "text-purple-600 bg-purple-50",
          DELIVERED: "text-green-600 bg-green-50",
          CANCELLED: "text-red-600 bg-red-50",
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[row.original.status]}`}>
            {row.original.status}
          </span>
        );
      },
    },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createMutation.mutate({
      productId: Number(formData.get("productId")),
      quantity: Number(formData.get("quantity")),
    });
  };

  return (
    <DistributorLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New Order
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Place New Order</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="productId">Product</Label>
                  <Select name="productId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={String(product.id)}>
                          {product.name} - ₹{product.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input id="quantity" name="quantity" type="number" min="1" required />
                </div>
                <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Placing Order..." : "Place Order"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <DataTable columns={columns} data={orders} searchKey="id" searchPlaceholder="Search order ID..." />
        )}
      </div>
    </DistributorLayout>
  );
}
