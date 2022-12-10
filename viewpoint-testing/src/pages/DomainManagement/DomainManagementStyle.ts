import styled from "styled-components";

export const Wrapper = styled.div`
  &&& {
    label {
      font-weight: 500;
    }

    .bordered {
      border: 1px solid #d8d8d8;
    }

    .container {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 1rem;
    }

    .domain-tree-empty {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .domain-search {
      max-width: 100%;
      width: 540px;
    }

    .domain-tree {
      height: 540px;
      overflow: auto;
    }

    .domain-tree::-webkit-scrollbar-track {
      border-radius: 10px;
    }

    .domain-tree::-webkit-scrollbar {
      width: 6px;
    }

    .domain-tree::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: #d8d8d8;
    }

    .domain-detail {
      position: sticky;
      height: 540px;
    }

    .ant-input-search-small .ant-input-search-button {
      height: 32px;
    }

    .ant-form-item-control-input-content .ant-typography {
      color: var(--clr-text);
    }
  }
`;
