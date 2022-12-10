import { Domain } from "@models/model";
import viewpointCollectionAPI from "@services/viewpointCollectionAPI";
import {
  MAX_LENGTH_INPUT_NAME_FIELD,
  MAX_LENGTH_TEXT_AREA,
} from "@utils/constantsUI";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@utils/notificationUtils";
import { convertTreeDataSelector } from "@utils/treeUtils";
import { validateInput, VALIDATE_TRIGGER } from "@utils/validateFormUtils";
import { Button, Form, Input, Modal, TreeSelect } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
// const { SHOW_PARENT } = TreeSelect;

const ModalEditVPCollection = ({
  open,
  setOpen,
  currentVPCollection,
  setCurrentVPCollection,
  domainList,
}) => {
  const { t } = useTranslation(["common", "validate"]); // languages
  const [form] = Form.useForm();
  // const [value, setValue] = useState([]);
  const [errorMessage, setErrorMessage] = useState<any>();
  const [domainTree, setDomainTree] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setDomainTree(convertTreeDataSelector(domainList));
  }, [domainList]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const contentLanguage = localStorage.getItem("i18nextLng");
      const res = {
        detail: JSON.stringify([
          {
            name: values?.name?.trim(),
            description: values?.description?.trim(),
            language: contentLanguage,
          },
        ]),
        processingStatus: currentVPCollection?.processingStatus,
        publishStatus: currentVPCollection?.publishStatus,
        domainIds: values?.domainIds?.map((item) => item?.value),
      };
      const response = await viewpointCollectionAPI.updateViewpointCollection({
        payload: res,
        id: currentVPCollection?.id,
      });

      setCurrentVPCollection({
        ...currentVPCollection,
        detail: {
          ...currentVPCollection.detail,
          name: values.name,
          description: values.description,
          language: contentLanguage,
          updateAt: response?.data?.updatedAt,
        },
        domains: response?.data?.domains,
        updatedAt: response?.data?.updatedAt,
      });
      showSuccessNotification(
        t("common:viewpoint_collection.update_successfully")
      );
      setOpen(false);
    } catch (error) {
      if (error?.code === "ViewPointCollectionNameExisted") {
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

  // const onChangeTreeDomain = (newValue) => {
  //   setValue(newValue);
  // };

  const treeSelectProps = {
    treeData: domainTree,
    treeCheckable: true,
    treeCheckStrictly: true,
    treeDefaultExpandAll: true,
    showCheckedStrategy: TreeSelect.SHOW_PARENT,
    placeholder: t("common:common.select_domain"),
    style: {
      width: "100%",
    },
    filterTreeNode: (search, item) => {
      return item.title.toLowerCase().indexOf(search.toLowerCase()) >= 0;
    },
  };

  useEffect(() => {
    if (errorMessage) {
      form.setFields([
        {
          name: "name",
          errors: [t(`responseMessage:${errorMessage?.code}`)],
        },
      ]);
    }
  }, [errorMessage, form]);

  useEffect(() => {
    if (currentVPCollection) {
      // const selectedDomain = currentVPCollection?.domains.map((item) => {
      //   return { label: item.detail.name, value: item.id };
      // });
      // setValue(selectedDomain);
      form.setFieldValue(
        "domainIds",
        currentVPCollection?.domains.map((domain: Domain) => {
          return { label: domain?.detail?.name, value: domain?.id };
          // return domain?.id;
        })
      );
      form.setFieldValue("name", currentVPCollection?.detail?.name);
      form.setFieldValue(
        "description",
        currentVPCollection?.detail?.description
      );
      // form.setFieldValue(
      //   "domainIds",
      //   currentVPCollection?.domains?.map((item) => item.id)
      // );
    }
  }, [
    currentVPCollection?.detail?.name,
    currentVPCollection?.detail?.description,
    currentVPCollection?.domains,
  ]);

  return (
    <Modal
      title={t("common:viewpoint_collection.modal_edit")}
      visible={open}
      onCancel={() => {
        setOpen(false);
        setErrorMessage(null);
      }}
      confirmLoading={loading}
      width={1000}
      footer={[
        <Button
          key="cancel"
          onClick={() => {
            setOpen(false);
            setErrorMessage(null);
          }}
        >
          {t("common:common.cancel")}
        </Button>,
        <Button
          key="save"
          form="createViewpointCollection"
          type="primary"
          htmlType="submit"
          loading={loading}
        >
          {t("common:common.save")}
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
        wrapperCol={{
          span: 17,
        }}
        initialValues={{
          name: currentVPCollection?.detail?.name,
          description: currentVPCollection?.detail?.description,
          domainIds: [],
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
          <TreeSelect {...treeSelectProps} />
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
            showCount
            maxLength={MAX_LENGTH_TEXT_AREA}
            rows={4}
            placeholder={t(
              "common:viewpoint_collection.description_placeholder"
            )}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalEditVPCollection;
