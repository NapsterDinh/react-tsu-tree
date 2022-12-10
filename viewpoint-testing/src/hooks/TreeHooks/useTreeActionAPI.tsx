import useAbortRequest from "@hooks/useAbortRequest";
import { IDataBodyFilterTestType } from "@models/model";
import { AxiosResponseCustom, ResponseWithPagination } from "@models/type";
import { RootState } from "@redux/store";
import {
  ERR_CANCELED_RECEIVE_RESPONSE,
  PAGE_SIZE_TREE,
  TYPE_FILTER_LOG,
} from "@utils/constants";
import { deepCopy, getUser, loopAllChildren } from "@utils/helpersUtils";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@utils/notificationUtils";
import { loopAllChildrenWithBigNode } from "@utils/treeUtils";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "routes";

export type TreeData = {
  children: any[]; //get ID, order item
  key: React.Key;
  parentKey: React.Key;
  title: string | any;
  detail: any;
  hasShowMore?: boolean;
  hasShowLess?: boolean;
  hierachyViewPointDetail?: any[];
};
export type TTreeActionAPI = {
  exportTree: () => void;
  setTree: (_props: {
    pathGetTitle: string;
    pathKey: string;
    pathNameNavigate: string;
  }) => void;
  setHintTextResource: (
    _getHintResource: (
      _data: IDataBodyFilterTestType
    ) => Promise<AxiosResponseCustom<ResponseWithPagination | any>>
  ) => void;
  deleteNode: (
    _node: TreeData,
    _isDeleteAllChildren: boolean,
    _msgSuccess: string
  ) => Promise<boolean>;
  deleteNodeByListId: (
    _ids: React.Key[],
    _msgSuccess: string
  ) => Promise<boolean>;
  saveNode: (_node: TreeData, _newContent: string) => Promise<boolean>;
  addChildNode: (
    _node: TreeData,
    _newContent: string,
    _entityKey: string
  ) => Promise<React.Key>;
  dragDropNode: (_props: {
    __dragParentKey: React.Key;
    __targetKey: React.Key;
    __dropParentKey: React.Key;
    __previousNodeAfterDropKey: React.Key;
    _entityKey: string;
  }) => Promise<boolean>;
  changeLockedNode: (_props: {
    _ids: React.Key[];
    _isLocked: boolean;
    msgLockSuccess: string;
    msgUnlockSuccess: string;
  }) => Promise<boolean>;
  changeProcessStatusTree: (_checked: boolean, _msgSuccess: string) => void;
  changePublishStatusTree: (_checked: boolean, _msgSuccess: string) => void;
  checkOwner: (_pathOwner: string) => boolean;
};

export const useTreeActionAPI = ({
  treeAPI,
  nodeAPI,
  entity,
  setEntity,
  setLoading,
  setHintTextList = null,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation(["common", "validate"]); // languages
  const { id } = useParams();
  const user = getUser();
  const { treeFullData } = useSelector((state: RootState) => state.tree);
  const [searchText, setSearchText] = React.useState("");
  const [typeEntity, setTypeEntity] = React.useState(
    TYPE_FILTER_LOG.VIEWPOINT_COLLECTION
  );

  const { signal } = useAbortRequest();

  const onSearchTree = React.useCallback(
    (newEntity?) => {
      const clonedNewEntity = newEntity ? newEntity : entity;
      const clonedChildren = deepCopy(clonedNewEntity?.children);
      if (searchText) {
        const result = [];
        loopAllChildrenWithBigNode(clonedChildren, searchText.trim(), result);
        setEntity({
          ...clonedNewEntity,
          children: clonedChildren,
        });
        return;
      } else {
        loopAllChildren(clonedChildren, (item, index, arr) => {
          arr.splice(index, 1, { ...item, isMatch: false, isMatchPath: false });
        });
        setEntity({
          ...clonedNewEntity,
          children: clonedChildren,
        });
      }
    },
    [entity?.children, searchText]
  );

  const customSetEntity = (newEntity) => {
    searchText ? onSearchTree(newEntity) : setEntity(newEntity);
  };

  React.useEffect(() => {
    entity && onSearchTree();
  }, [searchText]);

  return {
    baseHandleAPI: {
      setTree: async ({ pathNameNavigate }) => {
        try {
          if (id) {
            setLoading(true);
            const response = await treeAPI.getById(id, signal);
            const convertedData = response?.data;
            delete convertedData.orderStrings;
            delete convertedData.viewPoints;
            if (pathNameNavigate === routes.ProductManagement.path[0]) {
              setTypeEntity(TYPE_FILTER_LOG.PRODUCT);
              convertedData.children = convertedData.hierachyProductDetail;
              delete convertedData.hierachyProductDetail;
            } else {
              setTypeEntity(TYPE_FILTER_LOG.VIEWPOINT_COLLECTION);
              convertedData.children = convertedData.hierachyViewPointDetail;
              delete convertedData.hierachyViewPointDetail;
            }

            setEntity(convertedData);
          }
        } catch (error) {
          if (error?.code === ERR_CANCELED_RECEIVE_RESPONSE) {
            return;
          }
          if (error?.code !== "IdInvalid") {
            if (error?.response?.status === 400) {
              if (!error?.response?.data?.errors?.[0]?.code) {
                showErrorNotification(t("responseMessage:IdInvalid"));
              } else {
                showErrorNotification(t(`responseMessage:${error?.code}`));
              }
              navigate("/not-found", {
                state: {
                  from: {
                    pathname: pathNameNavigate,
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
                  pathname: pathNameNavigate,
                },
              },
            });
          }
        } finally {
          setLoading(false);
        }
      },
      setHintTextResource: async (getHintResource) => {
        try {
          const response = await getHintResource();
          const testTypeList = response?.data?.map(
            (testType) => testType?.detail?.name
          );
          setHintTextList && setHintTextList(testTypeList);
        } catch (error) {
          if (error?.code) {
            showErrorNotification(t(`responseMessage:${error?.code}`));
          }
        }
      },
      exportTree: async () => {
        try {
          await treeAPI.export(entity?.id);
        } catch (error) {
          if (error?.code) {
            showErrorNotification(t(`responseMessage:${error?.code}`));
          }
        }
      },
      deleteNode: async (node, isDeleteAllChildren, msgSuccess) => {
        try {
          await nodeAPI.deleteNode(node.key, isDeleteAllChildren);
          showSuccessNotification(msgSuccess);
          return true;
        } catch (error) {
          if (error?.code) {
            showErrorNotification(t(`responseMessage:${error?.code}`));
          }
          return false;
        }
      },
      deleteNodeByListId: async (ids, msgSuccess) => {
        try {
          await nodeAPI.deleteNodeByListId(ids);
          showSuccessNotification(msgSuccess);
          return true;
        } catch (error) {
          if (error?.code) {
            showErrorNotification(t(`responseMessage:${error?.code}`));
          }
          return false;
        }
      },
      saveNode: async (node, newContent, msgSuccess) => {
        try {
          await nodeAPI.updateNode(
            {
              viewDetail: JSON.stringify([
                {
                  ...node.viewDetail,
                  name: newContent,
                },
              ]),
            },
            node.key
          );
          showSuccessNotification(msgSuccess);
          return true;
        } catch (error) {
          if (error?.code) {
            showErrorNotification(t(`responseMessage:${error?.code}`));
          }
          return false;
        }
      },
      addChildNode: async (node, newContent, entityKey) => {
        try {
          const newBody: any = {
            viewDetail: JSON.stringify([
              {
                ...node.viewDetail,
                name: newContent,
              },
            ]),
            parentId: node.parentKey,
          };
          if (typeEntity === TYPE_FILTER_LOG.PRODUCT) {
            newBody.productId = entity.id;
          } else {
            newBody.viewPointCollectionId = entity.id;
          }
          newBody[entityKey] = entity.id;
          const response = await nodeAPI.addNewNode(newBody);
          return response.data?.id;
        } catch (error) {
          if (error?.code) {
            showErrorNotification(t(`responseMessage:${error?.code}`));
          }
          return null;
        }
      },
      dragDropNode: async ({
        dragParentKey,
        targetKey,
        dropParentKey,
        previousNodeAfterDropKey,
        entityKey,
      }) => {
        try {
          const newBody = {
            targetKey: targetKey,
            dragParentKey: dragParentKey,
            previousNoeAfterDropKey: previousNodeAfterDropKey,
            dropParentKey: dropParentKey,
          };
          newBody[entityKey] = entity?.id;
          await nodeAPI.updatePositionNode(newBody);
          return true;
        } catch (error) {
          if (error?.code) {
            showErrorNotification(t(`responseMessage:${error?.code}`));
          }
          return false;
        }
      },
      changeLockedNode: async ({
        ids,
        isLocked,
        msgLockSuccess,
        msgUnlockSuccess,
      }) => {
        try {
          await nodeAPI.updateLockedNode({
            ids: ids,
            isLocked: isLocked,
          });
          if (isLocked) {
            showSuccessNotification(msgLockSuccess);
          } else {
            showSuccessNotification(msgUnlockSuccess);
          }
          return true;
        } catch (error) {
          if (error?.code) {
            showErrorNotification(t(`responseMessage:${error?.code}`));
          }
          return false;
        }
      },
      changeProcessStatusTree: async (checked, msgSuccess) => {
        const newStatus = checked ? 1 : 0;
        try {
          const response = await treeAPI.updateStatus(entity?.id, {
            processingStatus: newStatus,
            isActive: true,
          });
          setEntity({
            ...entity,
            processingStatus: newStatus,
            detail: {
              ...entity?.detail,
              updateAt: response?.data?.updatedAt,
            },
            updatedAt: response?.data?.updatedAt,
          });
          showSuccessNotification(msgSuccess);
        } catch (error) {
          if (error?.code) {
            showErrorNotification(t(`responseMessage:${error?.code}`));
          }
        }
      },
      changePublishStatusTree: async (checked, msgSuccess) => {
        const newStatus = checked ? 1 : 0;
        try {
          const response = await treeAPI.updateStatus(entity?.id, {
            publishStatus: newStatus,
            isActive: true,
          });
          setEntity({
            ...entity,
            publishStatus: newStatus,
            detail: {
              ...entity?.detail,
              updateAt: response?.data?.updatedAt,
            },
            updatedAt: response?.data?.updatedAt,
          });
          showSuccessNotification(msgSuccess);
        } catch (error) {
          if (error?.code) {
            showErrorNotification(t(`responseMessage:${error?.code}`));
          }
        }
      },
    },
    checkOwner: React.useMemo(() => {
      if (entity?.listOwner) {
        return entity?.listOwner?.some((t) => t.id === user?.id);
      }
      return false;
    }, [entity?.id, entity?.listOwner]),
    loadMore: React.useCallback(() => {
      for (let index = 0; index < treeFullData?.length; index++) {
        const element = treeFullData[index];
        if (
          element?.id === entity?.children?.[entity?.children?.length - 1]?.id
        ) {
          if (treeFullData?.length < index + PAGE_SIZE_TREE) {
            setEntity({
              ...entity,
              children: entity.children.concat(
                treeFullData?.slice(index + 1, treeFullData?.length)
              ),
            });
          } else {
            setEntity({
              ...entity,
              children: entity.children.concat(
                treeFullData?.slice(index + 1, index + PAGE_SIZE_TREE)
              ),
            });
          }
          break;
        }
      }
    }, [entity?.id, treeFullData.length, entity?.children?.length]),
    loadLess: React.useCallback(() => {
      for (let index = 0; index < treeFullData.length; index++) {
        const element = treeFullData[index];
        if (
          element?.id === entity?.children?.[entity?.children?.length - 1]?.id
        ) {
          if (entity?.children - PAGE_SIZE_TREE > 0) {
            setEntity({
              ...entity,
              children: entity.children.slice(
                0,
                entity?.children - PAGE_SIZE_TREE
              ),
            });
          } else {
            setEntity({
              ...entity,
              children: entity.children.slice(0, PAGE_SIZE_TREE),
            });
          }
          break;
        }
      }
    }, [entity?.id, treeFullData?.length, entity?.children?.length]),
    onSearchTree,
    searchText,
    setSearchText,
    customSetEntity,
  };
};
