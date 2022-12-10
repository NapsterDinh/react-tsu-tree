import useLanguageData from "@hooks/useLanguageData";
import ModalTestTypeTable from "@pages/DetailViewpointCollection/components/CommonAction/ModalTestTypeTable/ModalTestTypeTable";
import TestTypeAPI from "@services/testTypeAPI";
import { deepCopy, loopAllChildren } from "@utils/helpersUtils";
import { showErrorNotification } from "@utils/notificationUtils";
import { compareTwoTree } from "@utils/treeUtils";
import { Col, Row, Spin } from "antd";
import * as React from "react";
import { useTranslation } from "react-i18next";
import ModalCompare from "./Components/ModalCompare/ModalCompare";
import ModalCompareProduct from "./Components/ModalCompare/ModalCompareProduct";
import ModalChangeDetail from "./Components/TreeFrom/ModalChangeDetail/ModalChangeDetail";
import ModalChangeProductDetail from "./Components/TreeFrom/ModalChangeDetail/ModalChangeProductDetail";
import TreeFrom from "./Components/TreeFrom/TreeFrom";
import TreeProductFrom from "./Components/TreeFrom/TreeProductFrom";
import TreeProductTo from "./Components/TreeTo/TreeProductTo";
import TreeTo from "./Components/TreeTo/TreeTo";
import { StateChangeWrapper } from "./StagedChangeWrapper";

const StagedChange = ({
  request,
  setRequest,
  referenceArr,
  setReferenceArr,
  isBlocking,
  setIsBlocking,
  getData,
  handleOnSaveDraft,
}) => {
  const treeFromRef = React.useRef<any>();
  const [hintTextList, setHintTextList] = React.useState([]);
  const [isShowHintTestType, setIsShowHintTestType] = React.useState(false);
  const [selectedNodeTo, setSelectedNodeTo] = React.useState(null);
  const [selectedNodeFrom, setSelectedNodeFrom] = React.useState(null);
  const [isOpenDetailFrom, setIsOpenDetailFrom] = React.useState(null);
  const [isOpenDetailTo, setIsOpenDetailTo] = React.useState(null);
  const [isOpenDetailBoth, setIsOpenDetailBoth] = React.useState(null);
  const { t } = useTranslation(["common"]); // languages
  const [loading, setLoading] = React.useState(false);
  const languageData = useLanguageData();

  const setTreeFrom = (newTreeFrom) => {
    setIsBlocking(true);
    const convertedTreeTo =
      request?.requestType === "ViewPointCollection"
        ? deepCopy(request?.viewPointCollectionTo)
        : deepCopy(request?.productTo);

    if (request?.requestType === "ViewPointCollection") {
      setReferenceArr(
        compareTwoTree(
          newTreeFrom.children,
          convertedTreeTo.children,
          "cloneViewPointId"
        )
      );
      setRequest({
        ...request,
        viewPointCollectionFrom: newTreeFrom,
        viewPointCollectionTo: convertedTreeTo,
      });
    } else {
      setReferenceArr(
        compareTwoTree(
          newTreeFrom.children,
          convertedTreeTo.children,
          "cloneFunctionId"
        )
      );
      setRequest({
        ...request,
        productFrom: newTreeFrom,
        productTo: convertedTreeTo,
      });
    }
  };

  const findReferenceNode = (key) => {
    const result = referenceArr.find((t) => t.to === key);
    treeFromRef.current.handleSetSelectedKey(result ? result.from : null);
  };

  const handleChangeLanguage = async (value) => {
    treeFromRef.current.closeCurrentInput();
    setSelectedNodeFrom(null);
    setSelectedNodeTo(null);
    languageData.setDataLanguage(value);
    await getData();
  };

  React.useEffect(() => {
    if (selectedNodeTo) {
      let result = null;
      if (request?.requestType === "ViewPointCollection") {
        loopAllChildren(request?.viewPointCollectionFrom?.children, (item) => {
          if (item.cloneViewPointId === selectedNodeTo.key) result = item;
        });
        setSelectedNodeFrom(result);
      } else {
        loopAllChildren(request?.productFrom?.children, (item) => {
          if (item.cloneFunctionId === selectedNodeTo.key) result = item;
        });
        setSelectedNodeFrom(result);
      }
    } else {
      setSelectedNodeFrom(null);
    }
  }, [selectedNodeTo]);

  React.useEffect(() => {
    request.requestType === "ViewPointCollection" &&
      (async () => {
        try {
          const response = await TestTypeAPI.searchFilterTestType({});
          const testTypeList = response?.data?.map(
            (testType) => testType?.detail?.name
          );
          setHintTextList(testTypeList);
        } catch (error) {
          if (error?.code) {
            showErrorNotification(t(`responseMessage:${error?.code}`));
          }
        }
      })();
  }, []);

  return (
    <Spin spinning={loading} tip={t("common:common.loading")}>
      <StateChangeWrapper>
        {request.requestType === "ViewPointCollection" && (
          <>
            <ModalChangeDetail
              open={isOpenDetailFrom}
              setOpen={setIsOpenDetailFrom}
              data={selectedNodeFrom}
              setData={setSelectedNodeFrom}
              saveNode={(node) => treeFromRef.current.saveNode(node)}
            />

            <ModalChangeDetail
              open={isOpenDetailTo}
              setOpen={setIsOpenDetailTo}
              data={selectedNodeTo}
              setData={setSelectedNodeTo}
              saveNode={null}
            />

            <ModalCompare
              open={isOpenDetailBoth}
              setOpen={setIsOpenDetailBoth}
              selectedNodeFrom={selectedNodeFrom}
              setSelectedNodeFrom={setSelectedNodeFrom}
              handleOk={(node) => treeFromRef.current.saveNode(node)}
              selectedNodeTo={selectedNodeTo}
              setSelectedNodeTo={setSelectedNodeTo}
              request={request}
            />
            <ModalTestTypeTable
              visible={isShowHintTestType}
              setVisible={setIsShowHintTestType}
            />
          </>
        )}

        {request.requestType === "Product" && (
          <>
            <ModalChangeProductDetail
              open={isOpenDetailFrom}
              setOpen={setIsOpenDetailFrom}
              data={selectedNodeFrom}
              setData={setSelectedNodeFrom}
              saveNode={(node) => treeFromRef.current.saveNode(node)}
            />

            <ModalChangeProductDetail
              open={isOpenDetailTo}
              setOpen={setIsOpenDetailTo}
              data={selectedNodeTo}
              setData={setSelectedNodeTo}
              saveNode={null}
            />

            <ModalCompareProduct
              open={isOpenDetailBoth}
              setOpen={setIsOpenDetailBoth}
              selectedNodeFrom={selectedNodeFrom}
              setSelectedNodeFrom={setSelectedNodeFrom}
              handleOk={(node) => treeFromRef.current.saveNode(node)}
              selectedNodeTo={selectedNodeTo}
              setSelectedNodeTo={setSelectedNodeTo}
              request={request}
            />
          </>
        )}

        <Row id="row-stage-change" gutter={8} justify={"space-between"}>
          <Col xs={12}>
            {request?.viewPointCollectionFrom && (
              <TreeFrom
                setLoading={setLoading}
                setOpenModalDetail={setIsOpenDetailFrom}
                referenceArr={referenceArr}
                selectedNode={selectedNodeFrom}
                setSelectedNode={setSelectedNodeFrom}
                ref={treeFromRef}
                dataObjectTree={request?.viewPointCollectionFrom}
                setDataObjectTree={setTreeFrom}
                hintTextList={hintTextList}
              />
            )}
            {request?.productFrom && (
              <TreeProductFrom
                setOpenModalDetail={setIsOpenDetailFrom}
                referenceArr={referenceArr}
                selectedNode={selectedNodeFrom}
                setSelectedNode={setSelectedNodeFrom}
                ref={treeFromRef}
                dataObjectTree={request?.productFrom}
                setDataObjectTree={setTreeFrom}
              />
            )}
          </Col>

          <Col xs={12}>
            {request?.viewPointCollectionFrom && (
              <TreeTo
                setIsOpenDetailBoth={setIsOpenDetailBoth}
                setOpenModalDetail={setIsOpenDetailTo}
                findReferenceNode={findReferenceNode}
                selectedNodeTo={selectedNodeTo}
                setSelectedNodeTo={setSelectedNodeTo}
                dataObjectTree={
                  request?.requestType === "ViewPointCollection"
                    ? request?.viewPointCollectionTo
                    : request?.productTo
                }
                transferNode={(node) => treeFromRef.current.transferNode(node)}
                overrideNode={(node) => treeFromRef.current.overrideNode(node)}
                handleChangeLanguage={handleChangeLanguage}
                getDataLanguage={languageData.getDataLanguage}
                setIsShowHintTestType={setIsShowHintTestType}
                isBlocking={isBlocking}
                handleOnSaveDraft={handleOnSaveDraft}
              />
            )}
            {request?.productFrom && (
              <TreeProductTo
                setIsOpenDetailBoth={setIsOpenDetailBoth}
                setOpenModalDetail={setIsOpenDetailTo}
                findReferenceNode={findReferenceNode}
                selectedNodeTo={selectedNodeTo}
                setSelectedNodeTo={setSelectedNodeTo}
                dataObjectTree={
                  request?.requestType === "ViewPointCollection"
                    ? request?.viewPointCollectionTo
                    : request?.productTo
                }
                transferNode={(node) => treeFromRef.current.transferNode(node)}
                overrideNode={(node) => treeFromRef.current.overrideNode(node)}
                handleChangeLanguage={handleChangeLanguage}
                getDataLanguage={languageData.getDataLanguage}
                isBlocking={isBlocking}
                handleOnSaveDraft={handleOnSaveDraft}
              />
            )}
          </Col>
        </Row>
      </StateChangeWrapper>
    </Spin>
  );
};

export default StagedChange;
