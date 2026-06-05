import api from "../api/axios";

export const searchHotels = async (city) => {
  const response = await api.get(`/hotels?city=${city}`);
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
  const response = await api.get("/hotels");
  return response.data;
};
