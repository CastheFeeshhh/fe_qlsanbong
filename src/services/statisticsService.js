import axios from "../axios";

const getRevenueStatistics = (startDate, endDate) => {
  return axios.get(`/api/statistics/revenue`, {
    params: {
      startDate,
      endDate,
    },
  });
};

const getBookingsStatistics = (startDate, endDate) => {
  return axios.get(`/api/statistics/bookings`, {
    params: {
      startDate,
      endDate,
    },
  });
};

export { getRevenueStatistics, getBookingsStatistics };
