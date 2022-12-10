import styled from "styled-components";
export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 10px;
  .note {
    margin-bottom: 0px;
    color: var(--clr-text);
  }
  .ant-space:first-child {
    margin-right: 20px;
  }
`;
