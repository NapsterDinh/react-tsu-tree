import { Menu } from "antd";
import styled from "styled-components";

export const Wrapper = styled.div`
  &&& {
    .input-text {
      border: 1px solid #d9d9d9;
      outline: none;
      background-color: transparent;
      padding-top: 0px;
      padding-bottom: 0px;
      box-shadow: none;
    }
    .custom-tree-node {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .custom-tree-node-container {
        display: flex;
        gap: 8px;
        align-items: center;
        width: 100%;
        justify-content: space-between;
      }

      .custom-tree-node__title {
        font-weight: 500;
        padding: 2px 0px 2px 0px;
        max-width: 600px;
        width: max-content;
        overflow-wrap: break-word;
      }
      .option-tree-node {
        transition: all 0.3s ease-in-out;
        z-index: 99;
        padding-left: 3px;
        padding-right: 3px;
        background-color: var(--background-outline-button);
        border-radius: var(--border-radius-element);
        display: none;
        border: solid 1px var(--clr-text);
        height: 24px;
        align-items: center;
        gap: 0.75rem;
        cursor: pointer;
        svg {
          font-size: 20px;
          transform: translateY(4px);
          color: var(--clr-text);
        }
      }
      &:hover {
        .option-tree-node {
          display: flex;
        }
      }
      /* &:hover {
        .option-tree-node {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-left: 1rem;

          .option-tree-node-btn {
            height: 100%;
            width: auto;

            &.add {
              color: #52c41a;
            }

            &.edit {
              color: #1890ff;
            }
            &.delete {
              color: #ff4d4f;
            }
          }
          svg {
            font-size: 1rem;
            transform: translateY(3px);
          }
        }
      } */
    }
  }
`;

export const OptionMenu = styled(Menu)`
  width: 150px;
  padding: 0;
  box-shadow: rgb(0 0 0 / 14%) 0px 1px 1px, rgb(0 0 0 / 12%) 0px 2px 1px,
    rgb(0 0 0 / 20%) 0px 1px 3px;
  border-radius: var(--border-radius-list);
  transition: all ease 0.5s;
  background-color: var(--background-color-full-layout-dark-mode) !important;

  & > li {
    padding: 5px 10px;
    transition: all ease 0.5s;
    background-color: var(--clr-background-menu-hover);
    :first-child {
      border-top-left-radius: 0.25rem;
      border-top-right-radius: 0.25rem;
    }
    :last-child {
      border-bottom-left-radius: 0.25rem;
      border-bottom-right-radius: 0.25rem;
    }

    &:hover {
      background-color: var(--background-color-selected-sidebar);
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
