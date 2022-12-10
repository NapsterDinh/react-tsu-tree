import styled from "styled-components";

export const Wrapper = styled.div`
  &&& {
    position: relative;
    scroll-behavior: smooth;
    .ant-layout {
      background: var(--background-color-full-layout-dark-mode);
      transition: all ease-in-out 0.2s;
    }
    /* .ant-back-top {
      position: fixed;
      bottom: 50px;
      right: 30px;
      width: 50px;
      height: 50px;
      svg {
        font-size: 25px;
        margin-top: 5px;
      }
    } */
    .content {
      margin-left: 200px;
      padding: 0rem 1.75rem 1.75rem;
      min-height: calc(100vh - 60px);
      z-index: 10;
      transition: all 0.2s ease-in-out;
    }
  }
`;
