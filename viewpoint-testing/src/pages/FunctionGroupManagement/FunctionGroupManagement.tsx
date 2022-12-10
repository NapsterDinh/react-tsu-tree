import { BreadCrumb } from "@components";
import { IDataBodyFilterTestType } from "@models/model";
import { DEFAULT_PAGINATION, SORT, STATUS } from "@utils/constants";
import { checkContainsSpecialCharacter } from "@utils/helpersUtils";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Wrapper } from "./FunctionGroupManagementStyle";
import CommonAction from "./components/CommonAction/CommonAction";
import ModalFunctionGroup from "./components/ModalFunctionGroup/ModalFunctionGroup";
import TableFunctionGroup from "./components/TableFunctionGroup/TableFunctionGroup";
import FunctionGroupAPI from "@services/functionGroupAPI";

export type FunctionGroupTableItem = any;

const FunctionGroupManagement = () => {
  const { t } = useTranslation(["common"]);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
  const [contentSearch, setContentSearch] = useState<string>("");
  const [filter, setFilter] = useState({
    isActive: STATUS.DEFAULT,
    sort: SORT.DEFAULT,
  });
  const [errorSearch, setErrorSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
    setSelectedItem("");
  };

  const handleChangeFilter = (typeChange, value) => {
    const tempVar = { ...filter };
    switch (typeChange) {
      case "sort":
        tempVar.sort = value;
        break;
      case "isActive":
        tempVar.isActive = value;
        break;
      default:
        tempVar.sort = value;
        break;
    }
    setFilter(tempVar);
  };

  const handleCallAPI = async (paginationProps?) => {
    try {
      setLoading(true);
      const dataBody: IDataBodyFilterTestType = {
        pageNumber: !paginationProps
          ? pagination?.currentPage
          : paginationProps?.currentPage,
        pageSize: !paginationProps
          ? pagination?.pageSize
          : paginationProps?.pageSize,
      };
      if (contentSearch) {
        setLoadingSearch(true);
        dataBody.text = contentSearch.trim();
      }
      if (filter.sort) {
        dataBody.sort = filter.sort;
      }
      if (filter.isActive !== 2) {
        dataBody.isActive = filter.isActive;
      }
      const response = await FunctionGroupAPI.searchFilterFunctionGroup(
        dataBody
      );

      setPagination({
        ...response.metaData,
      });

      const convertedData = response.data;

      for (let index = 0; index < convertedData.length; index++) {
        const element = convertedData[index];
        convertedData[index] = {
          ...convertedData[index],
          key: element.id,
          updatedAt: new Date(element?.updatedAt).toLocaleString(),
          name: element?.detail?.name,
          description: element?.detail?.description,
          userUpdateAccount: element?.userUpdate?.account,
        };
      }

      setData(convertedData);
    } catch (error) {
    } finally {
      setLoading(false);
      setLoadingSearch(false);
    }
  };

  useEffect(() => {
    handleCallAPI();
  }, [contentSearch, filter]);

  const onSearch = (value: string) => {
    if (checkContainsSpecialCharacter(value.trim())) {
      setErrorSearch(t("validate:common.search_can_not_contains_special_characters"));
    } else {
      setErrorSearch("");
      setContentSearch(value);
    }
  };

  return (
    <Wrapper className="main-layout-wrapper">
      <ModalFunctionGroup
        item={selectedItem}
        open={open}
        handleCancel={handleCancel}
        handleCallAPI={handleCallAPI}
      />
      <BreadCrumb
        previousTitle={t("home_page")}
        breadCrumb={true}
        link={"/category"}
        title={t("common:function_group_management")}
      />
      <CommonAction
        onSearch={onSearch}
        loading={loadingSearch}
        errorSearch={errorSearch}
        handleChangeFilter={handleChangeFilter}
        showModal={showModal}
      />
      <TableFunctionGroup
        setSelectedItem={setSelectedItem}
        handleCallAPI={handleCallAPI}
        data={data}
        loading={loading}
        showModal={showModal}
        setData={setData}
        pagination={pagination}
        setPagination={setPagination}
      />
    </Wrapper>
  );
};

export default FunctionGroupManagement;
