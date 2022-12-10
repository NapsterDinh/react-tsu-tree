import {
  MAX_LENGTH_INPUT_NAME_FIELD,
  MAX_LENGTH_TEXT_AREA
} from "@utils/constantsUI";
import { validateInput } from "@utils/validateFormUtils";
import { Button, Form, Input, Modal } from "antd";
import { FormInstance } from "antd/es/form/Form";
import React from "react";
import { useTranslation } from "react-i18next";

interface IProps {
  visible: boolean;
  onCancel: () => void;
  onFinish: (values: {
    name: string;
    description: string;
    parentId: React.Key;
  }) => void;
  form: FormInstance<any>;
  loading: boolean;
}

const CreateDomainModal = ({
  visible,
  form,
  onCancel,
  onFinish,
  loading,
}: IProps) => {
  const { t } = useTranslation(["common", "validate"]);
  return (
    <Modal
      title={t("common:domain_management.modal_create")}
      visible={visible}
      onCancel={onCancel}
      width={700}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          {t("common:common.cancel")}
        </Button>,
        <Button
          loading={loading}
          form="createDomainForm"
          key="create"
          type="primary"
          htmlType="submit"
        >
          {t("common:common.create")}
        </Button>,
      ]}
    >
      <Form
        id="createDomainForm"
        form={form}
        onFinish={onFinish}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          name="name"
          label={t("common:common.name")}
          required
          rules={[
            validateInput({
              messageRequired: t("validate:domain_management.name_is_required"),
              messageTrimSpace: t("validate:domain_management.name_trim_space"),
              messageNotContainSpecialCharacter: t(
                "validate:domain_management.name_can_not_contains_special_characters"
              ),
              maxLength: MAX_LENGTH_INPUT_NAME_FIELD,
              messageMaxLength: t(
                "validate:domain_management.name_max_length",
                {
                  MAX_LENGTH_INPUT_NAME_FIELD: MAX_LENGTH_INPUT_NAME_FIELD,
                }
              ),
            }),
          ]}
          validateTrigger={["onBlur", "onChange"]}
        >
          <Input placeholder={t("common:domain_management.name_placeholder")} />
        </Form.Item>
        <Form.Item
          name="description"
          label={t("common:common.description")}
          rules={[
            validateInput({
              messageTrimSpace: t(
                "validate:domain_management.description_trim_space"
              ),
              messageMaxLength: t(
                "validate:domain_management.description_max_length",
                {
                  MAX_LENGTH_TEXT_AREA: MAX_LENGTH_TEXT_AREA,
                }
              ),
              maxLength: MAX_LENGTH_TEXT_AREA,
            }),
          ]}
          validateTrigger={["onBlur", "onChange"]}
        >
          <Input.TextArea
            rows={4}
            showCount
            maxLength={MAX_LENGTH_TEXT_AREA}
            placeholder={t("common:domain_management.description_placeholder")}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateDomainModal;
