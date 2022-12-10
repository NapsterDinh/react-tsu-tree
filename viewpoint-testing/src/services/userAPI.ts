import { AxiosResponse } from "axios";
import { axiosInstance } from "./axiosInstance";

const userApi = {
  getAllUser: async (payload, signal?): Promise<AxiosResponse<any>> => {
    if (!payload.search) {
      const url = `/User?PageSize=${payload.PageSize}&PageNumber=${payload.PageNumber}`;
      const response = axiosInstance.get<any>(
        url,
        signal && { signal: signal }
      );
      return response;
    } else {
      const url = `/User${payload.search}&PageSize=${payload.PageSize}&PageNumber=${payload.PageNumber}`;
      const response = axiosInstance.get<any>(
        url,
        signal && { signal: signal }
      );
      return response;
    }
  },
  updateRole: async (payload: any): Promise<AxiosResponse<any>> => {
    const url = `/User/UpdateUser/${payload.id}`;
    const response = axiosInstance.put<any>(url, { role: payload.role });
    return response;
  },
  updateStatus: async (payload: any): Promise<AxiosResponse<any>> => {
    const url = `/User/UpdateStatus/${payload.id}`;
    const status = payload.isActive;
    const response = axiosInstance.put<any>(url, {
      isActive: status,
    });
    return response;
  },
  searchUser: async ({ payload }: any): Promise<AxiosResponse<any>> => {
    const url = `/User?Text=${payload.search}&PageSize=${200}&PageNumber=${1}`;
    const response = axiosInstance.get<any>(url);
    return response;
  },
  getOwnerFilter: async () => {
    const url = `/User?PageSize=${200}&PageNumber=1`;
    const response = axiosInstance.get<any>(url);
    return response;
  },
};

export { userApi };
