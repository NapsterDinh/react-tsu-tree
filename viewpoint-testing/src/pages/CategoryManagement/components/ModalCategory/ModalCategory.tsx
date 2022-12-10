import { usePermissions } from "@hooks/usePermissions";
import ViewpointCategoryAPI from "@services/categoryAPI";
import {
  MAX_LENGTH_INPUT_NAME_FIELD,
  MAX_LENGTH_TEXT_AREA,
} from "@utils/constantsUI";
import { showSuccessNotification } from "@utils/notificationUtils";
import { validateInput, VALIDATE_TRIGGER } from "@utils/validateFormUtils";
import { Button, Form, Input, Modal, Switch } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const { TextArea } = Input;

export type ModalCategoryProps = {
  open: boolean;
  handleCancel: () => void;
  item: any;
  handleCallAPI: () => void;
};
const ModalCategory: React.FC<ModalCategoryProps> = ({
  open,
  handleCancel,
  item,
  handleCallAPI,
}) => {
  const { checkPermission } = usePermissions();
  const [form] = useForm();
  const { t } = useTranslation(["common", "validate", "responseMessage"]);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    if (item !== "") {
      form.setFieldValue("name", item.name);
      form.setFieldValue("description", item.description);
      form.setFieldValue("isActive", item.isActive);
    }
  }, [item]);

  const onSubmit = async (values) => {
    try {
      setConfirmLoading(true);
      if (item !== "") {
        await ViewpointCategoryAPI.editCategory(values, item.id);
        showSuccessNotification(t("common:edit_category_success"));
      } else {
        await ViewpointCategoryAPI.createNewCategory(values);
        showSuccessNotification(t("common:create_new_category_success"));
      }
      await handleCallAPI();
      handleCancel();
      form.resetFields();
    } catch (error) {
      form.setFields([
        {
          name: "name",
          errors: [t(`responseMessage:${error?.code}`)],
        },
      ]);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <Modal
      title={
        item === ""
          ? t("common:create_new_category")
          : t("common:edit_category")
      }
      visible={open}
      width={800}
      onCancel={() => {
        handleCancel();
        form.resetFields();
      }}
      maskClosable={false}
      footer={[
        <Button
          key="cancel"
          onClick={() => {
            handleCancel();
            form.resetFields();
          }}
        >
          {t("common:common.cancel")}
        </Button>,
        <Button
          key="save"
          form="modalCategory"
          type="primary"
          htmlType="submit"
          loading={confirmLoading}
          disabled={!checkPermission(["CATEGORY.UPDATE"])}
        >
          {t("common:common.save")}
        </Button>,
      ]}
    >
      <Form
        id={"modalCategory"}
        name="basic"
        labelAlign="left"
        labelCol={{
          span: 6,
        }}
        form={form}
        wrapperCol={{
          span: 17,
        }}
        autoComplete="off"
      >
        <Form.Item
          label={t("common:common.name")}
          name="name"
          required
          rules={[
            validateInput({
              messageRequired: t("validate:category_name_required"),
              messageTrimSpace: t(
                "validate:viewpoint_collection.name_trim_space"
              ),
              messageNotContainSpecialCharacter: t(
                "validate:category_name_not_contains_special_characters"
              ),
              maxLength: MAX_LENGTH_INPUT_NAME_FIELD,
              messageMaxLength: t("validate:category_name_max_length", {
                MAX_LENGTH_INPUT_NAME_FIELD: MAX_LENGTH_INPUT_NAME_FIELD,
              }),
            }),
          ]}
          validateTrigger={VALIDATE_TRIGGER}
        >
          <Input placeholder={t("common:enter_name_category")} />
        </Form.Item>

        <Form.Item
          label={t("common:common.description")}
          name="description"
          validateTrigger={VALIDATE_TRIGGER}
          rules={[
            validateInput({
              messageTrimSpace: t(
                "validate:viewpoint_collection.description_trim_space"
              ),
              maxLength: MAX_LENGTH_TEXT_AREA,
              messageMaxLength: t("validate:description_max_length", {
                MAX_LENGTH_TEXT_AREA: MAX_LENGTH_TEXT_AREA,
              }),
            }),
          ]}
        >
          <Input.TextArea
            showCount
            maxLength={MAX_LENGTH_TEXT_AREA}
            rows={4}
            placeholder={t("common:enter_description_category")}
          />
        </Form.Item>

        <Form.Item
          label={t("common:common.status")}
          name="isActive"
          validateTrigger={VALIDATE_TRIGGER}
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalCategory;
