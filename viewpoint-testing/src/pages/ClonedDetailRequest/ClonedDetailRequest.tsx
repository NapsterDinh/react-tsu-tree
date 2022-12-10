import { HomeOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import requestAPI from "@services/requestAPI";
import {
  ERR_CANCELED_RECEIVE_RESPONSE,
  ROLE,
  STATUS_REQUEST,
} from "@utils/constants";
import * as React from "react";
import { useEffect, useState } from "react";

import { getUser, loopAllChildren } from "@utils/helpersUtils";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@utils/notificationUtils";
import { Breadcrumb, List, Popover, Spin, Tabs, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import { routes } from "routes";
import { Wrapper } from "./ClonedDetailRequest.Styled";
import CommonAction from "./components/CommonAction/CommonAction";
import Detail from "./components/Detail/Detail";
import StateChange from "./components/StateChange/StagedChange";
import { ElementWrapper } from "./components/StateChange/StagedChangeWrapper";
import useAbortRequest from "@hooks/useAbortRequest";

const ClonedDetailRequest = () => {
  const [currentRequest, setCurrentRequest] = useState(null);
  const [referenceArr, setReferenceArr] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isBlocking, setIsBlocking] = React.useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation(["common", "validate"]); // languages
  const user = getUser();
  const { signal } = useAbortRequest();

  const handleGetDetailRequest = async () => {
    try {
      if (id) {
        setLoading(true);
        const response = await requestAPI.getDetailRequest(
          {
            id,
          },
          signal
        );

        // viewpoint collection
        if (response.data.requestType === "ViewPointCollection") {
          const newRequest = {
            ...response.data,
            viewPointCollectionFrom: {
              ...response.data.viewPointCollectionFrom,
              children: response.data.viewPointCollectionRequestFrom,
            },
            viewPointCollectionTo: {
              ...response.data.viewPointCollectionTo,
              children: response.data.viewPointCollectionRequestTo,
            },
          };
          delete newRequest.viewPointCollectionRequestFrom;
          delete newRequest.viewPointCollectionRequestTo;
          delete newRequest.productRequestFrom;
          delete newRequest.productRequestTo;
          delete newRequest.listOwner;
          delete newRequest.orderStrings;
          delete newRequest.productFrom;
          delete newRequest.productTo;
          setCurrentRequest(newRequest);
        }
        // product
        else {
          const newRequest = {
            ...response.data,
            productFrom: {
              ...response.data.productFrom,
              children: response.data.productRequestFrom,
            },
            productTo: {
              ...response.data.productTo,
              children: response.data.productRequestTo,
            },
          };
          delete newRequest.productRequestFrom;
          delete newRequest.productRequestTo;
          delete newRequest.listOwner;
          delete newRequest.orderStrings;
          delete newRequest.viewPointCollectionFrom;
          delete newRequest.viewPointCollectionTo;
          setCurrentRequest(newRequest);
        }
      }
      setIsBlocking(false);
    } catch (error) {
      if (error?.code === ERR_CANCELED_RECEIVE_RESPONSE) {
        return;
      }
      if (error?.code !== "IdInvalid") {
        if (error?.response?.status === 400) {
          if (!error?.response?.currentRequest?.errors?.[0]?.code) {
            showErrorNotification(t("responseMessage:IdInvalid"));
          } else {
            showErrorNotification(t(`responseMessage:${error?.code}`));
          }
          navigate("/not-found", {
            state: {
              from: {
                pathname: routes.ViewpointCollection.path[0],
              },
            },
          });
        } else {
          showErrorNotification(t(`responseMessage:${error?.code}`));
        }
      } else {
        showErrorNotification(t(`responseMessage:${error?.code}`));
        navigate("/not-found", {
          state: {
            from: {
              pathname: routes.ViewpointCollection.path[0],
            },
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetDetailRequest();
  }, [id]);

  const checkOwner = () => {
    if (user?.role === ROLE.ADMIN) {
      return true;
    }
    if (currentRequest) {
      if (currentRequest?.requestType === "ViewPointCollection") {
        if (currentRequest?.viewPointCollectionTo?.listOwner) {
          return currentRequest?.viewPointCollectionTo?.listOwner?.some(
            (t) => t.id === user?.id
          );
        }
        return false;
      } else {
        if (currentRequest?.productTo?.listOwner) {
          return currentRequest?.productTo?.listOwner?.some(
            (t) => t.id === user?.id
          );
        }
        return false;
      }
    }

    return false;
  };

  const handleOnSaveDraft = async (isNavigate = false) => {
    try {
      const newViewpointsOrFunctions = [];
      const newPayload =
        currentRequest?.requestType === "ViewPointCollection"
          ? {
              ...currentRequest?.viewPointCollectionFrom,
              viewPoints: convertToPayload(
                currentRequest?.viewPointCollectionFrom,
                newViewpointsOrFunctions,
                currentRequest?.requestType
              ),
              detail: JSON.stringify([
                currentRequest?.viewPointCollectionFrom?.detail,
              ]),
              orderStrings: JSON.stringify(
                currentRequest?.viewPointCollectionFrom?.children
                  ?.filter((t) => typeof t.key === "string")
                  ?.map((item) => item?.key)
              ),
            }
          : {
              ...currentRequest?.productFrom,
              functions: convertToPayload(
                currentRequest?.productFrom,
                newViewpointsOrFunctions,
                "Product"
              ),
              detail: JSON.stringify([currentRequest?.productFrom?.detail]),
              orderStrings: JSON.stringify(
                currentRequest?.productFrom?.children
                  ?.filter((t) => typeof t.key === "string")
                  ?.map((item) => item?.key)
              ),
            };
      if (currentRequest?.requestType === "ViewPointCollection") {
        delete newPayload.children;
      } else {
        delete newPayload.children;
      }
      currentRequest?.requestType === "ViewPointCollection"
        ? await requestAPI.saveDraftRequest(newPayload, currentRequest?.id)
        : await requestAPI.saveDraftProductRequest(
            newPayload,
            currentRequest?.id
          );

      isNavigate &&
        showSuccessNotification(
          t("common:request_management.save_draft_successfully")
        );
      isNavigate &&
        navigate(routes.RequestManagement.path[0], {
          replace: true,
        });
    } catch (error) {
      if (error?.code) {
        showErrorNotification(t(`responseMessage:${error?.code}`));
      }
    }
  };

  const handleApprove = async () => {
    try {
      await handleOnSaveDraft(false);

      await requestAPI.approveRequest(null, currentRequest?.id);

      showSuccessNotification(
        t("common:request_management.approve_draft_successfully")
      );

      navigate(routes.RequestManagement.path[0], {
        replace: true,
      });
    } catch (error) {
      if (error?.code) {
        showErrorNotification(t(`responseMessage:${error?.code}`));
      }
    }
  };

  const handleRejectRequest = async () => {
    try {
      await requestAPI.rejectRequest({ id: currentRequest?.id });
      showSuccessNotification(
        t("common:request_management.reject_successfully")
      );
      navigate(routes.RequestManagement.path[0], { replace: true });
    } catch (error) {
      if (error?.code) {
        showErrorNotification(t(`common:${error?.code}`));
      }
    }
  };

  const convertToPayload = (data, newObject, type) => {
    if (type === "ViewPointCollection") {
      loopAllChildren(data?.children, (item) => {
        const newViewpoint = {
          id: item?.key,
          viewDetail: JSON.stringify([item?.viewDetail]),
          viewPointCollectionId: item?.viewPointCollectionId,
          parentId: item?.parentKey,
          orderStrings: JSON.stringify(item?.children?.map((t) => t?.key)),
          isLocked: item?.isLocked,
          cloneViewPointId: item.cloneViewPointId,
        };
        if (typeof item.key !== "number") {
          newObject.push(newViewpoint);
        }
      });
    } else {
      loopAllChildren(data?.children, (item) => {
        const newFunction = {
          id: item?.key,
          viewDetail: JSON.stringify([item?.viewDetail]),
          productId: item?.productId,
          parentId: item?.parentKey,
          orderStrings: JSON.stringify(item?.children?.map((t) => t?.key)),
          isLocked: item?.isLocked,
          cloneFunctionId: item.cloneFunctionId,
        };
        if (typeof item.key !== "number") {
          newObject.push(newFunction);
        }
      });
    }
    return newObject;
  };

  const operations = React.useMemo(() => {
    const data = [
      {
        key: "unchanged",
        prefix: "UNCHANGED",
        description: t("common:detail_request.note_unchanged"),
        color: "#ffffff",
      },
      {
        key: "updated",
        prefix: "UPDATED",
        description: t("common:detail_request.note_updated"),
        color: "rgb(250, 173, 20, 0.3)",
      },
      {
        key: "deleted",
        prefix: "DELETED",
        description: t("common:detail_request.note_deleted"),
        color: "rgb(255,192,203,0.6)",
      },
      {
        key: "added",
        prefix: "ADDED",
        description: t("common:detail_request.note_added"),
        color: "rgb(193,255,193,0.6)",
      },
    ];
    const note = (
      <List
        header={t("common:detail_request.header_note")}
        footer={null}
        bordered
        dataSource={data}
        renderItem={(item) => (
          <List.Item key={item?.key}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: item.color,
                  borderRadius: 5,
                  border: "solid 1px #d9d9d9",
                }}
              ></div>
              <div>
                <Typography.Text strong>[{item?.prefix}]</Typography.Text>{" "}
                <Typography.Text> {item.description}</Typography.Text>
              </div>
            </div>
          </List.Item>
        )}
      />
    );
    return (
      <Popover placement="bottomRight" trigger="hover" content={note}>
        <QuestionCircleOutlined
          style={{
            cursor: "pointer",
            fontSize: "20px",
          }}
        />
      </Popover>
    );
  }, []);

  return (
    <Wrapper>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to={"/"}>
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link
            to={routes.RequestManagement.path[0]}
            style={{ color: "var(--clr-text)" }}
          >
            {t("common:request_management.name")}
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{currentRequest?.title}</Breadcrumb.Item>
      </Breadcrumb>
      <CommonAction
        handleOnSaveDraft={handleOnSaveDraft}
        handleApprove={handleApprove}
        handleRejectRequest={handleRejectRequest}
        checkOwner={checkOwner}
        data={currentRequest}
        isBlocking={isBlocking}
      />
      <Spin spinning={loading} tip="Loading...">
        {currentRequest ? (
          <Tabs
            defaultActiveKey="Staged changes"
            tabBarExtraContent={operations}
          >
            <Tabs.TabPane tab={t("common:common.detail_info")} key="Details">
              <Detail request={currentRequest} />
            </Tabs.TabPane>
            {currentRequest?.status !== STATUS_REQUEST.APPROVE &&
              currentRequest?.status !== STATUS_REQUEST.REJECT &&
              currentRequest?.status !== STATUS_REQUEST.CANCELED && (
                <Tabs.TabPane
                  tab={t("common:common.staged_change")}
                  key="Staged changes"
                >
                  <StateChange
                    handleOnSaveDraft={handleOnSaveDraft}
                    getData={handleGetDetailRequest}
                    isBlocking={isBlocking}
                    setIsBlocking={setIsBlocking}
                    request={currentRequest}
                    setRequest={setCurrentRequest}
                    setReferenceArr={setReferenceArr}
                    referenceArr={referenceArr}
                  />
                </Tabs.TabPane>
              )}
          </Tabs>
        ) : (
          <ElementWrapper />
        )}
      </Spin>
    </Wrapper>
  );
};

export default ClonedDetailRequest;
