import LocaleProvider from "@components/LocaleProvider/LocaleProvider";
import { IResponseData, IResponseHistoryChanges } from "@models/model";
import historyChangeAPI from "@services/historyChangesAPI";
import {
  ACTION,
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGINATION,
  PROCESSING_STATUS,
  PUBLISH_STATUS,
} from "@utils/constants";
import { showErrorNotification } from "@utils/notificationUtils";
import { Button, Empty, Modal, Pagination, Tag, Timeline } from "antd";
import { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { routes } from "routes";

interface IHistoryChangeData {
  content: React.ReactNode;
  title: string;
}

const ModalHistoryChanges = ({ visible, onCancel, entity }) => {
  const { t } = useTranslation(["common", "validate", "responseMessage"]);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [data, setData] = useState<
    IResponseHistoryChanges[] & IHistoryChangeData[]
  >([]);
  const location = useLocation();

  const handleRenderContentHistory = (history: IResponseHistoryChanges) => {
    switch (history.title) {
      case ACTION.CREATE:
        return (
          <Trans
            i18nKey={`${
              location.pathname.includes(routes.ViewpointCollection.path[0])
                ? "viewpoint_collection"
                : "product"
            }.history_create`}
          >
            {{
              account: history?.userCreate?.account,
            }}
          </Trans>
        );
      case ACTION.CLONE:
        return (
          <Trans
            i18nKey={`${
              location.pathname.includes(routes.ViewpointCollection.path[0])
                ? "viewpoint_collection"
                : "product"
            }.history_clone`}
          >
            {{
              account: history?.userCreate?.account,
            }}
          </Trans>
        );
      case ACTION.UPDATE_NAME:
        return (
          <Trans
            i18nKey={`${
              location.pathname.includes(routes.ViewpointCollection.path[0])
                ? "viewpoint_collection"
                : "product"
            }.history_update_name`}
          >
            {{
              account: history?.userCreate?.account,
              old_name: history?.oldDetail?.name,
              new_name: history?.newDetail?.name,
            }}
          </Trans>
        );
      case ACTION.UPDATE_INFORMATION:
        return (
          <Trans
            i18nKey={`${
              location.pathname.includes(routes.ViewpointCollection.path[0])
                ? "viewpoint_collection"
                : "product"
            }.history_update_information`}
          >
            {{
              account: history?.userCreate?.account,
              old_description: history?.oldDetail?.description,
              new_description: history?.newDetail?.description,
            }}
          </Trans>
        );
      case ACTION.UPDATE_PROCESSING_STATUS:
        return (
          <Trans
            i18nKey={`${
              location.pathname.includes(routes.ViewpointCollection.path[0])
                ? "viewpoint_collection"
                : "product"
            }.history_update_processing_status`}
          >
            {{
              account: history?.userCreate?.account,
              old_status:
                history.old == PROCESSING_STATUS.ON_GOING
                  ? t("common:status.on_going")
                  : t("common:status.updating"),
              new_status:
                history.new == PROCESSING_STATUS.ON_GOING
                  ? t("common:status.on_going")
                  : t("common:status.updating"),
            }}
          </Trans>
        );
      case ACTION.UPDATE_PUBLISHING_STATUS:
        return (
          <Trans
            i18nKey={`${
              location.pathname.includes(routes.ViewpointCollection.path[0])
                ? "viewpoint_collection"
                : "product"
            }.history_update_publishing_status`}
          >
            {{
              account: history?.userCreate?.account,
              old_status:
                history.old === PUBLISH_STATUS.PUBLISHING
                  ? t("common:status.publishing")
                  : t("common:status.published"),
              new_status:
                history.new === PUBLISH_STATUS.PUBLISHING
                  ? t("common:status.publishing")
                  : t("common:status.published"),
            }}
          </Trans>
        );
      case ACTION.ADD_MEMBER:
        return (
          <Trans
            i18nKey={`${
              location.pathname.includes(routes.ViewpointCollection.path[0])
                ? "viewpoint_collection"
                : "product"
            }.history_add_member`}
          >
            {{
              account: history?.userCreate?.account,
              member: history?.new,
            }}
          </Trans>
        );
      case ACTION.REMOVE_MEMBER:
        return (
          <Trans
            i18nKey={`${
              location.pathname.includes(routes.ViewpointCollection.path[0])
                ? "viewpoint_collection"
                : "product"
            }.history_remove_member`}
          >
            {{
              account: history?.userCreate?.account,
              member: history?.old,
            }}
          </Trans>
        );
      case ACTION.CREATE_REQUEST:
        return (
          <Trans
            i18nKey={`${
              location.pathname.includes(routes.ViewpointCollection.path[0])
                ? "viewpoint_collection"
                : "product"
            }.history_create_request`}
          >
            {{
              account: history?.userCreate?.account,
              old: history?.oldDetail?.name,
              new: history?.newDetail?.name,
            }}
          </Trans>
        );
      case ACTION.APPROVE_REQUEST:
        return (
          <Trans
            i18nKey={`${
              location.pathname.includes(routes.ViewpointCollection.path[0])
                ? "viewpoint_collection"
                : "product"
            }.history_approve_request`}
          >
            {{
              account: history?.userCreate?.account,
              old: history?.oldDetail?.name,
              new: history?.newDetail?.name,
            }}
          </Trans>
        );
      default:
        return "";
    }
  };

  const handleGetHistoryChanges = async (
    pageNumber: number,
    pageSize: number
  ) => {
    try {
      const response: IResponseData = await historyChangeAPI.getHistoryChanges({
        id: entity?.id,
        PageSize: pageSize,
        PageNumber: pageNumber,
      });

      const changedData = response.data?.map(
        (item: IResponseHistoryChanges) => {
          return {
            ...item,
            content: handleRenderContentHistory(item),
          };
        }
      );
      setData(changedData);
      setPagination({
        ...response?.metaData,
      });
    } catch (error) {
      if (error?.code) {
        showErrorNotification(t(`responseMessage:${error?.code}`));
      }
    }
  };

  const handleChangePagination = (page: number, pageSize: number) => {
    handleGetHistoryChanges(page, pageSize);
    setPagination({ ...pagination, pageSize: pageSize, currentPage: page });
  };

  useEffect(() => {
    if (entity?.id && visible === true)
      handleGetHistoryChanges(pagination.currentPage, pagination.pageSize);
  }, [visible]);

  return (
    <Modal
      title={t("common:common.history_changes")}
      visible={visible}
      onCancel={() => {
        onCancel();
        setPagination(DEFAULT_PAGINATION);
      }}
      footer={[
        <Button
          key={"cancel"}
          onClick={() => {
            onCancel();
            setPagination(DEFAULT_PAGINATION);
          }}
        >
          {t("common:common.cancel")}
        </Button>,
      ]}
      style={{ top: 20 }}
      width={1000}
    >
      <LocaleProvider>
        {data?.length > 0 ? (
          <>
            <Timeline>
              {data?.map(
                (item: IResponseHistoryChanges & IHistoryChangeData, index) => (
                  <Timeline.Item
                    color={
                      item?.title === ACTION.CREATE ||
                      item?.title === ACTION.CLONE ||
                      item?.title === ACTION.CREATE_REQUEST
                        ? "blue"
                        : "green"
                    }
                    key={index}
                  >
                    <Tag
                      color={
                        item?.title === ACTION.CREATE ||
                        item?.title === ACTION.CLONE ||
                        item?.title === ACTION.CREATE_REQUEST
                          ? "blue"
                          : "green"
                      }
                    >
                      {item?.title === ACTION.CREATE ||
                      item?.title === ACTION.CLONE ||
                      item?.title === ACTION.CREATE_REQUEST
                        ? t("common:common.create_action")
                        : t("common:common.update_action")}
                    </Tag>{" "}
                    {new Date(item?.createdAt).toLocaleString()}
                    {" - "}
                    {item.content}
                  </Timeline.Item>
                )
              )}
            </Timeline>
            {pagination.totalCount > DEFAULT_PAGE_SIZE && (
              <Pagination
                total={pagination.totalCount}
                current={pagination.currentPage}
                showTotal={(total) =>
                  t("common:common.show_total", { total: total })
                }
                showSizeChanger={true}
                onChange={handleChangePagination}
                defaultPageSize={DEFAULT_PAGE_SIZE}
                pageSizeOptions={["20", "30", "50"]}
                style={{
                  marginTop: "1rem",
                  display: "flex",
                  justifyContent: "right",
                }}
              />
            )}
          </>
        ) : (
          <Empty />
        )}
      </LocaleProvider>
    </Modal>
  );
};

export default ModalHistoryChanges;
