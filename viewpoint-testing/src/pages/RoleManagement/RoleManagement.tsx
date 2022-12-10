import {
  CheckCircleOutlined,
  HomeOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { LocaleProvider } from "@components/index";
import useAbortRequest from "@hooks/useAbortRequest";
import { usePermissions } from "@hooks/usePermissions";
import { IResponseData, IRole } from "@models/model";
import { roleApi } from "@services/roleAPI";
import { ERR_CANCELED_RECEIVE_RESPONSE } from "@utils/constants";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@utils/notificationUtils";
import {
  Breadcrumb,
  Button,
  Form,
  Modal,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { Link } from "react-router-dom";
import ModalCreate from "./components/ModalCreate/ModalCreate";
import ModalUpdate from "./components/ModalUpdate/ModalUpdate";
import { RoleManagementWrapper } from "./RoleManagementWrapper";

interface DataType {
  key: string;
  role: string;
  lastUpdate: string;
  dateCreated: string;
  description: string;
  status: string;
  action: any;
}
const { Paragraph } = Typography;

const RoleManagement: React.FC = () => {
  const { t } = useTranslation(["common", "validate"]); // languages
  const { checkPermission } = usePermissions();
  const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
  const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false);
  const [loading, setLoading] = useState<any>();
  const [permissions, setPermissions] = useState<any>([]);
  const [detailRole, setDetailRole] = useState<any>();
  const [dataRoleList, setDataRoleList] = useState([]);
  const { signal } = useAbortRequest();

  const handleGetAllPermission = async () => {
    try {
      setLoading(true);
      const res = await roleApi.getAllPermission({ signal: signal });
      setPermissions(res.data);
    } catch (error) {
      if (error?.code === ERR_CANCELED_RECEIVE_RESPONSE) {
        return;
      }
      if (error?.code) {
        showErrorNotification(t(`responseMessage:${error?.code}`));
      }
    } finally {
      setLoading(false);
    }
  };

  // Modal create viewpoint collection
  const [form] = Form.useForm();

  const showModalCreate = () => {
    setIsModalOpenCreate(true);
  };

  const handleOkCreate = () => {
    setIsModalOpenCreate(false);
  };

  const handleCancelCreate = async () => {
    try {
      setLoading(true);
      handleGetAllPermission();
    } catch (error) {
      if (error?.code) {
        showErrorNotification(t(`responseMessage:${error?.code}`));
      }
    } finally {
      setIsModalOpenCreate(false);
      setLoading(false);
    }
  };

  // Modal create viewpoint collection
  const showModalUpdate = async (value) => {
    try {
      setIsModalOpenUpdate(true);
      const res = await roleApi.getRoleById(value?.id);
      setDetailRole(res.data);
    } catch (error) {
      showErrorNotification(t(`responseMessage:${error.code}`));
    } finally {
    }
  };

  const handleGetAllRole = async () => {
    try {
      setLoading(true);
      const response: IResponseData = await roleApi.getAllRole({
        signal: signal,
      });
      const dataTable = response.data.map((role: IRole) => {
        return {
          key: role.id,
          role: role.name,
          description: role?.description,
          lastUpdate: new Date(role.updateAt).toLocaleString(),
          dateCreated: role.createAt,
          status: role.isActive ? (
            <Tag
              color="success"
              className="active"
              icon={<CheckCircleOutlined />}
            >
              {t("common:status.active")}
            </Tag>
          ) : (
            <Tag
              color="default"
              className="inactive"
              icon={<MinusCircleOutlined />}
            >
              {t("common:status.inactive")}
            </Tag>
          ),
          action: (
            <Space>
              {checkPermission(["ROLE.UPDATE"]) && (
                <Tooltip title={t("common:common.edit")}>
                  <AiOutlineEdit
                    style={{ cursor: "pointer" }}
                    onClick={() => showModalUpdate(role)}
                  />
                </Tooltip>
              )}
              {checkPermission(["ROLE.DELETE"]) && (
                <Tooltip title={t("common:common.delete")}>
                  <AiOutlineDelete
                    style={{ cursor: "pointer" }}
                    onClick={() => confirmDeleteRole(role.id)}
                  />
                </Tooltip>
              )}
            </Space>
          ),
        };
      });
      setDataRoleList(dataTable);
    } catch (error) {
      if (error?.code === ERR_CANCELED_RECEIVE_RESPONSE) {
        return;
      }
      showErrorNotification(t(`responseMessage:${error.code}`));
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteRole = (id: string) => {
    Modal.confirm({
      title: t("common:role_management.modal_delete"),
      content: t("common:role_management.content_modal_delete"),
      onOk: () => handleOkDelete(id),
      okText: t("common:common.delete"),
    });
  };

  const handleOkDelete = async (id: string) => {
    try {
      setLoading(true);
      await roleApi.deleteRole(id);
      showSuccessNotification(t("common:role_management.delete_successfully"));
      handleGetAllRole();
    } catch (error) {
      showErrorNotification(t(`responseMessage:${error.code}`));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetAllRole();
    handleGetAllPermission();
  }, []);

  const columns: ColumnsType<DataType> = [
    {
      title: t("role_management.name"),
      dataIndex: "role",
      key: "role",
      width: "25%",
      ellipsis: true,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
    },
    {
      title: t("common:common.description"),
      key: "description",
      dataIndex: "description",
      ellipsis: true,
      width: "30%",
      render: (text) => (
        <Tooltip title={text}>
          <Paragraph style={{ marginBottom: "0px" }} ellipsis>
            {text}
          </Paragraph>
        </Tooltip>
      ),
    },
    {
      title: t("common.status"),
      key: "status",
      dataIndex: "status",
      width: "15%",
    },
    {
      title: t("common.updated_at"),
      dataIndex: "lastUpdate",
      key: "lastUpdate",
      width: "20%",
    },
    {
      title: t("common.action"),
      key: "action",
      dataIndex: "action",
      width: "10%",
    },
  ];

  return (
    <RoleManagementWrapper>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">
            <HomeOutlined style={{ marginRight: "0.5rem", fontSize: "14px" }} />
            {t("common:common.home_page")}
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{t("role_management.name")}</Breadcrumb.Item>
      </Breadcrumb>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1
          style={{
            marginTop: "20px",
            fontSize: "1.5rem",
            fontWeight: "600",
            color: "var(--clr-text)",
          }}
        >
          {t("role_management.name")}
        </h1>
        <Button
          disabled={!checkPermission(["ROLE.CREATE"])}
          type="primary"
          onClick={showModalCreate}
        >
          {t("common:common.create")}
        </Button>
      </div>

      {permissions && (
        <ModalCreate
          isModalOpenCreate={isModalOpenCreate}
          handleOkCreate={handleOkCreate}
          handleCancelCreate={handleCancelCreate}
          setIsModalOpenCreate={setIsModalOpenCreate}
          permissions={permissions}
          setPermissions={setPermissions}
          setLoading={setLoading}
          handleGetAllRole={handleGetAllRole}
        />
      )}

      <LocaleProvider>
        <Table
          loading={loading}
          columns={columns}
          dataSource={dataRoleList}
          pagination={false}
        />
      </LocaleProvider>

      <ModalUpdate
        checkPermission={checkPermission}
        isModalOpenUpdate={isModalOpenUpdate}
        setIsModalOpenUpdate={setIsModalOpenUpdate}
        form={form}
        detailRole={detailRole}
        permissions={permissions}
        setLoading={setLoading}
        setDetailRole={setDetailRole}
        handleGetAllRole={handleGetAllRole}
      />
    </RoleManagementWrapper>
  );
};

export default RoleManagement;
