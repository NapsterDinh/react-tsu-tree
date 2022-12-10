import { CloseOutlined } from "@ant-design/icons";
import CustomRCTree from "@components/CustomRCTree/CustomRCTree";
import { WrapperRCTree } from "@components/CustomRCTree/RCTree.Styled";
import { TreeData } from "@hooks/TreeHooks/useTreeActionAPI";
import usePrevious from "@hooks/usePreviouseState";
import {
  deepCopy,
  loop,
  loopAllChildren,
  loopAllChildrenFindIdMatch,
} from "@utils/helpersUtils";
import {
  showErrorNotification,
  showInfoNotification,
} from "@utils/notificationUtils";
import { expandedKeysWithLevel, generateList } from "@utils/treeUtils";
import { Button, Modal, Switch } from "antd";
// import { default as RCTree } from "rc-tree";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ClonedViewpointTreeNode from "./ClonedViewpointTreeNode/ClonedViewpointTreeNode";
import { Wrapper } from "./ClonedViewpointTreeStyle";
type TreeComponentProps = {
  dataObjectTree: TreeData;
  setDataObjectTree: (__any, newChidlren?) => void;
  handleDeleteNodeAPI: (_any, _isDeleteAllChildren) => Promise<boolean>;
  handleDeleteListNodeAPI: (_ids: React.Key[]) => Promise<boolean>;
  handleDragDropAPI: (
    _dragParentKey: React.Key,
    _targetKey: React.Key,
    _dropParentKey: React.Key,
    _previousNodeAfterDropKey: React.Key
  ) => Promise<boolean>;
  handleSaveNodeAPI: (_key: React.Key, _content: string) => Promise<boolean>;
  handleAddChildAPI: (_any, _string) => Promise<React.Key>;
  handleChangeDisabled: (
    _ids: React.Key[],
    _isLocked: boolean
  ) => Promise<boolean>;
  selectedNode: any;
  setSelectedNode: (_any) => void;
  levelShow: number;
  defaultNewTreeNodeLeaf: any;
  ref: any;
  checkOwner: boolean;
  hintTextList: string[];
  loadMore: () => void;
  loadLess: () => void;
  searchText: string;
  onSearchTree: (_newEntity: TreeData) => void;
};

const ClonedViewpointTree: React.FC<TreeComponentProps> = React.forwardRef(
  (props, ref) => {
    const {
      dataObjectTree,
      setDataObjectTree,
      handleDeleteNodeAPI,
      handleDeleteListNodeAPI,
      handleDragDropAPI,
      handleSaveNodeAPI,
      setSelectedNode,
      handleAddChildAPI,
      handleChangeDisabled,
      selectedNode,
      levelShow,
      defaultNewTreeNodeLeaf,
      checkOwner,
      hintTextList,
      searchText,
      loadMore,
      loadLess,
      onSearchTree,
    } = props;
    const { t } = useTranslation(["common", "responseMessage"]);
    const [error, setError] = useState<string>("");
    const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
    const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
    const [nodeEditing, setNodeEditing] = useState<TreeData>(null);
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [checkedList, setCheckedList] = useState<React.Key[]>([]);
    const [checkAll, setCheckAll] = useState(false);

    const prevNodeEditing = usePrevious(
      typeof nodeEditing?.key === "number" ? nodeEditing : null
    );

    const checkFakeNode = React.useCallback((node) => {
      return typeof node.key === "number";
    }, []);

    const handleChangeNodeEditing = React.useCallback((newNode) => {
      setError("");
      setNodeEditing(newNode);
    }, []);

    const handleSelect = React.useCallback((selectedKeys: React.Key[], e) => {
      setSelectedKeys(selectedKeys);
      setSelectedNode(e ? e.node : null);
    }, []);

    const handleExpand = React.useCallback((newExpandedKeys: React.Key[]) => {
      setExpandedKeys(newExpandedKeys);
      setAutoExpandParent(false);
    }, []);

    const handleChangeLevelShow = React.useCallback(
      (value) => {
        //-1: show full
        const updatedData = [];
        const clonedData = deepCopy(dataObjectTree?.children ?? []);
        if (value == -1) {
          expandedKeysWithLevel(clonedData, Infinity, updatedData);
        } else {
          expandedKeysWithLevel(clonedData, value, updatedData);
        }
        setExpandedKeys(updatedData);
      },
      [dataObjectTree?.children]
    );

    const onChangeCheckboxNode = React.useCallback(
      (checkedKeys: any, e) => {
        const flattenedDataNode = [];
        generateList(deepCopy(dataObjectTree.children), flattenedDataNode);
        const newCheckedKeys = checkedKeys.filter((t) => typeof t === "string");
        const newFlattenedDataNode = flattenedDataNode.filter(
          (t) => typeof t.key === "string"
        );
        setCheckedList(newCheckedKeys);
        setCheckAll(newCheckedKeys.length === newFlattenedDataNode.length);
      },
      [dataObjectTree?.children]
    );

    const onCheckAllChange = React.useCallback(
      (e) => {
        const flattenedDataNode = [];
        generateList(deepCopy(dataObjectTree.children), flattenedDataNode);
        setCheckedList(
          e
            ? flattenedDataNode
                .map((item) => item.key)
                .filter((t) => typeof t === "string")
            : []
        );
        setCheckAll(e);
      },
      [dataObjectTree?.children]
    );

    const handleDropNode = React.useCallback(
      async (info) => {
        const cloneChildren = deepCopy(dataObjectTree.children);
        if (nodeEditing) {
          return;
        }
        setSelectedKeys([]);
        setSelectedNode(null);
        const typeDragNode = info.dragNode.type;
        const typeDropNode = info.node.type;
        if (typeDragNode === typeDropNode) {
          const dropKey = info.node.key;
          const dragKey = info.dragNode.key;
          const dropPos = info.node.pos.split("-");
          const dropPosition =
            info.dropPosition - Number(dropPos[dropPos.length - 1]);

          const data = deepCopy(dataObjectTree.children); // Find dragObject

          let dragObj;
          loop(data, dragKey, (item, index, arr) => {
            dragObj = item;
            arr.splice(index, 1);
          });

          if (!info.dropToGap) {
            // Drop on the content
            let newDropParentKey = info.dragNode.parentKey;
            loop(data, dropKey, async (item) => {
              item.children = item.children || [];
              newDropParentKey = dropKey;
              item.children.unshift({
                ...dragObj,
                parentKey: dropKey,
              });
            });
            setDataObjectTree({
              ...dataObjectTree,
              children: data,
              detail: {
                ...dataObjectTree.detail,
                updateAt: Date.now(),
              },
              updatedAt: Date.now(),
            });
            try {
              await handleDragDropAPI(
                info.dragNode.parentKey,
                dragKey,
                newDropParentKey,
                null
              );
            } catch (error) {
              setDataObjectTree({
                ...dataObjectTree,
                children: cloneChildren,
              });
              if (error?.code) {
                showErrorNotification(t(`responseMessage:${error?.code}`));
              }
            }
          } else if (
            (info.node.children || []).length > 0 &&
            info.node.expanded &&
            dropPosition === 1
          ) {
            loop(data, dropKey, async (item) => {
              item.children = item.children || [];
              for (let index = 0; index < item.children.length; index++) {
                const element = item.children[index];
                if (element?.parentKey !== dragObj?.parentKey) {
                  dragObj.parentKey = element?.parentKey;
                  break;
                }
              }
              item.children.unshift(dragObj);
            });
            setDataObjectTree({
              ...dataObjectTree,
              children: data,
              detail: {
                ...dataObjectTree.detail,
                updateAt: Date.now(),
              },
              updatedAt: Date.now(),
            });
            try {
              await handleDragDropAPI(
                info.dragNode.parentKey,
                dragKey,
                info.node.parentKey,
                dropKey
              );
            } catch (error) {
              setDataObjectTree({
                ...dataObjectTree,
                children: cloneChildren,
              });
              if (error?.code) {
                showErrorNotification(t(`responseMessage:${error?.code}`));
              }
            }
          } else {
            let ar = [];
            let i;
            let dropParentKey = info.dragNode.parentKey ?? null;
            loop(data, dropKey, (_item, index, arr) => {
              ar = arr;
              i = index;
            });
            for (let index = 0; index < ar.length; index++) {
              const element = ar[index];
              if (element?.parentKey !== dragObj?.parentKey) {
                dragObj.parentKey = element?.parentKey;
                dropParentKey = element?.parentKey;
                break;
              }
            }
            let previousNodeAfterDropKey = ar[i].key;
            if (dropPosition === -1) {
              previousNodeAfterDropKey = null;
              ar.splice(i, 0, dragObj);
            } else {
              previousNodeAfterDropKey = ar[i].key;
              ar.splice(i + 1, 0, dragObj);
            }
            setDataObjectTree({
              ...dataObjectTree,
              children: data,
              detail: {
                ...dataObjectTree.detail,
                updateAt: Date.now(),
              },
              updatedAt: Date.now(),
            });
            try {
              await handleDragDropAPI(
                info.dragNode.parentKey,
                info.dragNode.key,
                dropParentKey,
                previousNodeAfterDropKey
              );
            } catch (error) {
              setDataObjectTree({
                ...dataObjectTree,
                children: cloneChildren,
              });
              if (error?.code) {
                showErrorNotification(t(`responseMessage:${error?.code}`));
              }
            }
          }
        } else {
          showErrorNotification(
            t("common:detail_viewpoint_collection.can_not_drag")
          );
        }
      },
      [nodeEditing, dataObjectTree?.children]
    );

    const onChangeLockedByArrayId = React.useCallback(
      async (isLocked = true) => {
        const newObjectTreeChildren = deepCopy(dataObjectTree.children);
        const isSuccess = await handleChangeDisabled(checkedList, isLocked);
        if (!isSuccess) {
          setDataObjectTree({
            ...dataObjectTree,
            children: newObjectTreeChildren,
          });
          return;
        }
        loopAllChildrenFindIdMatch(
          newObjectTreeChildren,
          checkedList,
          (item, index, arr) => {
            arr.splice(index, 1, {
              ...item,
              isLocked: isLocked,
            });
          }
        );
        setDataObjectTree({
          ...dataObjectTree,
          children: newObjectTreeChildren,
          detail: {
            ...dataObjectTree.detail,
            updateAt: Date.now(),
          },
          updatedAt: Date.now(),
        });
        setCheckedList([]);
        setCheckAll(false);
      },
      [checkedList, dataObjectTree?.children]
    );

    const checkHasLockedViewpointInObjectByListId = React.useCallback(
      (listKeyNeedToCheck?: React.Key[]) => {
        const clonedChildren = deepCopy(dataObjectTree.children);
        if (!listKeyNeedToCheck) {
          listKeyNeedToCheck = checkedList;
        }

        let isHasLockedVP = false;
        loopAllChildren(clonedChildren, (item) => {
          for (let index = 0; index < listKeyNeedToCheck.length; index++) {
            const element = listKeyNeedToCheck[index];
            if (element === item.key) {
              if (item.isLocked) {
                isHasLockedVP = true;
                return;
              }
              break;
            }
          }
        });
        return isHasLockedVP;
      },
      [dataObjectTree?.children]
    );

    const checkHasLockedViewpointInObject = React.useCallback(
      (object: TreeData) => {
        const clonedChildren = deepCopy(object.children);

        let isHasLockedVP = false;
        loopAllChildren(clonedChildren, (item) => {
          if (item.isLocked) {
            isHasLockedVP = true;
            return;
          }
        });
        return isHasLockedVP;
      },
      []
    );

    const onDeleteByArrayId = React.useCallback(async () => {
      const newObjectTreeChildren = deepCopy(dataObjectTree.children);
      const isSuccess = await handleDeleteListNodeAPI(checkedList);
      if (!isSuccess) {
        setDataObjectTree({
          ...dataObjectTree,
          children: newObjectTreeChildren,
        });
        return;
      }
      loopAllChildrenFindIdMatch(
        newObjectTreeChildren,
        deepCopy(checkedList),
        (item, index, arr) => {
          arr.splice(index, 1);
        }
      );
      setDataObjectTree({
        ...dataObjectTree,
        children: newObjectTreeChildren,
        detail: {
          ...dataObjectTree.detail,
          updateAt: Date.now(),
        },
        updatedAt: Date.now(),
      });
      setCheckedList([]);
      setCheckAll(false);
      Modal.destroyAll();
    }, [checkedList, dataObjectTree?.children]);

    const onChangeLocked = React.useCallback(
      async (node: TreeData, isLocked = true) => {
        const data = deepCopy(dataObjectTree.children);
        const newFlattenData = [];
        generateList(node.children, newFlattenData);
        newFlattenData.push(node);
        const isSuccess = await handleChangeDisabled(
          newFlattenData.map((item) => item.key),
          isLocked
        );
        if (!isSuccess) {
          setDataObjectTree({
            ...dataObjectTree,
            children: data,
          });
          return;
        }

        loop(data, node.key, (item, index, arr) => {
          const clonedChildren = deepCopy(item.children);
          if (clonedChildren) {
            loopAllChildren(clonedChildren, (item1, index1, arr1) => {
              arr1.splice(index1, 1, {
                ...item1,
                isLocked: isLocked,
              });
            });
          }
          arr.splice(index, 1, {
            ...item,
            children: clonedChildren,
            isLocked: isLocked,
          });
          return;
        });
        setDataObjectTree({
          ...dataObjectTree,
          children: data,
          detail: {
            ...dataObjectTree.detail,
            updateAt: Date.now(),
          },
          updatedAt: Date.now(),
        });
        handleChangeNodeEditing(null);
      },
      [dataObjectTree?.children]
    );

    const onDelete = React.useCallback(
      async (node, isDeleteAllChildren = false) => {
        const previousData = deepCopy(dataObjectTree);

        let temp = deepCopy(dataObjectTree?.children);
        if (typeof node.key === "string") {
          const isSuccess = await handleDeleteNodeAPI(
            node,
            isDeleteAllChildren
          );
          if (!isSuccess) {
            setDataObjectTree(previousData);
            return;
          }
        }

        if (isDeleteAllChildren) {
          //delete all children
          deleteNode(node?.key, temp);
        } else {
          //keep
          if (!node?.parentKey) {
            //first children in dataTreeObject
            let targetIndex = -1;
            const firstArr = [];
            for (let index = 0; index < temp.length; index++) {
              const element = temp[index];
              if (element.key === node.key) {
                targetIndex = index;
                temp.splice(index, 1);
                break;
              }
              firstArr.push(element);
            }
            const lastArr = temp.slice(targetIndex);
            const clonedNodeChildren = deepCopy(node.children);
            for (let index = 0; index < clonedNodeChildren.length; index++) {
              const element = clonedNodeChildren[index];
              element.parentKey = null;
            }

            temp = firstArr.concat(clonedNodeChildren, lastArr);
          } else {
            //loop to find children includes node
            loop(temp, node?.parentKey, (item, index, arr) => {
              let elementNeedDelete = null;
              const tempChildren = deepCopy(item.children);
              const firstArr = [];
              let indexNodeDelete = -1;
              for (let i = 0; i < tempChildren.length; i++) {
                const element = tempChildren[i];
                if (element.key === node.key) {
                  elementNeedDelete = element;
                  indexNodeDelete = i;
                  tempChildren.splice(i, 1);
                  break;
                }
                firstArr.push(element);
              }

              const lastArr = tempChildren.slice(indexNodeDelete);

              const clonedNodeChildren = deepCopy(elementNeedDelete.children);
              for (let index = 0; index < clonedNodeChildren.length; index++) {
                const element = clonedNodeChildren[index];
                element.parentKey = node.parentKey;
              }

              arr.splice(index, 1, {
                ...item,
                children: firstArr.concat(clonedNodeChildren, lastArr),
              });

              return;
            });
          }
        }
        setDataObjectTree({
          ...dataObjectTree,
          children: temp,
          detail: {
            ...dataObjectTree.detail,
            updateAt: Date.now(),
          },
          updatedAt: Date.now(),
        });
      },
      [dataObjectTree?.children]
    );

    const deleteNode = React.useCallback((key, data) => {
      loop(data, key, (item, index, arr) => {
        arr.splice(index, 1);
        return;
      });
    }, []);

    let isHandling = null;

    const onSave = React.useCallback(
      async ({
        node,
        isAddNewChildSameLevelAfterSave = false,
        isSaveFormData = false,
        newContent = "",
      }) => {
        const previousData = deepCopy(dataObjectTree);
        const result = deepCopy(previousData.children);

        if (!isHandling) {
          if (checkFakeNode(node)) {
            //add new child
            isHandling = handleAddChildAPI(node, newContent.trim());
          } else {
            //save content node
            isHandling = handleSaveNodeAPI(node, newContent);
          }
        }

        if (checkFakeNode(node)) {
          const newKey: React.Key = await isHandling;
          if (newKey) {
            saveNode({
              data: result,
              key: node.key,
              content: newContent.trim(),
              newKey: newKey,
            });
          } else {
            onDelete(node);
            return false;
          }
        } else {
          const isSuccess = await isHandling;
          if (isSuccess) {
            saveNode({
              data: result,
              key: node.key,
              content: newContent,
              newKey: null,
              newViewpointDetail: isSaveFormData ? node.viewDetail : null,
            });
          } else {
            setDataObjectTree(previousData);
            return false;
          }
        }

        if (isAddNewChildSameLevelAfterSave) {
          let findNode = null;
          loop(dataObjectTree.children, node?.parentKey, (item) => {
            findNode = deepCopy(item);
          });
          onAdd(
            findNode,
            deepCopy({
              ...dataObjectTree,
              children: result,
            })
          );
          isHandling = null;
          return true;
        }
        selectedNode && handleSelect([], null);

        setDataObjectTree({
          ...dataObjectTree,
          children: result,
          detail: {
            ...dataObjectTree.detail,
            updateAt: Date.now(),
          },
        });

        handleChangeNodeEditing(null);
        setSelectedNode(null);
        isHandling = null;
        return true;
      },
      [dataObjectTree?.children, searchText]
    );

    const saveNode = React.useCallback(
      ({ data, key, content, newKey, newViewpointDetail = null }) => {
        loop(data, key, (item, index, arr) => {
          const newSavedNode = {
            ...item,
            title: newViewpointDetail?.name ?? content,
            viewDetail: newViewpointDetail ?? {
              ...item.viewDetail,
              name: content,
            },
            key: newKey ?? key,
          };

          arr.splice(index, 1, newSavedNode);
        });
      },
      []
    );

    const onAdd = React.useCallback(
      (node: TreeData, dataTreeAfterSave?: TreeData) => {
        if (
          nodeEditing?.parentKey === node?.key &&
          !dataTreeAfterSave &&
          prevNodeEditing
        ) {
          return;
        }
        let clonedChildren = deepCopy(dataObjectTree?.children);

        if (dataTreeAfterSave) {
          clonedChildren = dataTreeAfterSave.children;
          // dispatch(treeActions.setTreeSuccess(dataTreeAfterSave.children));
        } else {
          const newExpandedKeys = [...expandedKeys];
          newExpandedKeys.push(node?.key);
          handleExpand(newExpandedKeys);
        }

        addNode(node, clonedChildren);

        setDataObjectTree({
          ...dataObjectTree,
          children: clonedChildren,
        });
      },
      [
        nodeEditing?.parentKey,
        prevNodeEditing,
        dataObjectTree?.children,
        expandedKeys,
      ]
    );

    const addNode = React.useCallback((node, data) => {
      if (!node?.key) {
        //add to big children (create new biggest node)
        const randomKey = Math.random();
        const newNode = {
          ...defaultNewTreeNodeLeaf,
          viewDetail: {
            ...defaultNewTreeNodeLeaf?.viewDetail,
            language: localStorage.getItem("dataLanguage"),
          },
          key: randomKey,
          parentKey: null,
          title: "",
          children: [],
          path: randomKey.toString(),
        };
        data.push(newNode);
        handleChangeNodeEditing(newNode);
      } else {
        loop(data, node?.key, (item) => {
          const randomKey = Math.random();
          const newNode = {
            viewDetail: {
              ...node?.viewDetail,
              language: item?.viewDetail.language,
              name: "",
            },
            key: randomKey,
            parentKey: node?.key,
            title: "",
            children: [],
            isLocked: false,
          };
          if (!item.children) {
            item.children = [];
          }
          item.children.push(newNode);
          handleChangeNodeEditing(newNode);
          return;
        });
      }
    }, []);

    React.useEffect(() => {
      handleChangeLevelShow(levelShow);
    }, [levelShow]);

    React.useImperativeHandle(ref, () => ({
      createFirstNode() {
        onAdd(null);
      },
      saveNode(node) {
        onSave({
          node: node,
          isAddNewChildSameLevelAfterSave: false,
          isSaveFormData: true,
          newContent: node?.viewDetail?.name,
        });
      },
      lockUnlockAllViewpoint(node, isLocked) {
        onChangeLocked(node, isLocked);
      },
    }));

    const confirmLockMany = () => {
      Modal.confirm({
        width: 600,
        title: (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {t("common:detail_viewpoint_collection.modal_lock_many")}
            <CloseOutlined onClick={() => Modal.destroyAll()} />
          </div>
        ),
        content: t("common:detail_viewpoint_collection.modal_lock_many"),
        cancelText: t("common:common.cancel"),
        okText: t("common:common.ok"),
        onOk: () => {
          onChangeLockedByArrayId(true);
        },
      });
    };

    const confirmUnLockMany = () => {
      Modal.confirm({
        width: 600,
        title: (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {t("common:detail_viewpoint_collection.unlock")}
            <CloseOutlined onClick={() => Modal.destroyAll()} />
          </div>
        ),
        content: t("common:detail_viewpoint_collection.modal_unlock_many"),
        cancelText: t("common:common.cancel"),
        okText: t("common:common.ok"),
        onOk: async () => {
          try {
            await onChangeLockedByArrayId(false);
          } catch (error) {}
        },
      });
    };

    const confirmDeleteManyByArrayId = () => {
      if (checkHasLockedViewpointInObjectByListId(checkedList)) {
        showInfoNotification(
          t("common:detail_viewpoint_collection.has_locked_viewpoint")
        );
        return;
      }
      Modal.confirm({
        width: 600,
        title: (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {t("common:detail_viewpoint_collection.modal_delete")}
            <CloseOutlined onClick={() => Modal.destroyAll()} />
          </div>
        ),
        content: t("common:detail_viewpoint_collection.content_modal_delete"),
        cancelText: t("common:common.cancel"),
        okText: t("common:common.ok"),
        onOk: async () => {
          try {
            await onDeleteByArrayId();
          } catch (error) {}
        },
      });
    };

    const handleClickInsertNew = () => {
      if (nodeEditing && nodeEditing?.parentKey === null) {
        return;
      }
      onAdd(null);
    };
    return (
      <Wrapper id="tree-data">
        {checkOwner && (
          <div className="check-all-container">
            {dataObjectTree?.children?.length > 0 &&
              typeof dataObjectTree?.children[0]?.key === "string" && (
                <Switch
                  className="switch-select-all"
                  checkedChildren={t("common:common.unselect_all")}
                  unCheckedChildren={t("common:common.select_all")}
                  onChange={onCheckAllChange}
                  checked={checkAll}
                />
              )}

            <div className="lock-unlock-container">
              {checkedList.length > 0 && (
                <>
                  <Button type="primary" onClick={confirmLockMany}>
                    {t("common:common.lock")}
                  </Button>
                  <Button type="primary" onClick={confirmUnLockMany}>
                    {t("common:common.unlock")}
                  </Button>
                  <Button type="primary" onClick={confirmDeleteManyByArrayId}>
                    {t("common:common.delete")}
                  </Button>
                </>
              )}
              {!checkAll &&
                dataObjectTree?.children?.length > 0 &&
                typeof dataObjectTree?.children[0]?.key === "string" && (
                  <Button type="primary" onClick={handleClickInsertNew}>
                    {t("common:common.insert_new")}
                  </Button>
                )}
            </div>
          </div>
        )}

        <WrapperRCTree>
          <CustomRCTree
            checkable={checkOwner}
            checkedKeys={checkedList}
            selectable
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            onExpand={handleExpand}
            selectedKeys={selectedKeys}
            onDragStart={() => {
              handleChangeNodeEditing(null);
              setSelectedNode(null);
            }}
            draggable={checkOwner}
            onSelect={handleSelect}
            treeData={dataObjectTree?.children}
            onDrop={handleDropNode}
            onCheck={onChangeCheckboxNode}
            defaultExpandAll
            height={740}
            itemHeight={500}
            showIcon={false}
            icon={null}
            titleRender={(node) => (
              <ClonedViewpointTreeNode
                checkFakeNode={checkFakeNode}
                objectDataTree={dataObjectTree}
                node={node}
                onDelete={onDelete}
                onAdd={onAdd}
                onSave={onSave}
                nodeEditing={nodeEditing}
                setNodeEditing={handleChangeNodeEditing}
                error={error}
                setError={setError}
                checkOwner={checkOwner}
                setLockedViewpoint={onChangeLocked}
                checkHasLockedViewpointInObject={
                  checkHasLockedViewpointInObject
                }
                hintTextList={hintTextList}
              />
            )}
          />
        </WrapperRCTree>

        {/* {dataObjectTree?.children?.length === treeFullData?.length && (
          <Button
            icon={<PlusCircleOutlined />}
            onClick={() => onAdd(null)}
            style={{
              marginTop: "0.5rem",
              marginLeft: "0.5rem",
            }}
          >
            {t("common:common.add")}
          </Button>
        )}
        {!isSearch && (
          <div className="load-more-container">
            {dataObjectTree?.children?.length < treeFullData?.length && (
              <Button onClick={loadMore}>{t("common:common.load_more")}</Button>
            )}
            {dataObjectTree?.children?.length > PAGE_SIZE_TREE && (
              <Button onClick={loadLess}>{t("common:common.show_less")}</Button>
            )}
          </div>
        )} */}
      </Wrapper>
    );
  }
);

export default React.memo(ClonedViewpointTree);
