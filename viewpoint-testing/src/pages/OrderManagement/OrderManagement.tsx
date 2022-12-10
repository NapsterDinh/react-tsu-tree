import { BreadCrumb, LocaleProvider } from "@components";
import useAbortRequest from "@hooks/useAbortRequest";
import { IResponseData } from "@models/model";
import { ViewpointCollectionWrapper } from "@pages/ViewpointCollection/ViewpointCollectionStyle";
import { orderAPI } from "@services/orderAPI";
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
  Tag,
  Tooltip,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BiDetail } from "react-icons/bi";
import { BsTrash } from "react-icons/bs";
import { useLocation } from "react-router-dom";
import ModalCreate from "./ModalCreate/ModalCreate";
import { OrderManagementWrapper } from "./OrderManagementWrapper";
const { Option } = Select;

const OrderManagement: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation(["common", "validate"]); // languages
  const [form] = Form.useForm();
  const [searchValue, setSearchValue] = useState("");
  const [isPaid, setIsPaid] = useState("2");
  const [delivered, setDelivered] = useState("2");
  const [paymentMethod, setPaymentMethod] = useState("2");
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
    switch (paymentMethod.toString()) {
      case "0":
        result = dataUserList.filter((item) => item.paymentMethod === "cash");
        break;
      case "1":
        result = dataUserList.filter((item) => item.paymentMethod === "paypal");
        break;
    }
    switch (isPaid.toString()) {
      case "1":
        result = result.filter((item) => item.isPaid);
        break;
      case "0":
        result = result.filter((item) => !item.isPaid);
        break;
    }
    switch (delivered.toString()) {
      case "1":
        result = result.filter((item) => item.isDelivered);
        break;
      case "0":
        result = result.filter((item) => !item.isDelivered);
        break;
    }
    if (searchValue) {
      result = result.filter((item) =>
        (item.customer as string)
          .toLocaleLowerCase()
          .includes(searchValue.trim().toLocaleLowerCase())
      );
    }

    setDataRender(result);
  };
  const handleGetAllUsers = async () => {
    try {
      setLoading(true);
      const response: IResponseData = await orderAPI.getAllOrder(
        {
          search: location.search,
        },
        signal
      );
      const userData = response.data?.map((item: any) => {
        return {
          ...item,
          id: item._id,
          key: item._id,
          customer: item.userInfo.name,
          createdAt: new Date(item.createdAt).toLocaleString(),
          paidAt: new Date(item.paidAt).toLocaleString(),
          totalPrice:
            item.shippingInfo.itemsPrice + item.shippingInfo.shippingPrice,
          action: (
            <ViewpointCollectionWrapper>
              <Space size={12} key={item?.id}>
                <Tooltip title={t("common:common.view_detail")}>
                  <BiDetail
                    className="icon-action"
                    onClick={() => {
                      setOpen(true);
                      setSelectedItem(item);
                    }}
                  />
                </Tooltip>

                <Tooltip title={t("common:common.delete")}>
                  <BsTrash
                    className="icon-action"
                    onClick={() =>
                      Modal.confirm({
                        title: t("common:common.delete_order"),
                        content: t("common:common.delete_content_order"),
                        okText: t("common:common.delete"),
                        cancelText: t("common:common.cancel"),
                        onOk: () => handleDeleteOrder(item._id),
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
  const handleDeleteOrder = async (id) => {
    try {
      setLoading(true);
      await orderAPI.deleteOrder(id);
      await handleGetAllUsers();
      showSuccessNotification(t("common:common.delete_order_successfully"));
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
      title: t("common:common.id"),
      dataIndex: "id",
      key: "id",
    },
    {
      title: t("common:common.customer"),
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: t("common:common.delivered"),
      dataIndex: "isDelivered",
      key: "isDelivered",
      render: (text) => (
        <Tag style={{ color: "white" }} color={text ? "#87d068" : "#2db7f5"}>
          {text ? "Delivered" : "Waiting"}
        </Tag>
      ),
      align: "center",
    },
    {
      title: t("common:common.paymentMethod"),
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (text) => (
        <Tag
          style={{ color: "white" }}
          color={text === "cash" ? "#87d068" : "#2db7f5"}
        >
          {text}
        </Tag>
      ),
      align: "center",
    },
    {
      title: t("common:common.isPaid"),
      dataIndex: "isPaid",
      key: "isPaid",
      render: (text) => (
        <Tag style={{ color: "white" }} color={text ? "#87d068" : "#2db7f5"}>
          {text ? "Paid" : "Not yet"}
        </Tag>
      ),
      align: "center",
    },

    {
      title: t("common:common.total_price"),
      dataIndex: "totalPrice",
      key: "totalPrice",
      align: "center",
      render: (text) => (
        <span>{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
      ),
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
  }, [searchValue, paymentMethod, delivered, isPaid]);
  return (
    <OrderManagementWrapper>
      <BreadCrumb
        title={t("common:common.order_management")}
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
            <span className="label">{t("common:common.delivered")}</span>
            <Select
              defaultValue={"2"}
              style={{ width: 180 }}
              onChange={(value) => setDelivered(value)}
            >
              <Option value="2">{t("common:common.all_of_delivered")}</Option>
              <Option value="1">{t("common:common.delivered")}</Option>
              <Option value="0">{t("common:common.waiting")}</Option>
            </Select>
          </Space>
          <Space direction="vertical" align="start">
            <span className="label">{t("common:common.paymentMethod")}</span>
            <Select
              defaultValue={"2"}
              style={{ width: 200 }}
              onChange={(value) => setPaymentMethod(value)}
            >
              <Option value="2">
                {t("common:common.all_of_paymentMethod")}
              </Option>
              <Option value="1">{t("common:common.paypal")}</Option>
              <Option value="0">{t("common:common.cash")}</Option>
            </Select>
          </Space>
          <Space direction="vertical" align="start">
            <span className="label">{t("common:common.isPaid")}</span>
            <Select
              defaultValue={"2"}
              style={{ width: 200 }}
              onChange={(value) => setIsPaid(value)}
            >
              <Option value="2">{t("common:common.all_of_isPaid")}</Option>
              <Option value="1">{t("common:common.isPaid")}</Option>
              <Option value="0">{t("common:common.not_yet")}</Option>
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
          {/* <Button
            type={"primary"}
            style={{ marginTop: 10 }}
            onClick={() => setOpen(true)}
          >
            {t("common:common.create")}
          </Button> */}
        </div>
      </div>
      {selectedItem && (
        <ModalCreate
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          setOpen={setOpen}
          open={open}
          callAPIGetListData={handleGetAllUsers}
        />
      )}
      <LocaleProvider>
        <Table
          loading={loading}
          columns={columns}
          dataSource={dataRender}
          pagination={{ position: ["bottomRight"] }}
        />
      </LocaleProvider>
    </OrderManagementWrapper>
  );
};
export default OrderManagement;
