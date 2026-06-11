import api from "../api/axios";

export const searchHotels = async (city, checkIn, checkOut) => {
  const response = await api.get("/hotels", { params: { city, checkIn, checkOut } });
  return response.data;
};

export const getHotelById = async (hotelId) => {
  const response = await api.get(`/hotels/${hotelId}`);
  return response.data;
};

export const createHotel = async (payload) => {
  const response = await api.post("/hotels", payload);
  return response.data;
};

export const updateHotel = async (hotelId, payload) => {
  const response = await api.put(`/hotels/${hotelId}`, payload);
  return response.data;
};

export const deleteHotel = async (hotelId) => {
  await api.delete(`/hotels/${hotelId}`);
};

export const getAllHotels = async () => {
  const response = await api.get("/hotels/all");
  return response.data;
};
