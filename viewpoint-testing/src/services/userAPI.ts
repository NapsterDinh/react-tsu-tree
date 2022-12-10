import { AxiosResponse } from "axios";
import { axiosInstance } from "./axiosInstance";

const userApi = {
  getAllUser: async (payload, signal?): Promise<AxiosResponse<any>> => {
    if (!payload.search) {
      const url = "/users/getallUser";
      const response = axiosInstance.get<any>(
        url,
        signal && { signal: signal }
      );
      return response;
    } else {
      const url = `/users/getallUser?searchText=${payload.search}`;
      const response = axiosInstance.get<any>(
        url,
        signal && { signal: signal }
      );
      return response;
    }
  },
  deleteUser: async (payload: any): Promise<AxiosResponse<any>> => {
    const url = `/users/deleteUser/${payload}`;
    const response = axiosInstance.delete<any>(url);
    return response;
  },
  createUser: async (payload: any): Promise<AxiosResponse<any>> => {
    const url = "/users/addUser";
    const response = axiosInstance.post<any>(url, payload);
    return response;
  },
  updateUser: async (payload: any): Promise<AxiosResponse<any>> => {
    const url = `/users/updateUser/${payload.id}`;
    const response = axiosInstance.put<any>(url, payload);
    return response;
  },
  updateRole: async (payload: any): Promise<AxiosResponse<any>> => {
    const url = `/users/updateRoleUser/${payload.id}`;
    const response = axiosInstance.put<any>(url, { isAdmin: payload.isAdmin });
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
  getChartInfo: async () => {
    const url = "/users/statsUser";
    const response = axiosInstance.get<any>(url);
    return response;
  },
};

export { userApi };
