import { CloseOutlined } from "@ant-design/icons";
import CustomRCTree from "@components/CustomRCTree/CustomRCTree";
import { WrapperRCTree } from "@components/CustomRCTree/RCTree.Styled";
import usePrevious from "@hooks/usePreviouseState";
import { DEFAULT_VIEWPOINT_NODE_LEAF, GUID_EMPTY } from "@utils/constants";
import {
  deepCopy,
  loop,
  loopAllChildren,
  loopAllChildrenFindIdMatch,
  loopAllChildrenParamsObject,
} from "@utils/helpersUtils";
import {
  showErrorNotification,
  showInfoNotification,
  showSuccessNotification,
} from "@utils/notificationUtils";
import { randomGUID12characters } from "@utils/stringUtils";
import { generateList, TreeData } from "@utils/treeUtils";
import { Button, Modal, Switch, Typography } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ElementWrapper } from "../../StagedChangeWrapper";
import { Wrapper } from "./TreeFrom.Style";
import TreeFromNode from "./TreeFromNode/TreeFromNode";

type TreeComponentProps = {
  dataObjectTree: TreeData;
  setDataObjectTree: (any) => void;
  selectedNode: any;
  setSelectedNode: (any) => void;
  ref: any;
  referenceArr: any[];
  setOpenModalDetail: (open: boolean) => void;
  hintTextList: string[];
  setLoading: (_loading: boolean) => void;
};

const ClonedViewpointTree: React.FC<TreeComponentProps> = React.forwardRef(
  (props, ref) => {
    const {
      dataObjectTree,
      setDataObjectTree,
      setSelectedNode,
      setOpenModalDetail,
      hintTextList,
      setLoading,
    } = props;
    const { t } = useTranslation(["common", "responseMessage"]);
    const [error, setError] = useState<string>("");
    const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
    const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
    const [nodeEditing, setNodeEditing] = useState<TreeData>(null);
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [checkedList, setCheckedList] = useState<React.Key[]>([]);
    const [checkAll, setCheckAll] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const prevNodeEditing = usePrevious(
      typeof nodeEditing?.key === "number" ? nodeEditing : null
    );

    const checkFakeNode = React.useCallback((node) => {
      return typeof node?.key === "number";
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
          }
          setDataObjectTree({
            ...dataObjectTree,
            children: data,
          });
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
        });
        setCheckedList([]);
        setCheckAll(false);
        if (isLocked) {
          showSuccessNotification(
            t("common:detail_viewpoint_collection.lock_viewpoint_successfully")
          );
        } else {
          showSuccessNotification(
            t(
              "common:detail_viewpoint_collection.unlock_viewpoint_successfully"
            )
          );
        }
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
      });
      setCheckedList([]);
      setCheckAll(false);
      Modal.destroyAll();
      showSuccessNotification(
        t("common:detail_viewpoint_collection.delete_successfully")
      );
    }, [checkedList, dataObjectTree?.children]);

    const onChangeLocked = React.useCallback(
      async (node: TreeData, isLocked = true) => {
        const data = deepCopy(dataObjectTree.children);
        const newFlattenData = [];
        generateList(node.children, newFlattenData);
        newFlattenData.push(node);

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
        });
        handleChangeNodeEditing(null);
        if (isLocked) {
          showSuccessNotification(
            t("common:detail_viewpoint_collection.lock_viewpoint_successfully")
          );
        } else {
          showSuccessNotification(
            t(
              "common:detail_viewpoint_collection.unlock_viewpoint_successfully"
            )
          );
        }
      },
      [dataObjectTree?.children]
    );

    const onDelete = React.useCallback(
      async (node, isDeleteAllChildren = false) => {
        const previousData = deepCopy(dataObjectTree);

        let temp = deepCopy(dataObjectTree?.children);

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

    const onSave = async ({
      node,
      isAddNewChildSameLevelAfterSave = false,
      isSaveFormData = false,
      newContent = "",
    }) => {
      const previousData = deepCopy(dataObjectTree);
      const result = deepCopy(previousData.children);
      if (checkFakeNode(node)) {
        //add new child
        saveNode({
          data: result,
          key: node.key,
          content: newContent.trim(),
          newKey: node.key.toString(),
        });
      } else {
        //save content node
        saveNode({
          data: result,
          key: node.key,
          content: newContent,
          newKey: null,
          newViewpointDetail: isSaveFormData ? node.viewDetail : null,
        });
      }

      handleSelect([], null);

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
        return;
      }

      handleChangeNodeEditing(null);

      setDataObjectTree({
        ...dataObjectTree,
        children: result,
      });
      showSuccessNotification(
        t("common:detail_viewpoint_collection.update_successfully")
      );
    };

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

    const addNode = (node, data) => {
      if (!node?.key) {
        //add to big children (create new biggest node)
        const randomKey = randomGUID12characters();
        const newNode = {
          ...DEFAULT_VIEWPOINT_NODE_LEAF,
          viewDetail: {
            ...DEFAULT_VIEWPOINT_NODE_LEAF?.viewDetail,
            language: localStorage.getItem("dataLanguage"),
          },
          key: randomKey,
          parentKey: null,
          title: "",
          children: [],
          path: randomKey.toString(),
          cloneViewPointId: GUID_EMPTY,
        };
        data.push(newNode);
        handleChangeNodeEditing(newNode);
      } else {
        loop(data, node?.key, (item) => {
          const randomKey = randomGUID12characters();
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
            cloneViewPointId: GUID_EMPTY,
          };
          if (!item.children) {
            item.children = [];
          }
          item.children.push(newNode);
          handleChangeNodeEditing(newNode);
          return;
        });
      }
    };

    const generateNewKeyAnSaveCloneViewpointId = (object) => {
      loopAllChildren(dataObjectTree.children, (t) => {
        if (t.cloneViewPointId === object.cloneViewPointId) {
          object.cloneViewPointId = GUID_EMPTY;
          return;
        }
      });

      loopAllChildrenParamsObject(object, (item, index, obj) => {
        let isExist = false;
        loopAllChildren(dataObjectTree.children, (t) => {
          if (t.cloneViewPointId === item.key) {
            isExist = true;
            return;
          }
        });

        const newNode = {
          ...item,
          cloneViewPointId: isExist ? GUID_EMPTY : item.key,
          key: randomGUID12characters().toString(),
          parentKey: obj.key,
        };
        obj.children.splice(index, 1, newNode);
      });
    };

    const transferNode = (nodeNeedTransfer) => {
      setLoading(true);
      const data = deepCopy(dataObjectTree.children);
      handleChangeNodeEditing(null);
      let newNode = deepCopy(nodeNeedTransfer);

      if (!nodeNeedTransfer?.parentKey) {
        //add to big children (create new biggest node)
        const randomKey = randomGUID12characters();
        newNode = {
          ...newNode,
          key: randomKey.toString(),
          parentKey: null,
          cloneViewPointId: nodeNeedTransfer.key,
        };
        generateNewKeyAnSaveCloneViewpointId(newNode);

        data.push(newNode);
      } else {
        let hasParentItem = false;
        loopAllChildren(data, (item) => {
          if (item.cloneViewPointId === nodeNeedTransfer?.parentKey) {
            hasParentItem = true;
            const randomKey = randomGUID12characters();
            newNode = {
              ...newNode,
              key: randomKey.toString(),
              parentKey: item.key,
              cloneViewPointId: nodeNeedTransfer.key,
            };
            generateNewKeyAnSaveCloneViewpointId(newNode);
            if (!item.children) {
              item.children = [];
            }
            item.children.push(newNode);
            const newExpandedKeys = [...expandedKeys];
            newExpandedKeys.push(nodeNeedTransfer?.parentKey);
            handleExpand(newExpandedKeys);
            return;
          }
        });
        if (!hasParentItem) {
          //add to big children (create new biggest node)
          const randomKey = randomGUID12characters();
          newNode = {
            ...nodeNeedTransfer,
            key: randomKey.toString(),
            parentKey: null,
            cloneViewPointId: nodeNeedTransfer.key,
          };
          generateNewKeyAnSaveCloneViewpointId(newNode);
          data.push(newNode);
        }
      }
      setDataObjectTree({
        ...dataObjectTree,
        children: data,
      });
      setLoading(false);
      showSuccessNotification(t("common:detail_request.transfer_successfully"));
    };
    console.log(dataObjectTree.children);

    const overrideNode = (nodeOverride) => {
      const data = deepCopy(dataObjectTree.children);
      loopAllChildren(data, (item, index, arr) => {
        if (item.cloneViewPointId === nodeOverride.key) {
          const newNode = {
            ...item,
            title: nodeOverride.title,
            viewDetail: {
              ...item.viewDetail,
              name: nodeOverride.viewDetail.name,
              confirmation: nodeOverride.viewDetail.confirmation,
              example: nodeOverride.viewDetail.example,
              note: nodeOverride.viewDetail.note,
            },
          };
          arr.splice(index, 1, newNode);
        }
      });
      setDataObjectTree({
        ...dataObjectTree,
        children: data,
      });
      showSuccessNotification(t("common:detail_request.override_successfully"));
    };

    React.useEffect(() => {
      setSearchValue(searchValue);
      setAutoExpandParent(true);
    }, [searchValue]);

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
      closeCurrentInput() {
        handleChangeNodeEditing(null);
      },
      transferNode(node) {
        transferNode(node);
      },
      overrideNode(node) {
        overrideNode(node);
      },
      handleSetSelectedKey(key) {
        setSelectedKeys(key ? [key] : []);
      },
    }));

    return (
      <ElementWrapper>
        <Wrapper>
          <Typography.Title level={5} className="color-text">
            {t("common:common.from")}
            {": "}
            {dataObjectTree?.detail?.name ??
              t(
                "common:detail_viewpoint_collection.no_viewpoint_collection_name"
              )}
          </Typography.Title>
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
                  <Button
                    type="primary"
                    onClick={() => {
                      handleChangeNodeEditing(null);
                      Modal.confirm({
                        width: 600,
                        title: (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            {t(
                              "common:detail_viewpoint_collection.modal_lock_many"
                            )}
                            <CloseOutlined onClick={() => Modal.destroyAll()} />
                          </div>
                        ),
                        content: t(
                          "common:detail_viewpoint_collection.modal_lock_many"
                        ),
                        cancelText: t("common:common.cancel"),
                        okText: t("common:common.ok"),
                        onOk: () => {
                          onChangeLockedByArrayId(true);
                        },
                      });
                    }}
                  >
                    {t("common:common.lock")}
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      handleChangeNodeEditing(null);
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
                        content: t(
                          "common:detail_viewpoint_collection.modal_unlock_many"
                        ),
                        cancelText: t("common:common.cancel"),
                        okText: t("common:common.ok"),
                        onOk: () => {
                          onChangeLockedByArrayId(false);
                        },
                      });
                    }}
                  >
                    {t("common:common.unlock")}
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      handleChangeNodeEditing(null);
                      if (
                        checkHasLockedViewpointInObjectByListId(checkedList)
                      ) {
                        showInfoNotification(
                          t(
                            "common:detail_viewpoint_collection.has_locked_viewpoint"
                          )
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
                            {t(
                              "common:detail_viewpoint_collection.modal_delete"
                            )}
                            <CloseOutlined onClick={() => Modal.destroyAll()} />
                          </div>
                        ),
                        content: t(
                          "common:detail_viewpoint_collection.content_modal_delete"
                        ),
                        cancelText: t("common:common.cancel"),
                        okText: t("common:common.ok"),
                        onOk: () => {
                          onDeleteByArrayId();
                        },
                      });
                    }}
                  >
                    {t("common:common.delete")}
                  </Button>
                </>
              )}
            </div>
          </div>

          <WrapperRCTree>
            <CustomRCTree
              checkable
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
              draggable
              onSelect={handleSelect}
              treeData={dataObjectTree?.children}
              onDrop={handleDropNode}
              onCheck={onChangeCheckboxNode}
              defaultExpandAll
              height={740}
              itemHeight={500}
              showIcon={false}
              icon={null}
              titleRender={(node: any) => (
                <TreeFromNode
                  setOpenModalDetail={setOpenModalDetail}
                  setSelectedNode={setSelectedNode}
                  objectDataTree={dataObjectTree}
                  node={node}
                  onDelete={onDelete}
                  onAdd={onAdd}
                  onSave={onSave}
                  nodeEditing={nodeEditing}
                  setNodeEditing={handleChangeNodeEditing}
                  error={error}
                  setError={setError}
                  checkFakeNode={checkFakeNode}
                  setLockedViewpoint={onChangeLocked}
                  checkHasLockedViewpointInObject={
                    checkHasLockedViewpointInObject
                  }
                  hintTextList={hintTextList}
                />
              )}
            />
          </WrapperRCTree>
        </Wrapper>
      </ElementWrapper>
    );
  }
);

export default React.memo(ClonedViewpointTree);
