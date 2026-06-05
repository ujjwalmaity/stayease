import api from "../api/axios";

export const createBooking = async (payload) => {
  const response = await api.post("/bookings", payload);
  return response.data;
};

export const getMyBookings = async () => {
  const response = await api.get("/bookings/mine");
  return response.data;
};

export const cancelBooking = async (bookingId) => {
  await api.put(`/bookings/${bookingId}/cancel`);
};
