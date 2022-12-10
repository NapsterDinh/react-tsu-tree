import { STATUS_REQUEST } from "@utils/constants";
import { Descriptions } from "antd";
import { ElementWrapper } from "AppStyled";
import { useTranslation } from "react-i18next";

const Detail = ({ request }) => {
  const { t } = useTranslation(["common", "validate"]); // languages
  return (
    <ElementWrapper>
      <Descriptions column={2} contentStyle={{ color: "var(--clr-text)" }}>
        <Descriptions.Item
          label={
            <span className="text">
              {t("common:request_management.requester")}
            </span>
          }
        >
          {request?.userCreate?.account}
        </Descriptions.Item>
        <Descriptions.Item
          label={
            <span className="text">
              {t("common:request_management.request_type")}
            </span>
          }
        >
          {request?.requestType}
        </Descriptions.Item>
        <Descriptions.Item
          label={<span className="text">{t("common:common.from")}</span>}
        >
          {request?.requestType === "ViewPointCollection" ? (
            <>
              {request?.viewPointCollectionFrom?.detail?.name}
              {request?.viewPointCollectionFrom?.isDeleted
                ? ` (${t("common:common.deleted")})`
                : ""}
            </>
          ) : (
            <>
              {request?.productFrom?.detail?.name}
              {request?.productFrom?.isDeleted
                ? ` (${t("common:common.deleted")})`
                : ""}
            </>
          )}
        </Descriptions.Item>
        <Descriptions.Item
          label={<span className="text">{t("common:common.to")}</span>}
        >
          {request?.requestType === "ViewPointCollection" ? (
            <>
              {request?.viewPointCollectionTo?.detail?.name}
              {request?.viewPointCollectionTo?.isDeleted
                ? ` (${t("common:common.deleted")})`
                : ""}
            </>
          ) : (
            <>
              {request?.productTo?.detail?.name}
              {request?.productTo?.isDeleted
                ? ` (${t("common:common.deleted")})`
                : ""}
            </>
          )}
        </Descriptions.Item>
        <Descriptions.Item
          label={<span className="text">{t("common:common.status")}</span>}
        >
          {request?.status === STATUS_REQUEST.APPROVE
            ? t("common:status.approved")
            : request?.status === STATUS_REQUEST.REJECT
            ? t("common:status.rejected")
            : request?.status === STATUS_REQUEST.PROCESSING
            ? t("common:status.processing")
            : request?.status === STATUS_REQUEST.WAITING
            ? t("common:status.waiting")
            : t("common:status.no_request_status")}
        </Descriptions.Item>
        <Descriptions.Item
          label={<span className="text">{t("common:common.created_at")}</span>}
        >
          {new Date(request?.createdAt).toLocaleString()}
        </Descriptions.Item>
        {/* <Descriptions.Item label={<span className="text">Requester</span>}>
          Domain
        </Descriptions.Item>
        <Descriptions.Item label={<span className="text">Test type</span>}>
          Function testing
        </Descriptions.Item> */}

        <Descriptions.Item
          label={<span className="text">{t("common:common.approver")}</span>}
        >
          {request?.userApprove?.account}
        </Descriptions.Item>
        <Descriptions.Item
          label={<span className="text">{t("common:common.updated_at")}</span>}
        >
          {new Date(request?.updatedAt).toLocaleString()}
        </Descriptions.Item>

        <Descriptions.Item
          label={<span className="text">{t("common:common.title")}</span>}
        >
          {request?.title}
        </Descriptions.Item>
        <Descriptions.Item
          label={<span className="text">{t("common:common.description")}</span>}
        >
          {request?.description}
        </Descriptions.Item>
      </Descriptions>
    </ElementWrapper>
  );
};

export default Detail;
