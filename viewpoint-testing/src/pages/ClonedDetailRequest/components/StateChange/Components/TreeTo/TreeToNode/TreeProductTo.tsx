import { LockOutlined } from "@ant-design/icons";
import { ENUM_DEEP_DIFF } from "@utils/constants";
import { deepCopy } from "@utils/helpersUtils";
import { generateList } from "@utils/treeUtils";
import { Dropdown, Tag, Typography } from "antd";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineEllipsis } from "react-icons/ai";
import { TreeData } from "../TreeTo";
import { OptionMenu, Wrapper } from "./TreeToNode.Style";

export type TreeNodeProps = {
  objectDataTree: TreeData;
  searchValue: string;
  node: TreeData;
  expandedKeys: string[];
};

const TreeProductToNode = ({
  objectDataTree,
  node,
  setSelectedNode,
  transferNode,
  overrideNode,
  setOpenModalDetail,
  setIsOpenDetailBoth,
}) => {
  const { t } = useTranslation(["common", "responseMessage"]);
  const handleOnClick = (e: any) => {
    e.preventDefault();
    if (node?.isLocked) {
      return;
    }
  };

  const menu = (
    <OptionMenu
      items={[
        {
          key: "edit_detail_info_to",
          label: (
            <Typography.Text>{t("common:common.detail_info")}</Typography.Text>
          ),
          onClick: () => {
            setSelectedNode(node);
            setOpenModalDetail(true);
          },
        },
        node?.typeCompare === ENUM_DEEP_DIFF.VALUE_UPDATED && {
          key: "compare_node",
          label: (
            <Typography.Text>
              {t("common:detail_request.compare")}
            </Typography.Text>
          ),
          onClick: () => {
            setSelectedNode(node);
            setIsOpenDetailBoth(true);
          },
        },
        node?.typeCompare === ENUM_DEEP_DIFF.VALUE_UPDATED && {
          key: "override_node",
          label: (
            <Typography.Text>
              {t("common:detail_request.override")}
            </Typography.Text>
          ),
          onClick: () => {
            overrideNode(node);
          },
        },
        !node?.typeCompare && {
          key: "transfer_node",
          label: (
            <Typography.Text>
              {t("common:detail_request.transfer")}
            </Typography.Text>
          ),
          onClick: () => {
            transferNode(node);
          },
        },
      ]}
    />
  );

  // count number element of node
  const handleCountNumberChildTreeNode = React.useMemo(() => {
    const flattenedDataNode = [];
    generateList(deepCopy(node.children), flattenedDataNode);
    return flattenedDataNode.length;
  }, [objectDataTree.children, node.children]);

  return (
    <Wrapper
      className={`tree-node-wrapper ${node?.isLocked ? "disabled " : ""}  ${
        node?.typeCompare + " " ?? ""
      }
        ${node?.isDuplicated ? ENUM_DEEP_DIFF.VALUE_DUPLICATED : ""}
      `}
    >
      <div
        className={`custom-tree-node ${node?.isLocked ? "disabled" : ""}`}
        onClick={handleOnClick}
      >
        <div className="custom-tree-node-container">
          <div className="custom-tree-node__title">
            {node?.isLocked && <LockOutlined style={{ marginRight: 10 }} />}
            {node?.title}
            {node.children && handleCountNumberChildTreeNode !== 0 && (
              <Tag
                color="#87d068"
                style={{
                  fontSize: "0.75rem",
                  borderRadius: "50%",
                  marginLeft: 10,
                }}
              >
                {handleCountNumberChildTreeNode}
              </Tag>
            )}
            {node?.isDuplicated && (
              <Tag
                color="#f5222d"
                style={{
                  fontSize: "0.75rem",
                  borderRadius: 5,
                  marginLeft: 10,
                }}
              >
                {t("common:common.duplicated")}
              </Tag>
            )}
          </div>
          <div
            className="option-tree-node more"
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
        </div>
      </div>
    </Wrapper>
  );
};

export default TreeProductToNode;
