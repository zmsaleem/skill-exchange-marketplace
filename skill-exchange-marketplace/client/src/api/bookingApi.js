import axiosInstance from './axiosInstance';

export const createBooking = async (bookingData) => {
  const { data } = await axiosInstance.post('/bookings', bookingData);
  return data;
};

export const getMyBookings = async () => {
  const { data } = await axiosInstance.get('/bookings/my-bookings');
  return data;
};

export const updateBookingStatus = async (id, status) => {
  const { data } = await axiosInstance.put(`/bookings/${id}/status`, { status });
  return data;
};
