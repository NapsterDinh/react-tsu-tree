import { BreadCrumb, LocaleProvider } from "@components";
import useAbortRequest from "@hooks/useAbortRequest";
import { usePermissions } from "@hooks/usePermissions";
import { IResponseData, IUser } from "@models/model";
import { roleApi } from "@services/roleAPI";
import { userApi } from "@services/userAPI";
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGINATION,
  ERR_CANCELED_RECEIVE_RESPONSE,
} from "@utils/constants";
import { INPUT_SEARCH } from "@utils/constantsUI";
import {
  checkContainsSpecialCharacter,
  removeEmoji,
} from "@utils/helpersUtils";
import { showErrorNotification } from "@utils/notificationUtils";
import { validateInput } from "@utils/validateFormUtils";
import { Form, Input, Pagination, Select, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useSearchParams } from "react-router-dom";
import { UserManagementWrapper } from "./UserManagementWrapper";
const { Option } = Select;
const UserManagement: React.FC = () => {
  const location = useLocation();
  const { checkPermission } = usePermissions();
  const { t } = useTranslation(["common", "validate"]); // languages
  const [roles, setRoles] = useState<any>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [form] = Form.useForm();
  const [searchValue, setSearchValue] = useState(searchParams.get("Text"));
  // const { users, loading } = useSelector((state: rootState) => state.user);
  const [loading, setLoading] = useState(false);
  const [dataUserList, setDataUserList] = useState([]);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [loadingChangeStatus, setLoadingChangeStatus] = useState(false);
  const { signal } = useAbortRequest();
  const handleChangeInputSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const handleEnterSearch = (value: string) => {
    setSearchValue(value.trim());
    form.setFields([
      {
        name: "searchValue",
        value: value.trim(),
      },
    ]);
    if (
      value?.trim() &&
      !checkContainsSpecialCharacter(value) &&
      !removeEmoji(value)
    ) {
      searchParams.set("Text", value.trim());
      setSearchParams(searchParams);
    } else {
      searchParams.delete("Text");
      setSearchParams(searchParams);
    }
    setPagination({
      ...pagination,
      currentPage: 1,
    });
  };

  const handleGetAllRole = async () => {
    try {
      const response = await roleApi.getAllRole({ signal: signal });
      const options = response.data.reduce((optionArray, currentRole) => {
        const option = {
          value: currentRole.name,
          label: currentRole.name,
        };
        optionArray = [...optionArray, option];
        return optionArray;
      }, []);
      setRoles(options);
    } catch (error) {
      if (error?.code === ERR_CANCELED_RECEIVE_RESPONSE) {
        return;
      }
      showErrorNotification(t(`responseMessage:${error.code}`));
    } finally {
      // setLoading(false);
    }
  };

  const handleChangeAsc = (value: string) => {
    if (searchParams.getAll("Text")[0] && searchParams.getAll("isActive")[0]) {
      setSearchParams({
        isActive: searchParams.getAll("isActive")[0],
        Text: searchParams.getAll("Text")[0],
        Sort: value,
      });
    } else if (searchParams.getAll("Text")[0]) {
      setSearchParams({
        Text: searchParams.getAll("Text")[0],
        Sort: value,
      });
    } else if (searchParams.getAll("isActive")[0]) {
      setSearchParams({
        isActive: searchParams.getAll("isActive")[0],
        Sort: value,
      });
    } else {
      setSearchParams({
        Sort: value,
      });
    }
    setPagination({
      ...pagination,
      currentPage: 1,
    });
  };

  const handleChangeSortActive = (value: string) => {
    if (searchParams.getAll("Text")[0] && searchParams.getAll("Sort")[0]) {
      setSearchParams({
        Sort: searchParams.getAll("Sort")[0],
        Text: searchParams.getAll("Text")[0],
        isActive: value,
      });
    } else if (searchParams.getAll("Text")[0]) {
      setSearchParams({
        Text: searchParams.getAll("Text")[0],
        isActive: value,
      });
    } else if (searchParams.getAll("Sort")[0]) {
      setSearchParams({
        Sort: searchParams.getAll("Sort")[0],
        isActive: value,
      });
    } else {
      setSearchParams({
        isActive: value,
      });
    }
    setPagination({
      ...pagination,
      currentPage: 1,
    });
  };

  const handleGetAllUsers = async (pageNumber: number, pageSize: number) => {
    try {
      setLoading(true);
      const response: IResponseData = await userApi.getAllUser(
        {
          PageNumber: pageNumber,
          PageSize: pageSize,
          search: location.search,
        },
        signal
      );
      const userData = response.data?.map((user: IUser) => {
        return {
          id: user.id,
          key: user.id,
          email: user.email,
          account: user.account,
          role: (
            <Select
              defaultValue={user.role}
              style={{
                width: 120,
              }}
              disabled={checkPermission(["USER.UPDATE"]) ? false : true}
              onChange={(value) => handleChangeRole(user.id, value)}
              options={roles}
            ></Select>
          ),
          status: (
            <Select
              defaultValue={user.isActive}
              disabled={checkPermission(["USER.UPDATE"]) ? false : true}
              style={{
                width: 120,
              }}
              loading={loadingChangeStatus}
              onChange={(value) => handleChangeStatus(user.id, value)}
            >
              <Option value={true}>{t("common:status.active")}</Option>
              <Option value={false}>{t("common:status.inactive")}</Option>
            </Select>
          ),
          dateStart: new Date(user.createdAt).toLocaleString(),
          updateAt: new Date(user.updatedAt).toLocaleString(),
        };
      });
      setDataUserList(userData);
      setPagination({
        ...pagination,
        ...response?.metaData,
      });
    } catch (error) {
      if (error?.code === ERR_CANCELED_RECEIVE_RESPONSE) {
        return;
      }
      showErrorNotification(t(`responseMessage:${error.code}`));
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatus = async (id: string, value: boolean) => {
    try {
      setLoadingChangeStatus(true);
      await userApi.updateStatus({ id: id, isActive: value });
    } catch (error) {
      showErrorNotification(t(`responseMessage:${error.code}`));
    } finally {
      setLoadingChangeStatus(false);
    }
  };

  const handleChangeRole = async (id: string, value: string) => {
    try {
      await userApi.updateRole({ id: id, role: value });
    } catch (error) {
      showErrorNotification(t(`responseMessage:${error.code}`));
    }
  };

  interface DataType {
    key: React.Key;
    userName: string;
    account: string;
    role: any;
    status: any;
    dateStart: any;
  }

  const columns: ColumnsType<DataType> = [
    {
      title: t("common:user_management.account"),
      dataIndex: "account",
      key: "account",
    },
    {
      title: t("common:common.email"),
      dataIndex: "email",
      key: "email",
    },
    {
      title: t("common:role_management.name"),
      dataIndex: "role",
      key: "role",
    },
    {
      title: t("common:common.status"),
      dataIndex: "status",
      key: "status",
    },
    {
      title: t("common:common.updated_at"),
      dataIndex: "updateAt",
      key: "updateAt",
    },
    {
      title: t("common:common.created_at"),
      dataIndex: "dateStart",
      key: "dateStart",
    },
  ];

  useEffect(() => {
    handleGetAllUsers(pagination.currentPage, pagination.pageSize);
  }, [location.search, roles]);

  useLayoutEffect(() => {
    handleGetAllRole();
  }, []);

  const onChange = (page: number, pageSize: number) => {
    handleGetAllUsers(page, pageSize);
    setPagination({
      ...pagination,
      currentPage: page,
      pageSize: pageSize,
    });
  };

  return (
    <UserManagementWrapper>
      <BreadCrumb
        title={t("common:user_management.name")}
        previousTitle={t("common:common.home_page")}
        link="/"
        breadCrumb={true as boolean}
      />
      <Space align="start">
        <Space direction="vertical" align="start">
          <span className="label">{t("common:common.sort")}</span>
          <Select
            defaultValue={
              searchParams.get("Sort") ? searchParams.get("Sort") : "2"
            }
            style={{ width: 180 }}
            onChange={handleChangeAsc}
          >
            <Option value={"2"}>{t("common:status.no_sort")}</Option>
            <Option value={"0"}>{t("common:common.sort_by_name_a_z")}</Option>
            <Option value={"1"}>{t("common:common.sort_by_name_z_a")}</Option>
          </Select>
        </Space>
        <Space direction="vertical" align="start">
          <span className="label">{t("common:common.status")}</span>
          <Select
            defaultValue={
              searchParams.get("isActive") ? searchParams.get("isActive") : "2"
            }
            style={{ width: 180 }}
            onChange={handleChangeSortActive}
          >
            <Option value="2">{t("common:common.all_of_status")}</Option>
            <Option value="1">{t("common:status.active")}</Option>
            <Option value="0">{t("common:status.inactive")}</Option>
          </Select>
        </Space>
        <Space direction="vertical" align="start">
          <span className="label">{t("common:common.search")}</span>
          <Form form={form} autoComplete="off">
            <Form.Item
              validateTrigger={["onChange", "onBlur"]}
              name="searchValue"
              rules={[
                validateInput({
                  messageNotContainSpecialCharacter: t(
                    "validate:common.search_can_not_contains_special_characters"
                  ),
                }),
              ]}
            >
              <Input.Search
                value={searchValue}
                placeholder={t("common:common.search_placeholder")}
                onSearch={handleEnterSearch}
                enterButton={t("common:common.search")}
                onChange={handleChangeInputSearch}
                maxLength={INPUT_SEARCH.MAX_LENGTH}
                style={{ width: INPUT_SEARCH.WIDTH }}
              />
            </Form.Item>
          </Form>
        </Space>
      </Space>
      <LocaleProvider>
        <Table
          loading={loading}
          columns={columns}
          dataSource={dataUserList}
          pagination={false}
        />
        {pagination.totalCount > DEFAULT_PAGE_SIZE && (
          <Pagination
            total={pagination.totalCount}
            current={pagination.currentPage}
            showTotal={(total) =>
              t("common:common.show_total", { total: total })
            }
            showSizeChanger={true}
            onChange={onChange}
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
    </UserManagementWrapper>
  );
};
export default UserManagement;
