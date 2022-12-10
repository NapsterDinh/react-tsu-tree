import styled from "styled-components";
import { Link } from "react-router-dom";
import { Button, Menu, Input } from "antd";
const { Search } = Input;

const Wrapper = styled.div`
  &&& {
    position: relative;
    header {
      position: relative;
      padding-top: 10px;
      height: 60px;
      transition: all 0.2s ease-in-out;
      background: transparent;
      border-bottom: 1px solid rgb(240, 240, 240);
      transition: all ease 0.2s;
      border: none;
    }
    .header-search-container {
      box-shadow: rgb(95 116 141 / 3%) 0px 2px 1px -1px,
        rgb(95 116 141 / 4%) 0px 1px 1px 0px,
        rgb(95 116 141 / 8%) 0px 1px 3px 0px;
      position: absolute;
      width: -webkit-fill-available;
      background-color: var(--background-side-bar-color);
      margin-left: 310px;
      display: flex;
      justify-content: space-between;
      margin-right: 60px;
      border-bottom-right-radius: var(--border-radius-element);
      border-bottom-left-radius: var(--border-radius-element);
      padding: 1.25rem 1rem;
      z-index: 999;
      transform: translateY(-200%);
      transition: transform 0.3s ease-in-out;
      .search-input-container {
        width: 70%;
        .input-header-search {
          margin-left: 2rem;
          background-color: transparent;
          border: none;
          outline: none;
          box-shadow: none;
          color: var(--clr-text);
          &::placeholder {
            /* Chrome, Firefox, Opera, Safari 10.1+ */
            color: var(--clr-text-second) !important;
          }

          &:-ms-input-placeholder {
            /* Internet Explorer 10-11 */
            color: var(--clr-text-second) !important;
          }

          &::-ms-input-placeholder {
            /* Microsoft Edge */
            color: var(--clr-text-second) !important;
          }
        }
        .ant-btn-icon-only {
          top: 7px;
        }
      }
      &.show {
        transform: translateY(-85%) !important;
      }
      &.collapsed {
        margin-left: 140px;
      }
    }
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  right: 0;
  transition: all 0.2s ease-in-out;
  background: transparent;
  border-bottom: 1px solid var(--border-color);
  z-index: 10;
  transition: all ease 0.5s;
`;

const NavbarContainer = styled.nav`
  &&& {
    width: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 1.75rem;
    min-height: 60px;
    transition: all ease 0.5s;

    @media screen and (max-width: 768px) {
      padding-left: 1rem;
      padding-right: 1rem;
      transition: all ease 0.5s;
    }
  }
`;

const HeaderSearch = styled(Search)`
  width: 300px;

  .ant-input,
  .ant-btn {
    color: var(--clr-text);
    background-color: var(--background-header-color);
    transition: all ease 0.5s;
  }

  .ant-btn svg {
    color: var(--clr-text);
    transition: all ease 0.5s;
  }
`;

const AvatarInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 6px;
  cursor: pointer;
  transition: all 0.5s ease 0s;

  &:hover {
    background-color: var(--background-hover-btn-icon);
    border-radius: 4px;
    transition: all 0.5s ease 0s;
  }

  .ant-avatar > svg {
    transform: translateY(2px);
  }

  h5.ant-typography {
    font-size: 0.875rem;
    margin-left: 0.5rem;
    margin-bottom: 0;
    color: var(--clr-text-second);
    font-weight: 600;
    transition: all ease 0.5s;
  }
`;

const ProfileMenu = styled(Menu)`
  width: 290px;
  min-width: 240px;
  max-width: 290px;
  padding: 0;
  box-shadow: rgb(0 0 0 / 14%) 0px 1px 1px, rgb(0 0 0 / 12%) 0px 2px 1px,
    rgb(0 0 0 / 20%) 0px 1px 3px;
  border-radius: var(--border-radius-list);
  background: var(--background-header-color);
  transition: all ease 0.5s;

  & > li {
    padding: 12px 16px;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
    transition: all ease 0.5s;
    background-color: var(--clr-background-menu-hover);

    &:hover {
      background-color: var(--clr-background-menu-hover);
      transition: all ease 0.5s;

      a,
      .ant-typography {
        color: var(--clr-text);
        transition: all ease 0.5s;
      }
    }

    a {
      display: flex;
      align-items: center;

      .ant-typography {
        margin-left: 1rem;
      }

      svg {
        font-size: 1rem;
      }
    }

    a,
    .ant-typography {
      color: var(--clr-text);
      transition: all ease 0.5s;
      font-size: 0.875rem;
    }
  }
`;

const HeaderLogo = styled(Link)`
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;

  .ant-typography {
    margin-left: 0.5rem;
    margin-bottom: 0;
    color: var(--clr-text);
    transition: all ease 0.5s;
  }
`;

const Logo = styled.img`
  width: 2rem;
  height: 2rem;
`;

const ButtonIcon = styled(Button)`
  position: absolute;
  /* top: 50; */
  left: 1rem;
  transform: translateY(22%);
  border: none;
  background: var(--background-icon);
  border-radius: var(--border-radius-icon) !important;
  z-index: 99;

  &:focus {
    background: var(--background-icon);
    transition: all ease 0.5s;
  }

  & > svg {
    color: var(--background-icon-dark-mode);
    transform: translateY(2px);
    transition: all ease 0.5s;
  }

  &:hover {
    background: var(--clr-background-icon-hover);
    transition: all ease 0.5s;
  }

  &:hover > svg {
    color: var(--clr-icon);
    transition: all ease 0.5s;
  }
`;

export {
  Wrapper,
  AvatarInfo,
  ButtonIcon,
  HeaderContainer,
  HeaderLogo,
  HeaderSearch,
  Logo,
  NavbarContainer,
  ProfileMenu,
};
