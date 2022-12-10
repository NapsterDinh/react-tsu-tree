import { CustomTree } from "@components";
import { IDetailDomain } from "@models/model";
import { DataTreeNode, ResponseDomain, rootState } from "@models/type";
import { domainActions } from "@redux/slices";
import DomainAPI from "@services/domainAPI";
import {
  convertTreeData,
  expandedKeysWithLevel,
  generateFlattenedList,
  getNodeListToUpdate,
  loopUpdateDataTreeNode,
} from "@utils/treeUtils";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@utils/notificationUtils";
import { Col, Empty, Form, Row, Space, Spin } from "antd";
import { ElementWrapper } from "AppStyled";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  CommonAction,
  CreateDomainModal,
  DetailDomainForm,
} from "./components";
import { Wrapper } from "./DomainManagementStyle";
import { checkContainsSpecialCharacter } from "@utils/helpersUtils";

const DomainManagement: React.FC = () => {
  const { t } = useTranslation(["common", "validate"]); // languages

  // redux
  const dispatch = useDispatch();
  const { domain, loadingDomain } = useSelector(
    (state: rootState) => state.domain
  );

  // tree
  const [dataTree, setData] = useState<DataTreeNode[]>([]); // data for tree
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]); // array of expanded keys for tree
  const [flattenedData, setFlattenedData] = useState<DataTreeNode[]>(); // data tree node has been flattened; // convert data tree to flattened data
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]); // array of key or id of selected node on tree
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true); // auto expanded key
  const [loadingCreateDomain, setLoadingCreateDomain] =
    useState<boolean>(false);
  const [loadingUpdateDomain, setLoadingUpdateDomain] =
    useState<boolean>(false);
  const [nodeEditing, setNodeEditing] = useState(null);

  // search and filter domain
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState<string>(
    searchParams.get("search")
  ); // search input
  const [searchForm] = Form.useForm();

  // create domain
  const [visible, setVisible] = useState<boolean>(false); // open modal create parent domain
  const [createDomainForm] = Form.useForm<IDetailDomain>(null); // form for creating domain

  // detail domain
  const [isChangedForm, setIsChangedForm] = useState(true); // check form change in detail domain to enable or disable Save button
  const [detailDomainForm] = Form.useForm<IDetailDomain>(null); // form for detail domain

  // function
  // tree
  const handleSelectDomain = (treeNode: React.Key[], info: any) => {
    setSelectedKeys(treeNode);
    setNodeEditing(info.node);
    detailDomainForm.setFieldsValue({
      name: info.node.title,
      isActive: info.node.isActive,
      description: info.node.description,
    });
  };
  const handleDragDomain = async (
    dragNode: DataTreeNode,
    dropNode: DataTreeNode,
    dropToGap: boolean,
    dropPosition: number
  ) => {
    const domainList = getNodeListToUpdate(
      dragNode,
      dropNode,
      dropToGap,
      dropPosition,
      flattenedData
    );
    const response: ResponseDomain = await DomainAPI.updateListDomain(
      domainList
    );
    return response;
  }; // update parent id domain on tree when drag and drop
  const handleExpandTree = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  }; // set expanded keys for tree

  const handleUpdateDomain = async (node: DataTreeNode, newName: string) => {
    try {
      setLoadingUpdateDomain(true);
      const dataBody = {
        detail: JSON.stringify([
          {
            language: localStorage.getItem("dataLanguage"),
            name: newName,
            description: node.description,
          },
        ]),
        index: node.index,
        isActive: node.isActive,
        parentId: "",
        previousDomainId: "",
        nextDomainId: "",
      };
      const response: ResponseDomain = await DomainAPI.updateDomain({
        id: node.key,
        data: dataBody,
      });
      return response;
    } catch (error) {
      if (error?.code) {
        showErrorNotification(t(`responseMessage:${error?.code}`));
      }
    } finally {
      setLoadingUpdateDomain(false);
    }
  }; // update domain name on tree
  const handleSaveUpdatedDomain = async (values: IDetailDomain) => {
    try {
      const dataBody = {
        detail: JSON.stringify([
          {
            language: localStorage.getItem("dataLanguage"),
            name: values.name,
            description: values.description,
          },
        ]),
        isActive: values.isActive,
        prevDomainId: "",
        parentId: "",
        nextDomainId: "",
      };
      const response: ResponseDomain = await DomainAPI.updateDomain({
        id: selectedKeys[0],
        data: dataBody,
      });
      if (response.isSucceeded) {
        showSuccessNotification(
          t("common:domain_management.update_successfully")
        );
      }
      const updatedData = loopUpdateDataTreeNode(
        dataTree,
        selectedKeys[0],
        values
      );
      setData(updatedData);
    } catch (error) {
      showErrorNotification(t("common:domain_management.update_failed"));
    } finally {
      setIsChangedForm(true);
    }
  }; // save update domain on tree
  const handleDeleteDomain = async (listId: Array<string>) => {
    const response: ResponseDomain = await DomainAPI.deleteDomain(listId);
    return response;
  }; // delete parent node and all child in data tree node

  // search tree
  const handleSearchDomain = (value: string) => {
    setSearchValue(value.trim());
    searchForm.setFields([
      {
        name: "searchValue",
        value: value.trim(),
      },
    ]);
    if (value.trim() && !checkContainsSpecialCharacter(value.trim())) {
      setSearchParams({ search: value });
      const newExpandedKeys = flattenedData
        ?.map((item: DataTreeNode) => {
          if (
            item?.title
              ?.toString()
              ?.toLowerCase()
              ?.indexOf(value.toLowerCase()) > -1
          ) {
            return item?.parentKey;
          }
          return null;
        })
        .filter(
          (item: React.Key, i: number, self: React.Key[]) =>
            item &&
            item !== "00000000-0000-0000-0000-000000000000" &&
            self.indexOf(item) === i
        );
      setExpandedKeys(newExpandedKeys as React.Key[]);
      setAutoExpandParent(true);
      setSearchValue(value);
    } else {
      setSearchParams({});
      setSearchValue(value);
    }
  };

  // create domain
  const handleShowCreateDomainModal = () => {
    setVisible(true);
  }; // show modal parent domain creating
  const handleCreateDomain = async (values: {
    name: string;
    description: string;
  }) => {
    try {
      setLoadingCreateDomain(true);
      const language = localStorage.getItem("dataLanguage");
      const dataBody = {
        detail: JSON.stringify([
          {
            language: language,
            name: values.name,
            description: values.description,
          },
        ]),
        previousDomainId:
          dataTree.length === 0 ? null : dataTree[dataTree.length - 1]?.key,
        nextDomainId: null,
      };
      const response: ResponseDomain = await DomainAPI.postDomain(dataBody);
      if (response?.isSucceeded) {
        showSuccessNotification(
          t("common:domain_management.create_successfully")
        );
      }
      dispatch(domainActions.getDomain());
      setVisible(false);
      createDomainForm.resetFields();
    } catch (error) {
      if (error?.code) {
        createDomainForm.setFields([
          {
            name: "name",
            errors: [t(`responseMessage:${error?.code}`)],
          },
        ]);
      } else {
        showErrorNotification(t("common:domain_management.create_failed"));
      }
    } finally {
      setLoadingCreateDomain(false);
    }
  }; // submit to call api parent domain creating and add into tree
  const handleCancelCreateDomainModal = () => {
    setVisible(false);
    createDomainForm.resetFields();
  }; // cancel modal parent domain creating

  // add child domain
  const handleAddChildDomain = async (node: DataTreeNode, newTitle: string) => {
    const dataBody = {
      detail: JSON.stringify([
        {
          language: localStorage.getItem("dataLanguage"),
          name: newTitle,
          description: "",
        },
      ]),
      parentId: node.parentKey,
      previousDomainId: node?.prev,
      nextDomainId: node?.next,
    };
    const response: ResponseDomain = await DomainAPI.postDomain(dataBody);
    return response;
  }; // submit to call api and add child domain into tree

  // detail domain
  const handleCheckChangedForm = () => {
    setIsChangedForm(false);
  }; // set false when detail domain form has changed
  const handleUpdateNameInDetailForm = (content: string) => {
    detailDomainForm.setFieldsValue({
      name: content,
    });
  }; // update name for detail domain form
  const handleResetDetailDomainForm = () => {
    detailDomainForm.resetFields();
    setSelectedKeys([]);
  };

  const handleChangeSearchInputSelectLevel = (value) => {
    //-1: show full
    const updatedData = [];
    const clonedData = [...dataTree];
    if (value == -1) {
      expandedKeysWithLevel(clonedData, Infinity, updatedData);
    } else {
      expandedKeysWithLevel(clonedData, value, updatedData);
    }
    setExpandedKeys(updatedData);
  };

  // call domain's action
  useEffect(() => {
    dispatch(domainActions.getDomain());
    handleChangeSearchInputSelectLevel(-1);
  }, []);
  // update data tree when domain has change
  useEffect(() => {
    setData(convertTreeData(domain));
    setFlattenedData(generateFlattenedList(domain));
  }, [domain]);

  return (
    <Wrapper>
      <CommonAction
        form={searchForm}
        search={searchValue}
        onChangeSelect={handleChangeSearchInputSelectLevel}
        openForm={handleShowCreateDomainModal}
        onEnterSearch={handleSearchDomain}
      />

      {/* Domain tree and detail */}
      <Row gutter={8}>
        <Col span={14}>
          <ElementWrapper>
            <div className="domain-tree">
              {loadingDomain ? (
                <Space
                  align="center"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <Spin tip={t("common:common.loading")} />
                </Space>
              ) : domain ? (
                <CustomTree
                  nodeEditing={nodeEditing}
                  setNodeEditing={setNodeEditing}
                  flattenedData={flattenedData}
                  setFlattenedData={setFlattenedData}
                  searchValue={searchValue}
                  dataTree={dataTree}
                  setDataTree={setData}
                  callDeleteNodeApi={handleDeleteDomain}
                  expandedKeys={expandedKeys}
                  autoExpandParent={autoExpandParent}
                  onCreate={handleShowCreateDomainModal}
                  onAddChildNode={handleAddChildDomain}
                  onSelect={handleSelectDomain}
                  onExpand={handleExpandTree}
                  onUpdate={handleUpdateDomain}
                  onDrag={handleDragDomain}
                  onUpdateNameInDetailForm={handleUpdateNameInDetailForm}
                  onResetDetailDomainForm={handleResetDetailDomainForm}
                />
              ) : (
                <div className="domain-tree-empty">
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={<span>{t("common:common.no_data")}</span>}
                  />
                </div>
              )}
            </div>
          </ElementWrapper>
        </Col>
        <Col span={10}>
          <ElementWrapper>
            {selectedKeys?.length !== 0 ? (
              <div className="domain-detail">
                <DetailDomainForm
                  loading={loadingUpdateDomain}
                  disabled={isChangedForm}
                  form={detailDomainForm}
                  onFinish={handleSaveUpdatedDomain}
                  onChange={handleCheckChangedForm}
                />
              </div>
            ) : (
              <div className="domain-detail">
                <div className="domain-tree-empty">
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={<span>{t("common:common.no_data")}</span>}
                  />
                </div>
              </div>
            )}
          </ElementWrapper>
        </Col>
      </Row>
      {/* Modal create new domain */}
      <CreateDomainModal
        loading={loadingCreateDomain}
        visible={visible}
        form={createDomainForm}
        onCancel={handleCancelCreateDomainModal}
        onFinish={handleCreateDomain}
      />
    </Wrapper>
  );
};

export default DomainManagement;
