import useLanguageData from "@hooks/useLanguageData";
import ViewpointAPI from "@services/viewpointsAPI";
import { LANGUAGE } from "@utils/constants";
import { checkValidTypeFile } from "@utils/fileUtils";
import {
  showErrorNotification,
  showInfoNotification,
  showSuccessNotification,
} from "@utils/notificationUtils";
import { VALIDATE_TRIGGER } from "@utils/validateFormUtils";
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Typography,
  Upload,
  UploadProps,
} from "antd";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { Wrapper } from "./ModalImportDataViewpointStyled";

const { Dragger } = Upload;
export type ModalImportProductProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  currentVPCollection: any;
  getData: any;
};

const ModalImportDataViewpoint: React.FC<ModalImportProductProps> = ({
  open,
  currentVPCollection,
  setOpen,
  getData,
}) => {
  const { t } = useTranslation(["common", "validate", "responseMessage"]); // languages
  const [isEmpty, setIsEmpty] = useState(true);
  const [file, setFile] = useState<File>(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

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
      data.append("Id", currentVPCollection?.id);
      await ViewpointAPI.importDataLanguage({
        payload: {
          data: data,
        },
      });
      await getData();
      handleCancel();
      showSuccessNotification(
        t("common:viewpoint_collection.import_data_successfully")
      );
      setOpen(false);
      setFile(null);
      setIsEmpty(true);
      form.resetFields();
    } catch (error) {
      if (error?.code === "ImportLocked") {
        handleCancel();
        await getData();
        showInfoNotification(t(`responseMessage:${error?.code}`));
        setOpen(false);
        setFile(null);
        setIsEmpty(true);
        form.resetFields();
      }
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
      destroyOnClose
      forceRender
      title={t("common:common.import_override_with_translated_data")}
      visible={open}
      width={600}
      onCancel={handleCancel}
      confirmLoading={loading}
      footer={[
        <Button key="cancel" htmlType="button" onClick={handleCancel}>
          {t("common:common.cancel")}
        </Button>,
        <Button
          form="importDataViewpoint"
          key="import"
          type="primary"
          htmlType="submit"
          loading={loading}
          disabled={!checkValidTypeFile(file)}
        >
          {t("common:common.import")}
        </Button>,
      ]}
    >
      <Form
        id="importDataViewpoint"
        form={form}
        onFinish={handleOk}
        autoComplete="off"
        layout="horizontal"
      >
        <Form.Item
          style={{ marginBottom: "0px" }}
          name="tagList"
          valuePropName="list"
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

export default ModalImportDataViewpoint;
