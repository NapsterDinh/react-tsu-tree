import { ExclamationCircleOutlined } from "@ant-design/icons";
import { usePermissions } from "@hooks/usePermissions";
import type { CategoryTableItem } from "@pages/CategoryManagement/CategoryManagement";
import ViewpointCategoryAPI from "@services/categoryAPI";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@utils/notificationUtils";
import { Modal, Space, Switch, Table, Tooltip, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { Link } from "react-router-dom";
import { LocaleProvider } from "@components";

import { Wrapper } from "./TableCategory.Styled";

const { Paragraph } = Typography;

export type TableCategoryProps = {
  data: any[];
  loading: boolean;
  handleCallAPI: (any?) => void;
  setSelectedItem: any;
  showModal: () => void;
  setData: (any) => void;
  pagination: any;
  setPagination: (any) => void;
};

const TableCategory: React.FC<TableCategoryProps> = ({
  data,
  loading,
  handleCallAPI,
  setSelectedItem,
  showModal,
  setData,
  setPagination,
  pagination,
}) => {
  const { t } = useTranslation(["common", "responseMessage"]);
  const { checkPermission } = usePermissions();

  const handleOnChangeStatus = async (checked, item) => {
    const newData = [...data];
    let findIndex = -1;
    for (let index = 0; index < newData.length; index++) {
      const element = newData[index];
      if (element.id === item.id) {
        findIndex = index;
        newData[index] = {
          ...element,
          isActive: checked,
        };
        break;
      }
    }
    setData(newData);
    try {
      await ViewpointCategoryAPI.updateStatusCategory(checked, item.id);
      showSuccessNotification(t("common:change_is_active_success"));
    } catch (error) {
      const restoredData = [...newData];
      restoredData.splice(findIndex, 1, {
        ...restoredData[findIndex],
        isActive: !checked,
      });
      setData(restoredData);
      showErrorNotification(t("common:change_is_active_failed"));
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    showModal();
  };

  const handleOkDelete = async (item) => {
    try {
      await ViewpointCategoryAPI.deleteCategory(item.id);
      showSuccessNotification(t("common:delete_success"));
      handleCallAPI();
    } catch (error) {
      if (error?.code) {
        showErrorNotification(t(`responseMessage:${error?.code}`));
      }
    }
  };

  const handleDelete = (item) => {
    Modal.confirm({
      title: t("common:confirm_delete"),
      icon: <ExclamationCircleOutlined />,
      width: 500,
      content: (
        <>
          <p>{t("common:sure_delete_category")}</p>
        </>
      ),
      okText: t("common:delete"),
      cancelText: t("common:cancel"),
      onOk: () => handleOkDelete(item),
    });
  };

  const columns: ColumnsType<CategoryTableItem> = [
    {
      title: t("common:name"),
      dataIndex: "name",
      width: "25%",
      ellipsis: true,
      render: (text, item) => (
        <Tooltip title={text}>
          <Link
            to={"/"}
            onClick={(e) => {
              e.preventDefault();
              handleEdit(item);
            }}
          >
            {text}
          </Link>
        </Tooltip>
      ),
    },
    {
      title: t("common:status"),
      dataIndex: "isActive",
      width: "10%",
      render: (value, item) => {
        return (
          <Switch
            disabled={!checkPermission(["CATEGORY.UPDATE"])}
            checked={value}
            onChange={(checked) => handleOnChangeStatus(checked, item)}
          />
        );
      },
    },
    {
      title: t("common:description"),
      dataIndex: "description",
      width: "30%",
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <Paragraph style={{ marginBottom: "0px" }} ellipsis>
            {text}
          </Paragraph>
        </Tooltip>
      ),
    },
    {
      title: t("common:last_updated_at"),
      dataIndex: "updatedAt",
      width: "15%",
    },
    {
      title: t("common:user_update_Account"),
      dataIndex: "userUpdateAccount",
      width: "12%",
      align: "center",
    },
    {
      title: "",
      dataIndex: "",
      key: "action",
      align: "center",
      render: (item) => {
        return (
          <Space>
            {checkPermission(["CATEGORY.UPDATE"]) && (
              <Tooltip title={t("common:edit")}>
                <AiOutlineEdit onClick={() => handleEdit(item)} />
              </Tooltip>
            )}
            {checkPermission(["CATEGORY.DELETE"]) && (
              <Tooltip title={t("common:delete")}>
                <AiOutlineDelete onClick={() => handleDelete(item)} />
              </Tooltip>
            )}
            {!checkPermission(["CATEGORY.DELETE", "CATEGORY.UPDATE"]) && (
              <Link
                to={"/"}
                onClick={(e) => {
                  e.preventDefault();
                  handleEdit(item);
                }}
              >
                View Details
              </Link>
            )}
          </Space>
        );
      },
    },
  ];

  const handleOnChangePagination = (page, pageSize) => {
    setPagination({ ...pagination, pageSize: pageSize, currentPage: page });
    handleCallAPI({ ...pagination, pageSize: pageSize, currentPage: page });
  };

  return (
    <Wrapper>
      <div>
        <LocaleProvider>
          <Table
            className="table-category"
            columns={columns}
            dataSource={data}
            loading={loading}
            pagination={
              pagination?.totalCount < 20
                ? false
                : {
                    pageSize: pagination?.pageSize,
                    total: pagination.totalCount,
                    defaultCurrent: 1,
                    showSizeChanger: true,
                    onChange: handleOnChangePagination,
                    pageSizeOptions: ["20", "30", "40"],
                  }
            }
          />
        </LocaleProvider>
      </div>
    </Wrapper>
  );
};

export default TableCategory;
