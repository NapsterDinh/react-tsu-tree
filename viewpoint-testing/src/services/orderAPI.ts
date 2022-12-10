import { AxiosResponse } from "axios";
import { axiosInstance } from "./axiosInstance";

const orderAPI = {
  getAllOrder: async (payload, signal?): Promise<AxiosResponse<any>> => {
    if (!payload.search) {
      const url = "/orders/allOrderList";
      const response = axiosInstance.get<any>(
        url,
        signal && { signal: signal }
      );
      return response;
    } else {
      const url = `/orders/allOrderList?searchText=${payload.search}`;
      const response = axiosInstance.get<any>(
        url,
        signal && { signal: signal }
      );
      return response;
    }
  },
  getChartInfo: async () => {
    const url = "/orders/statsOrder";
    const response = axiosInstance.get<any>(url);
    return response;
  },
  updateDelivery: async (payload) => {
    const url = `/orders/updateDelivery/${payload}`;
    const response = axiosInstance.put<any>(url, payload);
    return response;
  },
  deleteOrder: async (id) => {
    const url = `/orders/deleteOrder/${id}`;
    const response = axiosInstance.delete<any>(url);
    return response;
  },
};

export { orderAPI };
