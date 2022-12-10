import { CloseOutlined, LockOutlined, StarFilled } from "@ant-design/icons";
import { MAX_LENGTH_INPUT_NAME_FIELD } from "@utils/constantsUI";
import {
  checkContainsSpecialCharacter,
  deepCopy,
  loop,
  removeEmoji,
} from "@utils/helpersUtils";
import { showInfoNotification } from "@utils/notificationUtils";
import { generateList, TreeData } from "@utils/treeUtils";
import {
  Button,
  Dropdown,
  Input,
  Modal,
  Space,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineEllipsis } from "react-icons/ai";
import { OptionMenu, Wrapper } from "./ClonedProductTreeNodeStyle";
export type TreeNodeProps = {
  objectDataTree: TreeData;
  searchValue: string;
  node: TreeData;
  onDelete: (
    _nodeNeedToDelete: TreeData,
    _isDeleteAllChildren: boolean
  ) => void;
  onAdd: (_parentNodeAddNode: TreeData, _isAddSameLevel: boolean) => void;
  onSave: (_props: {
    _nodeNeedToSave: TreeData;
    _isAddNewChildSameLevelAfterSave?: boolean;
  }) => void;
  nodeEditing: TreeData;
  setNodeEditing: (_nextNodeEditing: TreeData) => void;
  error: string;
  setError: (_error: string) => void;
  checkOwner: boolean;
  expandedKeys: string[];
  setExpandedKeys: (_newExpandedKeys: string[]) => void;
  checkFakeNode: (_node: TreeData) => boolean;
  setLockedFunction: (_node: TreeData, _isLocked?: boolean) => void;
  checkHasLockedFunctionInObject: (_dataObject: TreeData) => void;
};

const ClonedProductTreeNode = ({
  objectDataTree,
  node,
  onDelete,
  onSave,
  onAdd,
  nodeEditing,
  setNodeEditing,
  setError,
  error,
  checkOwner,
  setLockedFunction,
  checkHasLockedFunctionInObject,
  checkFakeNode,
}) => {
  const { t } = useTranslation(["common", "responseMessage"]);
  const [content, setContent] = useState(node?.title); // content input
  const refNode = React.useRef(null);
  const handleShowDeleteConfirm = () => {
    if (checkHasLockedFunctionInObject(node)) {
      showInfoNotification(t("common:detail_product.has_locked_function"));
      return;
    }
    Modal.confirm({
      width: 600,
      title: (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {t("common:detail_product.modal_delete")}
          <CloseOutlined onClick={() => Modal.destroyAll()} />
        </div>
      ),
      content: t("common:detail_product.content_modal_delete"),
      cancelText: t("common:detail_product.delete_all_child"),
      okText: t("common:detail_product.delete_keep_child"),
      onCancel: async () => {
        try {
          await onDelete(node, true);
          Modal.destroyAll();
        } catch (error) {}
      },
      onOk: async () => {
        try {
          await onDelete(node, false);
          Modal.destroyAll();
        } catch (error) {}
      },
    });
  };
  // validate input
  const handleCheckErrors = (contentInput: string) => {
    // check the input content is empty
    if (!contentInput) {
      setError(t("validate:detail_product.function_name_is_required"));
      return true;
    }
    // check the input content contains special character
    if (
      checkContainsSpecialCharacter(contentInput.trim()) ||
      removeEmoji(contentInput)
    ) {
      setError(
        t(
          "validate:detail_product.function_name_can_not_contains_special_characters"
        )
      );
      return true;
    }
    if (contentInput.startsWith(" ") || contentInput.endsWith(" ")) {
      setError(t("validate:detail_product.function_name_trim_space"));
      return true;
    }
    if (contentInput?.trim().length > MAX_LENGTH_INPUT_NAME_FIELD) {
      setError(
        t("validate:detail_product.function_name_max_length", {
          MAX_LENGTH_INPUT_NAME_FIELD: MAX_LENGTH_INPUT_NAME_FIELD,
        })
      );
      return true;
    }
    if (contentInput.trim() === node?.title) {
      setNodeEditing(null);
      return true;
    }
    let isExisted = false;
    loop(objectDataTree?.children, node?.key, (item, index, arr) => {
      if (
        arr.some(
          (t) =>
            t?.key !== node?.key &&
            t?.viewDetail?.name?.toLowerCase() ===
              contentInput.toLowerCase().trim()
        )
      ) {
        isExisted = true;
      }
    });
    if (isExisted) {
      setError(t("validate:common.duplicated_function_name"));
      return true;
    }

    return false;
  };

  // double click content to show input
  const handleOnClick = (e: any) => {
    e.preventDefault();
    if (node?.isLocked) {
      return;
    }
    if (e.detail === 2) {
      if (checkOwner) {
        setNodeEditing(node);
      }
    }
  };

  // set keyboard shortcut event
  const handleOnKeyDown = (e: any) => {
    // keyboard Enter
    if (e.key === "Enter" || e.key === "tab") {
      e.preventDefault();
      handleSave(e); // save updated node
    }
    // keyboard Escape
    if (e.keyCode === 27) {
      setContent(node?.title);
      setNodeEditing(null); // cancel input
    }
  };

  // save node
  const handleSave = async (e: any) => {
    e.stopPropagation();

    const inputValue = (
      document.getElementById(`input-text-${node?.id}`) as HTMLInputElement
    ).value;

    if (handleCheckErrors(inputValue)) {
      return;
    }
    setContent(inputValue.trim());
    let isSuccess = false;
    if (checkFakeNode(node)) {
      isSuccess = await onSave({
        node: node,
        isAddNewChildSameLevelAfterSave: true,
        newContent: inputValue,
      });
    } else {
      isSuccess = await onSave({
        node: node,
        newContent: inputValue,
      });
    }

    !isSuccess && setContent(node?.title);
  };

  // count number element of node
  const handleCountNumberChildTreeNode = useMemo(() => {
    const flattenedDataNode = [];
    generateList(deepCopy(node.children), flattenedDataNode);
    return flattenedDataNode.length;
  }, [objectDataTree.children, node.children]);

  /**
   * Alert if clicked on outside of element
   */
  function handleClickOutside(event) {
    if (refNode.current && !refNode.current.contains(event.target)) {
      setNodeEditing(null);
    }
  }

  useEffect(() => {
    setContent(node?.title);
  }, [node?.title]);

  useEffect(() => {
    if (typeof node?.key !== "string" && nodeEditing?.key !== node?.key) {
      onDelete(node, true);
    }
  }, [nodeEditing?.key]);

  useEffect(() => {
    if (refNode) {
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refNode]);

  const menu = (
    <OptionMenu
      items={
        node?.isLocked
          ? [
              {
                key: "unlock_function",
                label: (
                  <Typography.Text>
                    {t("common:detail_product.unlock")}
                  </Typography.Text>
                ),
                onClick: () => {
                  Modal.confirm({
                    width: 600,
                    title: (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        {t("common:detail_product.unlock")}
                        <CloseOutlined onClick={() => Modal.destroyAll()} />
                      </div>
                    ),
                    content: t("common:detail_product.content_modal_unlock"),
                    cancelText: t("common:common.cancel"),
                    okText: t("common:common.ok"),
                    onOk: async () => {
                      try {
                        await setLockedFunction(node, false);
                      } catch (error) {}
                    },
                  });
                },
              },
            ]
          : [
              {
                key: "insert_new_node",
                label: (
                  <Typography.Text>
                    {t("common:detail_product.insert_new")}
                  </Typography.Text>
                ),
                onClick: () => {
                  let findNode = null;
                  loop(objectDataTree.children, node?.parentKey, (item) => {
                    findNode = deepCopy(item);
                  });
                  onAdd(findNode);
                },
              },
              {
                key: "create_new_child_node_leaf",
                label: (
                  <Typography.Text>
                    {t("common:detail_product.create_new_child")}
                  </Typography.Text>
                ),
                onClick: () => {
                  onAdd(node);
                },
              },
              {
                key: "edit",
                label: (
                  <Typography.Text>{t("common:common.edit")}</Typography.Text>
                ),
                onClick: () => {
                  setNodeEditing(node);
                },
              },
              {
                key: "delete",
                label: (
                  <Typography.Text>{t("common:common.delete")}</Typography.Text>
                ),
                onClick: handleShowDeleteConfirm,
              },
              {
                key: "lock_function",
                label: (
                  <Typography.Text>
                    {t("common:detail_product.lock")}
                  </Typography.Text>
                ),
                onClick: () => {
                  setLockedFunction(node);
                },
              },
            ]
      }
    />
  );

  return (
    <>
      {node?.key && nodeEditing?.key === node?.key ? (
        <Wrapper>
          <div ref={refNode} className="input-tree-node-container">
            <Tooltip
              title={error}
              visible={error && nodeEditing?.key === node.key ? true : false}
              color="#ff4d4f"
            >
              {/* OPTION 1 */}
              <Input.TextArea
                id={`input-text-${node?.id}`}
                className="input-text"
                onClick={(e) => e.stopPropagation()}
                value={content}
                autoFocus
                onChange={(e) => {
                  setContent(e.target.value);
                }}
                onFocus={(event) => event.target.select()}
                defaultValue={nodeEditing?.title}
                status={error ? "error" : ""}
                onKeyDown={handleOnKeyDown}
                autoSize={{ minRows: 1, maxRows: 3 }}
              />
            </Tooltip>
            <Space>
              <Button
                type="primary"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave(e);
                }}
              >
                {t("common:common.save")} {t("common:common.enter")}
              </Button>
              <Button
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOnKeyDown({ keyCode: 27 });
                }}
              >
                {t("common:common.cancel")} {t("common:common.esc")}
              </Button>
            </Space>
          </div>
        </Wrapper>
      ) : (
        <Wrapper
          className={`${node?.isLocked ? "disabled" : ""} ${
            node?.isMatch ? "matched" : ""
          } `}
        >
          <div
            className={`custom-tree-node ${node?.isLocked ? "disabled" : ""}`}
            onClick={handleOnClick}
          >
            <div className="custom-tree-node-container">
              <div className="custom-tree-node__title">
                {node?.isMatchPath && <StarFilled />}
                {node?.isLocked && <LockOutlined />}
                {content}
                {node?.children && handleCountNumberChildTreeNode !== 0 && (
                  <Tag color="#87d068">{handleCountNumberChildTreeNode}</Tag>
                )}
              </div>
              {checkOwner && (
                <div
                  className="option-tree-node"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Dropdown
                    overlay={menu}
                    trigger={["click"]}
                    placement="bottomRight"
                  >
                    <div className="option-tree-node-btn">
                      <AiOutlineEllipsis />
                    </div>
                  </Dropdown>
                </div>
              )}
            </div>
          </div>
        </Wrapper>
      )}
    </>
  );
};

export default ClonedProductTreeNode;
