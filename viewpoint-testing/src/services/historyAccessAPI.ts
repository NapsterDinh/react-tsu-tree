import { IDataBodyFilterLog } from "@models/model";
import { AxiosResponseCustom, ResponseWithPagination } from "@models/type";
import { axiosInstance } from "./axiosInstance";

const HistoryAccessAPI = {
  filterLogs: async (
    data: IDataBodyFilterLog,
    signal?
  ): Promise<AxiosResponseCustom<ResponseWithPagination | any>> => {
    const response = await axiosInstance.get("/Log/FilterLogs", {
      signal: signal,
      params: data,
    });
    return response;
  },
};

export default HistoryAccessAPI;
