import { JsonDetail } from "@models/model";
import { DataTreeNode, ResponseDomain } from "@models/type";
import {
  checkContainsSpecialCharacter,
  removeEmoji
} from "@utils/helpersUtils";
import {
  showErrorNotification,
  showSuccessNotification
} from "@utils/notificationUtils";
import { generateList } from "@utils/treeUtils";
import { Button, Dropdown, Input, Space, Tag, Tooltip, Typography } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineEllipsis } from "react-icons/ai";
import { OptionMenu, Wrapper } from "./CustomTreeNodeStyle";

const CustomTreeNode = ({
  dataTree,
  searchValue,
  flattenedData,
  node,
  nodeEditing,
  setNodeEditing,
  setIsSelectable,
  setDataTree,
  setFlattenedData,
  callAddChildNodeApi,
  onDelete,
  onSave,
  onAdd,
  onUpdate,
  onShowDeleteNodeModal,
  onUpdateNameInDetailForm,
}) => {
  const { t } = useTranslation(["common", "validate", "responseMessage"]); // languages
  const [isShowInput, setIsShowInput] = useState(
    typeof node?.key === "number" ? true : false
  ); // show input to add child or edit
  const [content, setContent] = useState(node?.title); // content input
  const [contentSearch, setContentSearch] = useState(node?.titleSearch); // content show when search value has value
  const [isChangedInput, setIsChangedInput] = useState(true); // check content has been changed
  const [error, setError] = useState(""); // validate input

  // change input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setContent(value);
    handleCheckErrors(value);

    // check the input content changes compared to the original
    if (value === node?.title) {
      setIsChangedInput(true);
    } else {
      setIsChangedInput(false);
    }
  };

  // validate input
  const handleCheckErrors = (contentInput: string) => {
    // check the input content is empty
    if (!contentInput.trim()) {
      setError(t("validate:domain_management.name_is_required"));
    } else if (contentInput.trim().length !== contentInput.length) {
      setError(t("validate:domain_management.name_trim_space"));
    }
    // check the input content contains special character
    else if (
      checkContainsSpecialCharacter(contentInput.trim()) ||
      removeEmoji(contentInput)
    ) {
      setError(
        t("validate:domain_management.name_can_not_contains_special_characters")
      );
      return;
    } else setError("");
  };

  // cancel input editing
  const handleCancel = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    // check if current node is mock node
    if (nodeEditing && typeof nodeEditing.key === "number") {
      const result = [...dataTree];
      onDelete(node?.key, result); //delete mock node
      setDataTree(result);
    } else {
      // current node is not mock node
      setIsShowInput(false); // show input
      setContent(node.title); // set content input to original value
    }
    setNodeEditing(null); // set mock node to null
    setIsSelectable(true); // set value allows to select another node in the tree
    setError(""); // set empty error
  };

  // double click content to show input
  const handleOnClick = (e: any) => {
    e.preventDefault();
    if (e.detail === 2) {
      setIsShowInput(true); // show input
    }
    setError(""); // set empty error
  };

  // set keyboard shortcut event
  const handleOnKeyDown = (e: any) => {
    // keyboard Enter
    if (e.key === "Enter") {
      handleSaveDataNode(e); // save updated node
    }
    // keyboard Escape
    if (e.keyCode === 27) {
      handleCancel(e); // cancel input
    }
  };

  // save node
  const handleSaveDataNode = async (e: any) => {
    e.stopPropagation();
    // check the input content has changed or not error
    if (!isChangedInput && !error) {
      // update title of node
      if (typeof node?.key === "string") {
        const result = [...dataTree];
        const response: ResponseDomain = await onUpdate(node, content);
        try {
          if (response?.isSucceeded) {
            onSave(node.key, result, content);
            setDataTree(result);
            const newFlattenedData = flattenedData.map((item: DataTreeNode) => {
              if (item.key === node.key) return { ...node, title: content };
              return item;
            });
            setFlattenedData(newFlattenedData);
            onUpdateNameInDetailForm(content);
            setIsShowInput(false); // close input
            setIsChangedInput(true); // set check changed input to true
            setIsSelectable(true); // set value allows to select nodes on the tree
            setNodeEditing(null);
            showSuccessNotification(
              t("common:domain_management.update_successfully")
            );
          }
        } catch (error) {
          if (error?.code) {
            setError(error?.description);
          } else {
            setContent(node.title);
            showErrorNotification(t("common:domain_management.update_failed"));
            setIsShowInput(false); // close input
            setIsChangedInput(true); // set check changed input to true
            setIsSelectable(true); // set value allows to select nodes on the tree
            setNodeEditing(null);
          }
        }
      }
      // update id and title of mock node
      else {
        const result = [...dataTree];
        try {
          const response: ResponseDomain = await callAddChildNodeApi(
            node,
            content
          );
          if (response.isSucceeded) {
            const detail: JsonDetail = JSON.parse(
              response.data.detail as string
            );
            onSave(node.key, result, content, response.data.id);
            node.title = detail.Name;
            node.key = response.data.id;
            setDataTree(result);
            const newFlattenedData = flattenedData.map((item: DataTreeNode) => {
              if (item.key === node.key)
                return { ...node, title: content, key: response.data.id };
              return item;
            });
            setFlattenedData(newFlattenedData);
            onAdd(node.parentKey);
            setIsShowInput(false); // close input
            setIsChangedInput(true); // set check changed input to true
            setIsSelectable(true); // set value allows to select nodes on the tree
            showSuccessNotification(
              t("common:domain_management.create_successfully")
            );
            setError(""); // set empty error
          }
        } catch (error) {
          if (error?.code) {
            setError(error?.description);
          } else {
            onDelete(node.key, result);
            setDataTree(result);
            showErrorNotification("Error");
            setIsShowInput(false); // close input
            setIsChangedInput(true); // set check changed input to true
            setIsSelectable(true); // set value allows to select nodes on the tree
            setError(""); // set empty error
          }
        }
      }
      // check search value has value
      if (searchValue) {
        handleChangeTitle(content); // change the content of titleSearch in data
      } else {
        setContentSearch(null); // set empty content search
      }
    }
  };

  // handle change title in data of node
  const handleChangeTitle = (newContent: string) => {
    const strTitle = newContent?.toLowerCase();
    const indexTitle = strTitle?.indexOf(searchValue.toLowerCase());
    const beforeStr = newContent.substring(0, indexTitle);
    const afterStr = newContent.substring(indexTitle + searchValue.length);
    const newTitle = indexTitle > -1 && (
      <span>
        {beforeStr}
        <span className="site-tree-search-value">
          {newContent.substring(indexTitle, indexTitle + searchValue.length)}
        </span>
        {afterStr}
      </span>
    );
    setContentSearch(newTitle); // set new content with search value
  };

  // count number element of node
  const handleCountNumberChildTreeNode = useMemo(() => {
    const flattenedDataNode = [];
    generateList(node.children, flattenedDataNode);
    return flattenedDataNode.length;
  }, [dataTree, node, node.children]);

  const menu = (
    <OptionMenu
      items={[
        {
          key: "add",
          label: <Typography.Text>{t("common:common.add")}</Typography.Text>,
          onClick: () => {
            const result = [...dataTree];
            onDelete(nodeEditing?.key, result);
            setDataTree(result);
            onAdd(node.key);
          },
        },
        {
          key: "edit",
          label: <Typography.Text>{t("common:common.edit")}</Typography.Text>,
          onClick: () => {
            setIsShowInput(true);
            setIsSelectable(false);
            if (nodeEditing && typeof nodeEditing.key === "number") {
              const result = [...dataTree];
              onDelete(nodeEditing?.key, result);
              setDataTree(result);
            }
            setNodeEditing(node);
          },
        },
        {
          key: "delete",
          label: <Typography.Text>{t("common:common.delete")}</Typography.Text>,
          onClick: () => {
            onShowDeleteNodeModal(node.key);
          },
        },
      ]}
    />
  );

  // set content show when search value changed
  useEffect(() => {
    if (searchValue) {
      handleChangeTitle(content);
    } else {
      setContentSearch(null);
    }
  }, [searchValue]);

  // render
  if (isShowInput && nodeEditing?.key === node.key) {
    return (
      <Wrapper>
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <Tooltip title={error} visible={error ? true : false} color="#ff4d4f">
            <Input
              autoFocus
              status={error ? "error" : ""}
              onKeyDown={handleOnKeyDown}
              value={content}
              onChange={handleInputChange}
              width={100}
              className="input-text"
              onClick={(e) => {
                e.stopPropagation();
              }}
            />
          </Tooltip>
          <Space
            style={{
              width: "40%",
            }}
          >
            <Button
              disabled={isChangedInput}
              type="primary"
              size="small"
              onClick={(e) => {
                if (!error) {
                  handleSaveDataNode(e);
                }
              }}
            >
              {t("common:common.save")} [Enter]
            </Button>
            <Button size="small" onClick={handleCancel}>
              {t("common:common.cancel")} [ESC]
            </Button>
          </Space>
        </div>
      </Wrapper>
    );
  } else {
    return (
      <Wrapper>
        <div className="custom-tree-node">
          <div className="custom-tree-node-container">
            <Space direction="horizontal">
              <div onClick={handleOnClick} className="custom-tree-node__title">
                {contentSearch && contentSearch !== 0 ? contentSearch : content}
              </div>
              {node.children && handleCountNumberChildTreeNode !== 0 && (
                <Tag color="#87d068" style={{ fontSize: "0.75rem" }}>
                  {handleCountNumberChildTreeNode}
                </Tag>
              )}
            </Space>
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
              {/* {checkPermission(["DOMAIN.CREATE"]) && (
              <div className="option-tree-node-btn add">
                <AiOutlinePlusCircle
                  onClick={(e) => {
                    e.stopPropagation();
                    const result = [...dataTree];
                    onDelete(nodeEditing?.key, result);
                    setDataTree(result);
                    onAdd(node.key);
                  }}
                />
              </div>
            )}
            {checkPermission(["DOMAIN.UPDATE"]) && (
              <div className="option-tree-node-btn edit">
                <AiOutlineEdit
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsShowInput(true);
                    setIsSelectable(false);
                    if (nodeEditing && typeof nodeEditing.key === "number") {
                      const result = [...dataTree];
                      onDelete(nodeEditing?.key, result);
                      setDataTree(result);
                    }
                    setNodeEditing(node);
                  }}
                />
              </div>
            )}
            {checkPermission(["DOMAIN.DELETE"]) && (
              <div className="option-tree-node-btn delete">
                <AiOutlineDelete
                  onClick={(e) => {
                    e.stopPropagation();
                    onShowDeleteNodeModal(node.key);
                  }}
                />
              </div>
            )} */}
            </div>
          </div>
        </div>
      </Wrapper>
    );
  }
};

export default CustomTreeNode;
