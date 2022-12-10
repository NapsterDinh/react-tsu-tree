import { DataNode } from "antd/lib/tree";
import { rootReducer } from "@redux/slices";
import { AxiosResponseHeaders, AxiosRequestConfig } from "axios";
import { Domain, User, Pagination } from "@models/model";
import { DefaultOptionType } from "antd/lib/select";

export type LocationState = {
  from?: string;
};

export type ResponseWithPagination = {
  isSucceeded: boolean;
  data: any[];
  errors: string[];
  metaData?: Pagination;
};

type stateAuthType = {
  loginResponse: null;
  loginSuccess: null | boolean;
  loginLoading: boolean;
  logoutLoading: boolean;
  user: null | User;
  userLoading: boolean;
  errorLogin: any;
};

type stateThemeType = {
  theme: null | string;
};

// Domain
export interface ResponseDomain {
  isSucceeded?: boolean;
  data?: Domain & Domain[];
  errors?: string[];
}

// Custom Tree selector
export interface ITreeDataNodeSelector extends DefaultOptionType {
  prev?: React.Key;
  next?: React.Key;
  children?: ITreeDataNodeSelector[];
  parentKey?: string | number;
}

// Custom Tree
export interface DataTreeNode extends DataNode {
  description?: string;
  isActive?: boolean;
  children?: Array<DataTreeNode>;
  parentKey?: string | number;
  index?: number;
  prev?: React.Key;
  next?: React.Key;
  name?: string;
}

export interface AxiosResponseCustom<T = any, D = any> {
  data: T;
  status: number;
  statusText: string;
  headers: AxiosResponseHeaders;
  config: AxiosRequestConfig<D>;
  request?: any;
  metaData?: any;
}

type rootState = ReturnType<typeof rootReducer>;
