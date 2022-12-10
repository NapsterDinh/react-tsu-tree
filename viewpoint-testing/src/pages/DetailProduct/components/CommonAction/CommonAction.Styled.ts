import styled from "styled-components";

export const Wrapper = styled.div`
  .right-action-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    .top-action {
      justify-content: end;
      gap: 8px;
      /* margin-top: 20px; */
      display: flex;
    }
    .bottom-action {
      display: flex;
      justify-content: end;
      gap: 8px;
    }
    .tag-rating,
    .tag-status {
      margin: 0px;
      margin-left: 10px;
    }
  }
`;
