import { axiosInstance } from "./axiosInstance";

const ExcelAPI = {
  downloadViewpointCollectionTemplate: () => {
    const url = "/Excel/Download-ViewpointCollection";
    axiosInstance.get(url, { responseType: "arraybuffer" }).then((res: any) => {
      const blob = new Blob([res], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Viewpoint_collection_template.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
  },
  downloadProductTemplate: () => {
    const url = "/Excel/Download-Product";
    axiosInstance.get(url, { responseType: "arraybuffer" }).then((res: any) => {
      const blob = new Blob([res], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Product_template.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
  },
};

export default ExcelAPI;
