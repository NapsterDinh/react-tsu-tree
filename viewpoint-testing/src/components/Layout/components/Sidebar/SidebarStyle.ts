import styled from "styled-components";

export const Wrapper = styled.div`
  &&& {
    * {
      color: var(--clr-text-second) !important;
    }
    position: relative;

    .version {
      position: absolute;
      bottom: 0.5rem;
      left: 0%;
      text-align: center;
      width: 100%;
    }

    svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
      .secondary {
        opacity: 0.4;
      }
    }

    .ant-menu-item:active {
      background-color: var(--background-color-selected-sidebar);
    }
    .ant-menu-item-selected {
      span {
        a {
          color: var(--clr-primary-1) !important;
        }
      }
      svg {
        path {
          color: var(--clr-primary-1) !important;
        }
      }
    }

    span {
      font-size: var(--font-size-span);
    }

    p {
      font-size: var(--font-size-p);
    }
    .ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
      background-color: var(--background-color-selected-sidebar);
    }
    .ant-layout-sider-children {
      transition: all 0.2s ease-in-out;
      background-color: var(--background-side-bar-color);
      ul {
        background-color: transparent;
      }
    }

    .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      height: 100vh;
      background: #fff;
    }
    .logo {
      display: flex;
      align-items: center;
      padding-left: 1.25rem;
      cursor: pointer;
      width: 100%;
      height: 60px;
      padding-top: 1rem;
      margin-bottom: 20px;

      .ant-typography {
        margin-left: 0.5rem;
        margin-bottom: 0;
        color: var(--clr-text);
        transition: all ease 0.5s;
      }
    }

    .logo__img {
      width: 14rem;
      transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    }

    .logo__title {
      margin-left: 0.5rem;
      margin-bottom: 0;
      color: var(--clr-text) !important;
      display: inline-block;
      font-size: 1.5rem;
      font-weight: 600;
      transition: opacity 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      opacity: 1;
    }

    .logo__title.collapsed {
      display: none;
      opacity: 0;
      transition: opacity 0.1s cubic-bezier(0.645, 0.045, 0.355, 1);
    }
    .logo__img.collapsed {
      margin-left: -20px;
      width: 5rem;
    }
  }
`;
