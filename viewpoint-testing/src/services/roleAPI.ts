import { AxiosResponse } from "axios";
// import { LoginRequest } from "../pages/LoginPage/LoginPage";
import { axiosInstance } from "./axiosInstance";

const roleApi = {
  getAllRole: async ({ payload }: any): Promise<AxiosResponse<any>> => {
    const url = "/Role";
    // ("api", payload);
    const response = axiosInstance.get<any>(url, payload);
    return response;
  },
  getAllPermission: async ({ payload }: any): Promise<AxiosResponse<any>> => {
    const url = "/Role/GetPermission";
    const response = axiosInstance.get<any>(url, payload);
    return response;
  },
  getRoleById: async (payload: any): Promise<AxiosResponse<any>> => {
    const url = `/Role/GetByIdRole/${payload}`;
    // ("api", payload);
    const response = axiosInstance.get<any>(url, payload);
    return response;
  },
  createRole: async (payload: any): Promise<AxiosResponse<any>> => {
    const url = "/Role";
    // ("api", payload);
    const response = axiosInstance.post<any>(url, payload);
    return response;
  },
  updatePermissions: async (res: any, id): Promise<AxiosResponse<any>> => {
    const url = `/Role/UpdatePerRole?roleId=${id}`;
    // ("api", payload);
    const response = axiosInstance.put<any>(url, res);
    return response;
  },
  updateRole: async (res: any, id): Promise<AxiosResponse<any>> => {
    const url = `/Role/UpdateRole?id=${id}`;
    // ("api", payload);
    const response = axiosInstance.put<any>(url, res);
    return response;
  },
  deleteRole: async (id): Promise<AxiosResponse<any>> => {
    const url = `/Role/${id}`;
    // ("api", payload);
    const response = axiosInstance.delete<any>(url);
    return response;
  },
};

export { roleApi };
