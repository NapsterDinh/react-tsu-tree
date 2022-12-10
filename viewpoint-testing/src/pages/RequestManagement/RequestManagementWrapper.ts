import styled from "styled-components";

export const RequestManagementWrapper = styled.div`
  &&& {
    color: var(--clr-text);
    .mr-t-20 {
      margin-top: 20px;
    }
    .container-sort {
      display: flex;
    }
    .ant-input-affix-wrapper {
      padding: 0;
    }

    .approve * {
      color: #52c41a !important;
    }

    .processing * {
      color: #1890ff !important;
    }

    .cancel * {
      color: #faad14 !important;
    }

    .reject * {
      color: #ff4d4f !important;
    }

    .waiting * {
      color: rgba(0, 0, 0, 0.85) !important;
    }
  }
`;
