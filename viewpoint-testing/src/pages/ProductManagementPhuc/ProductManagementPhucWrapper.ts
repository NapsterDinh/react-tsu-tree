import styled from "styled-components";

export const ProductManagementPhucWrapper = styled.div`
  color: var(--clr-text);
  .mr-t-20 {
    margin-top: 20px;
  }
  .container-sort {
    display: flex;
    margin-bottom: 30px;
  }
  .ant-input-affix-wrapper {
    padding: 0;
  }
  .search-container {
    display: flex;
    flex-direction: column;
    position: relative;
    .error-search {
      position: absolute;
      bottom: -50px;
    }
  }
`;
