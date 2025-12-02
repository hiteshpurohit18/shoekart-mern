import api from "./api";

export function signupUser(userData: {
  name: string;
  email: string;
  password: string;
}) {
  return api.post("/auth/signup", userData);
}

export function loginUser(data: { email: string; password: string }) {
  return api.post("/auth/login", data);
}
export function sendOtp(email: string) {
  return api.post("/auth/send-otp", { email });
}

export function verifyOtp(email: string, code: string) {
  return api.post("/auth/verify-otp", { email, code });
}
