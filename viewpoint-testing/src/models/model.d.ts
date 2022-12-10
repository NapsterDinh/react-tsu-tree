import { RawValueType } from "rc-select/lib/Select";
import React from "react";

// response data
export interface IResponseData {
  data?: IResponseViewPointCollection[] &
    IResponseViewPointCollection &
    IResponseProduct &
    IResponseProduct[] &
    IResponseDetailRequest &
    IResponseDetailRequest[] &
    IUser &
    IUser[] &
    IRole &
    IRole[] &
    IResponseHistoryChanges[];
  errors?: [];
  isSucceeded?: boolean;
  metaData?: Pagination;
}

// filter log
export interface IDataBodyFilterLog {
  text?: string;
  pageNumber?: string | number;
  pageSize?: string | number;
  type?: string | number;
  owner?: string | number;
  time?: string | number;
}

export interface Detail {
  name?: string;
  description?: string;
  language?: string;
  createAt?: Date;
  updateAt?: Date;
}

export interface JsonDetail {
  Name?: string;
  Description?: string;
  Language?: string;
}

// domain
export interface Domain {
  detail: Detail & JsonDetail;
  parentId: React.Key | null;
  user: {
    id: React.Key;
    userName: string;
    account: string;
    email: string;
    phoneNumber: string;
  };
  id: React.Key;
  index: number;
  createdBy: React.Key;
  updateBy: React.Key;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  isDeleted: boolean;
  previousDomainId: React.Key | null;
  nextDomainId: React.Key | null;
}

export interface IDetailDomain {
  id?: string;
  isActive?: boolean;
  name: string;
  description?: string;
  parentId?: React.Key;
}

export interface IDomainFilter {
  title?: string;
  parentKey?: string;
  key?: string;
  children?: IDomainFilter[];
  label?: string;
  value?: string | number | boolean;
}

// Test type
export interface IDataBodyFilterTestType {
  text?: string;
  pageNumber?: number | string;
  pageSize?: number | string;
  sort?: number | string;
  isActive?: number | string;
}

export interface ICloneCollection {
  detail: Detail;
  id: string;
}

export interface IViewpointDetail {
  language: string;
  name: string;
  confirmation?: string;
  example?: string;
  note?: string;
}

export interface IViewpoint {
  id: string;
  testTypeId: string;
  viewPointCategoryId: string;
  viewDetail: IViewpointDetail;
  viewPointCollectionId: string;
  parentId: string;
  domainId: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updateBy: string;
  isActive: boolean;
  isDelete: boolean;
  orderStrings: string[];
  userCreate: IUser;
  userUpdate: IUser;
  domain: Domain;
  testType?: null;
  viewPointCategory?: null;
}

// viewpoint collection
export interface IResponseViewPointCollection {
  detail: Detail;
  id: string;
  processingStatus: number | string;
  cloneCollectionId: string;
  cloneCollection: ICloneCollection;
  viewPoints: IViewpoint[];
  domains: Domain[];
  userCreate: IUser;
  userUpdate: IUser;
  createdBy: string;
  updateBy: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  isDeleted: boolean;
  avgRating: number | string;
  publishStatus: number | string;
  orderStrings: string[];
  countUserRating: number;
}

// Product
export interface IFunctionDetail {
  language: string;
  name: string;
  note?: string;
}

export interface IFunction {
  id: string;
  viewDetail: IFunctionDetail;
  productId: string;
  parentId: string;
  domainId: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updateBy: string;
  isActive: boolean;
  isDelete: boolean;
  orderStrings: string[];
  userCreate: IUser;
  userUpdate: IUser;
  domain: Domain;
  isLocked: boolean;
  children?: any[];
}

export interface IResponseProduct {
  detail: Detail;
  id: string;
  processingStatus: number | string;
  cloneProductId: string;
  cloneProductResponse: null;
  functions: IFunction[];
  domains: Domain[];
  userCreate: IUser;
  userUpdate: IUser;
  createdBy: string;
  updateBy: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  isDeleted: boolean;
  avgRating: number | string;
  publishStatus: number | string;
  orderStrings: string[];
  countUserRating: number;
  children?: [];
  disableCheckbox?: boolean;
  flatDataList?: string[];
  listOwner: IUser[];
}

export interface FunctionsList {
  id: string;
  isLocked: boolean;
  productId: string;
  viewDetail: string;
  orderStrings: string;
  parentId: null | string;
}

export interface ICloneProductDataBody {
  detail: string;
  processingStatus: number | string;
  publishStatus: number | string;
  cloneProductId: string;
  domainIds: RawValueType[];
  functions: FunctionsList[];
  orderStrings: string[];
}

// request
export interface IResponseDetailRequest {
  id: string;
  requestType: string;
  title: string;
  description: string;
  status: number;
  viewPointCollectionFrom: IResponseViewPointCollection;
  viewPointCollectionTo: IResponseViewPointCollection;
  productFrom: IResponseProduct;
  productTo: IResponseProduct;
  createdBy: string;
  updateBy: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  isDeleted: boolean;
  userCreate: IUser;
  userApprove: IUser;
  orderStrings: string[];
}

// Role
export interface IRole {
  id: string;
  name: string;
  description: string;
  permissionResponse: IPermission[];
  createAt: Date;
  updateAt: Date;
  isActive: boolean;
  isDeleted: boolean;
}

export interface IPermission {
  id: string;
  functionName: string;
  permissionType: null | string;
  name: null | string;
}

// user
export interface IUser {
  account: string;
  email: string;
  id: string;
  phoneNumber: string & null;
  userName: string;
  role?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type Pagination = {
  currentPage: number;
  hasNext: boolean;
  hasPreviousPage: boolean;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export interface IResponseHistoryChanges {
  id: string;
  createdBy: string;
  updateBy: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  isDeleted: boolean;
  title: "string";
  action: 0;
  old: "string";
  new: "string";
  oldDetail: {
    language: "string";
    name: "string";
    description: "string";
    createAt: Date;
    updateAt: Date;
  };
  newDetail: {
    language: "string";
    name: "string";
    description: "string";
    createAt: Date;
    updateAt: Date;
  };
  viewPointCollectionId: string;
  productId: string;
  userCreate: IUser;
  userUpdate: IUser;
}

type Role = "Admin" | "User" | "Leader" | "Guest";

export type User = {
  account?: string;
  role?: Role | string;
  id?: string;
  userName?: string;
  permissions?: Permission[];
  createdAt?: Date;
  updatedAt?: Date;
  isActive?: boolean;
  isDeleted?: boolean;
};

// table
export interface ITableData {
  ProcessingStatus: string | JSX.Element;
  PublishStatus: string | JSX.Element;
  action: JSX.Element;
  createdAt: string;
  description: string;
  domain: string;
  id: string;
  key: string;
  lastUpdate: string;
  name: JSX.Element;
  owner: string;
  rating: JSX.Element;
}

export type Permission =
  | "DOMAIN.VIEW"
  | "DOMAIN.CREATE"
  | "DOMAIN.UPDATE"
  | "DOMAIN.DELETE"
  | "CATEGORY.VIEW"
  | "CATEGORY.UPDATE"
  | "CATEGORY.CREATE"
  | "CATEGORY.DELETE"
  | "TEST_TYPE.VIEW"
  | "TEST_TYPE.UPDATE"
  | "TEST_TYPE.CREATE"
  | "TEST_TYPE.DELETE"
  | "USER.VIEW"
  | "USER.UPDATE_ROLE"
  | "USER.UPDATE_STATUS"
  | "ROLE.VIEW"
  | "ROLE.CREATE"
  | "ROLE.UPDATE"
  | "ROLE.DELETE"
  | "VIEWPOINT.VIEW"
  | "VIEWPOINT.CREATE"
  | "VIEWPOINT.UPDATE"
  | "VIEWPOINT.DELETE"
  | "VIEWPOINT.CLONE"
  | "PRODUCT.VIEW"
  | "PRODUCT.CREATE"
  | "PRODUCT.UPDATE"
  | "PRODUCT.DELETE"
  | "PRODUCT.CLONE"
  | "REQUEST.VIEW"
  | "REQUEST.CREATE"
  | "REQUEST.UPDATE"
  | "REQUEST.REVIEW";
