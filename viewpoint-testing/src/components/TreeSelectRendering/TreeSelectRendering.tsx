import { TreeSelect } from "antd";
import { useTranslation } from "react-i18next";
const TreeSelectRendering = ({ data }) => {
  const { t } = useTranslation();
  const renderTreeSelect = (array = []) => {
    return array.map((treeData) => {
      if (treeData?.children)
        return (
          <TreeSelect.TreeNode value={treeData?.value} title={treeData?.title}>
            {renderTreeSelect(treeData?.children)}
          </TreeSelect.TreeNode>
        );
      else
        return (
          <TreeSelect.TreeNode value={treeData?.value} title={treeData?.title}>
            {/* {treeData?.children && renderTreeSelect(treeData?.children)} */}
          </TreeSelect.TreeNode>
        );
    });
  };

  return (
    <>
      <TreeSelect
        // treeData={domainTree}
        treeCheckable={true}
        treeCheckStrictly={true}
        treeDefaultExpandAll
        // showCheckedStrategy={TreeSelect.SHOW_PARENT}
        // showCheckedStrategy={TreeSelect.SHOW_CHILD}
        multiple
        placeholder={t("common:common.select_domain")}
        filterTreeNode={(search, item) => {
          if (item?.title) {
            return (
              item.title
                .toString()
                .toLowerCase()
                .indexOf(search.toLowerCase()) >= 0
            );
          }
        }}
      >
        {renderTreeSelect(data)}
      </TreeSelect>
    </>
  );
};

export default TreeSelectRendering;
