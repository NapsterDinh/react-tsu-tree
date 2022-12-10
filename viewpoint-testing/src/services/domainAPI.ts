import { AxiosResponse } from "axios";
import { ResponseDomain } from "@models/type";

import { axiosInstance } from "./axiosInstance";
import React from "react";
const DomainAPI = {
  postDomain: async (payload: {
    detail: string;
    isActive?: boolean;
    parentId?: React.Key;
    previousDomainId?: React.Key;
    nextDomainId?: React.Key;
  }) => {
    const url = "/Domain";
    const response = axiosInstance.post(url, payload);
    return response;
  },

  getDomain: async (signal?): Promise<AxiosResponse<ResponseDomain | any>> => {
    const url = "/Domain";
    const response = axiosInstance.get(url, signal && { signal: signal });
    return response;
  },

  getDomainById: async (payload: {
    id: string;
  }): Promise<AxiosResponse<ResponseDomain | any>> => {
    const url = `/Domain/GetById/${payload.id}`;
    const response = axiosInstance.get(url);
    return response;
  },

  updateDomain: async (payload: {
    id: React.Key;
    data: any;
  }): Promise<AxiosResponse<ResponseDomain | any>> => {
    const url = `/Domain/UpdateDomain?id=${payload.id}`;
    const response = axiosInstance.put(url, payload.data);
    return response;
  },

  updateListDomain: async (
    payload
  ): Promise<AxiosResponse<ResponseDomain | any>> => {
    const url = "/Domain/UpdateListDomain";
    const response = axiosInstance.put(url, payload);
    return response;
  },

  deleteDomain: async (
    payload: Array<string>
  ): Promise<AxiosResponse<ResponseDomain | any>> => {
    const url = "/Domain";
    const response = axiosInstance.delete(url, {
      data: {
        domainIds: payload,
      },
    });
    return response;
  },
};

export default DomainAPI;
