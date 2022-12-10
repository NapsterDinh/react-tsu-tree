import styled, { createGlobalStyle } from "styled-components";
export const GlobalStyle = createGlobalStyle`
  * {
    font-family: ${() => {
      const language = localStorage.getItem("i18nextLng");
      language;
      switch (language) {
        case "en":
          return "Montserrat";
        case "vi":
          return "Montserrat";
        case "jp":
          return "Montserrat";
        default:
          return "Montserrat";
      }
    }}
  }
  body {
    color: var(--clr-text);
    font-weight: 500;
    .chartBox{
      width: 100%!important;
      height: 500px!important;
    }
    .ant-back-top
    {
      right: 50px;
      z-index: 99999999;
    }
    .full-opacity-spin
    {
      .ant-spin-container.ant-spin-blur
      {
        opacity: 0;
      }
    }
    .ant-btn-default:disabled
    {
      background-color: var(--background-side-bar-color);
      &:hover
      {
        background-color:var(--background-color-selected-sidebar);
      }
    }
    .ant-tabs-top>.ant-tabs-nav:before{
      border: solid 1px #d9d9d9;
    }
    .ant-list-split .ant-list-item
    {
      border-bottom: solid 1px #d9d9d9;
    }
    .ant-modal-header {
      border-bottom: 1px solid #d9d9d9
    }
    .ant-modal-footer
    {
      border-top: 1px solid #d9d9d9;
    }
    .ant-rate-star-zero,
    .ant-rate-star-focused
    {
      .ant-rate-star-first,
      .ant-rate-star-second
      {
        color: var(--clr-text);
      }
      &.ant-rate-star-full
      {
        .ant-rate-star-first,
        .ant-rate-star-second
        {
          color:inherit
        }
      }
      &.ant-rate-star-half
      {
        .ant-rate-star-first
        {
          color:inherit
        }
      }
    }
    .ant-rate-star-half
    {
      .ant-rate-star-second
      {
        color: var(--clr-text);
      }
    }
    .ant-tree .ant-tree-treenode-disabled .ant-tree-node-content-wrapper
    {
      color: var(--clr-text)!important;
      opacity: 0.6;
    }
    .table-row-menu-dropdown
    {
        font-size: 20px;
        color: #5F6368;
        margin-right: 15px;
    }
    .ant-checkbox+span
    {
      color: var(--clr-text)!important;
    }

    .ant-btn-icon-only
    {
      background-color: transparent;
      border: none;
      box-shadow: none;
      border-radius: 50%!important;
      width: 40px;
      height: 40px;
      padding: 8px;
      padding-top: 6px;
      svg
      {
        font-size: var(--font-size-icon-header);

      }
      &:hover
      {
        background-color: var(--background-hover-btn-icon);
      }
    }

    .ant-select
    {
      font-size: var(--font-size-span);
      .ant-select-selector
      {
        border-radius: var(--border-radius-element)!important;
        background-color: var(--background-side-bar-color)!important;
          transition: all 0.1s ease-in-out;
      }
      .ant-select-selection-item,
      .ant-select-arrow
      {
        color: var(--clr-text);
      }
    }

    /* input
    {
      font-size: var(--font-size-span)!important;
      padding: 5px 10px 5px!important;
    } */

    /* button */
    .ant-btn
    {
      border-radius: var(--border-radius-element);
      span
      {
        font-size: var(--font-size-span);
      }
    }

    .ant-btn-default:focus {
      background: initial;
    }

    .ant-btn-default {
      color: var(--clr-text) !important;
      background-color: transparent;
    }

    .ant-btn-default:hover {
      background-color: var(--background-color-cancel-btn-hover);
    }

    .ant-btn-primary[disabled], .ant-btn-primary[disabled]:active, .ant-btn-primary[disabled]:focus, .ant-btn-primary[disabled]:hover {
      color: var(--clr-white);
      border-color: #1890ff;
      background: #1890ff;
      opacity: 0.6;
    }

    /* breadcrumb */
    .ant-breadcrumb
    {
      span
      {
        font-size: var(--font-size-span);
        color: var(--clr-text-second);
        &.ant-breadcrumb-link
        {
          color: var(--clr-text);
        }
      }
    }
    .ant-checkbox-disabled+span
    {
      color: var(--clr-background-icon-hover);
    }

    .ant-pagination-options
    {
      span
      {
        font-size: var(--font-size-span);
      }
    }

    /* dropdown */
    .ant-select-dropdown {
      padding: 0;
      border-radius: var(--border-radius-list);
      background-color: var(--background-side-bar-color);

      .ant-select-item-option-content {
        color: var(--clr-text);
      }

      .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
        background-color: var(--clr-background-menu-hover);
      }

      .ant-select-item-option-active:not(.ant-select-item-option-disabled) {
        background-color: var(--clr-background-menu-hover);
      }
    }

    .ant-result-title {
      font-weight: 600;
      font-size: 2.375rem;
    }

    .site-tree-search-value {
      color: #f50;
    }

    .ant-menu-vertical .ant-menu-item,
    .ant-menu-inline .ant-menu-item:not(:last-child) {
      margin: 0;
    }

    .ant-menu-item:active, .ant-menu-submenu-title:active {
      background-color: unset;
    }

    /* table ant*/
    .ant-table
    {
      box-shadow: var(--box-shadow-table);
      border-radius: var(--border-radius-element);
      background-color: var(--background-color-element);
      transition: all ease-in-out 0.2s;
      thead th.ant-table-cell
      {
        color: var(--clr-text);
        font-weight: 600!important;
        font-size: var(--font-size-span);

        &:first-child
        {
          border-top-left-radius: var(--border-radius-element);
        }

        &:last-child
        {
          border-top-right-radius: var(--border-radius-element);
        }
      }

      tbody td *, tbody td
      {
        color: var(--clr-text);
        font-size: var(--font-size-span);
      }

      .ant-table-tbody > tr > td
      {
        border: none;
        background-color: var(--background-color-element);
      }

      .ant-table-thead th.ant-table-column-has-sorters.ant-table-cell-fix-left:hover,
      .ant-table-thead th.ant-table-column-has-sorters.ant-table-cell-fix-right:hover,
      .ant-table-thead th.ant-table-column-sort
      .ant-table-tbody > tr.ant-table-row:hover > td,
      .ant-table-tbody > tr > td.ant-table-cell-row-hover,
      .ant-table-thead th.ant-table-column-has-sorters:hover
      {
        background-color: var(--background-color-element);
      }

      .ant-table-tbody>tr.ant-table-placeholder:hover>td {
        background: none;
      }

      .ant-table-row-expand-icon {
        background-color: var(--background-color-element);
      }

      tr.ant-table-expanded-row>td,
      .ant-table-thead>tr>th
      {
        background: var(--background-color-element);
      }

      .ant-table-cell-fix-left, .ant-table-cell-fix-right {
        background: var(--background-color-element);
      }

      .ant-table-filter-trigger:hover {
        color: inherit;
        background: inherit;
      }
    }

    .ant-table-filter-dropdown {
      border-radius: var(--border-radius-element);
      background-color: var(--background-color-element);
    }

    .ant-dropdown-menu {
      background-color: var(--background-color-element);
    }

    .ant-dropdown-menu-item, .ant-dropdown-menu-submenu-title {
      color: var(--clr-text);
    }

    .ant-dropdown-menu-item:hover,
    .ant-dropdown-menu-item-selected,
    .ant-dropdown-menu-submenu-title-selected,
    .ant-table-filter-dropdown-tree .ant-tree-treenode .ant-tree-node-content-wrapper:hover,
    .ant-table-filter-dropdown-tree .ant-tree-treenode-checkbox-checked .ant-tree-node-content-wrapper {
      background-color: var(--clr-background-menu-hover);
    }

    .ant-table-filter-dropdown-btns {
      border-bottom-left-radius: var(--border-radius-element);
      border-bottom-right-radius: var(--border-radius-element);
    }

    .ant-tree {
      color: var(--clr-text);
    }

    .ant-tree .ant-tree-treenode:not(.ant-tree .ant-tree-treenode-disabled).filter-node .ant-tree-title {
      font-weight: 800;
    }

    /* selector */
    .ant-select:not(.ant-select-customize-input) .ant-select-selector {
      border-radius:var(--border-radius-element);
      background-color: var(--background-color-element);
      /* border: solid 1px var(--clr-text-second); */
      transition-duration: 0.2s;
    }

    .ant-select-selection-item,
    .ant-select-arrow  {
      color: var(--clr-text-second);
      font-weight: 500;
    }

    /* input */
    .ant-input, .ant-input-number, .ant-picker-input>input {
      color: var(--clr-text) !important;
      font-weight: 500 !important;
      border-radius: 0.25rem;
    }

    .ant-input::placeholder, .ant-input-number::placeholder {
      color: var(--clr-text-second);
    }

    .ant-input-status-error:not(.ant-input-disabled):not(.ant-input-borderless).ant-input, .ant-input-status-error:not(.ant-input-disabled):not(.ant-input-borderless).ant-input:hover,
    .ant-input-number-status-error:not(.ant-input-number-disabled):not(.ant-input-number-borderless).ant-input-number, .ant-input-number-status-error:not(.ant-input-number-disabled):not(.ant-input-number-borderless).ant-input-number:hover,
    .ant-picker-input-status-error:not(.ant-picker-input-disabled):not(.ant-picker-input-borderless).ant-picker-input, .ant-picker-input-status-error:not(.ant-picker-input-disabled):not(.ant-picker-input-borderless).ant-picker-input:hover,
    .ant-picker-status-error.ant-picker, .ant-picker-status-error.ant-picker:not([disabled]):hover
    {
      background-color: var(--background-color-element);
    }

    /* search */
    .ant-input-search .ant-input-group .ant-input-affix-wrapper:not(:last-child),
    .ant-input-group>.ant-input:first-child {
      border-top-left-radius:var(--border-radius-element);
      border-bottom-left-radius:var(--border-radius-element);
    }

    .ant-input-affix-wrapper,
    .ant-input-group-addon,
    .ant-input, .ant-input-number, .ant-picker {
      background-color: var(--background-color-element);
      border-radius: var(--border-radius-element);
    }
    .ant-input-number, .ant-picker{
      width: 100%;
    }
    .ant-picker-input span svg
    {
      color: var(--clr-text-second);
    }
    

    .ant-input-prefix > .anticon > svg {
      color: var(--clr-text-second);
    }

    /* modal */
    .ant-modal-content,
    .ant-modal-header {
      background-color: var(--background-color-full-layout-dark-mode);
    }

    .ant-modal-content {
      border-radius: 0.25rem;
    }

    .ant-modal-header {
      border-radius: 0.25rem 0.25rem 0 0;
    }

    .ant-modal-close {
      color: var(--clr-text-second);
    }

    .ant-modal-close:focus, .ant-modal-close:hover{
      color: var(--clr-text-second);
    }

    .ant-modal-header .ant-modal-title,
    .ant-form-item-label>label,
    .ant-form-item-label>label .ant-form-item-tooltip {
      color: var(--clr-text);
    }

    .ant-modal-confirm-title
    {
      color: var(--clr-text-second)!important;
    }
    .ant-modal-confirm-content
    {
      color: var(--clr-text)!important;
    }

    .ant-form-item-control-input-content > input.ant-input {
      color: var(--clr-text);
      font-weight: 500;
    }

    .ant-form-item-control-input-content > input.ant-input::placeholder {
      color: var(--clr-text-second);
    }

    .ant-input-textarea-show-count:after
    {
      color: var(--clr-text);
    }

    .ant-modal-wrap::-webkit-scrollbar {
      width: 0;
    }

    /* empty */
    .ant-empty-description {
      color: var(--clr-text);
    }

    /* pagination */
    .ant-pagination-item a {
      color: var(--clr-text);
    }

    .ant-pagination-total-text {
      color: var(--clr-text);
    }

    .ant-pagination-item-active a {
      color: #1890ff !important;
    }

    .ant-pagination li
    {
      border-radius: var(--border-radius-element)!important;
      background-color: transparent!important;
      border-color: var(--border-active)!important;
      &.ant-pagination-disabled
      {
        opacity: 0.6;
      }
      button
      {
        border-radius: var(--border-radius-element)!important;
        background-color: transparent!important;
        border-color: var(--border-active)!important;
        opacity: 0.6;
        span svg
        {
          margin-top: 6px;
          margin-left: -1px;
          color: var(--border-active);
        }
      }
      &.ant-pagination-item-active
      {
        opacity: 1;
      }
      &.ant-pagination-options
      {
        .ant-select-selector
        {
          background-color: var(--background-side-bar-color)!important;
          transition: all 0.1s ease-in-out;
        }
        .ant-select-selection-item,
        .ant-select-arrow
        {
          color: var(--clr-text);
        }
      }
    }

    .ant-pagination-options-quick-jumper {
      color: var(--clr-text);
    }

    /* description */
    .ant-descriptions-item-label {
      color: var(--clr-text-second);
    }

    .ant-descriptions-title,
    .ant-descriptions-item-content {
      color: var(--clr-text);
    }

    /* tree */
    .ant-tree.ant-tree-block-node .ant-tree-list-holder-inner .ant-tree-treenode.dragging[aria-expanded="true"] {
      cursor: grabbing;
    }

    /* tree select */
    .ant-select-tree {
      background-color: var(--background-color-element);
      color: var(--clr-text);
    }
    .ant-tree .ant-tree-node-content-wrapper{
      border-radius: 5px;
    }
    .ant-select-tree .ant-select-tree-node-content-wrapper:hover{
      background-color: var(--clr-background-menu-hover);
    }
    .ant-tree .ant-tree-node-content-wrapper.ant-tree-node-selected {
      background-color: var(--clr-background-menu-hover);
    }
    .ant-select,
    .ant-select-multiple .ant-select-selection-item-content {
      color: var(--clr-text);
    }

    .ant-select-multiple .ant-select-selection-item {
      background-color: #1890ff;
      border: #1890ff;
    }

    .ant-select-multiple .ant-select-selection-item-content,
    .ant-select-multiple .ant-select-selection-item-remove>.anticon {
      color: var(--clr-white);
    }

    .ant-tree .ant-tree-node-content-wrapper:hover {
      background-color: var(--clr-background-menu-hover);
    }

    .ant-input[disabled]
    {
      background-color: transparent!important;
    }

    /* tooltip */
    .ant-tooltip-inner {
      border-radius: var(--border-radius-element);
    }

    /* timeline */

  }
`;

export const ElementWrapper = styled.div`
  /* height: 100%; */
  /* min-height: 630px; */
  padding: 1.5rem;
  border-radius: var(--border-radius-element);
  background-color: var(--background-color-element);
  box-shadow: var(--box-shadow-element-wrapper);
  transition: all ease-in-out 0.2s;
`;

export const SpinContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100vw;
  align-items: center;
  justify-content: center;
`;

export const WrapperCenter = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SearchContainer = styled.div`
  width: 100%;
  max-width: 320px;
`;
