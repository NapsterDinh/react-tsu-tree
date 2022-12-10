import styled from "styled-components";

export const RoleManagementWrapper = styled.div`
  color: var(--clr-text);

  svg {
    font-size: var(--font-size-icon-action-table) !important;
  }

  .anticon svg {
    font-size: 14px !important;
  }

  .active * {
    color: #52c41a !important;
  }

  .inactive * {
    color: rgba(0, 0, 0, 0.85) !important;
  }
`;
