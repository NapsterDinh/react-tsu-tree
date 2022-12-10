import { HomeOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useTreeActionAPI } from "@hooks/TreeHooks/useTreeActionAPI";
import useLanguageData from "@hooks/useLanguageData";
import DomainAPI from "@services/domainAPI";
import TestTypeAPI from "@services/testTypeAPI";
import viewpointCollectionAPI from "@services/viewpointCollectionAPI";
import ViewpointAPI from "@services/viewpointsAPI";
import { DEFAULT_VIEWPOINT_NODE_LEAF } from "@utils/constants";
import { showErrorNotification } from "@utils/notificationUtils";
import { Breadcrumb, Button, Col, Empty, Row, Spin, Typography } from "antd";
import * as React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { routes } from "routes";
import { CommonAction } from "./components";
import ClonedViewpointTree from "./components/ClonedTree/ClonedViewpointTree";
import DetailViewpointForm from "./components/DetailViewpointForm/DetailViewpointForm";
import { ElementWrapper } from "./DetailViewpointCollection.Style";

import { Wrapper } from "./DetailViewpointCollection.Style";

const DetailViewpointCollection = () => {
  const [entity, setEntity] = useState(null);
  const [loadingEntity, setLoadingEntity] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [domainList, setDomainList] = useState([]);
  const [levelShow, setLevelShow] = useState(1);
  const treeRef = React.useRef(null);
  const { t } = useTranslation(["common", "validate"]); // languages
  const [hintTextList, setHintTextList] = useState([]);
  const languageData = useLanguageData();

  const {
    baseHandleAPI,
    checkOwner,
    loadMore,
    loadLess,
    searchText,
    setSearchText,
    onSearchTree,
    customSetEntity,
  } = useTreeActionAPI({
    treeAPI: viewpointCollectionAPI,
    nodeAPI: ViewpointAPI,
    setHintTextList: setHintTextList,
    entity: entity,
    setEntity: setEntity,
    setLoading: setLoadingEntity,
  });

  const handleCallHintResource = () => {
    baseHandleAPI.setHintTextResource(TestTypeAPI.searchFilterTestType);
  };

  const handleGetViewpointCollection = () => {
    baseHandleAPI.setTree({
      pathNameNavigate: routes.ViewpointCollection.path[0],
    });
  };

  const handleCallAPIDeleteViewpoint = (node, isDeleteAllChildren) => {
    return baseHandleAPI.deleteNode(
      node,
      isDeleteAllChildren,
      t("common:detail_viewpoint_collection.delete_successfully")
    );
  };

  const handleCallAPIDeleteListViewpoint = (ids) => {
    return baseHandleAPI.deleteNodeByListId(
      ids,
      t("common:detail_viewpoint_collection.delete_successfully")
    );
  };

  const handleCallAPISaveViewpoint = (node, newContent) => {
    return baseHandleAPI.saveNode(
      node,
      newContent,
      t("common:detail_viewpoint_collection.update_successfully")
    );
  };

  const handleCallAPIAddChildViewpoint = (node, newContent) => {
    return baseHandleAPI.addChildNode(
      node,
      newContent,
      "viewPointCollectionId"
    );
  };

  const handleCallAPIDomainList = async () => {
    try {
      const response = await DomainAPI.getDomain();
      setDomainList(
        response?.data.map((item) => ({
          ...item,
          key: item.id,
          label: item.detail.name,
          value: item.id,
        }))
      );
    } catch (error) {
      if (error?.code) {
        showErrorNotification(t(`responseMessage:${error?.code}`));
      }
    }
  };

  const handleCallAPIDragDropViewpoint = (
    dragParentKey,
    targetKey,
    dropParentKey,
    previousNodeAfterDropKey
  ) => {
    return baseHandleAPI.dragDropNode({
      dragParentKey: dragParentKey,
      targetKey: targetKey,
      dropParentKey: dropParentKey,
      previousNodeAfterDropKey: previousNodeAfterDropKey,
      entityKey: "viewpointCollectionId",
    });
  };

  const handleChangeLockedViewpoint = (ids, isLocked) => {
    return baseHandleAPI.changeLockedNode({
      ids: ids,
      isLocked: isLocked,
      msgLockSuccess: t(
        "common:detail_viewpoint_collection.lock_viewpoint_successfully"
      ),
      msgUnlockSuccess: t(
        "common:detail_viewpoint_collection.unlock_viewpoint_successfully"
      ),
    });
  };

  const handleChangeStatusProcess = (checked) => {
    baseHandleAPI.changeProcessStatusTree(
      checked,
      t("common:common.change_status_successfully")
    );
  };

  const handleChangeStatusPublish = (checked) => {
    baseHandleAPI.changePublishStatusTree(
      checked,
      t("common:common.change_status_successfully")
    );
  };

  // call domain's action
  useEffect(() => {
    (async () => {
      await handleGetViewpointCollection();
      await handleCallAPIDomainList();
      await handleCallHintResource();
    })();
    return () => {
      setSearchText("");
      // setEntity(null);
      setSelectedNode(null);
    };
  }, []);
  return (
    <Wrapper>
      <Spin
        wrapperClassName="full-opacity-spin"
        spinning={loadingEntity}
        tip={t("common:common.loading")}
      >
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={"/"}>
              <HomeOutlined
                style={{
                  marginRight: "0.5rem",
                }}
              />
              {t("common:common.home_page")}
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={routes.ViewpointCollection.path[0]}>
              {t("common:viewpoint_collection.name")}
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{entity?.detail?.name}</Breadcrumb.Item>
        </Breadcrumb>
        {!loadingEntity && (
          <CommonAction
            getDataLanguage={languageData.getDataLanguage}
            setDataLanguage={languageData.setDataLanguage}
            setSelectedNode={setSelectedNode}
            currentVPCollection={entity}
            getData={handleGetViewpointCollection}
            setCurrentVPCollection={setEntity}
            setLevelShow={setLevelShow}
            levelShow={levelShow}
            domainList={domainList}
            treeRef={treeRef}
            handleChangeStatusProcess={handleChangeStatusProcess}
            handleChangeStatusPublish={handleChangeStatusPublish}
            checkOwner={checkOwner}
            setSearchText={setSearchText}
          />
        )}

        <Spin spinning={loadingEntity} tip={t("common:common.loading")}>
          <Row
            gutter={8}
            style={{
              display: entity?.children?.length === 0 ? "block" : "none",
              marginTop: "10px",
            }}
          >
            <ElementWrapper>
              <div className="empty-container">
                <Empty
                  style={{ marginBottom: "0px", marginTop: "6rem" }}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <Typography.Title level={5} className="color-text">
                      {t("common:common.no_data")}
                    </Typography.Title>
                  }
                />
                <Typography.Paragraph
                  className="color-text"
                  style={{ width: "600px", textAlign: "center" }}
                >
                  {t("common:detail_viewpoint_collection.script")}
                </Typography.Paragraph>
                {checkOwner && (
                  <Button
                    icon={<PlusCircleOutlined />}
                    onClick={() => treeRef.current.createFirstNode(null)}
                  >
                    {t("common:detail_viewpoint_collection.create_new")}
                  </Button>
                )}
              </div>
            </ElementWrapper>
          </Row>
          <Row
            gutter={8}
            style={{
              display: entity?.children?.length !== 0 ? "flex" : "none",
              marginTop: "10px",
            }}
          >
            <Col xs={13}>
              <ElementWrapper>
                <div className="detail-viewpoint-collection-tree">
                  {!loadingEntity && (
                    <ClonedViewpointTree
                      onSearchTree={onSearchTree}
                      ref={treeRef}
                      searchText={searchText}
                      dataObjectTree={entity}
                      setDataObjectTree={customSetEntity}
                      handleDeleteNodeAPI={handleCallAPIDeleteViewpoint}
                      handleDeleteListNodeAPI={handleCallAPIDeleteListViewpoint}
                      handleDragDropAPI={handleCallAPIDragDropViewpoint}
                      handleSaveNodeAPI={handleCallAPISaveViewpoint}
                      handleAddChildAPI={handleCallAPIAddChildViewpoint}
                      handleChangeDisabled={handleChangeLockedViewpoint}
                      selectedNode={selectedNode}
                      setSelectedNode={setSelectedNode}
                      levelShow={levelShow}
                      defaultNewTreeNodeLeaf={DEFAULT_VIEWPOINT_NODE_LEAF}
                      checkOwner={checkOwner}
                      hintTextList={hintTextList}
                      loadMore={loadMore}
                      loadLess={loadLess}
                    />
                  )}
                </div>
              </ElementWrapper>
            </Col>
            <Col xs={11}>
              <DetailViewpointForm
                treeData={entity}
                setSelectedNode={setSelectedNode}
                checkOwner={checkOwner}
                data={selectedNode}
                setData={(node) => treeRef.current.saveNode(node)}
              />
            </Col>
          </Row>
        </Spin>
      </Spin>
    </Wrapper>
  );
};

export default React.memo(DetailViewpointCollection);
