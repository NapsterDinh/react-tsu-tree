import { axiosInstance } from "./axiosInstance";
import { AxiosResponseCustom, ResponseWithPagination } from "@models/type";
import { IDataBodyFilterTestType } from "@models/model";

const searchFilterCategory = async (
  data: IDataBodyFilterTestType
): Promise<AxiosResponseCustom<ResponseWithPagination | any>> => {
  const response = await axiosInstance.get("/ViewPointCategory", {
    params: data,
  });
  return response;
};

const deleteCategory = async (id) => {
  const response = await axiosInstance.delete(`/ViewPointCategory/${id}`);
  return response;
};

const createNewCategory = async (data) => {
  const convertedPayload = {
    detail: JSON.stringify([
      {
        Language: localStorage.getItem("dataLanguage"),
        Name: data.name,
        Description: data.description,
      },
    ]),
    isActive: data.isActive,
  };
  const response = await axiosInstance.post(
    "/ViewPointCategory",
    convertedPayload
  );
  return response;
};

const editCategory = async (data, id) => {
  const convertedPayload = {
    detail: JSON.stringify([
      {
        Language: localStorage.getItem("dataLanguage"),
        Name: data.name,
        Description: data.description,
      },
    ]),
    isActive: data.isActive,
  };
  const response = await axiosInstance.put(
    `/ViewPointCategory/${id}`,
    convertedPayload
  );
  return response;
};

const updateStatusCategory = async (value, id) => {
  const response = await axiosInstance.put(
    `/ViewPointCategory/UpdateStatus/${id}`,
    {
      isActive: value,
    }
  );
  return response;
};

const ViewpointCategoryAPI = {
  searchFilterCategory,
  deleteCategory,
  createNewCategory,
  editCategory,
  updateStatusCategory,
};

export default ViewpointCategoryAPI;
