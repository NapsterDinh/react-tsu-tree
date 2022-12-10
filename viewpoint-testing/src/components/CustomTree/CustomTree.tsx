import {
  ExclamationCircleOutlined,
  PlusCircleOutlined
} from "@ant-design/icons";
import CustomRCTree from "@components/CustomRCTree/CustomRCTree";
import { DataTreeNode, ResponseDomain } from "@models/type";
import { domainActions } from "@redux/slices";
import {
  showErrorNotification,
  showSuccessNotification
} from "@utils/notificationUtils";
import { getListIdChildrenTreeNode } from "@utils/treeUtils";
import { Button, Modal } from "antd";
import type { EventDataNode } from "antd/es/tree";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import CustomTreeNode from "./CustomTreeNode/CustomTreeNode";
import { Wrapper } from "./CustomTreeStyle";

interface ITreeInfo {
  event: "select";
  selected: boolean;
  node: EventDataNode<DataTreeNode>;
  selectedNodes: DataTreeNode[];
  nativeEvent: MouseEvent;
}

interface IProps {
  searchValue: string;
  flattenedData: DataTreeNode[];
  dataTree: DataTreeNode[] & DataTreeNode[];
  expandedKeys?: React.Key[];
  nodeEditing: DataTreeNode;
  autoExpandParent?: boolean;
  setDataTree: React.Dispatch<
    React.SetStateAction<DataTreeNode[] & DataTreeNode[]>
  >;
  setFlattenedData: React.Dispatch<React.SetStateAction<DataTreeNode[]>>;
  callDeleteNodeApi?: (
    _treeNodeId: React.Key[]
  ) => Promise<ResponseDomain | any>;
  onCreate: () => void;
  onAddChildNode: (
    _node: DataTreeNode,
    _newTitle: string
  ) => Promise<ResponseDomain | any>;
  onSelect?: (_treeNodeId: React.Key[], _info: ITreeInfo) => void;
  onExpand?: (_expandedKeys: React.Key[]) => void;
  onUpdate?: (_node: DataTreeNode, _name: string) => void;
  onDrag?: (
    _dragNode,
    _dropNode,
    _dropToGap,
    _dropPosition
  ) => Promise<ResponseDomain | any>;
  onUpdateNameInDetailForm?: (_content: string) => void;
  onResetDetailDomainForm?: () => void;
  setNodeEditing: React.Dispatch<any>;
}

const CustomTree = ({
  searchValue,
  flattenedData,
  dataTree,
  nodeEditing,
  expandedKeys,
  autoExpandParent,
  setDataTree,
  setNodeEditing,
  setFlattenedData,
  callDeleteNodeApi,
  onCreate,
  onAddChildNode,
  onSelect,
  onExpand,
  onUpdate,
  onDrag,
  onUpdateNameInDetailForm,
  onResetDetailDomainForm,
}: IProps) => {
  const { t } = useTranslation(["common"]);
  const dispatch = useDispatch();
  const [isSelectable, setIsSelectable] = useState<boolean>(true);

  const handleSelectNode = (treeNode: React.Key[], info: any) => {
    if (nodeEditing && typeof nodeEditing.key === "number") {
      const result = [...dataTree];
      deleteNode(nodeEditing?.key, result);
      setDataTree(result);
    }
    onSelect(treeNode, info);
  };

  const handleDropNode = async (info) => {
    try {
      const response: ResponseDomain = await onDrag(
        info.dragNode,
        info.node,
        info.dropToGap,
        info.dropPosition
      );
      if (response?.isSucceeded) {
        dispatch(domainActions.getDomain());
        showSuccessNotification(
          t("common:domain_management.update_successfully")
        );
      }
    } catch (error) {
      showErrorNotification(t("common:domain_management.update_failed"));
    }
  };

  const deleteNode = (key: React.Key, data: DataTreeNode[]) => {
    data.map((item: DataTreeNode, index: number) => {
      if (item.key === key) {
        if (data.length > 1 && index !== 0) {
          data[index - 1].next = data[index].next;
        }
        data.splice(index, 1);
        return;
      } else {
        if (item.children) {
          deleteNode(key, item.children);
        }
      }
    });
  };

  const saveNode = (
    key: React.Key,
    data: DataTreeNode[],
    content: string,
    newKey?: React.Key
  ) => {
    return data.map((item: DataTreeNode, index: number) => {
      if (item.key === key) {
        data.splice(index, 1, {
          ...item,
          title: content,
          key: newKey ?? key,
          prev: item.prev,
          next: item.next,
        } as DataTreeNode);
        data[index] = {
          ...item,
          title: content,
          key: newKey ?? key,
          prev: item.prev,
        };
        if (index !== 0) {
          data[index - 1].next = newKey ?? key;
        }
      }
      if (item.children) {
        saveNode(key, item.children, content, newKey);
      }
    });
  };

  const onAdd = (key: React.Key) => {
    const result = [...dataTree];
    addNode(key, result);
    setDataTree(result);
    const newExpandedKeys = [...expandedKeys];
    newExpandedKeys.push(key);
    onExpand(newExpandedKeys);
  };

  const addNode = (key: React.Key, data: DataTreeNode[]) => {
    data.map((item: DataTreeNode) => {
      if (item.key === key) {
        const randomKey = Math.random();
        const newNode: DataTreeNode = {
          title: "",
          key: randomKey,
          parentKey: key,
          description: "",
          isActive: true,
          index: 0,
          next: null,
        };
        if (!item.children || !item.children.length) {
          item.children = [];
          newNode.prev = null;
        } else {
          newNode.prev = item.children[item.children.length - 1].key;
          item.children[item.children.length - 1].next = randomKey;
        }
        item.children.push(newNode);
        setNodeEditing(newNode);
        confirm;
        return;
      }
      if (item.children) {
        addNode(key, item.children);
      }
    });
    return data;
  };

  const handleShowDeleteModal = (key: React.Key) => {
    Modal.confirm({
      title: t("common:domain_management.modal_delete"),
      icon: <ExclamationCircleOutlined />,
      content: t("common:domain_management.content_modal_delete"),
      okText: t("common:common.delete"),
      cancelText: t("common:common.cancel"),
      onOk: async () => {
        const listKey = [];
        const result: DataTreeNode[] = [...dataTree];
        if (nodeEditing) {
          deleteNode(nodeEditing?.key, result);
        }
        try {
          const listKeyChildrenTreeNode = getListIdChildrenTreeNode(
            listKey,
            result,
            key
          );
          const response: ResponseDomain = await callDeleteNodeApi(
            listKeyChildrenTreeNode
          );
          if (response.isSucceeded) {
            deleteNode(key, result);
            setFlattenedData(
              flattenedData.filter((item) => {
                return !listKeyChildrenTreeNode.includes(item.key);
              })
            );
            onResetDetailDomainForm();
            showSuccessNotification(
              t("common:domain_management.delete_successfully")
            );
          }
        } catch (error) {
          showErrorNotification(t("common:domain_management.delete_failed"));
        } finally {
          setDataTree(result);
          setNodeEditing(null);
        }
      },
    });
  };

  return (
    <Wrapper>
      <CustomRCTree
        draggable
        blockNode
        treeData={dataTree}
        selectable={isSelectable}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onExpand={onExpand}
        onSelect={handleSelectNode}
        onDrop={handleDropNode}
        titleRender={(node) => (
          <CustomTreeNode
            searchValue={searchValue}
            dataTree={dataTree}
            node={node}
            nodeEditing={nodeEditing}
            flattenedData={flattenedData}
            setDataTree={setDataTree}
            setFlattenedData={setFlattenedData}
            setIsSelectable={setIsSelectable}
            setNodeEditing={setNodeEditing}
            callAddChildNodeApi={onAddChildNode}
            onDelete={deleteNode}
            onUpdate={onUpdate}
            onSave={saveNode}
            onAdd={onAdd}
            onShowDeleteNodeModal={handleShowDeleteModal}
            onUpdateNameInDetailForm={onUpdateNameInDetailForm}
          />
        )}
      />
      <Button
        icon={<PlusCircleOutlined />}
        onClick={onCreate}
        style={{
          marginTop: "0.5rem",
          marginLeft: "0.5rem",
        }}
      >
        {t("common:common.add")}
      </Button>
    </Wrapper>
  );
};

export default CustomTree;
