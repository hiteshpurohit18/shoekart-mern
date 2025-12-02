import api from "./api";

export const getCart = async () => {
  const res = await api.get("/cart");
  return res.data;
};

export const addToCart = async (item: {
  productId: string;
  size: number;
  quantity: number;
}) => {
  const res = await api.post("/cart/add", item);
  return res.data;
};

export const updateCart = async (payload: {
  productId: string;
  size: number;
  quantity: number;
}) => {
  const res = await api.patch("/cart/update", payload);
  return res.data;
};

export const removeFromCart = async (payload: {
  productId: string;
  size: number;
}) => {
  const res = await api.delete("/cart/remove", { data: payload });
  return res.data;
};

export const clearCartApi = async () => {
  const res = await api.delete("/cart/clear");
  return res.data;
};
