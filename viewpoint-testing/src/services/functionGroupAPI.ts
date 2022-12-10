import { axiosInstance } from "./axiosInstance";
import { AxiosResponseCustom, ResponseWithPagination } from "@models/type";
import { IDataBodyFilterTestType } from "@models/model";

const searchFilterFunctionGroup = async (
  data: IDataBodyFilterTestType
): Promise<AxiosResponseCustom<ResponseWithPagination | any>> => {
  const response = await axiosInstance.get("/GroupFunction", {
    params: data,
  });
  return response;
};

const deleteFunctionGroup = async (id) => {
  const response = await axiosInstance.delete(`/GroupFunction/${id}`);
  return response;
};

const createNewFunctionGroup = async (data) => {
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
  const response = await axiosInstance.post("/GroupFunction", convertedPayload);
  return response;
};

const editFunctionGroup = async (data, id) => {
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
    `/GroupFunction/${id}`,
    convertedPayload
  );
  return response;
};

const updateStatusFunctionGroup = async (value, id) => {
  const response = await axiosInstance.put(
    `/GroupFunction/UpdateStatus/${id}`,
    {
      isActive: value,
    }
  );
  return response;
};

const FunctionGroupAPI = {
  searchFilterFunctionGroup,
  deleteFunctionGroup,
  createNewFunctionGroup,
  editFunctionGroup,
  updateStatusFunctionGroup,
};

export default FunctionGroupAPI;
