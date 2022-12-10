import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { BreadCrumb, LocaleProvider } from "@components";
import useAbortRequest from "@hooks/useAbortRequest";
import requestAPI from "@services/requestAPI";
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGINATION,
  ERR_CANCELED_RECEIVE_RESPONSE,
  ROLE,
  SORT,
  STATUS_REQUEST,
} from "@utils/constants";
import { INPUT_SEARCH } from "@utils/constantsUI";
import { showErrorNotification } from "@utils/notificationUtils";
import { Input, Pagination, Select, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  createSearchParams,
  Link,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { routes } from "routes";
import { RequestManagementWrapper } from "./RequestManagementWrapper";
const { Option } = Select;
const { Search } = Input;
const RequestManagement: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation(["common"]); // languages
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState(searchParams.get("Sort"));
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<any>(null);
  const [status, setStatus] = useState(searchParams.get("Status"));
  const [RequestType, setRequestType] = useState(
    searchParams.get("RequestType")
  );
  const [searchContent, setSearchContent] = useState(searchParams.get("Text"));
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [data, setData] = useState([]);
  const { signal } = useAbortRequest();

  // handle call get all request
  // const location = useLocation();
  const handleCallAPI = async (pageNumber: number, pageSize: number) => {
    try {
      setLoading(true);
      const response: any = await requestAPI.getAllRequest({
        payload: {
          search: location.search,
          PageNumber: pageNumber,
          PageSize: pageSize,
        },
        signal: signal,
      });
      setRequests(response);
      setPagination(response?.metaData);
    } catch (error) {
      if (error?.code === ERR_CANCELED_RECEIVE_RESPONSE) {
        return;
      }
      showErrorNotification(error?.code);
    } finally {
      setLoading(false);
    }
  };
  interface DataType {
    key: React.Key;
    id: string;
    requestType: string;
    requester: string;
    description: string;
    status: any;
    dateStart: any;
    action: any;
  }

  const columns: ColumnsType<DataType> = [
    {
      title: t("common:common.title"),
      dataIndex: "title",
      width: "20%",
    },
    {
      title: t("common:request_management.request_type"),
      dataIndex: "requestType",
      align: "center",
      width: "15%",
    },
    {
      title: t("common:request_management.requester"),
      dataIndex: "requester",
    },
    {
      title: t("common:common.status"),
      dataIndex: "status",
    },
    {
      title: t("common:common.updated_at"),
      dataIndex: "updatedAt",
    },
    {
      title: t("common:common.action"),
      dataIndex: "action",
    },
  ];

  useEffect(() => {
    if (requests) {
      let formattedData = requests?.data as any[];
      if (user?.role !== ROLE.ADMIN) {
        formattedData = requests?.data?.filter(
          (item) => item?.userApprove?.account === user?.account
        );
      }

      setData(
        formattedData.map((e, index) => {
          return {
            key: e?.id,
            id: index + 1,
            requestType: (
              <Tag
                color={`${
                  e.requestType === "ViewPointCollection"
                    ? "#008000"
                    : "#1890ff"
                }`}
                style={{
                  color: "white",
                  fontSize: "0.75rem",
                }}
              >
                {e.requestType === "ViewPointCollection"
                  ? t("common:detail_viewpoint_collection.viewpoint")
                  : t("common:product.name")}
              </Tag>
            ),
            requester: e?.userCreate?.account,
            approver: user?.role === ROLE.ADMIN ? e?.userApprove?.account : "",
            title: (
              <Link to={routes.RequestManagement.path[0] + `/${e?.id}`}>
                {e?.title}
              </Link>
            ),
            updatedAt: new Date(e?.updatedAt).toLocaleString(),
            status:
              e?.status == STATUS_REQUEST.NO_REQUEST_STATUS ? (
                <Tag color="default" className="waiting">
                  {t("common:status.no_request_status")}
                </Tag>
              ) : e?.status == STATUS_REQUEST.WAITING ? (
                <Tag
                  color="default"
                  icon={<ClockCircleOutlined />}
                  className="waiting"
                >
                  {t("common:status.waiting")}
                </Tag>
              ) : e?.status == STATUS_REQUEST.PROCESSING ? (
                <Tag
                  color="processing"
                  icon={<SyncOutlined />}
                  className="processing"
                >
                  {t("common:status.processing")}
                </Tag>
              ) : e?.status == STATUS_REQUEST.APPROVE ? (
                <Tag
                  color="success"
                  icon={<CheckCircleOutlined />}
                  className="approve"
                >
                  {t("common:status.approved")}
                </Tag>
              ) : e?.status == STATUS_REQUEST.REJECT ? (
                <Tag
                  icon={<MinusCircleOutlined />}
                  color="error"
                  className="reject"
                >
                  {t("common:status.rejected")}
                </Tag>
              ) : e?.status == STATUS_REQUEST.CANCELED ? (
                <Tag
                  icon={<ExclamationCircleOutlined />}
                  color="warning"
                  className="cancel"
                >
                  {t("common:status.canceled")}
                </Tag>
              ) : null,
            action: (
              <Link to={`${routes.RequestManagement.path[0]}/${e?.id}`}>
                {t("common:common.view_detail")}
              </Link>
            ),
          };
        })
      );
    }
  }, [requests]);

  const handleSelectSort = (value) => {
    setSort(value);
  }; // handle select sort

  const handleSelectStatus = (value) => {
    setStatus(value);
  }; // handle select sort
  const handleSelectRequest = (value) => {
    setRequestType(value);
  }; // handle select sort
  const handleEnterInputSearch = (value) => {
    setSearchContent(value.trim());
  }; // handle enter search to set content search

  const handleChangePagination = (page: number, pageSize: number) => {
    handleCallAPI(page, pageSize);
    setPagination({ ...pagination, pageSize: pageSize, currentPage: page });
  };

  useEffect(() => {
    handleCallAPI(pagination.currentPage, pagination.pageSize);
  }, [location.search]);

  // filter when params has changed
  useEffect(() => {
    const params: any = {};

    if (sort) {
      params.Sort = sort;
    }
    if (status) {
      params.Status = status;
    }
    if (searchContent) {
      params.Text = searchContent;
    }
    if (RequestType) {
      params.RequestType = RequestType;
    }
    setPagination({
      ...pagination,
      currentPage: 1,
    });
    setSearchParams(createSearchParams(params));
  }, [sort, status, searchContent, RequestType]);

  return (
    <RequestManagementWrapper>
      <BreadCrumb
        title={t("request_management.name")}
        previousTitle={t("common.home_page")}
        link="/"
        breadCrumb={true as boolean}
      />
      <Space className="container-sort">
        <div className="item-sort">
          <p className="label">{t("common:common.sort")}</p>
          <Select
            defaultValue={
              searchParams.get("Sort") ? searchParams.get("Sort") : "2"
            }
            style={{ width: 180 }}
            onChange={handleSelectSort}
          >
            <Option value={SORT.DEFAULT}>{t("common:status.no_sort")}</Option>
            <Option value={SORT.ACS}>
              {t("common:common.sort_by_name_a_z")}
            </Option>
            <Option value={SORT.DESC}>
              {t("common:common.sort_by_name_z_a")}
            </Option>
          </Select>
        </div>
        <div className="item-sort">
          <p className="label">{t("common:request_management.request_type")}</p>
          <Select
            defaultValue={
              searchParams.get("RequestType")
                ? searchParams.get("RequestType")
                : ""
            }
            style={{ width: 180 }}
            onChange={handleSelectRequest}
          >
            <Option value={"ViewPointCollection"}>
              {t("common:detail_viewpoint_collection.viewpoint")}
            </Option>
            <Option value={"Product"}>{t("common:product.name")}</Option>
            <Option value={""}>
              {t("common:request_management.all_request")}
            </Option>
          </Select>
        </div>
        <div className="item-sort">
          <p className="label">{t("common:common.status")}</p>
          <Select
            defaultValue={
              searchParams.get("Status") ? searchParams.get("Status") : "0"
            }
            style={{ width: 180 }}
            onChange={handleSelectStatus}
          >
            <Option value="0">{t("common:status.no_request_status")}</Option>
            <Option value="1">{t("common:status.waiting")}</Option>
            <Option value="2">{t("common:status.processing")}</Option>
            <Option value="3">{t("common:status.approved")}</Option>
            <Option value="4">{t("common:status.rejected")}</Option>
            <Option value="5">{t("common:status.canceled")}</Option>
          </Select>
        </div>
        <div className="item-sort1">
          <p className="label">{t("common:common.search")}</p>
          <Search
            defaultValue={searchParams.get("Text")}
            placeholder={t("common:common.search_placeholder")}
            onSearch={handleEnterInputSearch}
            enterButton={t("common:common.search")}
            maxLength={INPUT_SEARCH.MAX_LENGTH}
            style={{ width: INPUT_SEARCH.WIDTH }}
          />
        </div>
      </Space>
      <div className="mr-t-20">
        <LocaleProvider>
          <Table
            scroll={{
              x: 600,
            }}
            loading={loading}
            columns={columns}
            dataSource={data}
            pagination={false}
          />
        </LocaleProvider>
        {pagination.totalCount > DEFAULT_PAGE_SIZE && (
          <Pagination
            total={pagination.totalCount}
            current={pagination.currentPage}
            showTotal={(total) =>
              t("common:common.show_total", { total: total })
            }
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
      </div>
    </RequestManagementWrapper>
  );
};

export default RequestManagement;
