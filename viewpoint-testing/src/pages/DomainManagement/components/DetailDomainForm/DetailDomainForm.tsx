import { MAX_LENGTH_TEXT_AREA } from "@utils/constantsUI";
import { validateInput } from "@utils/validateFormUtils";
import { Button, Form, Input, Switch, Typography } from "antd";
import { FormInstance } from "antd/es/form/Form";
import React from "react";
import { useTranslation } from "react-i18next";
const { Title } = Typography;

interface IDomainParams {
  name: string;
  description: string;
  isActive: boolean;
  parentId: React.Key;
}

interface IProps {
  loading: boolean;
  disabled: boolean;
  form: FormInstance<any>;
  onFinish: (_values: IDomainParams) => void;
  onChange: (_changedValues?, _allValues?) => void;
}

const DetailDomainForm = ({ loading, form, onFinish, onChange }: IProps) => {
  const { t } = useTranslation(["common", "validate"]);
  return (
    <Form
      onFinish={onFinish}
      initialValues={{
        name: "",
        isActive: true,
        description: "",
      }}
      form={form}
      layout="vertical"
      autoComplete="off"
      onValuesChange={onChange}
    >
      <Form.Item name="name">
        <Title level={4}>{form.getFieldValue("name")}</Title>
      </Form.Item>
      <Form.Item
        name="isActive"
        label={t("common:common.status")}
        valuePropName="checked"
      >
        <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
      </Form.Item>
      <Form.Item
        name="description"
        label={t("common:common.description")}
        rules={[
          validateInput({
            messageTrimSpace: t(
              "validate:domain_management.description_trim_space"
            ),
            maxLength: MAX_LENGTH_TEXT_AREA,
            messageMaxLength: t(
              "validate:domain_management.description_max_length",
              {
                MAX_LENGTH_TEXT_AREA: MAX_LENGTH_TEXT_AREA,
              }
            ),
          }),
        ]}
        validateTrigger={["onChange", "onBlur"]}
      >
        <Input.TextArea
          rows={4}
          showCount
          maxLength={MAX_LENGTH_TEXT_AREA}
          placeholder={t("common:domain_management.description_placeholder")}
        />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={loading}>
        {t("common:common.save")}
      </Button>
    </Form>
  );
};

export default DetailDomainForm;
