import { showErrorNotification } from "@utils/notificationUtils";
import { AxiosResponse } from "axios";
import { LoginType } from "../redux/sagas/authSaga";
import { axiosInstance } from "./axiosInstance";

export type IUser = {
  id: string;
  account: string;
};

type LoginData = {
  token: string;
  expiration: string;
};

type LoginResponse = {
  data: LoginData;
  isSucceeded: boolean;
};

const authAPI = {
  login: async ({
    payload,
  }: LoginType): Promise<AxiosResponse<LoginResponse, any>> => {
    const url = "/users/login";
    const response = axiosInstance.post<LoginResponse>(url, payload);
    return response;
  },
  getCurrentUser: async () => {
    const url = "/users/get-current-user";
    const response = axiosInstance.get(url);
    return response;
  },
};

export default authAPI;
