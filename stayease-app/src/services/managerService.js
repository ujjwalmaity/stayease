import api from "../api/axios";

export const getUpcomingBookings = async () => {
  const response = await api.get("/manager/bookings");
  return response.data;
};
