import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchOrderById } from "../services/ordersApi";

export default function OrderDetails() {
  const { id } = useParams();
  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => fetchOrderById(id!),
    enabled: !!id,
  });

  if (isLoading) return <div>Loading...</div>;
  if (!order) return <div>Not found</div>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-semibold">
        Order #{String(order._id).slice(-6).toUpperCase()}
      </h1>

      <section className="mb-6 rounded-lg border p-4">
        <h3 className="text-sm font-medium text-gray-700">Shipping Address</h3>
        <div className="mt-2 text-sm text-gray-600">
          <div>{order.address.name}</div>
          <div>{order.address.line1}</div>
          {order.address.line2 && <div>{order.address.line2}</div>}
          <div>
            {order.address.city} • {order.address.state} •{" "}
            {order.address.pincode}
          </div>
          <div>{order.address.country}</div>
        </div>
      </section>

      <section className="rounded-lg border p-4">
        <h3 className="text-sm font-medium text-gray-700">Items</h3>
        <div className="mt-2 space-y-3">
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
              <div className="ml-auto text-sm font-semibold">
                ₹{it.price * it.quantity}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
