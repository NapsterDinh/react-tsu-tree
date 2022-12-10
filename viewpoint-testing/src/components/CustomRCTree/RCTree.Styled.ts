import styled from "styled-components";

export const WrapperRCTree = styled.div`
  .rc-tree {
    margin: 0;
    border: 1px solid transparent;

    &-focused:not(&-active-focused) {
      border-color: cyan;
    }

    // padding: 5px;
    .rc-tree-treenode {
      margin: 0;
      margin-bottom: 0px;
      padding: 0;
      line-height: 24px;
      white-space: nowrap;
      list-style: none;
      outline: 0;
      display: flex;
      align-items: center;
      .draggable {
        color: #333;
        -moz-user-select: none;
        -khtml-user-select: none;
        -webkit-user-select: none;
        user-select: none;
        /* Required to make elements draggable in old WebKit */
        // -khtml-user-drag: element;
        // -webkit-user-drag: element;
      }

      &.dragging {
        background: rgba(100, 100, 255, 0.1);
      }

      &.drop-container {
        > .draggable::after {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          box-shadow: inset 0 0 0 2px red;
          content: "";
        }
        & ~ .rc-tree-treenode {
          border-left: 2px solid chocolate;
        }
      }
      &.drop-target {
        background-color: yellowgreen;
        & ~ .rc-tree-treenode {
          border-left: none;
        }
      }
      &.filter-node {
        > .rc-tree-node-content-wrapper {
          color: #a60000 !important;
          font-weight: bold !important;
        }
      }
      ul {
        margin: 0;
        padding: 0 0 0 18px;
      }
      .rc-tree-node-content-wrapper {
        position: relative;
        display: inline-block;
        height: 100%;
        flex: 1;
        display: flex;
        align-items: center;
        margin: 0;
        padding: 0;
        text-decoration: none;
        vertical-align: top;
        margin-left: 10px;
        cursor: pointer;
        .rc-tree-title {
          flex: 1;
          display: block;
        }
        &.rc-tree-node-selected {
          background-color: var(--background-color-selected-sidebar);
          box-shadow: none;
          border-radius: 3px;
        }
        &:hover:not(.rc-tree-node-selected) {
          background-color: var(--background-color-selected-sidebar);
        }
      }
      span {
        &.rc-tree-switcher,
        &.rc-tree-checkbox,
        &.rc-tree-iconEle {
          position: relative;
          flex: none;
          align-self: stretch;
          width: 24px;
          margin: 0;
          line-height: 24px;
          text-align: center;
          cursor: pointer;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;

          &.rc-tree-icon__customize {
            background-image: none;
          }
        }
        &.rc-tree-icon_loading {
          margin-right: 2px;
          vertical-align: top;
          background: url("data:image/gif;base64,R0lGODlhEAAQAKIGAMLY8YSx5HOm4Mjc88/g9Ofw+v///wAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFCgAGACwAAAAAEAAQAAADMGi6RbUwGjKIXCAA016PgRBElAVlG/RdLOO0X9nK61W39qvqiwz5Ls/rRqrggsdkAgAh+QQFCgAGACwCAAAABwAFAAADD2hqELAmiFBIYY4MAutdCQAh+QQFCgAGACwGAAAABwAFAAADD1hU1kaDOKMYCGAGEeYFCQAh+QQFCgAGACwKAAIABQAHAAADEFhUZjSkKdZqBQG0IELDQAIAIfkEBQoABgAsCgAGAAUABwAAAxBoVlRKgyjmlAIBqCDCzUoCACH5BAUKAAYALAYACgAHAAUAAAMPaGpFtYYMAgJgLogA610JACH5BAUKAAYALAIACgAHAAUAAAMPCAHWFiI4o1ghZZJB5i0JACH5BAUKAAYALAAABgAFAAcAAAMQCAFmIaEp1motpDQySMNFAgA7")
            no-repeat scroll 0 0 transparent;
        }
        &.rc-tree-switcher {
          &.rc-tree-switcher-noop {
            cursor: auto;
          }
          &.rc-tree-switcher_open {
            background-position: -93px -56px;
          }
          &.rc-tree-switcher_close {
            background-position: -75px -56px;
          }
        }
        &.rc-tree-checkbox {
          top: initial;
          margin: 4px 8px 0 0;
          position: relative;
          display: block;
          width: 16px;
          height: 16px;
          direction: ltr;
          background-color: #fff;
          border: 1px solid #d9d9d9;
          border-radius: 2px;
          border-collapse: separate;
          transition: all 0.3s;
          &-checked {
            /* background-position: -14px 0; */
            background-color: var(--ant-primary-color);
            border-color: var(--ant-primary-color);

            &::after {
              position: absolute;
              width: 5.71428571px;
              height: 9.14285714px;
              top: 50%;
              left: 21.5%;
              display: table;
              border: 2px solid #fff;
              border-top: 0;
              border-left: 0;
              transform: rotate(45deg) scale(1) translate(-50%, -50%);
              opacity: 1;
              transition: all 0.2s cubic-bezier(0.12, 0.4, 0.29, 1.46) 0.1s;
              content: "";
            }
          }
          &-indeterminate {
            &::after {
              position: absolute;
              width: 10px;
              height: 10px;
              top: 21.5%;
              left: 21.5%;
              display: table;
              background-color: var(--ant-primary-color);
              border: 2px solid #fff;
              border-top: 0;
              border-left: 0;
              opacity: 1;
              transition: all 0.2s cubic-bezier(0.12, 0.4, 0.29, 1.46) 0.1s;
              content: "";
            }
          }
          &-disabled {
            cursor: not-allowed;
            background-color: #f5f5f5;
            border-color: #d9d9d9 !important;
          }

          &.rc-tree-checkbox-checked.rc-tree-checkbox-disabled {
            &::after {
              position: absolute;
              width: 5.71428571px;
              height: 9.14285714px;
              top: 50%;
              left: 21.5%;
              display: table;
              border: 2px solid #fff;
              border-top: 0;
              border-left: 0;
              border-color: #ccc;
              transform: rotate(45deg) scale(1) translate(-50%, -50%);
              opacity: 1;
              transition: all 0.2s cubic-bezier(0.12, 0.4, 0.29, 1.46) 0.1s;
              content: "";
            }
          }
          &.rc-tree-checkbox-indeterminate.rc-tree-checkbox-disabled {
            position: relative;
            background: #ccc;
            border-radius: 3px;
            &:after {
              position: absolute;
              top: 5px;
              left: 3px;
              width: 5px;
              height: 0;
              border: 2px solid #fff;
              border-top: 0;
              border-left: 0;
              -webkit-transform: scale(1);
              transform: scale(1);
              content: " ";
            }
          }
        }
      }
    }
    &:not(.rc-tree-show-line) {
      .rc-tree-treenode {
        .rc-tree-switcher-noop {
          background: none;
        }
      }
    }
    &.rc-tree-show-line {
      .rc-tree-treenode:not(:last-child) {
        > ul {
          background: url("data:image/gif;base64,R0lGODlhCQACAIAAAMzMzP///yH5BAEAAAEALAAAAAAJAAIAAAIEjI9pUAA7")
            0 0 repeat-y;
        }
        > .rc-tree-switcher-noop {
          background-position: -56px -18px;
        }
      }
      .rc-tree-treenode:last-child {
        > .rc-tree-switcher-noop {
          background-position: -56px -36px;
        }
      }
    }
    &-child-tree {
      display: none;
      &-open {
        display: block;
      }
    }
    &-treenode-disabled {
      > span:not(.rc-tree-switcher),
      > a,
      > a span {
        color: #767676;
        cursor: not-allowed;
      }
    }
    &-treenode-active {
      background: rgba(0, 0, 0, 0.1);

      // .rc-tree-node-content-wrapper {
      //   background: rgba(0, 0, 0, 0.1);
      // }
    }
    &-node-selected {
      background-color: #ffe6b0;
      box-shadow: 0 0 0 1px #ffb951;
      opacity: 0.8;
    }
    &-icon__open {
      margin-right: 2px;
      vertical-align: top;
      background-position: -110px -16px;
    }
    &-icon__close {
      margin-right: 2px;
      vertical-align: top;
      background-position: -110px 0;
    }
    &-icon__docu {
      margin-right: 2px;
      vertical-align: top;
      background-position: -110px -32px;
    }
    &-icon__customize {
      margin-right: 2px;
      vertical-align: top;
    }
    &-title {
      display: inline-block;
    }
    &-indent {
      display: inline-block;
      height: 0;
      vertical-align: bottom;
      flex: 0;
    }
    &-indent-unit {
      display: inline-block;
      width: 16px;
    }

    &-draggable-icon {
      display: inline-flex;
      justify-content: center;
      width: 16px;
    }
  }
  .animation {
    .rc-tree-treenode {
      display: flex;

      .rc-tree-indent {
        position: relative;
        align-self: stretch;
        display: flex;
        flex-wrap: nowrap;
        align-items: stretch;

        .rc-tree-indent-unit {
          position: relative;
          height: 100%;

          &::before {
            position: absolute;
            top: 0;
            bottom: 0;
            border-right: 1px solid blue;
            left: 50%;
            content: "";
          }

          &-end {
            &::before {
              display: none;
            }
          }

          // End should ignore
          // &-end {
          //   &::before {
          //     display: none;
          //   }
          // }
        }
      }

      .rc-tree-switcher-noop {
        flex: 0;
        &::before {
          content: "";
          display: inline-block;
          width: 16px;
          height: 16px;
          background: red;
          border-radius: 100%;
        }
      }

      // Motion
      &-motion:not(.node-motion-appear-active) {
        // .rc-tree-indent-unit {
        //   &::before {
        //     display: none;
        //   }
        // }
      }
    }
  }
`;
