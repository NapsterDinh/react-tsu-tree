import {
  MAX_LENGTH_INPUT_NAME_FIELD,
  MAX_LENGTH_TEXT_AREA,
} from "@utils/constantsUI";
import { validateInput, VALIDATE_TRIGGER } from "@utils/validateFormUtils";
import { Button, Col, Form, Input, Modal, Row } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

const ModalCompare = ({
  handleOk,
  selectedNodeTo,
  selectedNodeFrom,
  setSelectedNodeFrom,
  setSelectedNodeTo,
  open,
  setOpen,
  request,
}) => {
  const [form] = Form.useForm();
  const [formTo] = Form.useForm();
  const { t } = useTranslation(["common", "responseMessage"]);

  const onFinish = (values: any) => {
    handleOk({
      ...selectedNodeFrom,
      title: values.name ? values.name.trim() : "",
      viewDetail: {
        ...selectedNodeFrom.viewDetail,
        name: values.name ? values.name.trim() : "",
        confirmation: values.confirmation ? values.confirmation.trim() : "",
        example: values.example ? values.example.trim() : "",
        note: values.note ? values.note.trim() : "",
      },
    });
    handleCancel();
  };

  React.useEffect(() => {
    form.setFieldsValue({
      name: selectedNodeFrom?.viewDetail?.name,
      confirmation: selectedNodeFrom?.viewDetail?.confirmation,
      note: selectedNodeFrom?.viewDetail?.note,
      example: selectedNodeFrom?.viewDetail?.example,
    });
    formTo.setFieldsValue({
      name: selectedNodeTo?.viewDetail?.name,
      confirmation: selectedNodeTo?.viewDetail?.confirmation,
      note: selectedNodeTo?.viewDetail?.note,
      example: selectedNodeTo?.viewDetail?.example,
    });
  }, [selectedNodeFrom, selectedNodeFrom?.viewDetail]);

  const handleCancel = () => {
    form.resetFields();
    formTo.resetFields();
    setSelectedNodeFrom(null);
    setSelectedNodeTo(null);
    setOpen(false);
  };
  return (
    <Modal
      title={t("common:detail_request.information_changes")}
      visible={open}
      width={1200}
      footer={[
        <Button key={"cancel"} onClick={handleCancel}>
          {t("common:common.cancel")}
        </Button>,
        <Button
          form="compareChange"
          key={"save"}
          type="primary"
          htmlType="submit"
        >
          {t("common:common.save")}
        </Button>,
      ]}
      onCancel={handleCancel}
    >
      <Row style={{ display: "flex", justifyContent: "center" }}>
        <Col
          md={12}
          style={{
            border: "1px solid #ccc",
            padding: "20px 50px",
            borderBottomLeftRadius: "5px",
            borderTopLeftRadius: "5px",
          }}
        >
          <div>
            <h3 style={{ color: "var(--clr-text)" }}>
              {t("common:common.from")} :{" "}
              {request?.viewPointCollectionFrom?.detail?.name}
            </h3>
            <Form
              form={form}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              initialValues={{ remember: true }}
              autoComplete="off"
              onFinish={onFinish}
              id="compareChange"
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
                        MAX_LENGTH_INPUT_NAME_FIELD:
                          MAX_LENGTH_INPUT_NAME_FIELD,
                      }
                    ),
                  }),
                ]}
                validateTrigger={VALIDATE_TRIGGER}
              >
                <Input.TextArea
                  rows={2}
                  disabled={selectedNodeFrom?.isLocked}
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
                  disabled={selectedNodeFrom?.isLocked}
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
                  disabled={selectedNodeFrom?.isLocked}
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
                  disabled={selectedNodeFrom?.isLocked}
                  rows={3}
                  placeholder={t(
                    "common:detail_viewpoint_collection.note_placeholder"
                  )}
                />
              </Form.Item>
            </Form>
          </div>
        </Col>

        <Col
          md={12}
          style={{
            borderRight: "1px solid #ccc",
            borderTop: "1px solid #ccc",
            borderBottom: "1px solid #ccc",
            padding: "20px 50px",
            borderBottomRightRadius: "5px",
            borderTopRightRadius: "5px",
          }}
        >
          <Form
            name="basic"
            form={formTo}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            initialValues={{ remember: true }}
            autoComplete="off"
          >
            <div>
              <h3 style={{ color: "var(--clr-text)" }}>
                {t("common:common.to")} :{" "}
                {request?.viewPointCollectionTo?.detail?.name}
              </h3>
            </div>
            <Form.Item
              required
              name="name"
              label={t("common:detail_viewpoint_collection.viewpoint_name")}
            >
              <Input.TextArea disabled rows={2} />
            </Form.Item>
            <Form.Item
              name="confirmation"
              label={t("common:detail_viewpoint_collection.confirmation")}
            >
              <Input.TextArea disabled rows={3} />
            </Form.Item>
            <Form.Item
              name="example"
              label={t("common:detail_viewpoint_collection.example")}
            >
              <Input.TextArea disabled rows={3} />
            </Form.Item>
            <Form.Item
              name="note"
              label={t("common:detail_viewpoint_collection.note")}
            >
              <Input.TextArea disabled rows={3} />
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Modal>
  );
};

export default ModalCompare;
