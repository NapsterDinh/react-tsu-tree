import styled from "styled-components";
export const Wrapper = styled.div`
  height: 100%;
  background-color: var(--background-color-full-layout-dark-mode);
  .ant-result {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    transform: translateY(-10%);
    .ant-result-icon.ant-result-image {
      margin: 0px 0px 0px 24px;
    }
  }
`;
