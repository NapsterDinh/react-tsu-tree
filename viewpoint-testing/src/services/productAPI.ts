import { SHORT_TYPE } from "@utils/constants";
import { handleFileNameWithLangueAndTimeNow } from "@utils/fileUtils";
import { AxiosResponse } from "axios";
import { axiosInstance, axiosInstanceFormData } from "./axiosInstance";

const productAPI = {
  getAllProduct: async (
    { payload }: any,
    signal?: any
  ): Promise<AxiosResponse<any>> => {
    if (!payload.search) {
      const url = `/Product?PageSize=${payload.PageSize}&PageNumber=${payload.PageNumber}`;
      const response = axiosInstance.get<any>(
        url,
        signal && { signal: signal }
      );
      return response;
    } else {
      const url = `/Product${payload.search}&PageSize=${payload.PageSize}&PageNumber=${payload.PageNumber}`;
      const response = axiosInstance.get<any>(
        url,
        signal && { signal: signal }
      );
      return response;
    }
  },

  searchProduct: async ({ payload }: any): Promise<AxiosResponse<any>> => {
    const url = `/Product?Text=${payload.search}`;
    const response = axiosInstance.get<any>(url);
    return response;
  },

  getProductById: async (id: any): Promise<AxiosResponse<any>> => {
    const url = `/Product/GetById/${id}`;
    const response = axiosInstance.get<any>(url);
    return response;
  },
  getById: async (id: any, signal?: any): Promise<AxiosResponse<any>> => {
    const url = `/Product/GetById/${id}`;
    const response = axiosInstance.get<any>(url, signal && { signal: signal });
    return response;
  },
  deleteProduct: async ({ payload }: any): Promise<AxiosResponse<any>> => {
    const url = `/Product/${payload?.id}`;
    const response = axiosInstance.delete<any>(url);
    return response;
  },
  cloneProduct: async ({ payload }: any): Promise<AxiosResponse<any>> => {
    const url = "/Product/CloneCopyProduct";
    const response = axiosInstance.post<any>(url, payload);
    return response;
  },
  createProduct: async ({ payload }: any): Promise<AxiosResponse<any>> => {
    const url = "/Product";
    const response = axiosInstance.post(url, payload);
    return response;
  },
  importProduct: async (payload): Promise<AxiosResponse<any, any>> => {
    const url = "/Excel/ImportProduct";
    const response = axiosInstanceFormData.post(url, payload);
    return response;
  },
  export: async (id: string): Promise<AxiosResponse<any, any>> => {
    const url = "/Product/export";
    const response = axiosInstance.get(url + "/" + id);
    return response;
  },
  updateStatus: async (id, payload): Promise<AxiosResponse<any, any>> => {
    const url = "/Product/Update";
    const response = axiosInstance.put(url + `/${id}`, payload);
    return response;
  },
  updateProduct: async ({ payload, id }: any): Promise<AxiosResponse<any>> => {
    const url = "/Product/" + id;
    const response = axiosInstance.put(url, payload);
    return response;
  },
  ratingProduct: async (id, rating): Promise<AxiosResponse<any, any>> => {
    const url = "/Rating";
    const response = axiosInstance.post(url, {
      productId: id,
      startRating: rating,
    });
    return response;
  },
  importAppendChild: async ({ payload }: any): Promise<AxiosResponse<any>> => {
    const url = `/Excel/ImportProduct-append/${payload.id}`;
    const response = axiosInstanceFormData.post(url, payload.data);
    return response;
  },
  // importDataLanguage: async (payload): Promise<AxiosResponse<any, any>> => {
  //   const authTokens = localStorage.getItem("token");
  //   const axiosInstance = axios.create({
  //     baseURL: window?.__RUNTIME_CONFIG__?.REACT_APP_API_URL
  //       ? window.__RUNTIME_CONFIG__.REACT_APP_API_URL
  //       : process.env.REACT_APP_API_URL,
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Access-Control-Expose-Headers": "x-pagination, Access-Token, Uid",
  //     },
  //   });
  //   const url = `/Excel/ImportProduct-append/${payload.id}`;
  //   const headers = {
  //     Authorization: `Bearer ${authTokens}`,
  //     ContentLanguage: payload.language ?? "en",
  //     "Access-Control-Expose-Headers": "x-pagination, Access-Token, Uid",
  //   }
  //   const response = axiosInstance.post(url, payload.data, {headers: headers});
  getHistoryChange: async (payload: any): Promise<AxiosResponse<any>> => {
    const url = `/HistoryChange/GetById/${payload.id}`;
    const response = axiosInstance.get<any>(url);
    return response;
  },
  addMember: async (payload): Promise<AxiosResponse<any, any>> => {
    const response = axiosInstance.put(
      `/Product/addMember/${payload.id}`,
      payload.data
    );
    return response;
  },
  removeOwner: async (payload: any): Promise<AxiosResponse<any>> => {
    const url = `/Product/removeMember/${payload.id}`;
    const response = axiosInstance.put<any>(url, payload.data);
    return response;
  },
  exportProduct: (payload) => {
    const url = `/Excel/ExportProduct/${payload.id}`;
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
        SHORT_TYPE.PRODUCT
      )}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
  },
  exportProductWithLevel: (payload) => {
    const url = `/Excel/ExportProdLevel/${payload.id}`;
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
        SHORT_TYPE.PRODUCT
      )}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
  },
  importDataLanguage: async ({ payload }: any): Promise<AxiosResponse<any>> => {
    const url = "/Excel/TranslateImportProduct";
    const response = axiosInstance.post(url, payload.data);
    return response;
  },
};

export default productAPI;
