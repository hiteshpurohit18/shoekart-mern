import api from "./api"; // your axios instance that sets baseURL + auth headers

export async function createOrder(payload: {
  items: any[];
  address: any;
  subtotal: number;
  shipping?: number;
  total: number;
  paymentMethod?: string;
}) {
  const res = await api.post("/orders", payload);
  return res.data;
}

export async function fetchOrders() {
  const res = await api.get("/orders");
  return res.data.orders; // as returned by controller
}

export async function fetchOrderById(id: string) {
  const res = await api.get(`/orders/${id}`);
  return res.data.order;
}
