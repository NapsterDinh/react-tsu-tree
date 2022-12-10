import { Select } from "antd";

import styled from "styled-components";

export const StyledSelect = styled(Select)`
  &&& {
    width: 40px;
    height: 40px;
    transition: all ease 0.5s;
    border-radius: 50%;

    &:hover {
      background-color: var(--background-color-cancel-btn-hover);
    }

    .ant-select-selection-item {
      transition: all ease 0.5s;
      display: none;
    }

    .ant-select-selector {
      border: none !important;
      outline: none !important;
      box-shadow: none !important;
      background: transparent !important;
    }
    .ant-select-arrow {
      color: inherit;
      left: 23%;
      img {
        width: 22px;
        height: 22px;
        object-fit: contain;
      }
    }
  }
`;
