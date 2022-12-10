import styled from "styled-components";

export const Wrapper = styled.div`
  &&& {
    .load-more-container {
      display: flex;
      justify-content: center;
      gap: 10px;
    }
    .check-all-container {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      .ant-checkbox-wrapper {
        margin-left: 48px;
        margin-top: 5px;
      }
      .lock-unlock-container {
        display: flex;
        gap: 10px;
      }
    }
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
    .switch-select-all {
      min-width: 100px;
      margin: 6px;
    }
  }
`;
