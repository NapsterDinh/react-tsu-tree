import { axiosInstance } from "./axiosInstance";
import { AxiosResponseCustom, ResponseWithPagination } from "@models/type";
import { IDataBodyFilterTestType } from "@models/model";

const baseAPIUrl = "/TestType";

const searchFilterTestType = async (
  data: IDataBodyFilterTestType
): Promise<AxiosResponseCustom<ResponseWithPagination | any>> => {
  const response = await axiosInstance.get(baseAPIUrl, {
    params: data,
  });
  return response;
};

const deleteTestType = async (id) => {
  const response = await axiosInstance.delete(`${baseAPIUrl}/${id}`);
  return response;
};

const createTestType = async (data) => {
  const convertedPayload = {
    detail: JSON.stringify([
      {
        Language: localStorage.getItem("dataLanguage"),
        Name: data.name,
        Description: data.description,
      },
    ]),
    isActive: data.isActive,
    testType: "string",
  };
  const response = await axiosInstance.post(baseAPIUrl, convertedPayload);
  return response;
};

const editTestType = async (data, id) => {
  const convertedPayload = {
    detail: JSON.stringify([
      {
        Language: localStorage.getItem("dataLanguage"),
        Name: data.name,
        Description: data.description,
      },
    ]),
    isActive: data.isActive,
    testType: "string",
  };
  const response = await axiosInstance.put(
    `${baseAPIUrl}/${id}`,
    convertedPayload
  );
  return response;
};

const updateStatusTestType = async (value, id) => {
  const response = await axiosInstance.put(`${baseAPIUrl}/UpdateStatus/${id}`, {
    isActive: value,
  });
  return response;
};

const TestTypeAPI = {
  searchFilterTestType,
  deleteTestType,
  createTestType,
  editTestType,
  updateStatusTestType,
};

export default TestTypeAPI;
