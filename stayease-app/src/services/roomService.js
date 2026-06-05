import api from "../api/axios";

export const getAvailableRooms = async (
  hotelId,
  checkIn,
  checkOut,
) => {
  const response = await api.get(`/hotels/${hotelId}/rooms`, {
    params: {
      checkIn,
      checkOut,
    },
  });
  return response.data;
};

export const getManagerRooms = async () => {
  const response = await api.get("/manager/rooms");
  return response.data;
};

export const createRoom = async (hotelId, payload) => {
  const response = await api.post(`/hotels/${hotelId}/rooms`, payload);
  return response.data;
};

export const updateRoom = async (roomId, payload) => {
  const response = await api.put(`/rooms/${roomId}`, payload);
  return response.data;
};

export const deleteRoom = async (roomId) => {
  await api.delete(`/rooms/${roomId}`);
};

export const toggleRoomStatus = async (roomId) => {
  const response = await api.patch(`/rooms/${roomId}/status`);
  return response.data;
};
