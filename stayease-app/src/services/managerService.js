import api from "../api/axios";

export const getUpcomingBookings = async () => {
  const response = await api.get("/bookings/manager/upcoming");
  return response.data;
};
