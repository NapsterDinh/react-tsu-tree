import styled from "styled-components";

export const Wrapper = styled.div`
  &&& {
    height: 100%;
    min-height: 630px;
    .detail-viewpoint-collection-tree {
      overflow: auto;
      height: 100%;
    }

    .detail-viewpoint-collection-empty {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .clone-btn {
      background-color: var(--clr-clone-btn);
      border-color: var(--clr-clone-btn);
      color: var(--clr-white);

      span {
        color: var(--clr-white);
      }
    }

    .clone-btn:hover {
    }

    .import-btn {
      background-color: var(--clr-import-btn);
      border-color: var(--clr-import-btn);
      color: var(--clr-white);

      span {
        color: var(--clr-white);
      }
    }

    .export-btn {
      background-color: var(--clr-export-btn);
      border-color: var(--clr-export-btn);
      color: var(--clr-white);

      span {
        color: var(--clr-white);
      }
    }

    .info-btn {
      background-color: var(--clr-info-btn);
      border-color: var(--clr-info-btn);

      span {
        color: var(--clr-white);
      }
    }

    .create-merge-request-btn {
      background-color: #ff4d4f;
      border-color: #ff4d4f;

      span {
        color: var(--clr-white);
      }
    }

    .cancel-btn {
      background-color: var(--clr-cancel-btn);
      border-color: var(--clr-cancel-btn);

      span {
        color: var(--clr-white);
      }
    }

    .publish-btn {
      background-color: var(--clr-publish-btn);
      border-color: var(--clr-publish-btn);

      span {
        color: var(--clr-white);
      }
    }

    .download-btn {
      background-color: var(--clr-download-btn);
      border-color: var(--clr-download-btn);

      span {
        color: var(--clr-white);
      }
    }
  }
`;

export const ElementWrapper = styled.div`
  height: 100%;
  min-height: 73vh;
  padding: 1.5rem;
  border-radius: var(--border-radius-element);
  background-color: var(--background-color-element);
  box-shadow: var(--box-shadow-element-wrapper);
  transition: all ease-in-out 0.2s;
`;
