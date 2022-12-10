import { orderAPI } from "@services/orderAPI";
import { userApi } from "@services/userAPI";
import { MAX_LENGTH_INPUT_NAME_FIELD } from "@utils/constantsUI";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@utils/notificationUtils";
import { validateInput, VALIDATE_TRIGGER } from "@utils/validateFormUtils";
import {
  Avatar,
  Button,
  Descriptions,
  Form,
  Input,
  List,
  Modal,
  Select,
  Tag,
} from "antd";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const ModalCreate = ({
  setOpen,
  open,
  callAPIGetListData,
  selectedItem,
  setSelectedItem,
}) => {
  const { t } = useTranslation(["common", "validate"]); // languages
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // handle delete viewpoint collection
  const handleUpdateDelivery = async () => {
    try {
      setLoading(loading);
      await orderAPI.updateDelivery(selectedItem._id);
      await callAPIGetListData();
      showSuccessNotification(t("common:common.delete_order_successfully"));
    } catch (error) {
      setLoading(false);
      if (error?.msg) {
        showErrorNotification(error?.msg);
      }
    } finally {
      setLoading(false);
      Modal.destroyAll();
      setOpen(false);
      form.resetFields();
      setSelectedItem(null);
    }
  };

  return (
    <Modal
      title={"Order Info"}
      visible={open}
      onCancel={() => {
        setOpen(false);
        form.resetFields();
        setSelectedItem(null);
      }}
      width={1000}
      footer={[
        <Button
          key="cancel"
          onClick={() => {
            setOpen(false);
            form.resetFields();
            setSelectedItem(null);
          }}
        >
          {t("common:common.cancel")}
        </Button>,
        !selectedItem.isDelivered && (
          <Button
            key="create"
            form="createUpdateProduct"
            type="primary"
            loading={loading}
            onClick={handleUpdateDelivery}
          >
            {"Mark delivered"}
          </Button>
        ),
      ]}
    >
      <Form
        id="createUpdateProduct"
        labelAlign="left"
        form={form}
        labelCol={{
          span: 6,
        }}
        autoComplete="off"
      >
        <Descriptions>
          <Descriptions.Item label="ID">{selectedItem._id}</Descriptions.Item>
          <Descriptions.Item label="Customer">
            {selectedItem.userInfo.name}
          </Descriptions.Item>
          <Descriptions.Item label="Address">
            {selectedItem.shippingInfo.address}
          </Descriptions.Item>
          <Descriptions.Item label="Shipping Phone">
            {selectedItem.shippingInfo.shippingPhone}
          </Descriptions.Item>
          <Descriptions.Item>
            {/* {selectedItem.shippingInfo.itemsPrice} */}
          </Descriptions.Item>
          <Descriptions.Item>
            {/* {selectedItem.shippingInfo.shippingPrice} */}
          </Descriptions.Item>
          <Descriptions.Item label="Delivered status:">
            <Tag
              style={{ color: "white" }}
              color={selectedItem.isDelivered ? "#87d068" : "#2db7f5"}
            >
              {selectedItem.isDelivered ? "Delivered" : "Waiting"}
            </Tag>
          </Descriptions.Item>
          {selectedItem.isDelivered ? (
            <>
              <Descriptions.Item label="Delivered at">
                {new Date(selectedItem.deliveredAt).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item>
                {/* {new Date(selectedItem.deliveredAt).toLocaleString()} */}
              </Descriptions.Item>
            </>
          ) : (
            <>
              <Descriptions.Item>
                {/* {new Date(selectedItem.deliveredAt).toLocaleString()} */}
              </Descriptions.Item>
              <Descriptions.Item>
                {/* {new Date(selectedItem.deliveredAt).toLocaleString()} */}
              </Descriptions.Item>
            </>
          )}
          <Descriptions.Item label="Paid status:">
            <Tag
              style={{ color: "white" }}
              color={selectedItem.isPaid ? "#87d068" : "#2db7f5"}
            >
              {selectedItem.isPaid ? "Paid" : "Not yet"}
            </Tag>
          </Descriptions.Item>
          {selectedItem.isPaid ? (
            <>
              <Descriptions.Item label="Payment Method">
                <Tag
                  style={{ color: "white" }}
                  color={
                    selectedItem.paymentMethod === "cash"
                      ? "#87d068"
                      : "#2db7f5"
                  }
                >
                  {selectedItem.paymentMethod}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Paid at">
                {new Date(selectedItem.paidAt).toLocaleString()}
              </Descriptions.Item>
            </>
          ) : (
            <>
              <Descriptions.Item>
                {/* <Tag
                  style={{ color: "white" }}
                  color={
                    selectedItem.paymentMethod === "cash"
                      ? "#87d068"
                      : "#2db7f5"
                  }
                >
                  {selectedItem.paymentMethod}
                </Tag> */}
              </Descriptions.Item>

              <Descriptions.Item>
                {/* {new Date(selectedItem.paidAt).toLocaleString()} */}
              </Descriptions.Item>
            </>
          )}
          <Descriptions.Item label={t("common:common.productItems")}>
            {/* {selectedItem.shippingInfo.shippingPrice} */}
          </Descriptions.Item>
        </Descriptions>

        <List
          itemLayout="horizontal"
          dataSource={selectedItem.orderItems}
          renderItem={(item: any) => (
            <List.Item key={item._id}>
              <List.Item.Meta
                avatar={<Avatar src={item.productId.image} />}
                title={item.productId.name}
              ></List.Item.Meta>
              <div>
                {item.productId.primaryPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                x {item.qty}
              </div>
            </List.Item>
          )}
        />
        <List.Item>
          <List.Item.Meta
            title={t("common:common.totalItemPrice")}
          ></List.Item.Meta>
          <div>
            {selectedItem.shippingInfo.itemsPrice
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </div>
        </List.Item>
        <List.Item>
          <List.Item.Meta
            title={t("common:common.shippingPrice")}
          ></List.Item.Meta>
          <div>
            {selectedItem.shippingInfo.shippingPrice
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </div>
        </List.Item>
        <List.Item>
          <List.Item.Meta
            title={t("common:common.totalPrice")}
          ></List.Item.Meta>
          <h2 style={{ color: "#237804" }}>
            {(
              selectedItem.shippingInfo.itemsPrice +
              selectedItem.shippingInfo.shippingPrice
            )
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </h2>
        </List.Item>
      </Form>
    </Modal>
  );
};

export default ModalCreate;
