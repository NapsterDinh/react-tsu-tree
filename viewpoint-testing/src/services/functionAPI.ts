import { AxiosResponse } from "axios";
import { axiosInstance } from "./axiosInstance";

const baseUrl = "/Function";

const FunctionAPI = {
  //   getAllViewpoint: async (): Promise<
  //     AxiosResponse<IResponseData, any>
  //   > => {
  //     const url = "/viewpoints";
  //     const response = axiosInstance.get(url);
  //     return response;
  //   },
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
      response = axiosInstance.delete(
        baseUrl + "/DeleteKeepFunction" + `/${id}`
      );
    }
    return response;
  },
  deleteNodeByListId: async (ids): Promise<AxiosResponse<any, any>> => {
    const authTokens = localStorage.getItem("token");
    const contentLanguage = localStorage.getItem("i18nextLng");
    const dataLanguage = localStorage.getItem("dataLanguage");
    const response = axiosInstance.delete(baseUrl + "/DeleteListFunction", {
      headers: {
        Authorization: `Bearer ${authTokens}`,
        ContentLanguage: dataLanguage ?? contentLanguage ?? "en",
      },
      data: {
        functionIds: ids,
      },
    });
    return response;
  },
};

export default FunctionAPI;
