import { BreadCrumb, LocaleProvider } from "@components";
import CustomerChart from "@components/CustomChart/CustomChart";
import useAbortRequest from "@hooks/useAbortRequest";
import { IResponseData } from "@models/model";
import { ViewpointCollectionWrapper } from "@pages/ViewpointCollection/ViewpointCollectionStyle";
import { productPhucAPI } from "@services/productPhucAPI";
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
  Image,
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
import { ProductManagementPhucWrapper } from "./ProductManagementPhucWrapper";
const { Option } = Select;
const ProductManagementPhuc: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation(["common", "validate"]); // languages
  const [form] = Form.useForm();
  const [searchValue, setSearchValue] = useState("");
  const [role, setRole] = useState("2");
  const [sort, setSort] = useState("2");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dataUserList, setDataUserList] = useState([]);
  const [dataRender, setDataRender] = useState([]);
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

  // handle delete viewpoint collection
  const handleDeleteProduct = async (id) => {
    try {
      setLoading(true);
      await productPhucAPI.deleteProduct(id);
      await handleGetAllUsers();
      showSuccessNotification(t("common:common.delete_product_successfully"));
    } catch (error) {
      if (error?.msg) {
        showErrorNotification(error?.msg);
      }
    } finally {
      setLoading(false);
      Modal.destroyAll();
    }
  };

  const handleGetAllUsers = async () => {
    try {
      setLoading(true);
      const response: IResponseData = await productPhucAPI.getAllProduct(
        {
          search: location.search,
        },
        signal
      );

      const productData = response.data?.map((item: any) => {
        return {
          ...item,
          id: item._id,
          key: item._id,
          createdAt: new Date(item.createdAt).toLocaleString(),
          updatedAt: new Date(item.updatedAt).toLocaleString(),
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
                        title: t("common:common.delete_product"),
                        content: t("common:common.delete_content_product"),
                        okText: t("common:common.delete"),
                        cancelText: t("common:common.cancel"),
                        onOk: () => handleDeleteProduct(item._id),
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
      setDataUserList(productData);
      setDataRender(productData);
    } catch (error) {
      if (error?.code === ERR_CANCELED_RECEIVE_RESPONSE) {
        return;
      }
      showErrorNotification(t(`responseMessage:${error.code}`));
    } finally {
      setLoading(false);
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
      title: t("common:common.image"),
      dataIndex: "image",
      key: "image",
      align: "center",
      render: (text) => <Image height={40} width={40} src={text} />,
    },
    {
      title: t("common:common.name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("common:common.category"),
      dataIndex: "category",
      key: "category",
    },
    {
      title: t("common:common.brand"),
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: t("common:common.stock"),
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: t("common:common.primary_price"),
      dataIndex: "primaryPrice",
      key: "primaryPrice",
      render: (text) => (
        <span>{text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
      ),
    },
    {
      title: t("common:common.origin"),
      dataIndex: "origin",
      key: "origin",
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
  }, [searchValue, role, sort]);
  return (
    <ProductManagementPhucWrapper>
      <BreadCrumb
        title={t("common:common.product_management")}
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
    </ProductManagementPhucWrapper>
  );
};
export default ProductManagementPhuc;