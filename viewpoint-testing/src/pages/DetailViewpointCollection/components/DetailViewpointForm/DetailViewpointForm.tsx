import { LocaleProvider } from "@components";
import {
  MAX_LENGTH_INPUT_NAME_FIELD,
  MAX_LENGTH_TEXT_AREA,
  ROWS_DEFAULT_TEXT_AREA,
} from "@utils/constantsUI";
import { loop } from "@utils/helpersUtils";
import { TreeData } from "@utils/treeUtils";
import { validateInput, VALIDATE_TRIGGER } from "@utils/validateFormUtils";
import { Button, Form, Input, Space, Table, Tabs, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Wrapper } from "./DetailViewpointForm.Styled";

interface IProps {
  onChange?: (_e) => void;
  data: any;
  setData: (_any) => void;
  checkOwner: boolean;
  setSelectedNode: (_any) => void;
  treeData: TreeData;
}

const DetailViewpointForm = ({
  onChange,
  data,
  setData,
  checkOwner,
  setSelectedNode,
  treeData,
}: IProps) => {
  const { t } = useTranslation(["common", "validate", "responseMessage"]);
  const [form] = Form.useForm();
  const onFinish = (values) => {
    let isExisted = false;
    loop(treeData?.children, data?.key, (item, index, arr) => {
      if (
        arr.some(
          (t) =>
            t?.key !== data?.key &&
            t?.viewDetail?.name?.toLowerCase() ===
              values?.name.toLowerCase().trim()
        )
      ) {
        isExisted = true;
      }
    });
    if (isExisted) {
      form.setFields([
        {
          name: "name",
          value: data?.viewDetail?.name,
          errors: [t("validate:common.duplicated_viewpoint_name")],
        },
      ]);
      return;
    }
    setData({
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

  const columns: ColumnsType<any> = [
    {
      title: t("common:common.name"),
      dataIndex: "title",
      width: 250,
      fixed: "left",
    },
    {
      title: t("common:detail_viewpoint_collection.confirmation"),
      dataIndex: "confirmation",
      width: 250,
    },
    {
      title: t("common:detail_viewpoint_collection.example"),
      dataIndex: "example",
      width: 250,
    },
    {
      title: t("common:detail_viewpoint_collection.note"),
      dataIndex: "note",
      width: 250,
    },
  ];

  return (
    <Wrapper className="sticky">
      {data && (
        <div className="detail-viewpoint-collection-detail">
          <div>
            <Typography.Title level={4} className="color-text">
              {t("common:common.detail_info")}
            </Typography.Title>
          </div>
          <Tabs defaultActiveKey="tab-1">
            <Tabs.TabPane tab={t("common:common.detail_info")} key="item-1">
              <Form
                style={{ marginTop: "0.5rem" }}
                onFinish={onFinish}
                form={form}
                layout="vertical"
                autoComplete="off"
                onChange={onChange}
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
                        "validate:viewpoint_collection.name_can_not_contains_special_characters"
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
                    rows={4}
                    disabled={!checkOwner || data?.isLocked}
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
                    rows={ROWS_DEFAULT_TEXT_AREA + 1}
                    disabled={!checkOwner || data?.isLocked}
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
                    rows={ROWS_DEFAULT_TEXT_AREA + 1}
                    disabled={!checkOwner || data?.isLocked}
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
                    disabled={!checkOwner || data?.isLocked}
                    rows={ROWS_DEFAULT_TEXT_AREA + 1}
                    placeholder={t(
                      "common:detail_viewpoint_collection.note_placeholder"
                    )}
                  />
                </Form.Item>
                <Space style={{ justifyContent: "right", width: "100%" }}>
                  <Button
                    onClick={() => {
                      form.resetFields();
                      setSelectedNode(null);
                    }}
                  >
                    {t("common:common.cancel")}
                  </Button>
                  <Button
                    disabled={!checkOwner || data?.isLocked}
                    type="primary"
                    htmlType="submit"
                  >
                    {t("common:common.save")}
                  </Button>
                </Space>
              </Form>
            </Tabs.TabPane>
            {data?.children?.length > 0 && (
              <Tabs.TabPane
                tab={t("detail_viewpoint_collection.children_info")}
                key="item-2"
              >
                <LocaleProvider>
                  <Table
                    className="table-category"
                    columns={columns}
                    dataSource={data.children.map((item) => {
                      const newItem = {
                        ...item,
                        confirmation: item.viewDetail.confirmation,
                        example: item.viewDetail.confirmation,
                        note: item.viewDetail.note,
                        children: [],
                      };
                      delete newItem.children;
                      return newItem;
                    })}
                    scroll={{ x: 900 }}
                    pagination={false}
                  />
                </LocaleProvider>
              </Tabs.TabPane>
            )}
          </Tabs>
        </div>
      )}
    </Wrapper>
  );
};

export default DetailViewpointForm;
