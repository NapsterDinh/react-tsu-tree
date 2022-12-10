import { AxiosResponse } from "axios";
import { axiosInstance } from "./axiosInstance";

const requestAPI = {
  createRequest: async ({ payload }: any): Promise<AxiosResponse<any>> => {
    const url = "/Request/addRequest";
    const response = axiosInstance.post(url, payload);
    return response;
  },
  getAllRequest: async ({ payload, signal }): Promise<AxiosResponse<any>> => {
    if (!payload.search) {
      const url = `/request?PageSize=${payload.PageSize}&PageNumber=${payload.PageNumber}`;
      const response = axiosInstance.get<any>(
        url,
        signal && { signal: signal }
      );
      return response;
    } else {
      const url = `/request${payload.search}&PageSize=${payload.PageSize}&PageNumber=${payload.PageNumber}`;
      const response = axiosInstance.get<any>(
        url,
        signal && { signal: signal }
      );
      return response;
    }
  },
  getDetailRequest: async (
    { id }: any,
    signal?: any
  ): Promise<AxiosResponse<any>> => {
    const url = `/Request/GetById?requestId=${id}`;
    const response = axiosInstance.get(url, signal && { signal: signal });
    return response;
  },
  saveDraftRequest: async (payload, id): Promise<AxiosResponse<any>> => {
    const url = `/Request/updateDraft/${id}`;
    const response = axiosInstance.patch(url, payload);
    return response;
  },
  saveDraftProductRequest: async (payload, id): Promise<AxiosResponse<any>> => {
    const url = `/Request/updateProductDraft/${id}`;
    const response = axiosInstance.patch(url, payload);
    return response;
  },
  approveRequest: async (payload, id): Promise<AxiosResponse<any>> => {
    const url = `/Request/approveRequest/${id}`;
    const response = axiosInstance.patch(url, payload);
    return response;
  },
  rejectRequest: async (payload: {
    id: string;
  }): Promise<AxiosResponse<any>> => {
    const url = `/Request/reject/${payload.id}`;
    const response = axiosInstance.patch(url, payload);
    return response;
  },
};

export default requestAPI;
