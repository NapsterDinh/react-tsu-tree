import { CloseOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { STATUS_REQUEST } from "@utils/constants";
import { Button, Modal, Space, Tag, Typography } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { routes } from "routes";

const CommonAction = ({
  data,
  checkOwner,
  isBlocking,
  handleOnSaveDraft,
  handleApprove,
  handleRejectRequest,
}) => {
  const { t } = useTranslation(["common", "validate", "responseMessage"]); // languages
  const navigate = useNavigate();
  return (
    <>
      <Space
        align="center"
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Typography.Title
              level={4}
              style={{
                marginTop: "5px",
                fontWeight: "600",
                color: "var(--clr-text)",
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "600px",
                whiteSpace: "nowrap",
              }}
            >
              {data?.title ?? "No request name"}
            </Typography.Title>
            <Tag
              color="#87d068"
              style={{
                fontSize: "0.75rem",
                marginLeft: 10,
                transform: "translateY(-3px)",
              }}
            >
              {data?.status == STATUS_REQUEST.NO_REQUEST_STATUS
                ? t("common:status.no_request_status")
                : data?.status == STATUS_REQUEST.WAITING
                ? t("common:status.waiting")
                : data?.status == STATUS_REQUEST.PROCESSING
                ? t("common:status.processing")
                : data?.status == STATUS_REQUEST.APPROVE
                ? t("common:status.approved")
                : data?.status == STATUS_REQUEST.REJECT
                ? t("common:status.rejected")
                : data?.status == STATUS_REQUEST.CANCELED
                ? t("common:status.canceled")
                : ""}
            </Tag>
          </div>
        </div>

        <div className="right-action-container">
          <Space className="top-action">
            {checkOwner &&
              data?.status !== STATUS_REQUEST.APPROVE &&
              data?.status !== STATUS_REQUEST.REJECT &&
              data?.status !== STATUS_REQUEST.CANCELED && (
                <React.Fragment>
                  <Button
                    onClick={() => handleOnSaveDraft(true)}
                    type="primary"
                  >
                    {t("common:common.save_draft")}
                  </Button>
                  <Button
                    onClick={() => {
                      Modal.confirm({
                        title: (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            {t("common:request_management.approve_request")}
                            <CloseOutlined onClick={() => Modal.destroyAll()} />
                          </div>
                        ),
                        icon: <ExclamationCircleOutlined />,
                        content: t(
                          "common:request_management.content_modal_approve"
                        ),
                        okText: t("common:common.approve"),
                        cancelText: t("common:common.cancel"),
                        onOk: handleApprove,
                      });
                    }}
                    type="primary"
                  >
                    {t("common:common.approve")}
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      Modal.confirm({
                        title: (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            {t("common:request_management.reject_request")}
                            <CloseOutlined onClick={() => Modal.destroyAll()} />
                          </div>
                        ),
                        icon: <ExclamationCircleOutlined />,
                        content: t(
                          "common:request_management.content_modal_reject"
                        ),
                        okText: t("common:common.reject"),
                        cancelText: t("common:common.cancel"),
                        onOk: handleRejectRequest,
                      });
                    }}
                  >
                    {t("common:common.reject")}
                  </Button>
                </React.Fragment>
              )}

            <Button
              type="primary"
              onClick={() => {
                if (isBlocking) {
                  Modal.confirm({
                    title: (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        {t("common:detail_request.confirm_cancel")}
                        <CloseOutlined onClick={() => Modal.destroyAll()} />
                      </div>
                    ),
                    icon: <ExclamationCircleOutlined />,
                    content: t(
                      "common:detail_request.confirm_cancel_detail_request"
                    ),
                    okText: t("common:common.continue_navigate"),
                    cancelText: t("common:common.cancel"),
                    onOk: () => {
                      navigate(routes.RequestManagement.path[0]);
                    },
                  });
                } else {
                  navigate(routes.RequestManagement.path[0]);
                }
              }}
            >
              {t("common:common.cancel")}
            </Button>
          </Space>
        </div>
      </Space>
    </>
  );
};

export default CommonAction;
