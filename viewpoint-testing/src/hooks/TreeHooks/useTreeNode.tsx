// import usePrevious from "@hooks/usePreviouseState";
// import {
//   deepCopy,
//   generateList,
//   loop,
//   loopAllChildren,
//   loopAllChildrenFindIdMatch,
// } from "@utils/helpersUtils";
// import { showErrorNotification } from "@utils/notificationUtils";
// import { expandedKeysWithLevel, TreeData } from "@utils/treeUtils";
// import * as React from "react";
// import { useState } from "react";
// import { useTranslation } from "react-i18next";

// type TreeComponentProps = {
//   dataObjectTree: TreeData;
//   setDataObjectTree: (__any) => void;
//   handleDeleteNodeAPI: (_any, _isDeleteAllChildren) => Promise<boolean>;
//   handleDeleteListNodeAPI: (_ids: React.Key[]) => Promise<boolean>;
//   handleDragDropAPI: (
//     _dragParentKey: React.Key,
//     _targetKey: React.Key,
//     _dropParentKey: React.Key,
//     _previousNodeAfterDropKey: React.Key
//   ) => Promise<boolean>;
//   handleSaveNodeAPI: (_key: React.Key, _content: string) => Promise<boolean>;
//   handleAddChildAPI: (_any, _string) => Promise<React.Key>;
//   handleChangeDisabled: (
//     _ids: React.Key[],
//     _isLocked: boolean
//   ) => Promise<boolean>;
//   selectedNode: any;
//   setSelectedNode: (_any) => void;
//   searchValue: string;
//   setSearchValue: (_string) => void;
//   levelShow: number;
//   defaultNewTreeNodeLeaf: any;
//   ref: any;
//   checkOwner: boolean;
//   hintTextList: string[];
// };

// const useTreeNode: React.FC<TreeComponentProps> = React.forwardRef(
//   (props, ref) => {
//     const {
//       dataObjectTree,
//       setDataObjectTree,
//       handleDeleteNodeAPI,
//       handleDeleteListNodeAPI,
//       handleDragDropAPI,
//       handleSaveNodeAPI,
//       setSelectedNode,
//       handleAddChildAPI,
//       handleChangeDisabled,
//       searchValue,
//       setSearchValue,
//       levelShow,
//       defaultNewTreeNodeLeaf,
//       checkOwner,
//       hintTextList,
//     } = props;
//     const { t } = useTranslation(["common", "responseMessage"]);
//     const [error, setError] = useState<string>("");
//     const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
//     const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
//     const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
//     const [nodeEditing, setNodeEditing] = useState<TreeData>(null);
//     const [checkedList, setCheckedList] = useState<React.Key[]>([]);
//     const [checkAll, setCheckAll] = useState(false);

//     const prevNodeEditing = usePrevious(
//       typeof nodeEditing?.key === "number" ? nodeEditing : null
//     );

//     const checkFakeNode = (inputNode) => {
//       return typeof inputNode.key === "number";
//     };

//     const handleChangeNodeEditing = (newNode) => {
//       setError("");
//       setNodeEditing(newNode);
//     };

//     const handleSelect = (selectedKeys: React.Key[], e) => {
//       setSelectedKeys(selectedKeys);
//       setSelectedNode(e ? e.node : null);
//     };

//     const handleExpand = (newExpandedKeys: React.Key[]) => {
//       setExpandedKeys(newExpandedKeys);
//       setAutoExpandParent(false);
//     };

//     const handleChangeSearchInputSelectLevel = (value) => {
//       handleChangeNodeEditing(null);
//       //-1: show full
//       const updatedData = [];
//       const clonedData = deepCopy(dataObjectTree?.children ?? []);
//       if (value == -1) {
//         expandedKeysWithLevel(clonedData, Infinity, updatedData);
//       } else {
//         expandedKeysWithLevel(clonedData, value, updatedData);
//       }
//       setExpandedKeys(updatedData);
//     };

//     const onChangeCheckboxNode = (checkedKeys: React.Key[], e) => {
//       handleChangeNodeEditing(null);
//       const flattenedDataNode = [];
//       generateList(deepCopy(dataObjectTree.children), flattenedDataNode);
//       const newCheckedKeys = checkedKeys.filter((t) => typeof t === "string");
//       const newFlattenedDataNode = flattenedDataNode.filter(
//         (t) => typeof t.key === "string"
//       );
//       setCheckedList(newCheckedKeys);
//       setCheckAll(newCheckedKeys.length === newFlattenedDataNode.length);
//     };

//     const onCheckAllChange = (e) => {
//       handleChangeNodeEditing(null);
//       const flattenedDataNode = [];
//       generateList(deepCopy(dataObjectTree.children), flattenedDataNode);
//       setCheckedList(
//         e
//           ? flattenedDataNode
//               .map((item) => item.key)
//               .filter((t) => typeof t === "string")
//           : []
//       );
//       setCheckAll(e);
//     };

//     const handleDropNode = async (info) => {
//       const cloneChildren = deepCopy(dataObjectTree.children);
//       if (nodeEditing) {
//         return;
//       }
//       setSelectedKeys([]);
//       setSelectedNode(null);
//       const typeDragNode = info.dragNode.type;
//       const typeDropNode = info.node.type;
//       if (typeDragNode === typeDropNode) {
//         const dropKey = info.node.key;
//         const dragKey = info.dragNode.key;
//         const dropPos = info.node.pos.split("-");
//         const dropPosition =
//           info.dropPosition - Number(dropPos[dropPos.length - 1]);

//         const data = [...dataObjectTree.children]; // Find dragObject
//         let dragObj;
//         loop(data, dragKey, (item, index, arr) => {
//           arr.splice(index, 1);
//           dragObj = item;
//         });

//         if (!info.dropToGap) {
//           // Drop on the content
//           let newDropParentKey = info.dragNode.parentKey;
//           loop(data, dropKey, async (item) => {
//             item.children = item.children || [];
//             newDropParentKey = dropKey;
//             item.children.unshift({
//               ...dragObj,
//               parentKey: dropKey,
//             });
//           });
//           setDataObjectTree({
//             ...dataObjectTree,
//             children: data,
//             detail: {
//               ...dataObjectTree.detail,
//               updateAt: Date.now(),
//             },
//             updatedAt: Date.now(),
//           });
//           try {
//             await handleDragDropAPI(
//               info.dragNode.parentKey,
//               dragKey,
//               newDropParentKey,
//               null
//             );
//           } catch (error) {
//             setDataObjectTree({
//               ...dataObjectTree,
//               children: cloneChildren,
//             });
//             showErrorNotification(t(`responseMessage:${error?.code}`));
//           }
//         } else if (
//           (info.node.children || []).length > 0 &&
//           info.node.expanded &&
//           dropPosition === 1
//         ) {
//           loop(data, dropKey, async (item) => {
//             item.children = item.children || [];
//             for (let index = 0; index < item.children.length; index++) {
//               const element = item.children[index];
//               if (element?.parentKey !== dragObj?.parentKey) {
//                 dragObj.parentKey = element?.parentKey;
//                 break;
//               }
//             }
//             item.children.unshift(dragObj);
//           });
//           setDataObjectTree({
//             ...dataObjectTree,
//             children: data,
//             detail: {
//               ...dataObjectTree.detail,
//               updateAt: Date.now(),
//             },
//             updatedAt: Date.now(),
//           });
//           try {
//             await handleDragDropAPI(
//               info.dragNode.parentKey,
//               dragKey,
//               info.node.parentKey,
//               dropKey
//             );
//           } catch (error) {
//             setDataObjectTree({
//               ...dataObjectTree,
//               children: cloneChildren,
//             });
//             showErrorNotification(t(`responseMessage:${error?.code}`));
//           }
//         } else {
//           let ar = [];
//           let i;
//           let dropParentKey = info.dragNode.parentKey ?? null;
//           loop(data, dropKey, (_item, index, arr) => {
//             ar = arr;
//             i = index;
//           });
//           for (let index = 0; index < ar.length; index++) {
//             const element = ar[index];
//             if (element?.parentKey !== dragObj?.parentKey) {
//               dragObj.parentKey = element?.parentKey;
//               dropParentKey = element?.parentKey;
//               break;
//             }
//           }
//           let previousNodeAfterDropKey = ar[i].key;
//           if (dropPosition === -1) {
//             previousNodeAfterDropKey = null;
//             ar.splice(i, 0, dragObj);
//           } else {
//             previousNodeAfterDropKey = ar[i].key;
//             ar.splice(i + 1, 0, dragObj);
//           }
//           setDataObjectTree({
//             ...dataObjectTree,
//             children: data,
//             detail: {
//               ...dataObjectTree.detail,
//               updateAt: Date.now(),
//             },
//             updatedAt: Date.now(),
//           });
//           try {
//             await handleDragDropAPI(
//               info.dragNode.parentKey,
//               info.dragNode.key,
//               dropParentKey,
//               previousNodeAfterDropKey
//             );
//           } catch (error) {
//             setDataObjectTree({
//               ...dataObjectTree,
//               children: cloneChildren,
//             });
//             showErrorNotification(t(`responseMessage:${error?.code}`));
//           }
//         }
//       } else {
//         showErrorNotification(
//           t("common:detail_viewpoint_collection.can_not_drag")
//         );
//       }
//     };

//     const onChangeLockedByArrayId = async (isLocked = true) => {
//       const newObjectTreeChildren = deepCopy(dataObjectTree.children);
//       const isSuccess = await handleChangeDisabled(checkedList, isLocked);
//       if (!isSuccess) {
//         setDataObjectTree({
//           ...dataObjectTree,
//           children: newObjectTreeChildren,
//         });
//         return;
//       }
//       loopAllChildrenFindIdMatch(
//         newObjectTreeChildren,
//         checkedList,
//         (item, index, arr) => {
//           arr.splice(index, 1, {
//             ...item,
//             isLocked: isLocked,
//           });
//         }
//       );
//       setDataObjectTree({
//         ...dataObjectTree,
//         children: newObjectTreeChildren,
//         detail: {
//           ...dataObjectTree.detail,
//           updateAt: Date.now(),
//         },
//         updatedAt: Date.now(),
//       });
//       setCheckedList([]);
//       setCheckAll(false);
//     };

//     const checkHasLockedViewpointInObjectByListId = (
//       listKeyNeedToCheck?: React.Key[]
//     ) => {
//       const clonedChildren = deepCopy(dataObjectTree.children);
//       if (!listKeyNeedToCheck) {
//         listKeyNeedToCheck = checkedList;
//       }

//       let isHasLockedVP = false;
//       loopAllChildren(clonedChildren, (item, index, arr) => {
//         for (let index = 0; index < listKeyNeedToCheck.length; index++) {
//           const element = listKeyNeedToCheck[index];
//           if (element === item.key) {
//             if (item.isLocked) {
//               isHasLockedVP = true;
//               return;
//             }
//             break;
//           }
//         }
//       });
//       return isHasLockedVP;
//     };

//     const checkHasLockedViewpointInObject = (object: TreeData) => {
//       const clonedChildren = deepCopy(object.children);

//       let isHasLockedVP = false;
//       loopAllChildren(clonedChildren, (item, index, arr) => {
//         if (item.isLocked) {
//           isHasLockedVP = true;
//           return;
//         }
//       });
//       return isHasLockedVP;
//     };

//     const onDeleteByArrayId = async () => {
//       const newObjectTreeChildren = deepCopy(dataObjectTree.children);
//       const isSuccess = await handleDeleteListNodeAPI(checkedList);
//       if (!isSuccess) {
//         setDataObjectTree({
//           ...dataObjectTree,
//           children: newObjectTreeChildren,
//         });
//         return;
//       }

//       loopAllChildrenFindIdMatch(
//         newObjectTreeChildren,
//         deepCopy(checkedList),
//         (item, index, arr, elementID, indexId, arrId) => {
//           arr.splice(index, 1);
//         }
//       );
//       setDataObjectTree({
//         ...dataObjectTree,
//         children: newObjectTreeChildren,
//         detail: {
//           ...dataObjectTree.detail,
//           updateAt: Date.now(),
//         },
//         updatedAt: Date.now(),
//       });
//       setCheckedList([]);
//       setCheckAll(false);
//     };

//     const onChangeLocked = async (node: TreeData, isLocked = true) => {
//       const data = deepCopy(dataObjectTree.children);
//       const newFlattenData = [];
//       generateList(node.children, newFlattenData);
//       newFlattenData.push(node);
//       const isSuccess = await handleChangeDisabled(
//         newFlattenData.map((item) => item.key),
//         isLocked
//       );
//       if (!isSuccess) {
//         setDataObjectTree({
//           ...dataObjectTree,
//           children: data,
//         });
//         return;
//       }

//       loop(data, node.key, (item, index, arr) => {
//         const clonedChildren = deepCopy(item.children);
//         if (clonedChildren) {
//           loopAllChildren(clonedChildren, (item1, index1, arr1) => {
//             arr1.splice(index1, 1, {
//               ...item1,
//               isLocked: isLocked,
//             });
//           });
//         }
//         arr.splice(index, 1, {
//           ...item,
//           children: clonedChildren,
//           isLocked: isLocked,
//         });
//         return;
//       });
//       setDataObjectTree({
//         ...dataObjectTree,
//         children: data,
//         detail: {
//           ...dataObjectTree.detail,
//           updateAt: Date.now(),
//         },
//         updatedAt: Date.now(),
//       });
//       handleChangeNodeEditing(null);
//     };

//     const onDelete = async (node, isDeleteAllChildren = false) => {
//       const previousData = deepCopy(dataObjectTree);

//       let temp = deepCopy(dataObjectTree?.children);
//       if (typeof node.key === "string") {
//         const isSuccess = await handleDeleteNodeAPI(node, isDeleteAllChildren);
//         if (!isSuccess) {
//           setDataObjectTree(previousData);
//           return;
//         }
//       }

//       if (isDeleteAllChildren) {
//         //delete all children
//         deleteNode(node?.key, temp);
//       } else {
//         //keep
//         if (!node?.parentKey) {
//           //first children in dataTreeObject
//           let targetIndex = -1;
//           const firstArr = [];
//           for (let index = 0; index < temp.length; index++) {
//             const element = temp[index];
//             if (element.key === node.key) {
//               targetIndex = index;
//               temp.splice(index, 1);
//               break;
//             }
//             firstArr.push(element);
//           }
//           const lastArr = temp.slice(targetIndex);
//           const clonedNodeChildren = deepCopy(node.children);
//           for (let index = 0; index < clonedNodeChildren.length; index++) {
//             const element = clonedNodeChildren[index];
//             element.parentKey = null;
//           }

//           temp = firstArr.concat(clonedNodeChildren, lastArr);
//         } else {
//           //loop to find children includes node
//           loop(temp, node?.parentKey, (item, index, arr) => {
//             let elementNeedDelete = null;
//             const tempChildren = deepCopy(item.children);
//             const firstArr = [];
//             let indexNodeDelete = -1;
//             for (let i = 0; i < tempChildren.length; i++) {
//               const element = tempChildren[i];
//               if (element.key === node.key) {
//                 elementNeedDelete = element;
//                 indexNodeDelete = i;
//                 tempChildren.splice(i, 1);
//                 break;
//               }
//               firstArr.push(element);
//             }

//             const lastArr = tempChildren.slice(indexNodeDelete);

//             const clonedNodeChildren = deepCopy(elementNeedDelete.children);
//             for (let index = 0; index < clonedNodeChildren.length; index++) {
//               const element = clonedNodeChildren[index];
//               element.parentKey = node.parentKey;
//             }

//             arr.splice(index, 1, {
//               ...item,
//               children: firstArr.concat(clonedNodeChildren, lastArr),
//             });

//             return;
//           });
//         }
//       }
//       setDataObjectTree({
//         ...dataObjectTree,
//         children: temp,
//         detail: {
//           ...dataObjectTree.detail,
//           updateAt: Date.now(),
//         },
//         updatedAt: Date.now(),
//       });
//     };

//     const deleteNode = (key, data) => {
//       loop(data, key, (item, index, arr) => {
//         arr.splice(index, 1);
//         return;
//       });
//     };

//     const onSave = async (
//       node,
//       isAddNewChildSameLevelAfterSave = false,
//       isSaveFormData = false
//     ) => {
//       const previousData = deepCopy(dataObjectTree);
//       const result = deepCopy(previousData.children);
//       if (checkFakeNode(node)) {
//         //add new child
//         const newKey: React.Key = await handleAddChildAPI(
//           node,
//           nodeEditing?.title.trim()
//         );
//         newKey
//           ? saveNode(result, node.key, nodeEditing?.title.trim(), newKey)
//           : onDelete(node);
//       } else {
//         //save content node
//         const isSuccess = await handleSaveNodeAPI(
//           node,
//           nodeEditing?.title && nodeEditing?.title !== ""
//             ? nodeEditing.title.trim()
//             : node.title.trim()
//         );
//         if (isSuccess) {
//           saveNode(
//             result,
//             node.key,
//             nodeEditing?.title && nodeEditing?.title !== ""
//               ? nodeEditing.title.trim()
//               : node.title.trim(),
//             null,
//             !isSaveFormData ? null : node.viewDetail
//           );
//         } else {
//           setDataObjectTree(previousData);
//         }
//       }

//       handleSelect([], null);
//       handleChangeNodeEditing(null);

//       setDataObjectTree({
//         ...dataObjectTree,
//         children: result,
//         detail: {
//           ...dataObjectTree.detail,
//           updateAt: Date.now(),
//         },
//       });

//       if (isAddNewChildSameLevelAfterSave) {
//         let findNode = null;
//         loop(dataObjectTree.children, node?.parentKey, (item) => {
//           findNode = deepCopy(item);
//         });
//         onAdd(
//           findNode,
//           deepCopy({
//             ...dataObjectTree,
//             children: result,
//           })
//         );
//         return;
//       }
//     };

//     const saveNode = (data, key, content, newKey?, newViewpointDetail?) => {
//       loop(data, key, (item, index, arr) => {
//         const newNode = {
//           ...item,
//           title: newViewpointDetail?.name ?? content,
//           viewDetail: newViewpointDetail ?? {
//             ...item.viewDetail,
//             name: content,
//           },
//           key: newKey ?? key,
//         };
//         arr.splice(index, 1, newNode);
//       });
//     };

//     const onAdd = (node: TreeData, dataTreeAfterSave?: TreeData) => {
//       if (
//         nodeEditing?.parentKey === node?.key &&
//         !dataTreeAfterSave &&
//         prevNodeEditing
//       ) {
//         return;
//       }
//       let clonedChildren = deepCopy(dataObjectTree.children);

//       if (dataTreeAfterSave) {
//         clonedChildren = dataTreeAfterSave.children;
//       }
//       addNode(node, clonedChildren);

//       setDataObjectTree({
//         ...dataObjectTree,
//         children: clonedChildren,
//       });

//       const newExpandedKeys = [...expandedKeys];
//       newExpandedKeys.push(node?.key);
//       handleExpand(newExpandedKeys);
//     };

//     const addNode = (node, data) => {
//       if (!node?.key) {
//         //add to big children (create new biggest node)
//         const randomKey = Math.random();
//         const newNode = {
//           ...defaultNewTreeNodeLeaf,
//           viewDetail: {
//             ...defaultNewTreeNodeLeaf?.viewDetail,
//             language: localStorage.getItem("i18nextLng"),
//           },
//           key: randomKey,
//           parentKey: null,
//           title: "",
//           children: [],
//           path: randomKey.toString(),
//         };
//         data.push(newNode);
//         handleChangeNodeEditing(newNode);
//       } else {
//         loop(data, node?.key, (item) => {
//           const randomKey = Math.random();
//           const newNode = {
//             viewDetail: {
//               ...node?.viewDetail,
//               language: item?.viewDetail.language,
//               name: "",
//             },
//             key: randomKey,
//             parentKey: node?.key,
//             title: "",
//             children: [],
//             isLocked: false,
//           };
//           if (!item.children) {
//             item.children = [];
//           }
//           item.children.push(newNode);
//           handleChangeNodeEditing(newNode);
//           return;
//         });
//       }
//     };

//     React.useEffect(() => {
//       handleChangeSearchInputSelectLevel(levelShow);
//     }, [levelShow]);

//     React.useEffect(() => {
//       setSearchValue(searchValue);
//       setAutoExpandParent(true);
//     }, [searchValue]);

//     React.useImperativeHandle(ref, () => ({
//       createFirstNode() {
//         onAdd(null);
//       },
//       saveNode(node) {
//         onSave(node, false, true);
//       },
//       lockUnlockAllViewpoint(node, isLocked) {
//         onChangeLocked(node, isLocked);
//       },
//       closeCurrentInput() {
//         handleChangeNodeEditing(null);
//       },
//     }));
//     return {
//       treeRef: ref,
//       checkFakeNode: checkFakeNode,
//       handleChangeNodeEditing: handleChangeNodeEditing,
//       handleSelect: handleSelect,
//       handleExpand: handleExpand,
//       handleChangeSearchInputSelectLevel: handleChangeSearchInputSelectLevel,
//       onChangeCheckboxNode: onChangeCheckboxNode,
//       onCheckAllChange: onCheckAllChange,
//       handleDropNode: handleDropNode,
//       onChangeLockedByArrayId: onChangeLockedByArrayId,
//       checkLockedNodeByListId: checkHasLockedViewpointInObjectByListId,
//       checkHasLockedViewpointInObject: checkHasLockedViewpointInObject,
//       onDeleteByArrayId: onDeleteByArrayId,
//       onChangeLocked: onChangeLocked,
//       onDelete: onDelete,
//       deleteNode: deleteNode,
//       onSave: onSave,
//       saveNode: saveNode,
//       onAdd: onAdd,
//       addNode: addNode,
//     };
//   }
// );
// export default useTreeNode;
