import { LocaleProvider } from "@components";
import {
  IResponseData,
  ITableData,
  IUser,
  Pagination as IPagination
} from "@models/model";
import { userApi } from "@services/userAPI";
import {
  DEFAULT_PAGE_SIZE,
  PROCESSING_STATUS,
  PUBLISH_STATUS,
  SORT
} from "@utils/constants";
import { showErrorNotification } from "@utils/notificationUtils";
import { Pagination, Table, Tooltip, Typography } from "antd";
import { ColumnsType } from "antd/lib/table";
import {
  FilterValue,
  SorterResult,
  TablePaginationConfig
} from "antd/lib/table/interface";
import { Dispatch, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface IProps {
  loading: boolean;
  dataSource: ITableData[];
  pagination: IPagination;
  setPagination: Dispatch<IPagination>;
  callAPI: (_pageNumber: string | number, _pageSize: number | string) => void;
  onSortTable: (
    _pagination: TablePaginationConfig,
    _filter: Record<string, FilterValue>,
    _sorter: SorterResult<any> | SorterResult<any>[]
  ) => void;
  domainTreeFilter;
  searchParams: URLSearchParams;
}

const TableViewpointCollection = ({
  loading,
  dataSource,
  pagination,
  searchParams,
  domainTreeFilter,
  callAPI,
  onSortTable,
  setPagination,
}: IProps) => {
  const { t } = useTranslation(["common", "validate", "responseMessage"]); // languages
  const [ownerFilter, setOwnerFilter] = useState([]);
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : {};

  const columns: ColumnsType<ITableData> = [
    {
      title: t("common:common.name"),
      // title: "Sub domain",
      dataIndex: "name",
      key: "name",
      width: 250,
      ellipsis: true,
      sorter: true,
      fixed: "left",
      filteredValue: null,
      sortOrder:
        searchParams.get("Sort") === SORT.ACS
          ? "ascend"
          : searchParams.get("Sort") === SORT.DESC
          ? "descend"
          : null,
      render: (text) => (
        <Tooltip title={text}>
          <Typography.Paragraph style={{ marginBottom: "0px" }} ellipsis>
            {text}
          </Typography.Paragraph>
        </Tooltip>
      ),
    },
    {
      title: t("common:common.domain"),
      dataIndex: "domain",
      key: "domain",
      width: 250,
      filterMode: "tree",
      ellipsis: true,
      filteredValue: searchParams.getAll("DomainIds")
        ? searchParams.getAll("DomainIds")
        : null,
      filters: domainTreeFilter,
      filterSearch: true,
    },
    {
      title: t("common:common.rating"),
      dataIndex: "rating",
      key: "rating",
      align: "center",
      width: 150,
      sorter: true,
      filteredValue: null,
      sortOrder:
        searchParams.get("SortRating") === SORT.ACS
          ? "ascend"
          : searchParams.get("SortRating") === SORT.DESC
          ? "descend"
          : null,
    },
    {
      title: t("common:common.processing_status"),
      dataIndex: "ProcessingStatus",
      key: "ProcessingStatus",
      width: 180,
      filterMultiple: false,
      filteredValue: searchParams.get("ProcessingStatus")
        ? Array(searchParams.get("ProcessingStatus"))
        : null,
      filters: [
        {
          text: t("common:status.on_going"),
          value: PROCESSING_STATUS.ON_GOING,
        },
        {
          text: t("common:status.updating"),
          value: PROCESSING_STATUS.UPDATING,
        },
      ],
    },
    {
      title: t("common:common.publishing_status"),
      dataIndex: "PublishStatus",
      key: "PublishStatus",
      width: 180,
      filterMultiple: false,
      filteredValue: searchParams.get("PublishStatus")
        ? Array(searchParams.get("PublishStatus"))
        : null,
      filters: [
        {
          text: t("common:status.publishing"),
          value: PUBLISH_STATUS.PUBLISHING,
        },
        { text: t("common:status.published"), value: PUBLISH_STATUS.PUBLISHED },
      ],
    },
    {
      title: t("common:common.owner"),
      key: "owner",
      dataIndex: "owner",
      width: 150,
      filterMultiple: false,
      filterSearch: true,
      filteredValue: searchParams.get("Owner")
        ? Array(searchParams.get("Owner"))
        : null,
      filters: ownerFilter,
    },
    {
      title: t("common:common.updated_at"),
      key: "lastUpdate",
      dataIndex: "lastUpdate",
      width: 200,
      sorter: true,
      filteredValue: null,
      sortOrder:
        searchParams.get("SortDatetime") === SORT.ACS
          ? "ascend"
          : searchParams.get("SortDatetime") === SORT.DESC
          ? "descend"
          : null,
    },
    {
      title: t("common:common.action"),
      key: "action",
      dataIndex: "action",
      filteredValue: null,
      width: 100,
      fixed: "right",
    },
  ];

  const handleOwnerFilter = async () => {
    try {
      const response: IResponseData = await userApi.getOwnerFilter();
      const initialValues = [{ text: user.account, value: user.account }];
      const filter = response.data.reduce(
        (filterArray, currentOwner: IUser) => {
          filterArray.push({
            text: currentOwner.account,
            value: currentOwner.account,
          });
          return filterArray;
        },
        initialValues
      );
      setOwnerFilter(filter);
    } catch (error) {
      if (error?.code) {
        showErrorNotification(t(`responseMessage:${error?.code}`));
      }
    }
  };

  const handleChangePagination = (page: number, pageSize: number) => {
    callAPI(page, pageSize);
    setPagination({ ...pagination, pageSize: pageSize, currentPage: page });
  };

  useLayoutEffect(() => {
    handleOwnerFilter();
  }, []);

  return (
    <LocaleProvider>
      <Table
        loading={loading}
        columns={columns}
        scroll={{ x: 1600 }}
        showSorterTooltip={false}
        dataSource={dataSource}
        onChange={onSortTable}
        pagination={false}
      />
      {pagination.totalCount > DEFAULT_PAGE_SIZE && (
        <Pagination
          total={pagination.totalCount}
          current={pagination.currentPage}
          showTotal={(total) => t("common:common.show_total", { total: total })}
          showSizeChanger={true}
          onChange={handleChangePagination}
          defaultPageSize={DEFAULT_PAGE_SIZE}
          pageSizeOptions={["20", "30", "50"]}
          style={{
            marginTop: "1rem",
            display: "flex",
            justifyContent: "right",
          }}
        />
      )}
    </LocaleProvider>
  );
};

export default TableViewpointCollection;
