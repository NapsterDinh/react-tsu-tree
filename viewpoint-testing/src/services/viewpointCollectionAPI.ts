import { IResponseData } from "@models/model";
import { AxiosResponse } from "axios";
import { axiosInstance, axiosInstanceFormData } from "./axiosInstance";

const viewpointCollectionAPI = {
  getAllViewpointCollection: async (
    { payload }: any,
    signal?: any
  ): Promise<AxiosResponse<any>> => {
    if (!payload.search) {
      const url = `/ViewPointCollection?PageSize=${payload.PageSize}&PageNumber=${payload.PageNumber}`;
      const response = axiosInstance.get<any>(
        url,
        signal && { signal: signal }
      );
      return response;
    } else {
      const url = `/ViewPointCollection${payload.search}&PageSize=${payload.PageSize}&PageNumber=${payload.PageNumber}`;
      const response = axiosInstance.get<any>(
        url,
        signal && { signal: signal }
      );
      return response;
    }
  },

  searchViewpointCollection: async ({
    payload,
  }: any): Promise<AxiosResponse<any>> => {
    const url = `/ViewPointCollection?Text=${payload.search}`;
    const response = axiosInstance.get<any>(url);
    return response;
  },

  getViewpointCollectionById: async (
    id: string
  ): Promise<AxiosResponse<any>> => {
    const url = `/ViewPointCollection/GetById/${id}`;
    const response = axiosInstance.get<any>(url);
    return response;
  },
  getById: async (id: string, signal?: any): Promise<AxiosResponse<any>> => {
    const url = `/ViewPointCollection/GetById/${id}`;
    const response = axiosInstance.get<any>(url, signal && { signal: signal });
    return response;
  },
  deleteCollection: async ({
    payload,
  }: any): Promise<AxiosResponse<IResponseData>> => {
    const url = `/ViewPointCollection/${payload?.id}`;
    const response = axiosInstance.delete<any>(url);
    return response;
  },
  cloneCollection: async ({ payload }: any) => {
    const url = "/ViewPointCollection/AddVPCollection";
    const response = axiosInstance.post<any>(url, payload);
    return response;
  },
  createViewpointCollection: async ({
    payload,
  }: any): Promise<AxiosResponse<any>> => {
    const url = "/ViewPointCollection";
    const response = axiosInstance.post(url, payload);
    return response;
  },
  updateViewpointCollection: async ({
    payload,
    id,
  }: any): Promise<AxiosResponse<any>> => {
    const url = "/ViewPointCollection/" + id;
    const response = axiosInstance.put(url, payload);
    return response;
  },
  importViewpointCollection: async (
    payload
  ): Promise<AxiosResponse<any, any>> => {
    const url = "/Excel/ImportVP";
    const response = axiosInstanceFormData.post(url, payload);
    return response;
  },
  export: async (id: string): Promise<AxiosResponse<any, any>> => {
    const url = "/ViewPointCollection/export";
    const response = axiosInstance.get(url + "/" + id);
    return response;
  },
  ratingViewpointCollection: async (
    id,
    rating
  ): Promise<AxiosResponse<any, any>> => {
    const url = "/Rating";
    const response = axiosInstance.post(url, {
      viewPointCollectionId: id,
      startRating: rating,
    });
    return response;
  },
  updateStatus: async (id, payload): Promise<AxiosResponse<any, any>> => {
    const url = "/ViewPointCollection/Update";
    const response = axiosInstance.put(url + `/${id}`, payload);
    return response;
  },
  getHistoryChange: async (payload: any): Promise<AxiosResponse<any>> => {
    const url = `/HistoryChange/GetById/${payload.id}`;
    const response = axiosInstance.get<any>(url);
    return response;
  },
  addMember: async (payload): Promise<AxiosResponse<any, any>> => {
    const response = axiosInstance.put(
      `/ViewPointCollection/addMember/${payload.id}`,
      payload.data
    );
    return response;
  },
  removeOwner: async (payload: any): Promise<AxiosResponse<any>> => {
    const url = `/ViewPointCollection/removeMember/${payload.id}`;
    const response = axiosInstance.put<any>(url, payload.data);
    return response;
  },
};

export default viewpointCollectionAPI;
