import styled from "styled-components";
import { Button, Layout } from "antd";
const { Header, Content } = Layout;

export const StyledAuthLayout = styled(Layout)`
  width: 100%;
  height: 100vh;
  .ant-select-show-arrow
  {
    transform: translateY(-2px);
  }
  .ant-btn-icon-only
  {
    transform: translateY(3px);
  }
`;

export const AuthHeader = styled(Header)`
  background: var(--background-header-color);
  padding: 0;
  border-bottom: 1px solid var(--border-color);
`;

export const WrapperHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: var(--max-width-pc-screen);
  max-width: 100%;
  height: 60px;
  padding: 0 var(--padding-left-right-layout);
  margin: auto;
`;

export const AuthContent = styled(Content)`
  height: calc(100vh - 80px);
  padding: 2rem;
  background: var(--background-color-full-layout-dark-mode);
`;

export const WrapperContent = styled.div`
  margin-top: 100px!important;
  width: var(--max-width-pc-screen);
  max-width: 100%;
  padding: 0 var(--padding-left-right-layout) 1rem;
  margin: auto;
  display: flex;
  align-items: center;
`;

export const Logo = styled.img`
  width: 80px;
  height: 80px;
`;

export const ButtonIcon = styled(Button)`
  border: none;
  background: var(--background-icon);
  border-radius: var(--border-radius-icon) !important;
  transition: all 0.5s ease 0s;
  position: relative;

  &:focus {
    background: var(--background-icon);
  }

  & > svg {
    color: var(--clr-icon);
    transform: translateY(2px);
  }

  &:hover {
    background: var(--clr-background-icon-hover);
  }

  &:hover > svg {
    color: var(--clr-icon);
  }
`;
