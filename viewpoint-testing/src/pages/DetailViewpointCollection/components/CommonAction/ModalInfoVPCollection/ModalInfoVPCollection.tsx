import { StarFilled } from "@ant-design/icons";
import { PROCESSING_STATUS, PUBLISH_STATUS } from "@utils/constants";
import { Button, Descriptions, Modal, Space } from "antd";
import { useTranslation } from "react-i18next";
import { routes } from "routes";

interface IProps {
  visible: boolean;
  onCancel: () => void;
  currentVPCollection: any;
}

const ModalInfoVPCollection = ({
  visible,
  onCancel,
  currentVPCollection,
}: IProps) => {
  const { t } = useTranslation(["common"]);

  const generateDomainString = () => {
    return currentVPCollection?.domains?.length !== 0
      ? currentVPCollection?.domains
          ?.filter((item) => item.parentId === null)
          .concat(
            currentVPCollection?.domains?.filter(
              (item) => item.parentId !== null
            )
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
        <Button key="ok" onClick={onCancel}>
          {t("common:common.cancel")}
        </Button>,
      ]}
    >
      <Descriptions title={currentVPCollection?.detail?.name} layout="vertical">
        <Descriptions.Item label={t("common:common.domain")}>
          {currentVPCollection?.domains?.length === 0
            ? t("common:common.no_information")
            : generateDomainString()}
        </Descriptions.Item>
        <Descriptions.Item label={t("common:common.processing_status")}>
          {currentVPCollection?.processingStatus === +PROCESSING_STATUS.UPDATING
            ? t("common:status.updating")
            : t("common:status.on_going")}
        </Descriptions.Item>
        <Descriptions.Item label={t("common:common.publishing_status")}>
          {currentVPCollection?.publishStatus === +PUBLISH_STATUS.PUBLISHED
            ? t("common:status.published")
            : t("common:status.publishing")}
        </Descriptions.Item>
        <Descriptions.Item label={t("common:common.create_by")}>
          {currentVPCollection?.userCreate?.account}
        </Descriptions.Item>
        <Descriptions.Item label={t("common:common.created_at")}>
          {new Date(currentVPCollection?.createdAt).toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label={t("common:common.updated_at")}>
          {new Date(currentVPCollection?.detail?.updateAt).toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label={t("common:common.clone_from")}>
          {currentVPCollection?.cloneCollection?.detail?.name ? (
            <a
              href={
                routes.ViewpointCollection.path[0] +
                "/" +
                currentVPCollection?.cloneCollection?.id
              }
            >
              {currentVPCollection?.cloneCollection?.detail?.name}
            </a>
          ) : (
            t("common:common.this_is_base")
          )}
        </Descriptions.Item>
        <Descriptions.Item label={t("common:common.rating")}>
          {!currentVPCollection?.avgRating ||
          currentVPCollection?.avgRating === 0 ? (
            t("common:status.no_rating")
          ) : (
            <Space>
              <span>{currentVPCollection?.avgRating}</span>
              <StarFilled />
            </Space>
          )}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default ModalInfoVPCollection;
