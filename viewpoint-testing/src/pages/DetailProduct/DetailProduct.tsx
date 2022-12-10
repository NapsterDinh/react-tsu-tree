import { HomeOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useTreeActionAPI } from "@hooks/TreeHooks/useTreeActionAPI";
import useAbortRequest from "@hooks/useAbortRequest";
import useLanguageData from "@hooks/useLanguageData";
import DomainAPI from "@services/domainAPI";
import FunctionAPI from "@services/functionAPI";
import productAPI from "@services/productAPI";
import { DEFAULT_FUNCTION_NODE_LEAF } from "@utils/constants";
import { showErrorNotification } from "@utils/notificationUtils";
import { Breadcrumb, Button, Col, Empty, Row, Spin, Typography } from "antd";
import * as React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { routes } from "routes";
import ClonedProductTree from "./components/ClonedTree/ClonedProductTree";
import CommonAction from "./components/CommonAction/CommonAction";
import DetailProductForm from "./components/DetailProductForm/DetailProductForm";
import { ElementWrapper, Wrapper } from "./DetailProductStyle";

const DetailProduct = () => {
  const [entity, setEntity] = useState(null);
  const [loadingEntity, setLoadingEntity] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [domainList, setDomainList] = useState([]);
  const [levelShow, setLevelShow] = useState(1);
  const treeRef = React.useRef(null);
  const { t } = useTranslation(["common", "validate"]); // languages
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
    treeAPI: productAPI,
    nodeAPI: FunctionAPI,
    entity: entity,
    setEntity: setEntity,
    setLoading: setLoadingEntity,
  });

  const handleGetProduct = async () => {
    baseHandleAPI.setTree({
      pathNameNavigate: routes.ProductManagement.path[0],
    });
  };
  const handleCallAPIDeleteFunction = async (node, isDeleteAllChildren) => {
    return baseHandleAPI.deleteNode(
      node,
      isDeleteAllChildren,
      t("common:detail_product.delete_successfully")
    );
  };

  const handleCallAPIDeleteListFunction = async (ids) => {
    return baseHandleAPI.deleteNodeByListId(
      ids,
      t("common:detail_product.delete_successfully")
    );
  };

  const handleCallAPISaveFunction = async (node, newContent) => {
    return baseHandleAPI.saveNode(
      node,
      newContent,
      t("common:detail_product.update_successfully")
    );
  };

  const handleCallAPIAddChildFunction = async (node, newContent) => {
    return baseHandleAPI.addChildNode(node, newContent, "productId");
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

  const handleCallAPIDragDropFunction = async (
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
      entityKey: "productId",
    });
  };

  const handleChangeLockedFunction = async (ids, isLocked) => {
    return baseHandleAPI.changeLockedNode({
      ids: ids,
      isLocked: isLocked,
      msgLockSuccess: t("common:detail_product.lock_successfully"),
      msgUnlockSuccess: t("common:detail_product.unlock_successfully"),
    });
  };

  const handleChangeStatusProcess = async (checked) => {
    baseHandleAPI.changeProcessStatusTree(
      checked,
      t("common:common.change_status_successfully")
    );
  };

  const handleChangeStatusPublish = async (checked) => {
    baseHandleAPI.changePublishStatusTree(
      checked,
      t("common:common.change_status_successfully")
    );
  };

  // call domain's action
  useEffect(() => {
    (async () => {
      await handleGetProduct();
      await handleCallAPIDomainList();
    })();
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
            <Link to={routes.ProductManagement.path[0]}>
              {t("common:product.name")}
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{entity?.detail?.name}</Breadcrumb.Item>
        </Breadcrumb>
        {!loadingEntity && (
          <CommonAction
            getDataLanguage={languageData.getDataLanguage}
            setDataLanguage={languageData.setDataLanguage}
            setSelectedNode={setSelectedNode}
            currentProduct={entity}
            getData={handleGetProduct}
            setCurrentProduct={setEntity}
            setSearchText={setSearchText}
            setLevelShow={setLevelShow}
            levelShow={levelShow}
            domainList={domainList}
            treeRef={treeRef}
            handleChangeStatusProcess={handleChangeStatusProcess}
            handleChangeStatusPublish={handleChangeStatusPublish}
            checkOwner={checkOwner}
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
                  {t("common:detail_product.script")}
                </Typography.Paragraph>
                {checkOwner && (
                  <Button
                    icon={<PlusCircleOutlined />}
                    onClick={() => treeRef.current.createFirstNode(null)}
                  >
                    {t("common:detail_product.create_new")}
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
                    <ClonedProductTree
                      onSearchTree={onSearchTree}
                      ref={treeRef}
                      searchText={searchText}
                      dataObjectTree={entity}
                      setDataObjectTree={customSetEntity}
                      handleDeleteNodeAPI={handleCallAPIDeleteFunction}
                      handleDeleteListNodeAPI={handleCallAPIDeleteListFunction}
                      handleDragDropAPI={handleCallAPIDragDropFunction}
                      handleSaveNodeAPI={handleCallAPISaveFunction}
                      handleAddChildAPI={handleCallAPIAddChildFunction}
                      handleChangeDisabled={handleChangeLockedFunction}
                      selectedNode={selectedNode}
                      setSelectedNode={setSelectedNode}
                      levelShow={levelShow}
                      defaultNewTreeNodeLeaf={DEFAULT_FUNCTION_NODE_LEAF}
                      checkOwner={checkOwner}
                      loadMore={loadMore}
                      loadLess={loadLess}
                    />
                  )}
                </div>
              </ElementWrapper>
            </Col>
            <Col xs={11}>
              <DetailProductForm
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

export default DetailProduct;
