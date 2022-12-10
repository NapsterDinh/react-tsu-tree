import productAPI from "@services/productAPI";
import {
  MAX_LENGTH_INPUT_NAME_FIELD,
  MAX_LENGTH_TEXT_AREA
} from "@utils/constantsUI";
import {
  showErrorNotification,
  showSuccessNotification
} from "@utils/notificationUtils";
import { convertTreeDataSelector } from "@utils/treeUtils";
import { validateInput, VALIDATE_TRIGGER } from "@utils/validateFormUtils";
import { Button, Form, Input, Modal, TreeSelect } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
// const { SHOW_PARENT } = TreeSelect;

const ModalEditProduct = ({
  open,
  setOpen,
  currentProduct,
  setCurrentProduct,
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
      const contentLanguage = localStorage.getItem("dataLanguage");
      const res = {
        detail: JSON.stringify([
          {
            name: values.name,
            description: values.description,
            language: contentLanguage,
          },
        ]),
        processingStatus: currentProduct?.processingStatus,
        publishStatus: currentProduct?.publishStatus,
        domainIds: values?.domainIds?.map((item) => item?.value),
      };
      const response = await productAPI.updateProduct({
        payload: res,
        id: currentProduct?.id,
      });

      setCurrentProduct({
        ...currentProduct,
        detail: {
          ...currentProduct.detail,
          name: values.name,
          description: values.description,
          language: contentLanguage,
          updateAt: Date.now(),
        },
        domains: response?.data?.domains,
        updatedAt: response?.data?.updatedAt,
      });
      showSuccessNotification(t("common:product.update_successfully"));
      setOpen(false);
    } catch (error) {
      if (error?.code === "ProductNameExisted") {
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
  //   console.log(newValue);
  //   setValue(newValue);
  // };

  const treeSelectProps = {
    treeData: domainTree,
    treeDefaultExpandAll: true,
    treeCheckable: true,
    treeCheckStrictly: true,
    multiple: true,
    showCheckedStrategy: TreeSelect.SHOW_PARENT,
    placeholder: t("common:common.select_domain"),
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
    if (currentProduct) {
      // const selectedDomain = currentProduct?.domains.map((item) => {
      //   return item.id;
      // });
      // setValue(selectedDomain);
      form.setFieldValue("name", currentProduct?.detail?.name);
      form.setFieldValue("description", currentProduct?.detail?.description);
      form.setFieldValue(
        "domainIds",
        currentProduct?.domains?.map((item) => {
          return {
            label: item?.detail?.name,
            value: item?.id,
          };
        })
      );
    }
  }, [
    currentProduct?.detail?.name,
    currentProduct?.detail?.description,
    currentProduct?.domains,
  ]);

  return (
    <Modal
      title={t("common:product.modal_edit")}
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
          form="editProduct"
          type="primary"
          htmlType="submit"
          loading={loading}
        >
          {t("common:common.save")}
        </Button>,
      ]}
    >
      <Form
        id="editProduct"
        labelAlign="left"
        form={form}
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 17,
        }}
        initialValues={{
          name: currentProduct?.detail?.name,
          description: currentProduct?.detail?.description,
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
              messageRequired: t("validate:product.name_is_required"),
              messageTrimSpace: t("validate:product.name_trim_space"),
              messageNotContainSpecialCharacter: t(
                "validate:product.name_can_not_contains_special_characters"
              ),
              maxLength: MAX_LENGTH_INPUT_NAME_FIELD,
              messageMaxLength: t("validate:product.name_max_length", {
                MAX_LENGTH_INPUT_NAME_FIELD: MAX_LENGTH_INPUT_NAME_FIELD,
              }),
            }),
          ]}
          validateTrigger={VALIDATE_TRIGGER}
        >
          <Input placeholder={t("common:product.name_placeholder")} />
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
              messageTrimSpace: t("validate:product.description_trim_space"),
              maxLength: MAX_LENGTH_TEXT_AREA,
              messageMaxLength: t("validate:product.description_max_length", {
                MAX_LENGTH_TEXT_AREA: MAX_LENGTH_TEXT_AREA,
              }),
            }),
          ]}
        >
          <Input.TextArea
            showCount
            rows={4}
            maxLength={MAX_LENGTH_TEXT_AREA}
            placeholder={t("common:product.description_placeholder")}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalEditProduct;
