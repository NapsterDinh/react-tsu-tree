import { AxiosResponse } from "axios";
import { axiosInstance } from "./axiosInstance";

const baseUrl = "/HistoryChange/GetById";

const historyChangeAPI = {
  getHistoryChanges: async (payload: any): Promise<AxiosResponse<any>> => {
    const url = `${baseUrl}/${payload.id}?PageNumber=${payload.PageNumber}&PageSize=${payload.PageSize}`;
    const response = axiosInstance.get<any>(url);
    return response;
  },
};

export default historyChangeAPI;
