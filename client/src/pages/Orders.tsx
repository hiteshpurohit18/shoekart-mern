import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "../services/ordersApi";
import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

export default function OrdersPage() {
  const { user } = useAuth();
  const {
    data: orders = [],
    isLoading,
    error,
  } = useQuery({
    // 👇 Fixed: Changed user?._id to user?.id
    queryKey: ["orders", user?.id],
    queryFn: fetchOrders,
    enabled: !!user,
    staleTime: 1000 * 30,
  });

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6">Failed to load orders</div>;
  if (!orders || orders.length === 0)
    return <div className="p-6">You have no orders yet.</div>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Your Orders</h1>

      <div className="space-y-4">
        {orders.map((order: any) => (
          <article key={order._id} className="rounded-lg border p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="mb-1 text-sm text-gray-500">
                  Order placed on {new Date(order.createdAt).toLocaleString()}
                </div>
                <div className="text-lg font-medium">
                  Order #{String(order._id).slice(-6).toUpperCase()}
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Status: {order.status}
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-500">Items</div>
                <div className="font-semibold"> {order.items.length}</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="space-y-2 sm:col-span-2">
                {order.items.map((it: any) => (
                  <div
                    key={`${it.productId}_${it.size}`}
                    className="flex items-center gap-3"
                  >
                    <img
                      src={it.imageURL || "/placeholder.png"}
                      className="h-12 w-12 rounded object-cover"
                    />
                    <div>
                      <div className="text-sm font-medium">{it.name}</div>
                      <div className="text-xs text-gray-500">
                        Size {it.size} • Qty {it.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="text-sm text-gray-500">Subtotal</div>
                <div className="text-lg font-semibold">₹{order.subtotal}</div>

                <Link
                  to={`/orders/${order._id}`}
                  className="mt-3 text-sm text-blue-600 hover:underline"
                >
                  View details
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
