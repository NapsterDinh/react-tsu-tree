import { default as RCTree } from "rc-tree";
import * as React from "react";
import { WrapperRCTree } from "./RCTree.Styled";
import { CaretRightOutlined } from "@ant-design/icons";

const CustomRCTree: React.FC<any> = (props) => {
  const switcherIcon = (obj) => {
    if (obj.isLeaf) {
      return "";
    }
    return (
      <CaretRightOutlined
        style={{
          cursor: "pointer",
          backgroundColor: "var(--background-color-element)",
          transform: `rotate(${obj.expanded ? 90 : 0}deg)`,
        }}
      />
    );
  };

  return (
    <WrapperRCTree>
      <RCTree {...props} switcherIcon={switcherIcon} icon={props?.isLocked} />
    </WrapperRCTree>
  );
};

export default CustomRCTree;
