import { Icon } from "@components";
import useAbortRequest from "@hooks/useAbortRequest";
import type { Domain, IDataBodyFilterLog, User } from "@models/model";
import HistoryAccessAPI from "@services/historyAccessAPI";
import {
  DEFAULT_PAGINATION,
  ERR_CANCELED_RECEIVE_RESPONSE,
  FILTER_TIME,
  OWNED,
  TYPE_FILTER_LOG,
} from "@utils/constants";
import { checkContainsSpecialCharacter } from "@utils/helpersUtils";
import { showErrorNotification } from "@utils/notificationUtils";
import { Space, Tooltip, Typography } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  createSearchParams,
  Link,
  URLSearchParamsInit,
  useSearchParams,
} from "react-router-dom";
import { routes } from "routes";
import CommonAction from "./components/CommonAction/CommonAction";
import TableHistoryAccess from "./components/TableHistoryAccess/TableHistoryAccess";
import { Wrapper } from "./HomePage.Styled";
const { Paragraph } = Typography;

export type HistoryAccessItem = {
  name: string;
  type: string;
  lastOpenedTime: string;
  user: User;
  domain: Domain;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  isDeleted: boolean;
  key: string;
  icon: any;
  domainName: string;
  userName: string;
  commonId: string;
};

const HomePage = () => {
  const { t } = useTranslation(["common", "validate"]);
  const [data, setData] = useState<HistoryAccessItem[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
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
    lastOpenedTimeRange:
      searchParams.get("last_open") ?? FILTER_TIME.LAST_30_DAYS,
    domain: searchParams.get("domain") ?? "",
    type: searchParams.get("type") ?? TYPE_FILTER_LOG.DEFAULT,
    owner: searchParams.get("owner") ?? OWNED.ALL_USER,
  });
  const [errorSearch, setErrorSearch] = useState("");
  const { signal } = useAbortRequest();

  const handleChangeFilter = (typeChange, value) => {
    const tempVar = { ...filter };
    switch (typeChange) {
      case "Owner":
        tempVar.owner = value;
        break;
      case "TypeFile":
        tempVar.type = value;
        break;
      case "Domain":
        tempVar.domain = value;
        break;
      case "LastOpenedTime":
        tempVar.lastOpenedTimeRange = value as number;
        break;
      default:
        tempVar.owner = value;
        break;
    }
    setFilter(tempVar);
  };

  const handleCallAPI = async (paginationProps?) => {
    try {
      setLoading(true);
      const dataBody: IDataBodyFilterLog = {
        pageNumber: !paginationProps
          ? pagination?.currentPage
          : paginationProps?.currentPage,
        pageSize: !paginationProps
          ? pagination?.pageSize
          : paginationProps?.pageSize,
        type: 2,
      };
      const newSearchParams: URLSearchParamsInit = {};

      if (contentSearch) {
        setLoadingSearch(true);
        dataBody.text = contentSearch.trim();
        newSearchParams.text = contentSearch.trim();
      }
      if (filter.type !== null) {
        dataBody.type = filter.type;
        if (filter.type != TYPE_FILTER_LOG.DEFAULT) {
          newSearchParams.type = filter.type.toString();
        }
      }
      if (filter.owner !== null) {
        dataBody.owner = filter.owner;
        if (filter.owner != OWNED.ALL_USER) {
          newSearchParams.owner = filter.owner.toString();
        }
      }
      if (filter.lastOpenedTimeRange !== null) {
        dataBody.time = filter.lastOpenedTimeRange;
        if (filter.lastOpenedTimeRange !== FILTER_TIME.LAST_30_DAYS) {
          newSearchParams.last_open = filter.lastOpenedTimeRange.toString();
        }
      }

      const response = await HistoryAccessAPI.filterLogs(dataBody, signal);

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
        const target =
          element.type === TYPE_FILTER_LOG.PRODUCT
            ? element?.product
            : element?.viewPointCollections;
        convertedData[index] = {
          ...convertedData[index],
          key: element.id,
          updatedAt: element?.updatedAt
            ? new Date(element?.createdAt).toLocaleString()
            : new Date(element?.updatedAt).toLocaleString(),
          lastOpenedTime: new Date(element?.lastOpenedTime).toLocaleString(),
          name: (
            <Tooltip title={JSON.parse(target?.detail)?.Name}>
              <Space>
                <Icon
                  isProductIcon={
                    element.type === TYPE_FILTER_LOG.PRODUCT ? true : false
                  }
                />
                <Link
                  to={
                    element.type === TYPE_FILTER_LOG.PRODUCT
                      ? `${routes.ProductManagement.path[0]}/${element?.commonId}`
                      : `${routes.ViewpointCollection.path[0]}/${element?.commonId}`
                  }
                >
                  {JSON.parse(target?.detail)?.Name}
                </Link>
              </Space>
            </Tooltip>
          ),
          domainName:
            target && target?.domains.length !== 0
              ? target?.domains.map((e, i) => {
                  if (i === target?.domains?.length - 1) {
                    return JSON.parse(e?.detail)?.Name + " ";
                  } else {
                    return JSON.parse(e?.detail)?.Name + ", ";
                  }
                })
              : "No Domain Name",
          userName: target?.userCreate?.account,
        };
      }
      setData(convertedData);
    } catch (error) {
      if (error?.code === ERR_CANCELED_RECEIVE_RESPONSE) {
        return;
      }
      if (error?.code) {
        showErrorNotification(t(`responseMessage:${error?.code}`));
      }
    } finally {
      setLoading(false);
      setLoadingSearch(false);
    }
  };

  useEffect(() => {
    handleCallAPI();
  }, [contentSearch, filter]);

  const onSearch = (value) => {
    if (checkContainsSpecialCharacter(value.trim())) {
      setErrorSearch(
        t("validate:common.search_can_not_contains_special_characters")
      );
    } else {
      setErrorSearch("");
      setContentSearch(value);
    }
  };

  return (
    <div>
      <Wrapper>
        <div
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            color: "var(--clr-text)",
          }}
        >
          {t("common:dashboard:your_history_access")}
        </div>
        <div>
          <Space>
            <Icon />
            <Paragraph className="note">{t("common:product.name")}</Paragraph>
          </Space>
          <Space>
            <Icon isProductIcon={false} />
            <Paragraph className="note">
              {t("common:viewpoint_collection.name")}
            </Paragraph>
          </Space>
        </div>
      </Wrapper>

      <CommonAction
        errorSearch={errorSearch}
        onSearch={onSearch}
        loading={loadingSearch}
        filter={filter}
        handleChangeFilter={handleChangeFilter}
      />
      <TableHistoryAccess
        data={data}
        loading={loading}
        pagination={pagination}
        setPagination={setPagination}
        handleCallAPI={handleCallAPI}
      />
    </div>
  );
};

export default HomePage;
