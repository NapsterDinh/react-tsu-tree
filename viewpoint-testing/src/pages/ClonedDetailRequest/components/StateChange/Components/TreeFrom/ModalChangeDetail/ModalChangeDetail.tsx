import {
  MAX_LENGTH_INPUT_NAME_FIELD,
  MAX_LENGTH_TEXT_AREA,
} from "@utils/constantsUI";
import { showErrorNotification } from "@utils/notificationUtils";
import { validateInput, VALIDATE_TRIGGER } from "@utils/validateFormUtils";
import { Button, Form, Input, Modal } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
const ModalChangeDetail = ({ data, setData, saveNode, open, setOpen }) => {
  const { t } = useTranslation(["common", "validate", "responseMessage"]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  console.log(data);

  const onFinish = (values) => {
    try {
      saveNode({
        ...data,
        title: values.name ? values.name.trim() : "",
        viewDetail: {
          ...data.viewDetail,
          name: values.name ? values.name.trim() : "",
          confirmation: values.confirmation ? values.confirmation.trim() : "",
          example: values.example ? values.example.trim() : "",
          note: values.note ? values.note.trim() : "",
        },
      });
      setLoading(true);
    } catch (error) {
      showErrorNotification(error);
    } finally {
      setData(null);
      setOpen(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data) {
      form.setFields([
        {
          name: "name",
          value: data?.viewDetail?.name,
          errors: [],
        },
        {
          name: "confirmation",
          value: data?.viewDetail?.confirmation,
          errors: [],
        },
        {
          name: "example",
          value: data?.viewDetail?.example,
          errors: [],
        },
        {
          name: "note",
          value: data?.viewDetail?.note,
          errors: [],
        },
      ]);
    }
  }, [data]);

  return (
    <Modal
      title={
        saveNode !== null
          ? t("common:viewpoint_collection.modal_edit")
          : t("common:common.detail_info")
      }
      visible={open}
      onCancel={() => {
        setData(null);
        setOpen(false);
        form.resetFields();
      }}
      confirmLoading={loading}
      width={800}
      footer={[
        <Button
          key="cancel"
          onClick={() => {
            setData(null);
            setOpen(false);
            form.resetFields();
          }}
        >
          {t("common:common.cancel")}
        </Button>,
        saveNode !== null && (
          <Button
            disabled={data?.isLocked}
            key="save"
            form="editDetailViewpoint"
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            {t("common:common.save")}
          </Button>
        ),
      ]}
    >
      <Form
        id={"editDetailViewpoint"}
        style={{ marginTop: "0.5rem" }}
        onFinish={onFinish}
        form={form}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          required
          name="name"
          label={t("common:detail_viewpoint_collection.viewpoint_name")}
          rules={[
            validateInput({
              messageRequired: t(
                "validate:detail_viewpoint_collection.name_is_required"
              ),
              messageTrimSpace: t(
                "validate:detail_viewpoint_collection.name_trim_space"
              ),
              messageNotContainSpecialCharacter: t(
                "validate:detail_viewpoint_collection.name_can_not_contains_special_characters"
              ),
              maxLength: MAX_LENGTH_INPUT_NAME_FIELD,
              messageMaxLength: t(
                "validate:detail_viewpoint_collection.name_max_length",
                {
                  MAX_LENGTH_INPUT_NAME_FIELD: MAX_LENGTH_INPUT_NAME_FIELD,
                }
              ),
            }),
          ]}
          validateTrigger={VALIDATE_TRIGGER}
        >
          <Input.TextArea
            rows={2}
            disabled={data?.isLocked || saveNode === null}
            placeholder={t(
              "common:detail_viewpoint_collection.viewpoint_name_placeholder"
            )}
          />
        </Form.Item>
        <Form.Item
          name="confirmation"
          label={t("common:detail_viewpoint_collection.confirmation")}
          validateTrigger={VALIDATE_TRIGGER}
          rules={[
            validateInput({
              messageTrimSpace: t(
                "validate:detail_viewpoint_collection.confirmation_trim_space"
              ),
              maxLength: MAX_LENGTH_TEXT_AREA,
              messageMaxLength: t(
                "validate:detail_viewpoint_collection.confirmation_max_length",
                {
                  MAX_LENGTH_TEXT_AREA: MAX_LENGTH_TEXT_AREA,
                }
              ),
            }),
          ]}
        >
          <Input.TextArea
            rows={3}
            disabled={data?.isLocked || saveNode === null}
            placeholder={t(
              "common:detail_viewpoint_collection.confirmation_placeholder"
            )}
          />
        </Form.Item>
        <Form.Item
          name="example"
          label={t("common:detail_viewpoint_collection.example")}
          rules={[
            validateInput({
              messageTrimSpace: t(
                "validate:detail_viewpoint_collection.example_trim_space"
              ),
              maxLength: MAX_LENGTH_TEXT_AREA,
              messageMaxLength: t(
                "validate:detail_viewpoint_collection.example_max_length",
                {
                  MAX_LENGTH_TEXT_AREA: MAX_LENGTH_TEXT_AREA,
                }
              ),
            }),
          ]}
          validateTrigger={VALIDATE_TRIGGER}
        >
          <Input.TextArea
            rows={3}
            disabled={data?.isLocked || saveNode === null}
            placeholder={t(
              "common:detail_viewpoint_collection.example_placeholder"
            )}
          />
        </Form.Item>
        <Form.Item
          name="note"
          label={t("common:detail_viewpoint_collection.note")}
          rules={[
            validateInput({
              messageTrimSpace: t(
                "validate:detail_viewpoint_collection.note_trim_space"
              ),
              maxLength: MAX_LENGTH_TEXT_AREA,
              messageMaxLength: t(
                "validate:detail_viewpoint_collection.note_max_length",
                {
                  MAX_LENGTH_TEXT_AREA: MAX_LENGTH_TEXT_AREA,
                }
              ),
            }),
          ]}
          validateTrigger={VALIDATE_TRIGGER}
        >
          <Input.TextArea
            disabled={data?.isLocked || saveNode === null}
            rows={3}
            placeholder={t(
              "common:detail_viewpoint_collection.note_placeholder"
            )}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalChangeDetail;
