import styled from "styled-components";

export const Wrapper = styled.div`
  .ant-tree,
  .ant-tree-show-line .ant-tree-switcher {
    background-color: var(--background-color-element);
    color: var(--clr-text);
    transition: all ease-in-out 0.2s;
  }

  .ant-tree .ant-tree-treenode {
    align-items: center;
    /* min-width: 870px; */
    width: 100%;
  }

  .ant-tree-switcher {
    align-self: unset;
  }

  .ant-tree .ant-tree-node-content-wrapper:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  .ant-tree .ant-tree-treenode-draggable .ant-tree-draggable-icon {
    cursor: grab;
  }
  .ant-tree-switcher .ant-tree-switcher-icon {
    transform: translateY(3px) !important;
    svg {
      font-size: 18px !important;
    }
  }
  .ant-tree.ant-tree-block-node .ant-tree-list-holder-inner {
    width: 100% !important;
  }
`;
