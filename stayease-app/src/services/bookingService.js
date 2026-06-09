import api from "../api/axios";

export const createBooking = async (payload) => {
  const response = await api.post("/bookings", payload);
  return response.data;
};

export const getMyBookings = async (userId) => {
  const response = await api.get(`/bookings/mine/${userId}`);
  return response.data;
};

export const cancelBooking = async (bookingId, payload) => {
  await api.put(`/bookings/${bookingId}/cancel`, payload);
};
