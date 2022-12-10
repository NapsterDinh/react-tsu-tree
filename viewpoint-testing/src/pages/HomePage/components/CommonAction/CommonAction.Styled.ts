import styled from "styled-components";

export const Wrapper = styled.div`
  &&& {
    .common-action {
      margin-bottom: 20px;
      margin-top: -10px;
      width: 100%;

      .error-search {
        position: absolute;
        color: red;
      }
      .search-container {
        gap: 0px !important;
      }
      p.label {
        margin-bottom: 8px;
      }
      @media (max-width: 1330px) {
        flex-direction: column;
        align-items: start;
      }
      @media (max-width: 1330px) {
        flex-direction: column;
        align-items: start;
      }
    }
  }
`;
