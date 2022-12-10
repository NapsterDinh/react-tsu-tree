import styled from "styled-components";

export const Wrapper = styled.div`
  position: sticky;
  top: 5%;
  min-height: 83vh;
  padding: 1.5rem;
  border-radius: var(--border-radius-element);
  background-color: var(--background-color-element);
  box-shadow: var(--box-shadow-element-wrapper);
  transition: all ease-in-out 0.2s;
  .ant-tabs-tab-btn {
    color: var(--clr-text);
  }
  .ant-table-cell-fix-left,
  .ant-table-cell-fix-right,
  body .ant-table .ant-table-thead > tr > th {
    background-color: var(--background-side-bar-color) !important;
  }

  .ant-table-content::-webkit-scrollbar-track {
    background-color: var(--background-color-full-layout-dark-mode);
  }

  .ant-table-content::-webkit-scrollbar {
    height: 0.5rem;
  }

  .ant-table-content::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: var(--background-color-scrollbar);
  }
  .ant-table-tbody > tr > td {
    overflow-wrap: anywhere;
    white-space: break-spaces;
  }
`;
