import { AxiosResponse } from "axios";
import { axiosInstance, axiosInstanceFormData } from "./axiosInstance";

const productPhucAPI = {
  getAllProduct: async (payload, signal?): Promise<AxiosResponse<any>> => {
    if (!payload.search) {
      const url = "/products/getallProduct";
      const response = axiosInstance.get<any>(
        url,
        signal && { signal: signal }
      );
      return response;
    } else {
      const url = `/products/getallProduct?searchText=${payload.search}`;
      const response = axiosInstance.get<any>(
        url,
        signal && { signal: signal }
      );
      return response;
    }
  },
  getChartInfo: async () => {
    const url = "/products/statsProduct";
    const response = axiosInstance.get<any>(url);
    return response;
  },
  deleteProduct: async (id) => {
    const url = `/products/deleteProduct/${id}`;
    const response = axiosInstance.delete<any>(url);
    return response;
  },
  createProduct: async (product) => {
    const url = "/products/createProduct";
    const response = axiosInstance.post<any>(url, product);
    return response;
  },
  updateProduct: async (product) => {
    const url = `/products/updateProduct/${product._id}`;
    const response = axiosInstance.put<any>(url, product);
    return response;
  },

  uploadImage: async (file) => {
    const url = "products/uploadImage";
    const form = new FormData();
    form.append("file", file);
    const response = axiosInstanceFormData.post<any>(url, form);
    return response;
  },
};

export { productPhucAPI };
