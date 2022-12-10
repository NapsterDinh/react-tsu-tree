import { userApi } from "@services/userAPI";
import { MAX_LENGTH_INPUT_NAME_FIELD } from "@utils/constantsUI";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@utils/notificationUtils";
import { validateInput, VALIDATE_TRIGGER } from "@utils/validateFormUtils";
import { Button, Form, Input, InputNumber, Modal, Select } from "antd";

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

  const onFinish = async (values: any) => {
    if (
      !(values.phone as string).match(/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/)
    ) {
      form.setFields([
        {
          name: "phone",
          value: values.phone,
          errors: ["Invalid Phone!"],
        },
      ]);
      return;
    }
    try {
      setLoading(true);
      const dataBody = {
        ...selectedItem,
        ...values,
        isAdmin: values.isAdmin === "admin",
      };

      if (selectedItem) {
        await userApi.updateUser(dataBody);
      } else {
        await userApi.createUser(dataBody);
      }
      await callAPIGetListData();
      showSuccessNotification(t("common:common.create_user_successfully"));
      form.resetFields();
      setOpen(false);
      setSelectedItem(null);
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
          name: "phone",
          value: selectedItem.phone,
          errors: [],
        },
        {
          name: "gender",
          value: selectedItem.gender,
          errors: [],
        },
        {
          name: "isAdmin",
          value: selectedItem.isAdmin ? "admin" : "guest",
          errors: [],
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
            name: "phone",
            value: "",
            errors: [],
          },
          {
            name: "gender",
            value: "male",
            errors: [],
          },
          {
            name: "isAdmin",
            value: "guest",
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
          ? t("common:common.update_user")
          : t("common:common.create_user")
      }
      visible={open}
      onCancel={() => {
        setOpen(false);
        form.resetFields();
        setSelectedItem(null);
      }}
      width={800}
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
          rules={[
            validateInput({
              messageRequired: t("validate:common.user_name_is_required"),
              messageTrimSpace: t("validate:common.user_name_trim_space"),
              messageNotContainSpecialCharacter: t(
                "validate:common.user_name_can_not_contains_special_characters"
              ),
              maxLength: MAX_LENGTH_INPUT_NAME_FIELD,
              messageMaxLength: t("validate:common.user_name_max_length", {
                MAX_LENGTH_INPUT_NAME_FIELD: MAX_LENGTH_INPUT_NAME_FIELD,
              }),
            }),
          ]}
          validateTrigger={VALIDATE_TRIGGER}
        >
          <Input placeholder={t("common:common.user_name_placeholder")} />
        </Form.Item>

        <Form.Item
          label={t("common:common.phone")}
          name="phone"
          required
          validateTrigger={VALIDATE_TRIGGER}
          rules={[
            validateInput({
              messageRequired: t("validate:common.phone_is_required"),
              messageTrimSpace: t("validate:common.phone_trim_space"),
              messageNotContainSpecialCharacter: t(
                "validate:common.phone_can_not_contains_special_characters"
              ),
              maxLength: 10,
              messageMaxLength: t("validate:common.phone_max_length"),
              messageValidateOnlyContainNumber: t(
                "validate:common.phone_only_contain_number"
              ),
            }),
          ]}
        >
          <Input
            disabled
            maxLength={10}
            placeholder={t("common:common.phone_placeholder")}
          />
        </Form.Item>
        <Form.Item label={t("common:common.gender")} name="gender" required>
          <Select style={{ width: 180 }}>
            <Select.Option value="male">
              {t("common:common.male")}
            </Select.Option>
            <Select.Option value="female">
              {t("common:common.female")}
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label={t("common:common.role")} name="isAdmin" required>
          <Select style={{ width: 180 }}>
            <Select.Option value="admin">
              {t("common:common.admin")}
            </Select.Option>
            <Select.Option value="guest">
              {t("common:common.guest")}
            </Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalCreate;
