import { BreadCrumb } from "@components";
import { IDataBodyFilterTestType } from "@models/model";
import ViewpointCategoryAPI from "@services/categoryAPI";
import { DEFAULT_PAGINATION, SORT, STATUS } from "@utils/constants";
import { checkContainsSpecialCharacter } from "@utils/helpersUtils";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  createSearchParams,
  URLSearchParamsInit,
  useSearchParams,
} from "react-router-dom";
import { Wrapper } from "./CategoryManagement.Styled";
import CommonAction from "./components/CommonAction/CommonAction";
import ModalCategory from "./components/ModalCategory/ModalCategory";
import TableCategory from "./components/TableCategory/TableCategory";

export type CategoryTableItem = any;

const CategoryManagement = () => {
  const { t } = useTranslation(["common"]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    ...DEFAULT_PAGINATION,
    pageSize: searchParams.get("pageSize") ?? DEFAULT_PAGINATION.pageSize,
    currentPage:
      searchParams.get("currentPage") ?? DEFAULT_PAGINATION.currentPage,
  });
  const [loading, setLoading] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [contentSearch, setContentSearch] = useState(
    searchParams.get("text") ?? ""
  );
  const [filter, setFilter] = useState({
    isActive: searchParams.get("isActive") ?? STATUS.DEFAULT,
    sort: searchParams.get("sort") ?? SORT.DEFAULT,
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
      const newSearchParams: URLSearchParamsInit = {};
      if (contentSearch) {
        setLoadingSearch(true);
        dataBody.text = contentSearch.trim();
        newSearchParams.text = contentSearch.trim();
      }
      if (filter.sort != SORT.DEFAULT) {
        dataBody.sort = filter.sort;
        newSearchParams.sort = filter.sort.toString();
      }
      if (filter.isActive !== STATUS.DEFAULT) {
        dataBody.isActive = filter.isActive;
        newSearchParams.isActive = filter?.isActive.toString();
      }
      const response = await ViewpointCategoryAPI.searchFilterCategory(
        dataBody
      );

      setPagination({
        ...response.metaData,
      });

      if (response.metaData.pageSize !== DEFAULT_PAGINATION.pageSize) {
        newSearchParams.pageSize = response.metaData.pageSize;
      }
      if (response.metaData.currentPage !== DEFAULT_PAGINATION.currentPage) {
        newSearchParams.currentPage = response.metaData.currentPage;
      }

      setSearchParams(createSearchParams(newSearchParams) ?? {});

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
    } finally {
      setLoading(false);
      setLoadingSearch(false);
    }
  };

  useEffect(() => {
    handleCallAPI();
  }, [filter]);

  const onSearch = async (value) => {
    if (checkContainsSpecialCharacter(value.trim())) {
      setErrorSearch(
        t("validate:common.search_can_not_contains_special_characters")
      );
    } else {
      setErrorSearch("");
      setContentSearch(value.trim());
      await handleCallAPI();
    }
  };

  return (
    <Wrapper className="main-layout-wrapper">
      <ModalCategory
        item={selectedItem}
        open={open}
        handleCancel={handleCancel}
        handleCallAPI={handleCallAPI}
      />
      <BreadCrumb
        previousTitle={t("home_page")}
        breadCrumb={true}
        link={"/category"}
        title={t("common:category_management")}
      />
      <CommonAction
        onSearch={onSearch}
        loading={loadingSearch}
        filter={filter}
        errorSearch={errorSearch}
        handleChangeFilter={handleChangeFilter}
        showModal={showModal}
        contentSearch={contentSearch}
        setContentSearch={setContentSearch}
      />
      <TableCategory
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

export default CategoryManagement;
