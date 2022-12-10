import { IResponseData } from "@models/model";
import viewpointCollectionAPI from "@services/viewpointCollectionAPI";
import { PROCESSING_STATUS, PUBLISH_STATUS } from "@utils/constants";
import {
  MAX_LENGTH_INPUT_NAME_FIELD,
  MAX_LENGTH_TEXT_AREA
} from "@utils/constantsUI";
import {
  showErrorNotification,
  showSuccessNotification
} from "@utils/notificationUtils";
import { validateInput, VALIDATE_TRIGGER } from "@utils/validateFormUtils";
import { Button, Form, Input, Modal, Select, TreeSelect } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { routes } from "routes";

const ModalCreate = ({
  isModalOpenCreate,
  handleOkCreate,
  handleCancelCreate,
  domainTree,
  setIsModalOpenCreate,
  setLoading,
  loading,
}) => {
  const { t } = useTranslation(["common", "validate"]); // languages
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const contentLanguage = localStorage.getItem("dataLanguage");
      const dataBody = {
        detail: JSON.stringify([
          {
            name: values?.name?.trim(),
            description: values?.description?.trim(),
            language: contentLanguage,
          },
        ]),
        processingStatus: +PROCESSING_STATUS.ON_GOING,
        publishStatus: +PUBLISH_STATUS.PUBLISHING,
        domainIds: values?.domainIds?.map((item) => item?.value),
      };
      const response: IResponseData =
        await viewpointCollectionAPI.createViewpointCollection({
          payload: dataBody,
        });
      if (response.isSucceeded) {
        navigate(`${routes.ViewpointCollection.path[0]}/${response.data.id}`);
        showSuccessNotification(
          t("common:viewpoint_collection.create_successfully")
        );
        form.resetFields();
        setIsModalOpenCreate(false);
      }
    } catch (error) {
      if (error.code === "ViewPointCollectionNameExisted") {
        form.setFields([
          {
            name: "name",
            errors: [t(`responseMessage:${error?.code}`)],
          },
        ]);
      } else {
        if (error?.code) {
          showErrorNotification(t(`responseMessage:${error?.code}`));
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={t("common:viewpoint_collection.modal_create")}
      visible={isModalOpenCreate}
      onOk={handleOkCreate}
      onCancel={() => {
        handleCancelCreate();
        form.resetFields();
      }}
      width={1000}
      footer={[
        <Button
          key="cancel"
          onClick={() => {
            setIsModalOpenCreate(false);
            form.resetFields();
          }}
        >
          {t("common:common.cancel")}
        </Button>,
        <Button
          key="create"
          form="createViewpointCollection"
          type="primary"
          htmlType="submit"
          loading={loading}
        >
          {t("common:common.create")}
        </Button>,
      ]}
    >
      <Form
        id="createViewpointCollection"
        labelAlign="left"
        form={form}
        labelCol={{
          span: 6,
        }}
        initialValues={{
          name: "",
          description: "",
          domainIds: [],
          ProcessingStatus: PROCESSING_STATUS.ON_GOING,
          PublishStatus: PUBLISH_STATUS.PUBLISHING,
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
              messageRequired: t(
                "validate:viewpoint_collection.name_is_required"
              ),
              messageTrimSpace: t(
                "validate:viewpoint_collection.name_trim_space"
              ),
              messageNotContainSpecialCharacter: t(
                "validate:viewpoint_collection.name_can_not_contains_special_characters"
              ),
              maxLength: MAX_LENGTH_INPUT_NAME_FIELD,
              messageMaxLength: t(
                "validate:viewpoint_collection.name_max_length",
                {
                  MAX_LENGTH_INPUT_NAME_FIELD: MAX_LENGTH_INPUT_NAME_FIELD,
                }
              ),
            }),
          ]}
          validateTrigger={VALIDATE_TRIGGER}
        >
          <Input
            placeholder={t("common:viewpoint_collection.name_placeholder")}
          />
        </Form.Item>

        <Form.Item
          label={t("common:common.domain")}
          name="domainIds"
          rules={[
            {
              required: true,
              message: t("validate:common.please_select_domain"),
            },
          ]}
          validateTrigger={VALIDATE_TRIGGER}
        >
          {/* <Cascader
            options={domainTree}
            placeholder={t("common:common.select_domain")}
          /> */}
          <TreeSelect
            treeData={domainTree}
            treeCheckable={true}
            treeCheckStrictly={true}
            treeDefaultExpandAll
            multiple
            placeholder={t("common:common.select_domain")}
            filterTreeNode={(search, item) => {
              if (item?.title) {
                return (
                  item.title
                    .toString()
                    .toLowerCase()
                    .indexOf(search.toLowerCase()) >= 0
                );
              }
            }}
          >
          </TreeSelect>
            {/* <TreeSelectRendering data={domainTree}/> */}
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
              messageMaxLength: t(
                "validate:viewpoint_collection.description_max_length",
                {
                  MAX_LENGTH_TEXT_AREA: MAX_LENGTH_TEXT_AREA,
                }
              ),
            }),
          ]}
        >
          <Input.TextArea
            rows={4}
            showCount
            maxLength={MAX_LENGTH_TEXT_AREA}
            placeholder={t(
              "common:viewpoint_collection.description_placeholder"
            )}
          />
        </Form.Item>
        <Form.Item
          label={t("common:common.processing_status")}
          name="ProcessingStatus"
        >
          <Select style={{ width: 180 }} disabled>
            <Select.Option value={PROCESSING_STATUS.ON_GOING}>
              {t("common:status.on_going")}
            </Select.Option>
            <Select.Option value={PROCESSING_STATUS.UPDATING}>
              {t("common:status.updating")}
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label={t("common:common.publishing_status")}
          name="PublishStatus"
        >
          <Select style={{ width: 180 }} disabled>
            <Select.Option value={PUBLISH_STATUS.PUBLISHING}>
              {t("common:status.publishing")}
            </Select.Option>
            <Select.Option value={PUBLISH_STATUS.PUBLISHED}>
              {t("common:status.published")}
            </Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalCreate;
