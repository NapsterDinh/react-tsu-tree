import { StarFilled } from "@ant-design/icons";
import { PROCESSING_STATUS, PUBLISH_STATUS } from "@utils/constants";
import { Button, Descriptions, Modal, Space } from "antd";
import { useTranslation } from "react-i18next";
import { routes } from "routes";

interface IProps {
  visible: boolean;
  onCancel: () => void;
  currentProduct: any;
}

const ModalInfoProduct = ({ visible, onCancel, currentProduct }: IProps) => {
  const { t } = useTranslation(["common"]);

  const generateDomainString = () => {
    return currentProduct?.domains?.length !== 0
      ? currentProduct?.domains
          ?.filter((item) => item.parentId === null)
          .concat(
            currentProduct?.domains?.filter((item) => item.parentId !== null)
          )
          ?.map((item) => item?.detail?.name)
          ?.join(" - ")
      : "";
  };

  return (
    <Modal
      title={t("common:common.detail_info")}
      visible={visible}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button key="ok" type="primary" onClick={onCancel}>
          {t("common:common.cancel")}
        </Button>,
      ]}
    >
      <Descriptions title={currentProduct?.detail?.name} layout="vertical">
        <Descriptions.Item label={t("common:common.domain")}>
          {currentProduct?.domains.length === 0
            ? t("common:common.no_information")
            : generateDomainString()}
        </Descriptions.Item>
        <Descriptions.Item label={t("common:common.processing_status")}>
          {currentProduct?.processingStatus === +PROCESSING_STATUS.UPDATING
            ? t("common:status.updating")
            : t("common:status.on_going")}
        </Descriptions.Item>
        <Descriptions.Item label={t("common:common.publishing_status")}>
          {currentProduct?.publishStatus === +PUBLISH_STATUS.PUBLISHED
            ? t("common:status.published")
            : t("common:status.publishing")}
        </Descriptions.Item>
        <Descriptions.Item label={t("common:common.create_by")}>
          {currentProduct?.userCreate?.account}
        </Descriptions.Item>
        <Descriptions.Item label={t("common:common.created_at")}>
          {new Date(currentProduct?.createdAt).toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label={t("common:common.updated_at")}>
          {new Date(currentProduct?.detail?.updateAt).toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label={t("common:common.clone_from")}>
          {currentProduct?.cloneProductId ? (
            <a
              href={
                routes.ProductManagement.path[0] +
                "/" +
                currentProduct?.cloneProductResponse?.id
              }
            >
              {currentProduct?.cloneProductResponse?.detail?.name}
            </a>
          ) : (
            t("common:common.this_is_base")
          )}
        </Descriptions.Item>
        <Descriptions.Item label={t("common:common.rating")}>
          {!currentProduct?.avgRating || currentProduct?.avgRating === 0 ? (
            t("common:status.no_rating")
          ) : (
            <Space>
              <span>{currentProduct?.avgRating}</span>
              <StarFilled />
            </Space>
          )}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default ModalInfoProduct;
