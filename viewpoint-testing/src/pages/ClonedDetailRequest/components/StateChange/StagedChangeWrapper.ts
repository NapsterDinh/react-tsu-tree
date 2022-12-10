import styled from "styled-components";

export const StateChangeWrapper = styled.div`
  .container-required {
    border: 1px solid;
  }
  color: var(--clr-text);
  .tree1 .ant-tree-treenode-selected:before {
    background: #ff4d4f !important;
  }
  .tree1 .ant-tree-treenode-selected {
    background: #ff4d4f !important;
  }
  .tree2 .ant-tree-treenode-selected {
    background: #52c41a !important;
  }
  .tree2 .ant-tree-treenode-selected:before {
    background: #52c41a !important;
  }
  .icon-arrow {
    color: #fff;
    margin-right: 20px;
  }
  .icon-arrow:hover {
    opacity: 0.8;
  }

  .ant-tree-treenode:has(.container-change) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #ffec3d;
  }
  .container-icon {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .top-action {
    user-select: none;
  }
`;

export const ElementWrapper = styled.div`
  height: 100%;
  min-height: 73vh;
  padding: 1.5rem;
  border-radius: var(--border-radius-element);
  background-color: var(--background-color-element);
  box-shadow: var(--box-shadow-element-wrapper);
  transition: all ease-in-out 0.2s;
`;
