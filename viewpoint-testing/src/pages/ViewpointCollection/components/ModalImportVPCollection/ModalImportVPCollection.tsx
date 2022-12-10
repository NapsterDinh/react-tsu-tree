import viewpointCollectionAPI from "@services/viewpointCollectionAPI";
import { checkValidTypeFile } from "@utils/fileUtils";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@utils/notificationUtils";
import {
  Button,
  Form,
  Modal,
  TreeSelect,
  Typography,
  Upload,
  UploadProps,
} from "antd";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { routes } from "routes";
import { Wrapper } from "./ModalImportVPCollection.Styled";

const { Dragger } = Upload;
export type ModalImportVPCollectionProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  treeDataSelector;
};

const ModalImportVPCollection: React.FC<ModalImportVPCollectionProps> = ({
  open,
  treeDataSelector,
  setOpen,
}) => {
  const { t } = useTranslation(["common", "validate", "responseMessage"]); // languages
  const [isEmpty, setIsEmpty] = useState(true);
  const [file, setFile] = useState<File>(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const props: UploadProps = {
    name: "file",
    maxCount: 1,
    onChange(info) {
      if (info?.fileList?.length > 0) {
        if (!checkValidTypeFile(info.fileList[0])) {
          form.setFields([
            {
              name: "file",
              errors: [t("validate:common.invalid_type_file")],
            },
          ]);
        } else {
          form.setFields([
            {
              name: "file",
              errors: [],
            },
          ]);
        }
      }
    },
    beforeUpload: (file) => {
      if (!checkValidTypeFile(file)) {
        form.setFields([
          {
            name: "file",
            errors: [t("validate:common.invalid_type_file")],
          },
        ]);
      } else {
        form.setFields([
          {
            name: "file",
            errors: [],
          },
        ]);
      }
      setFile(file);
      setIsEmpty(false);
      return false;
    },
    onDrop(e) {
      if (!checkValidTypeFile(e.dataTransfer.files[0])) {
        form.setFields([
          {
            name: "file",
            errors: [t("validate:common.invalid_type_file")],
          },
        ]);
      } else {
        form.setFields([
          {
            name: "file",
            errors: [],
          },
        ]);
        setFile(e.dataTransfer.files[0]);
      }
    },
    onRemove() {
      form.setFields([
        {
          name: "file",
          errors: [],
        },
      ]);
      setIsEmpty(true);
      setFile(null);
    },
    multiple: false,
    listType: "text",
    showUploadList: {
      showPreviewIcon: false,
      showDownloadIcon: false,
    },
    accept:
      ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
  };

  const handleOk = async (values) => {
    try {
      setLoading(true);
      const data = new FormData();
      data.append("formFile", file);
      values?.domainIds.map((domainId) =>
        data.append("DomainIds", domainId?.value)
      );
      const response = await viewpointCollectionAPI.importViewpointCollection(
        data
      );
      navigate(routes.ViewpointCollection.path[0] + "/" + response?.data?.id);
      showSuccessNotification(
        t("common:viewpoint_collection.import_successfully")
      );
      setOpen(false);
      setFile(null);
      setIsEmpty(true);
      form.resetFields();
    } catch (error) {
      if (error?.code) {
        showErrorNotification(t(`responseMessage:${error?.code}`));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setFile(null);
    setIsEmpty(true);
    form.resetFields();
  };

  return (
    <Modal
      title={t("common:viewpoint_collection.modal_import")}
      visible={open}
      width={600}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" htmlType="button" onClick={handleCancel}>
          {t("common:common.cancel")}
        </Button>,
        <Button
          disabled={!checkValidTypeFile(file)}
          form="importViewpointCollection"
          key="import"
          type="primary"
          htmlType="submit"
          loading={loading}
        >
          {t("common:common.import")}
        </Button>,
      ]}
    >
      <Form
        id="importViewpointCollection"
        form={form}
        onFinish={handleOk}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item
          label={t("common:common.domain")}
          name="domainIds"
          rules={[
            {
              required: true,
              message: t("validate:common.please_select_domain"),
            },
          ]}
          validateTrigger={["onBlur", "onChange"]}
        >
          {/* <Cascader
            options={treeDataSelector}
            placeholder={t("common:common.select_domain")}
          /> */}
          <TreeSelect
            treeData={treeDataSelector}
            treeCheckable={true}
            treeCheckStrictly={true}
            showCheckedStrategy={TreeSelect.SHOW_PARENT}
            treeDefaultExpandAll
            placeholder={t("common:common.select_domain")}
            style={{
              width: "100%",
            }}
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
          />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: "0px" }}
          valuePropName="fileList"
          name="tagList"
        >
          <Wrapper className={isEmpty ? "empty" : ""}>
            <Dragger {...props}>
              <AiOutlineCloudUpload className="icon-upload" />
              <Typography.Title level={5}>
                {t("common:common.drag_file_content")}
              </Typography.Title>
              <Typography.Title level={5}>
                {t("common:common.or")}
              </Typography.Title>
              <Typography.Title level={5} className={"browse-file"}>
                {t("common:common.browse_files")}
              </Typography.Title>
            </Dragger>
          </Wrapper>
          <div
            className="restrict-files"
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "10px",
            }}
          >
            {isEmpty && (
              <>
                <Typography.Text style={{ color: "var(--clr-text)" }}>
                  {t("common:common.accept_file_excel")}
                </Typography.Text>
                <Typography.Text style={{ color: "var(--clr-text)" }}>
                  {t("common:common.upload_one_file")}
                </Typography.Text>
              </>
            )}
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalImportVPCollection;
