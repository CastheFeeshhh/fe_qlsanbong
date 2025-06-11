import axios from "../axios";

const getRevenueStatistics = (startDate, endDate) => {
  return axios.get(`/api/statistics/revenue`, {
    params: {
      startDate,
      endDate,
    },
  });
};

export { getRevenueStatistics };
