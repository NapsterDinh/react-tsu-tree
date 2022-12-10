import { BreadCrumb, LocaleProvider } from "@components";
import useAbortRequest from "@hooks/useAbortRequest";
import { IResponseData } from "@models/model";
import { ViewpointCollectionWrapper } from "@pages/ViewpointCollection/ViewpointCollectionStyle";
import { userApi } from "@services/userAPI";
import { ERR_CANCELED_RECEIVE_RESPONSE } from "@utils/constants";
import { INPUT_SEARCH } from "@utils/constantsUI";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@utils/notificationUtils";
import { validateInput } from "@utils/validateFormUtils";
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tooltip,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BiDetail } from "react-icons/bi";
import { BsTrash } from "react-icons/bs";
import { useLocation } from "react-router-dom";
import ModalCreate from "./ModalCreate/ModalCreate";
import { UserManagementWrapper } from "./UserManagementWrapper";
const { Option } = Select;
const UserManagement: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation(["common", "validate"]); // languages
  const [form] = Form.useForm();
  const [searchValue, setSearchValue] = useState("");
  const [role, setRole] = useState("2");
  const [sort, setSort] = useState("2");
  const [gender, setGender] = useState("2");
  const [loading, setLoading] = useState(false);
  const [dataUserList, setDataUserList] = useState([]);
  const [dataRender, setDataRender] = useState([]);
  const { signal } = useAbortRequest();
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
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
  };

  const handleFilterSearchFE = () => {
    let result = [...dataUserList];
    switch (role.toString()) {
      case "0":
        result = dataUserList.filter((item) => !item.isAdmin);
        break;
      case "1":
        result = dataUserList.filter((item) => item.isAdmin);
        break;
    }
    switch (gender.toString()) {
      case "1":
        result = result.filter((item) => item.gender === "male");
        break;
      case "0":
        result = result.filter((item) => item.gender === "female");
        break;
    }
    if (searchValue) {
      result = result.filter((item) =>
        (item.name as string)
          .toLocaleLowerCase()
          .includes(searchValue.trim().toLocaleLowerCase())
      );
    }

    switch (sort.toString()) {
      case "0":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "1":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }
    setDataRender(result);
  };
  const handleGetAllUsers = async () => {
    try {
      setLoading(true);
      const response: IResponseData = await userApi.getAllUser(
        {
          search: location.search,
        },
        signal
      );
      const userData = response.data?.map((user: any) => {
        return {
          id: user.id,
          key: user.id,
          phone: user.phone,
          name: user.name,
          gender: user.gender,
          isAdmin: user.isAdmin,
          role: (
            <Select
              defaultValue={user.isAdmin}
              style={{
                width: 120,
              }}
              // disabled={checkPermission(["USER.UPDATE"]) ? false : true}
              onChange={(value) => handleChangeRole(user.id, value)}
              options={[
                {
                  value: true,
                  label: "Admin",
                },
                {
                  value: false,
                  label: "Guest",
                },
              ]}
            ></Select>
          ),
          createdAt: new Date(user.createdAt).toLocaleString(),
          action: (
            <ViewpointCollectionWrapper>
              <Space size={12} key={user?.id}>
                <Tooltip title={t("common:common.view_detail")}>
                  <BiDetail
                    className="icon-action"
                    onClick={() => {
                      setOpen(true);
                      setSelectedItem(user);
                    }}
                  />
                </Tooltip>

                <Tooltip title={t("common:common.delete")}>
                  <BsTrash
                    className="icon-action"
                    onClick={() =>
                      Modal.confirm({
                        title: t("common:common.delete_user"),
                        content: t("common:common.delete_content_user"),
                        okText: t("common:common.delete"),
                        cancelText: t("common:common.cancel"),
                        onOk: () => handleDeleteUser(user.id),
                        width: 600,
                      })
                    }
                  />
                </Tooltip>
              </Space>
            </ViewpointCollectionWrapper>
          ),
        };
      });
      setDataUserList(userData);
      setDataRender(userData);
    } catch (error) {
      if (error?.code === ERR_CANCELED_RECEIVE_RESPONSE) {
        return;
      }
      showErrorNotification(t(`responseMessage:${error.code}`));
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async (id: string, value: string) => {
    try {
      await userApi.updateRole({ id: id, isAdmin: value });
      showSuccessNotification(t("common:common.update_role_user_successfully"));
    } catch (error) {
      showErrorNotification(t("common:common.update_role_user_failed"));
    }
  };

  // handle delete viewpoint collection
  const handleDeleteUser = async (id) => {
    try {
      setLoading(true);
      await userApi.deleteUser(id);
      await handleGetAllUsers();
      showSuccessNotification(t("common:common.delete_user_successfully"));
    } catch (error) {
      if (error?.msg) {
        showErrorNotification(error?.msg);
      }
    } finally {
      setLoading(false);
      Modal.destroyAll();
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
      title: t("common:user_management.name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("common:common.gender"),
      dataIndex: "gender",
      key: "gender",
      render: (text) => <span>{t(`common:common.${text}`)}</span>,
    },
    {
      title: t("common:common.phone"),
      dataIndex: "phone",
      key: "phone",
    },

    {
      title: t("common:role_management.name"),
      dataIndex: "role",
      key: "role",
    },
    {
      title: t("common:common.created_at"),
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: t("common:common.action"),
      key: "action",
      dataIndex: "action",
    },
  ];

  useEffect(() => {
    handleGetAllUsers();
  }, []);

  useEffect(() => {
    handleFilterSearchFE();
  }, [searchValue, role, sort, gender]);
  return (
    <UserManagementWrapper>
      <BreadCrumb
        title={t("common:common.user_management")}
        previousTitle={t("common:common.home_page")}
        link="/"
        breadCrumb={true as boolean}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Space align="start">
          <Space direction="vertical" align="start">
            <span className="label">{t("common:common.sort")}</span>
            <Select
              defaultValue={"2"}
              style={{ width: 180 }}
              onChange={(value) => setSort(value)}
            >
              <Option value={"2"}>{t("common:status.no_sort")}</Option>
              <Option value={"0"}>{t("common:common.sort_by_name_a_z")}</Option>
              <Option value={"1"}>{t("common:common.sort_by_name_z_a")}</Option>
            </Select>
          </Space>
          <Space direction="vertical" align="start">
            <span className="label">{t("common:common.role")}</span>
            <Select
              defaultValue={"2"}
              style={{ width: 180 }}
              onChange={(value) => setRole(value)}
            >
              <Option value="2">{t("common:common.all_of_role")}</Option>
              <Option value="1">{t("common:common.admin")}</Option>
              <Option value="0">{t("common:common.guest")}</Option>
            </Select>
          </Space>
          <Space direction="vertical" align="start">
            <span className="label">{t("common:common.gender")}</span>
            <Select
              defaultValue={"2"}
              style={{ width: 180 }}
              onChange={(value) => setGender(value)}
            >
              <Option value="2">{t("common:common.all_of_gender")}</Option>
              <Option value="1">{t("common:common.male")}</Option>
              <Option value="0">{t("common:common.female")}</Option>
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
        <div>
          <Button
            type={"primary"}
            style={{ marginTop: 10 }}
            onClick={() => setOpen(true)}
          >
            {t("common:common.create")}
          </Button>
        </div>
      </div>
      <ModalCreate
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        setOpen={setOpen}
        open={open}
        callAPIGetListData={handleGetAllUsers}
      />
      <LocaleProvider>
        <Table
          loading={loading}
          columns={columns}
          dataSource={dataRender}
          pagination={{ position: ["bottomRight"] }}
        />
      </LocaleProvider>
    </UserManagementWrapper>
  );
};
export default UserManagement;
