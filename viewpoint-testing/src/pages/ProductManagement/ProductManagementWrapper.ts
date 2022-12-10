import styled from "styled-components";

export const ProductManagementWrapper = styled.div`
  && {
    color: var(--clr-text);
    .ant-form-item-required {
    }

    .anticon-star * {
      color: #fadb14 !important;
    }

    .btn-submit {
      color: #fff !important;
    }
    .icon-close {
      font-size: 18px;
      padding: 6px;
    }
    .icon-close:hover {
      color: #e73535;
    }
    .btn-action {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 40px;
      height: 40px;
      color: var(--clr-text);
      background-color: var(--background-color-element);
    }
    .btn-action:hover {
      cursor: pointer;
    }
    .icon-action {
      font-size: 1rem;
    }
    .icon-action:hover {
      cursor: pointer;
    }
    .filter-item {
      margin-right: 14px;
    }
  }
`;
