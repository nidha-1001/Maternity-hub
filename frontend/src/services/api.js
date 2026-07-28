import axios from "axios";

const API = axios.create({
  baseURL: "/api",
});

// Interceptor to attach Authorization header
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const loginApi = (data) => API.post("/auth/login", data);
export const registerApi = (data) => API.post("/auth/register", data);
export const getProfileApi = () => API.get("/users/profile");
export const updateProfileApi = (data) => API.put("/users/profile", data);

// Centers API
export const getCentersApi = (status) => API.get(`/centers${status ? `?status=${status}` : ""}`);
export const getCenterByIdApi = (id) => API.get(`/centers/${id}`);
export const registerCenterApi = (data) => API.post("/centers", data);
export const updateCenterApi = (id, data) => API.put(`/centers/${id}`, data);
export const updateCenterStatusApi = (id, status) => API.put(`/admin/center-status/${id}`, { status });

// Services API
export const getServicesApi = (centerId) => API.get(`/services${centerId ? `?center=${centerId}` : ""}`);
export const addServiceApi = (data) => API.post("/services", data);
export const updateServiceApi = (id, data) => API.put(`/services/${id}`, data);
export const deleteServiceApi = (id) => API.delete(`/services/${id}`);

// Bookings API
export const createBookingApi = (data) => API.post("/bookings", data);
export const getBookingsApi = () => API.get("/bookings");
export const updateBookingStatusApi = (id, data) => API.put(`/bookings/${id}`, data);
export const deleteBookingApi = (id) => API.delete(`/bookings/${id}`);

// Reviews API
export const getReviewsApi = (centerId) => API.get(`/reviews${centerId ? `?center=${centerId}` : ""}`);
export const addReviewApi = (data) => API.post("/reviews", data);

// Payments API
export const createPaymentApi = (data) => API.post("/payments", data);
export const getPaymentsApi = () => API.get("/payments");

// Admin API
export const getAdminDashboardApi = () => API.get("/admin/dashboard");
export const getAllUsersApi = () => API.get("/users");

export default API;
