import { ERR_CANCELED_RECEIVE_RESPONSE } from "@utils/constants";
import { showErrorNotification } from "@utils/notificationUtils";
import axios, { AxiosRequestConfig } from "axios";

const customAxios = (contentType) => {
  const axiosInstance = axios.create({
    baseURL: window?.__RUNTIME_CONFIG__?.REACT_APP_API_URL
      ? window.__RUNTIME_CONFIG__.REACT_APP_API_URL
      : process.env.REACT_APP_API_URL,
    headers: {
      "Content-Type": contentType,
      "Access-Control-Expose-Headers": "x-pagination, Access-Token, Uid",
    },
  });

  axiosInstance.interceptors.request.use((request?: AxiosRequestConfig) => {
    const authTokens = localStorage.getItem("token");
    const contentLanguage = localStorage.getItem("i18nextLng");
    const dataLanguage = localStorage.getItem("dataLanguage");
    return authTokens
      ? {
          ...request,
          headers: {
            Authorization: `Bearer ${authTokens}`,
            ContentLanguage: dataLanguage ?? contentLanguage ?? "en",
          },
        }
      : request;
  });

  axiosInstance.interceptors.response.use(
    (response) => {
      const pagination = response.headers["x-pagination"];

      if (pagination) {
        const parsed = JSON.parse(pagination);
        const metaData = {
          currentPage: parsed.CurrentPage,
          pageSize: parsed.PageSize,
          totalPages: parsed.TotalPages,
          totalCount: parsed.TotalCount,
          hasPreviousPage: parsed.HasPreviousPage,
          hasNext: parsed.HasNext,
        };
        response.data = {
          metaData,
          ...response.data,
        };
      }
      return response.data;
    },
    async (error) => {
      if (!error?.code) {
        return Promise.reject({
          ...error,
          code: "UndefinedError",
        });
      }
      if (error.code === ERR_CANCELED_RECEIVE_RESPONSE) {
        return Promise.reject(error);
      } else {
        const { status } = error.response;
        switch (status) {
          case 400:
            // TODO: Define what to do on 400
            if (
              error?.response?.data?.errors?.length !== 0 &&
              error?.response?.data?.errors?.[0]?.code
            ) {
              const responseError = error?.response?.data?.errors?.[0];
              return Promise.reject(responseError);
            } else {
              showErrorNotification(error.message);
              return Promise.reject(error);
            }
          case 401:
            localStorage.removeItem("token");
            localStorage.removeItem("expiration");
            window.location.href = "/login";
            break;
          case 403:
            // TODO: Define what to do on 403
            // showErrorNotification("Forbidden !");
            // window.location.href = "/forbidden";
            break;
          case 408:
            // TODO: Define what to do on 408
            break;
          case 404:
            break;
          case 500:
            return Promise.reject({
              code: "ServerError",
            });
          case 500:
            return Promise.reject({
              code: "ServerTimeOut",
            });
          default:
            return;
        }
      }
    }
  );
  return axiosInstance;
};

export const axiosInstance = customAxios("application/json");

export const axiosInstanceFormData = customAxios("multipart/form-data");
