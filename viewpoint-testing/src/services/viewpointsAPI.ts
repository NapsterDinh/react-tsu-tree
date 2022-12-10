import type { User } from "@models/model";
import { SHORT_TYPE } from "@utils/constants";
import { handleFileNameWithLangueAndTimeNow } from "@utils/fileUtils";
import { AxiosResponse } from "axios";
import { axiosInstance, axiosInstanceFormData } from "./axiosInstance";

const baseUrl = "/ViewPoint";

export type IViewpoint = {
  id: number;
  name: string;
  thumbnail: string;
  owner: User;
  lastOpenedTime: Date;
  description: string;
  isPublic?: boolean;
  viewPointStructors: [];
};

export type ResponseViewpoints = {
  isSuccess: true;
  data: IViewpoint[];
  errors: string[];
};

const ViewpointAPI = {
  getAllViewpoint: async (): Promise<
    AxiosResponse<ResponseViewpoints, any>
  > => {
    const url = "/viewpoints";
    const response = axiosInstance.get(url);
    return response;
  },
  addNewNode: async (payload): Promise<AxiosResponse<any, any>> => {
    const response = axiosInstance.post(baseUrl, payload);
    return response;
  },
  updateNode: async (payload, id): Promise<AxiosResponse<any, any>> => {
    const response = axiosInstance.put(baseUrl + `/${id}`, payload);
    return response;
  },
  updateLockedNode: async (payload): Promise<AxiosResponse<any, any>> => {
    const response = axiosInstance.put(baseUrl + "/UpdateLocker", payload);
    return response;
  },
  updatePositionNode: async (payload): Promise<AxiosResponse<any, any>> => {
    const response = axiosInstance.put(baseUrl + "/UpdatePosition", payload);
    return response;
  },
  deleteNode: async (
    id,
    isDeleteAllChildrenNode
  ): Promise<AxiosResponse<any, any>> => {
    let response = null;
    if (isDeleteAllChildrenNode) {
      response = axiosInstance.delete(baseUrl + `/${id}`);
    } else {
      response = axiosInstance.delete(baseUrl + "/DeleteKeepVP" + `/${id}`);
    }
    return response;
  },
  deleteNodeByListId: async (ids): Promise<AxiosResponse<any, any>> => {
    const authTokens = localStorage.getItem("token");
    const contentLanguage = localStorage.getItem("i18nextLng");
    const dataLanguage = localStorage.getItem("dataLanguage");
    const response = axiosInstance.delete(baseUrl + "/DeleteListViewPoint", {
      headers: {
        Authorization: `Bearer ${authTokens}`,
        ContentLanguage: dataLanguage ?? contentLanguage ?? "en",
      },
      data: {
        viewPointIds: ids,
      },
    });
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
  createHistoryChange: async (payload: any): Promise<AxiosResponse<any>> => {
    const url = "/HistoryChange";
    const response = axiosInstance.post<any>(url, payload);
    return response;
  },
  getHistoryChange: async (payload: any): Promise<AxiosResponse<any>> => {
    const url = `/HistoryChange/GetById/${payload.id}`;
    const response = axiosInstance.get<any>(url);
    return response;
  },
  importAppendChild: async ({ payload }: any): Promise<AxiosResponse<any>> => {
    const url = `/Excel/ImportVP-append/${payload.id}`;
    const response = axiosInstanceFormData.post(url, payload.data);
    return response;
  },
  importDataLanguage: async ({ payload }: any): Promise<AxiosResponse<any>> => {
    const url = "/Excel/TranslateImportVP";
    const response = axiosInstance.post(url, payload.data);
    return response;
  },
  exportViewpoint: (payload) => {
    const url = `/Excel/ExportVP/${payload.id}`;
    axiosInstance.get(url, { responseType: "arraybuffer" }).then((res: any) => {
      const blob = new Blob([res], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${handleFileNameWithLangueAndTimeNow(
        payload.name,
        payload.language,
        SHORT_TYPE.VIEWPOINT_COLLECTION
      )}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
  },
  exportViewpointWithLevel: (payload) => {
    const url = `/Excel/ExportCollectionLevel/${payload.id}`;
    axiosInstance.get(url, { responseType: "arraybuffer" }).then((res: any) => {
      const blob = new Blob([res], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${handleFileNameWithLangueAndTimeNow(
        payload.name,
        payload.language,
        SHORT_TYPE.VIEWPOINT_COLLECTION
      )}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
  },
};

export default ViewpointAPI;
