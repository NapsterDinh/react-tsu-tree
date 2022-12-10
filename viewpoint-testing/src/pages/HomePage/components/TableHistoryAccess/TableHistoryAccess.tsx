import { LocaleProvider } from "@components";
import { HistoryAccessItem } from "@pages/HomePage/HomePage";
import { Pagination, Table, Tooltip } from "antd";

import type { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import { Wrapper } from "./TableHistoryAccess.Styled";

type TableHistoryAccessProps = {
  data: HistoryAccessItem[];
  loading: boolean;
  pagination: any;
  setPagination: (any) => void;
  handleCallAPI: (any?) => void;
};

const TableHistoryAccess: React.FC<TableHistoryAccessProps> = ({
  data,
  loading,
  pagination,
  setPagination,
  handleCallAPI,
}) => {
  const { t } = useTranslation(["common"]);

  const columns: ColumnsType<HistoryAccessItem> = [
    {
      title: t("common:common.name"),
      dataIndex: "name",
      width: "30%",
      ellipsis: true,
    },
    {
      title: t("common:domain_management.name"),
      dataIndex: "domainName",
      ellipsis: true,
      width: "20%",
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: t("common:common.owner"),
      dataIndex: "userName",
      width: "15%",
      align: "center" as const,
    },
    {
      title: t("common:common.updated_at"),
      dataIndex: "updatedAt",
      width: "15%",
    },
    {
      title: t("common:dashboard.last_opened_time"),
      dataIndex: "lastOpenedTime",
      width: "15%",
    },
  ];

  const handleOnChangePagination = (page, pageSize) => {
    setPagination({ ...pagination, pageSize: pageSize, currentPage: page });
    handleCallAPI({ ...pagination, pageSize: pageSize, currentPage: page });
  };

  return (
    <Wrapper>
      <LocaleProvider>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          loading={loading}
        />
        {pagination.totalCount > 20 && (
          <Pagination
            total={pagination.totalCount}
            current={pagination.currentPage}
            showTotal={(total) =>
              t("common:common.show_total", { total: total })
            }
            showSizeChanger={true}
            onChange={handleOnChangePagination}
            defaultPageSize={20}
            pageSizeOptions={["20", "30", "50"]}
            style={{
              marginTop: "1rem",
              display: "flex",
              justifyContent: "right",
            }}
          />
        )}
      </LocaleProvider>
    </Wrapper>
  );
};

export default TableHistoryAccess;
