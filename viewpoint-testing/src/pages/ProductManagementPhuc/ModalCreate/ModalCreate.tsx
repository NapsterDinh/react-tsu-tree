import { productPhucAPI } from "@services/productPhucAPI";
import { MAX_LENGTH_TEXT_AREA } from "@utils/constantsUI";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@utils/notificationUtils";
import { VALIDATE_TRIGGER } from "@utils/validateFormUtils";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Upload,
  UploadFile,
} from "antd";
import moment from "moment";

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
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };
  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const dataBody = {
        ...selectedItem,
        ...values,
        exp: values.exp.format("DD/MM/YYYY"),
        image: fileList[0]?.url ? fileList[0]?.url : fileList[0].response.data,
      };
      if (selectedItem) {
        await productPhucAPI.updateProduct(dataBody);
      } else {
        await productPhucAPI.createProduct(dataBody);
      }
      await callAPIGetListData();
      showSuccessNotification(t("common:common.create_product_successfully"));
      form.resetFields();
      setOpen(false);
      setSelectedItem(null);
      setFileList([]);
    } catch (error) {
      if (error?.msg) {
        showErrorNotification(error.msg);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedItem) {
      form.setFields([
        {
          name: "name",
          value: selectedItem.name,
          errors: [],
        },
        {
          name: "description",
          value: selectedItem.description,
          errors: [],
        },
        {
          name: "category",
          value: selectedItem.category,
          errors: [],
        },
        {
          name: "primaryPrice",
          value: selectedItem.primaryPrice,
          errors: [],
        },
        {
          name: "oldPrice",
          value: selectedItem.oldPrice,
          errors: [],
        },
        {
          name: "origin",
          value: selectedItem.origin,
          errors: [],
        },
        {
          name: "brand",
          value: selectedItem.brand,
          errors: [],
        },
        {
          name: "weight",
          value: selectedItem.weight,
          errors: [],
        },
        {
          name: "exp",
          value: moment(selectedItem.exp, "DD/MM/YYYY"),
          errors: [],
        },
        {
          name: "stock",
          value: selectedItem.stock,
          errors: [],
        },
      ]);
      setFileList([
        {
          uid: selectedItem.id,
          name: "image.png",
          status: "done",
          url: selectedItem.image,
        },
      ]);
    } else {
      {
        form.setFields([
          {
            name: "name",
            value: "",
            errors: [],
          },
          {
            name: "description",
            value: "",
            errors: [],
          },
          {
            name: "category",
            value: "chicken",
            errors: [],
          },
          {
            name: "primaryPrice",
            value: 0,
            errors: [],
          },
          {
            name: "oldPrice",
            value: 0,
            errors: [],
          },
          {
            name: "origin",
            value: "VND",
            errors: [],
          },
          {
            name: "brand",
            value: "",
            errors: [],
          },
          {
            name: "weight",
            value: 0,
            errors: [],
          },
          {
            name: "exp",
            value: moment(moment(), "DD/MM/YYYY"),
            errors: [],
          },
          {
            name: "stock",
            value: 0,
            errors: [],
          },
        ]);
      }
    }
  }, [selectedItem]);

  return (
    <Modal
      title={
        selectedItem
          ? t("common:common.update_product")
          : t("common:common.create_product")
      }
      visible={open}
      onCancel={() => {
        setOpen(false);
        form.resetFields();
        setSelectedItem(null);
        setFileList([]);
      }}
      width={800}
      footer={[
        <Button
          key="cancel"
          onClick={() => {
            setOpen(false);
            form.resetFields();
            setSelectedItem(null);
            setFileList([]);
          }}
        >
          {t("common:common.cancel")}
        </Button>,
        <Button
          key="create"
          form="createUpdateProduct"
          type="primary"
          htmlType="submit"
          loading={loading}
        >
          {selectedItem ? t("common:common.update") : t("common:common.create")}
        </Button>,
      ]}
    >
      <Form
        id="createUpdateProduct"
        labelAlign="left"
        form={form}
        labelCol={{
          span: 6,
        }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label={t("common:common.name")}
          name="name"
          required
          validateTrigger={VALIDATE_TRIGGER}
        >
          <Input placeholder={t("common:common.product_name_placeholder")} />
        </Form.Item>

        <Form.Item label={t("common:common.description")} name="description">
          <Input.TextArea
            rows={4}
            showCount
            maxLength={MAX_LENGTH_TEXT_AREA}
            placeholder={t("common:common.product_description_placeholder")}
          />
        </Form.Item>

        <Form.Item label={t("common:common.category")} name="category" required>
          <Select style={{ width: 180 }}>
            <Select.Option value={"chicken"}>Chicken</Select.Option>
            <Select.Option value={"pork"}>Pork</Select.Option>
            <Select.Option value={"fish"}>Fish</Select.Option>
            <Select.Option value={"seafood"}>Seafood</Select.Option>
            <Select.Option value={"egg"}>Egg</Select.Option>
            <Select.Option value={"vegetable"}>Vegetable</Select.Option>
            <Select.Option value={"root vegetable"}>
              Root vegetable
            </Select.Option>
            <Select.Option value={"fruit"}>Fruit</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={t("common:common.primary_price")}
          name="primaryPrice"
          required
        >
          <InputNumber
            min={0}
            placeholder={t("common:common.product_primary_price_placeholder")}
          />
        </Form.Item>

        <Form.Item
          label={t("common:common.old_price")}
          name="oldPrice"
          required
        >
          <InputNumber
            min={0}
            placeholder={t("common:common.product_old_price_placeholder")}
          />
        </Form.Item>

        <Form.Item label={t("common:common.origin")} name="origin" required>
          <InputNumber
            min={0}
            placeholder={t("common:common.product_origin_placeholder")}
          />
        </Form.Item>

        <Form.Item label={t("common:common.brand")} name="brand" required>
          <Input placeholder={t("common:common.product_brand_placeholder")} />
        </Form.Item>

        <Form.Item label={t("common:common.weight")} name="weight" required>
          <InputNumber
            min={0}
            placeholder={t("common:common.product_weight_placeholder")}
          />
        </Form.Item>

        <Form.Item label={t("common:common.exp")} name="exp" required>
          <DatePicker format="DD/MM/YYYY" />
        </Form.Item>

        <Form.Item label={t("common:common.stock")} name="stock" required>
          <InputNumber
            min={0}
            placeholder={t("common:common.product_stock_placeholder")}
          />
        </Form.Item>
        <Form.Item label={t("common:common.image")} name="image">
          <Upload
            action="http://localhost:5000/products/uploadImage"
            listType="picture-card"
            fileList={fileList}
            onChange={onChange}
            onPreview={onPreview}
          >
            {fileList.length < 1 && "+ Upload"}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalCreate;
