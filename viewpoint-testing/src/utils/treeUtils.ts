import { Domain } from "@models/model";
import { DataTreeNode } from "@models/type";
import { DataNode } from "antd/lib/tree";
import * as React from "react";
import { ENUM_DEEP_DIFF } from "./constants";
import { deepCopy, deepFind, loopAllChildren } from "./helpersUtils";

export type TreeData = {
  children: any[]; //get ID, order item
  key: React.Key;
  parentKey: React.Key;
  title: string | any;
  detail: any;
};

export const loopAllChildrenWithBigNode = (data, searchText, result) => {
  for (let i = 0; i < data.length; i++) {
    let item = data[i];
    if (searchText.trim() === "") {
      item = { ...item, isMatch: false };
    } else {
      if (item?.title?.toLowerCase().indexOf(searchText?.toLowerCase()) > -1) {
        item = { ...item, isMatch: true };
        if (!item?.parentKey) {
          result.push(item);
        }
      } else {
        item = { ...item, isMatch: false };
      }
    }

    if (item.children) {
      const newData = loopAllChildrenWithBigNode(
        item.children,
        searchText,
        result
      );
      if (
        newData.findIndex((t) => t?.isMatch) !== -1 ||
        newData.findIndex((t) => t?.isMatchPath) !== -1
      ) {
        item = { ...item, isMatchPath: true };

        if (!item?.parentKey) {
          result.push(item);
        }
      } else {
        item = { ...item, isMatchPath: false };
      }
    }
    data.splice(i, 1, item);
  }
  return data;
};

export const loopAllLockNode = (data) => {
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (item?.isLocked) {
      data.splice(i, 1, {
        ...item,
        disabled: true,
      });
    }

    if (data[i].children) {
      const newData = loopAllLockNode(data[i].children);
      if (newData.findIndex((t) => t?.disabled) !== -1) {
        data.splice(i, 1, { ...item, disabled: true });
      }
    }
  }
  return data;
};

export const convertedToDataTree = (
  parentViewpoint,
  vpCollection,
  keyFlatData,
  pathGetTitle,
  pathKey?
) => {
  parentViewpoint.children = [];

  if (parentViewpoint?.orderStrings?.length > 0) {
    for (let index = 0; index < parentViewpoint?.orderStrings.length; index++) {
      const orderItem = parentViewpoint?.orderStrings[index];
      for (
        let indexVP = 0;
        indexVP < vpCollection?.[keyFlatData].length;
        indexVP++
      ) {
        const viewpointItem = vpCollection?.[keyFlatData][indexVP];
        if (pathKey) {
          if (deepFind(viewpointItem, pathKey) === orderItem) {
            viewpointItem.key = deepFind(viewpointItem, pathKey); //do not use spread to clone
            viewpointItem.parentKey = viewpointItem?.parentId;
            viewpointItem.title = deepFind(viewpointItem, pathGetTitle);
            viewpointItem.path = [deepFind(viewpointItem, pathGetTitle)];
            if (parentViewpoint?.path) {
              viewpointItem.path = parentViewpoint.path.concat(
                viewpointItem.path
              );
            }
            parentViewpoint.children.push(viewpointItem);
            convertedToDataTree(
              viewpointItem,
              vpCollection,
              keyFlatData,
              pathGetTitle,
              pathKey
            );
          }
        } else {
          if (viewpointItem?.id === orderItem) {
            viewpointItem.key = viewpointItem?.id; //do not use spread to clone
            viewpointItem.parentKey = viewpointItem?.parentId;
            viewpointItem.title = deepFind(viewpointItem, pathGetTitle);
            viewpointItem.path = [deepFind(viewpointItem, pathGetTitle)];
            if (parentViewpoint?.path) {
              viewpointItem.path = parentViewpoint.path.concat(
                viewpointItem.path
              );
            }
            parentViewpoint.children.push(viewpointItem);
            convertedToDataTree(
              viewpointItem,
              vpCollection,
              keyFlatData,
              pathGetTitle
            );
          }
        }
      }
    }
  }

  const newData = {
    ...parentViewpoint,
    flatDataList: parentViewpoint[keyFlatData],
  };
  delete newData[keyFlatData];
  return newData;
};

export const convertDataTreeLockCheckBox = (
  parentViewpoint,
  vpCollection,
  keyFlatData,
  pathGetTitle,
  pathLocked
) => {
  parentViewpoint.children = [];
  if (parentViewpoint?.orderStrings?.length > 0) {
    for (let index = 0; index < parentViewpoint?.orderStrings.length; index++) {
      const orderItem = parentViewpoint?.orderStrings[index];
      for (
        let indexVP = 0;
        indexVP < vpCollection?.[keyFlatData].length;
        indexVP++
      ) {
        const viewpointItem = vpCollection?.[keyFlatData][indexVP];
        if (viewpointItem?.id === orderItem) {
          viewpointItem.key = viewpointItem?.id; //do not use spread to clone
          viewpointItem.parentKey = viewpointItem?.parentId;
          viewpointItem.title = deepFind(viewpointItem, pathGetTitle);
          viewpointItem.path = [deepFind(viewpointItem, pathGetTitle)];

          if (parentViewpoint?.path) {
            viewpointItem.path = parentViewpoint.path.concat(
              viewpointItem.path
            );
          }

          viewpointItem.disableCheckbox = deepFind(viewpointItem, pathLocked);
          const newValue = convertDataTreeLockCheckBox(
            viewpointItem,
            vpCollection,
            keyFlatData,
            pathGetTitle,
            pathLocked
          );

          if (newValue.disableCheckbox) {
            viewpointItem.disableCheckbox = true;
            parentViewpoint.children.push(viewpointItem);
          } else {
            parentViewpoint.children.push(viewpointItem);
          }
        }
      }
    }
  }
  const isHasChildLocked = parentViewpoint.children.some(
    (item) => item?.disableCheckbox
  );

  const newData = {
    ...parentViewpoint,
    flatDataList: parentViewpoint[keyFlatData],
    disableCheckbox: isHasChildLocked,
  };
  delete newData[keyFlatData];
  return newData;
};

export const convertTreeDataSelector = (table) => {
  const keys = table.map((x) => x?.id);
  const formattedData = table.map((x) => {
    return {
      key: x.id,
      title: x.detail.name,
      text: x?.detail.name,
      parentKey: x?.parentId,
      value: x?.id,
      label: x.detail.name,
    };
  });
  const result = formattedData
    .map((parent) => {
      const children = formattedData.filter((child) => {
        if (child.key !== child.parentKey && child.parentKey === parent.key) {
          return true;
        }
        return false;
      });

      if (children.length) {
        parent.children = children;
      }
      return parent;
    })
    .filter((obj) => {
      if (obj.key === obj.parentKey || !keys.includes(obj.parentKey)) {
        return true;
      }
      return false;
    });
  return result;
};

export const convertTreeDataFilter = (table) => {
  const keys = table.map((x) => x?.id);
  const formattedData = table.map((x) => {
    return {
      key: x.id,
      title: x.detail.name,
      text: x.detail.name,
      parentKey: x?.parentId,
      value: x?.id,
      label: x.detail.name,
    };
  });
  const result = formattedData
    .map((parent) => {
      const children = formattedData.filter((child) => {
        if (child.key !== child.parentKey && child.parentKey === parent.key) {
          return true;
        }
        return false;
      });

      if (children.length) {
        parent.children = children;
      }
      return parent;
    })
    .filter((obj) => {
      if (obj.key === obj.parentKey || !keys.includes(obj.parentKey)) {
        return true;
      }
      return false;
    });
  return result;
};

export const convertTreeData = (data) => {
  const keys = data.map((x: Domain) => x.id);

  const formattedData = data.map((x: Domain) => {
    return {
      key: x.id,
      title: x?.detail?.name,
      description: x?.detail?.description,
      parentKey: x.parentId,
      isActive: x.isActive,
      index: x.index,
      prev: x.previousDomainId,
      next: x.nextDomainId,
    };
  });
  const result = formattedData
    .map((parent: DataTreeNode) => {
      const children = formattedData.filter((child: DataTreeNode) => {
        if (child.key !== child.parentKey && child.parentKey === parent.key) {
          return true;
        }
        return false;
      });
      if (children.length) {
        parent.children = children;
        // parent.children = sortArray(children);
      }
      return parent;
    })
    .filter((obj: DataTreeNode) => {
      if (obj.key === obj.parentKey || !keys.includes(obj.parentKey)) {
        return true;
      }
      return false;
    });
  // return sortArray(result);
  return result;
};

// update tree node
const updateDataTree = (
  element: DataTreeNode,
  matchingKey: React.Key,
  changedData: DataTreeNode
) => {
  if (element.key == matchingKey) {
    element.title = changedData.title ?? changedData?.name;
    element.isActive = changedData.isActive;
    element.description = changedData.description;
    element.index = changedData.index;
    element.prev = changedData.prev;
    element.next = changedData.next;
    return;
  } else if (element.children != null) {
    for (let i = 0; i < element.children.length; i++) {
      return updateDataTree(element.children[i], matchingKey, changedData);
    }
    return;
  }
  return;
};

export const loopUpdateDataTreeNode = (data, matchingKey, changedData) => {
  for (let i = 0; i < data.length; i++) {
    updateDataTree(data[i], matchingKey, changedData);
  }
  return data;
};

export const getListIdChildrenTreeNode = (listKey = [], data, key) => {
  data.map((item) => {
    if (item.key === key) {
      listKey.push(item.key);
      if (item.children) {
        getAllIdTreeData(listKey, item.children);
      }
      return;
    } else {
      if (item.children) {
        getListIdChildrenTreeNode(listKey, item.children, key);
      }
    }
  });
  return listKey;
};

export const generateList = (
  data: DataTreeNode[],
  generatedList: DataTreeNode[]
) => {
  for (let i = 0; i < data?.length; i++) {
    const node = data[i];
    generatedList.push({
      key: node.key,
      title: node.title,
      parentKey: node.parentKey,
      description: node.description,
      isActive: node.isActive,
      index: node.index,
      prev: node?.prev,
      next: node?.next,
    });
    if (node.children) {
      generateList(node.children, generatedList);
    }
  }
};

export const generateFlattenedTreeList = (data, generatedList) => {
  for (let i = 0; i < data?.length; i++) {
    generatedList.push(data[i]);
    if (data[i].children && data[i].children.length > 0) {
      generateFlattenedTreeList(data[i].children, generatedList);
    }
  }
};

// get list id children of tree node
export const getAllIdTreeData = (listKey = [], data) => {
  data.map((item) => {
    listKey.push(item.key);
    if (item.children) {
      getAllIdTreeData(listKey, item.children);
    }
  });
};

export const getNodeListToUpdate = (
  dragNode: DataTreeNode & DataNode,
  dropNode: DataTreeNode & DataNode,
  dropToGap: boolean,
  dropPosition: number,
  flattenedData: DataTreeNode[]
) => {
  const domainList = [];
  if (dragNode.prev !== dropNode.key || dropPosition === -1 || !dropToGap) {
    if (dropPosition === -1) {
      if (dragNode?.prev) {
        const oldPrevDomain = {
          id: dragNode?.prev,
          nextDomainId: dragNode?.next,
          previousDomainId: "",
          parentId: "",
        };
        domainList.push(oldPrevDomain);
      }
      if (dragNode?.next) {
        const oldNextDomain = {
          id: dragNode?.next,
          previousDomainId: dragNode?.prev,
          nextDomainId: "",
          parentId: "",
        };
        domainList.push(oldNextDomain);
      }
      const newCurrentDomain = {
        id: dragNode?.key,
        parentId: null,
        previousDomainId: null,
        nextDomainId: dropNode?.key,
      };
      domainList.push(newCurrentDomain);
      const newNextDomain = {
        id: dropNode.key,
        previousDomainId: dragNode?.key,
        nextDomainId: "",
        parentId: "",
      };
      domainList.push(newNextDomain);
    } else {
      // drag / drop inside a branch in tree
      if (dropToGap) {
        if (dragNode?.prev) {
          const oldPrevDomain = {
            id: dragNode?.prev,
            nextDomainId: dragNode?.next,
            previousDomainId: "",
            parentId: "",
          };
          domainList.push(oldPrevDomain);
        }
        if (dragNode?.next) {
          const oldNextDomain = {
            id: dragNode?.next,
            previousDomainId: dragNode?.prev,
            parentId: "",
            nextDomainId: "",
          };
          domainList.push(oldNextDomain);
        }
        if (dropPosition === 0) {
          const parentDomainOfDragedDomain: DataTreeNode = flattenedData.find(
            (item: DataTreeNode) =>
              item.parentKey === dropNode.key && item?.prev === null
          );
          if (parentDomainOfDragedDomain) {
            const newCurrentDomain = {
              id: dragNode?.key,
              previousDomainId: null,
              nextDomainId: parentDomainOfDragedDomain?.key,
              parentId: "",
            };
            domainList.push(newCurrentDomain);
            const newNextDomain = {
              id: parentDomainOfDragedDomain?.key,
              previousDomainId: dragNode?.key,
              parentId: parentDomainOfDragedDomain?.parentKey,
              nextDomainId: "",
            };
            domainList.push(newNextDomain);
          } else {
            const newCurrentDomain = {
              id: dragNode?.key,
              previousDomainId: null,
              nextDomainId: null,
              parentId: parentDomainOfDragedDomain?.parentKey,
            };
            domainList.push(newCurrentDomain);
          }
        } else {
          const newCurrentDomain = {
            id: dragNode?.key,
            nextDomainId: dropNode?.next,
            previousDomainId: dropNode?.key,
            parentId:
              dragNode?.parentKey === dropNode?.parentKey
                ? ""
                : dropNode?.parentKey,
          };
          domainList.push(newCurrentDomain);
          const newPrevDomain = {
            id: dropNode?.key,
            nextDomainId: dragNode?.key,
            parentId: "",
            previousDomainId: "",
          };
          domainList.push(newPrevDomain);

          if (dropNode?.next) {
            const newNextDomain = {
              id: dropNode?.next,
              previousDomainId: dragNode?.key,
              nextDomainId: "",
              parentId: "",
            };
            domainList.push(newNextDomain);
          }
        }
      } else {
        if (dragNode?.prev) {
          const oldPrevDomain = {
            id: dragNode?.prev,
            nextDomainId: dragNode?.next,
            previousDomainId: "",
            parentId: "",
          };
          domainList.push(oldPrevDomain);
        }
        if (dragNode?.next) {
          const oldNextDomain = {
            id: dragNode?.next,
            previousDomainId: dragNode?.prev,
            nextDomainId: "",
            parentId: "",
          };
          domainList.push(oldNextDomain);
        }
        const parentDomainOfDragedDomain: DataTreeNode = flattenedData.find(
          (item: DataTreeNode) =>
            item.parentKey === dropNode.key && item?.prev === null
        );
        if (
          parentDomainOfDragedDomain &&
          parentDomainOfDragedDomain?.key !== dragNode?.key
        ) {
          const newCurrentDomain = {
            id: dragNode?.key,
            parentId: dropNode?.key,
            previousDomainId: null,
            nextDomainId: parentDomainOfDragedDomain?.key,
          };
          domainList.push(newCurrentDomain);
          const newNextDomain = {
            id: parentDomainOfDragedDomain?.key,
            previousDomainId: dragNode?.key,
            nextDomainId: "",
            parentId: "",
          };
          domainList.push(newNextDomain);
        } else {
          const newCurrentDomain = {
            id: dragNode?.key,
            parentId: dropNode?.key,
            previousDomainId: null,
            nextDomainId: null,
          };
          domainList.push(newCurrentDomain);
        }
      }
    }
  }
  return domainList;
};

export const generateFlattenedList = (data) => {
  return data.map((item) => {
    return {
      key: item.id,
      title: item?.detail.name,
      parentKey: item.parentId,
      description: item?.detail.description,
      isActive: item.isActive,
      index: item.index,
      prev: item.previousDomainId,
      next: item.nextDomainId,
    };
  });
};

const checkSameViewDetail = (nodeTo, nodeFrom) => {
  if (
    nodeTo?.viewDetail?.name !== nodeFrom?.viewDetail?.name ||
    nodeTo?.viewDetail?.confirmation !== nodeFrom?.viewDetail?.confirmation ||
    nodeTo?.viewDetail?.example !== nodeFrom?.viewDetail?.example ||
    nodeTo?.viewDetail?.note !== nodeFrom?.viewDetail?.note
  ) {
    return false;
  }
  return true;
};

export const compareTwoTree = (
  treeFromChildren,
  treeToChildren,
  pathCloneId?
) => {
  const handleNode = []; //arr save couple node which refer to each other
  if (treeFromChildren.length === 0) {
    loopAllChildren(treeToChildren, (itemTo, indexTo, arrTo) => {
      const newItemTo = deepCopy(itemTo);
      delete newItemTo.typeCompare;
      arrTo.splice(indexTo, 1, newItemTo);
    });
  }
  loopAllChildren(treeFromChildren, (itemFrom, indexFrom, arrFrom) => {
    const newItemFrom = deepCopy(itemFrom);
    loopAllChildren(treeToChildren, (itemTo, indexTo, arrTo) => {
      const newItemTo = deepCopy(itemTo);
      if (itemTo.key === deepFind(itemFrom, pathCloneId)) {
        handleNode.push({
          from: itemFrom.key,
          to: itemTo.key,
        });
        if (!checkSameViewDetail(newItemFrom, itemTo)) {
          newItemFrom.typeCompare = ENUM_DEEP_DIFF.VALUE_UPDATED;
          newItemTo.typeCompare = ENUM_DEEP_DIFF.VALUE_UPDATED;
        } else {
          newItemFrom.typeCompare = ENUM_DEEP_DIFF.VALUE_UNCHANGED;
          newItemTo.typeCompare = ENUM_DEEP_DIFF.VALUE_UNCHANGED;
        }
        //check duplicate
        if (handleNode.filter((t) => t.to === itemTo.key).length > 1) {
          newItemTo.isDuplicated = true;
        } else {
          delete newItemTo.isDuplicated;
        }
      }
      if (!handleNode.some((t) => t.to === itemTo.key)) {
        delete newItemTo.typeCompare;
      }

      arrTo.splice(indexTo, 1, newItemTo);
    });
    arrFrom.splice(indexFrom, 1, newItemFrom);
  });
  return handleNode;
};

export const expandedKeysWithLevel = (
  data,
  levelShow: number,
  expandedKeys: React.Key[]
) => {
  if (levelShow - 1 > 0) {
    // data.map((item) => {
    for (let index = 0; index < data?.length; index++) {
      if (levelShow - 1 > 0) {
        if (data[index].children && data[index]?.children?.length !== 0) {
          expandedKeys.push(data[index].key);
          //de quy
          expandedKeysWithLevel(
            data[index].children,
            levelShow - 1,
            expandedKeys
          );
        }
      }
    }
  }
  return expandedKeys;
};
