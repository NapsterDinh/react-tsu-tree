import styled from "styled-components";

export const WrapperLogin = styled.div`
  width: 100%;
`;

export const ThumbnailLogin = styled.img`
  max-width: 500px;
  border-radius: var(--border-radius-element);
`;

export const FormLogin = styled.div`
  background: var(--background-side-bar-color);
  box-shadow: var(--box-shadow-element-wrapper);
  padding: 0 2rem 2rem 2rem;
  border-radius: var(--border-radius-element);
  overflow: hidden;
  position: relative;
  margin: auto;

  .ant-space {
    display: flex;
    flex-direction: column;
    margin-bottom: 1.5rem;
    z-index: 1;
  }

  .ant-input-affix-wrapper {
    z-index: 1;
    border: 1px solid #d9d9d9;
    background-color: var(--background-side-bar-color) !important;
    .ant-input-prefix svg {
      color: var(--clr-text);
    }
  }
  svg {
    color: var(--clr-text);
  }

  h2.ant-typography {
    font-weight: 700;
    color: var(--clr-text);
    margin-top: 40px;
  }

  span.ant-typography {
    color: var(--clr-text);
  }

  .ant-form-item-label > label {
    font-size: 1rem;
    font-weight: 500;
    color: var(--clr-text);
  }

  .ant-btn {
    width: 100%;
    z-index: 1;
  }

  .ant-btn > span {
    color: #fff !important;
    text-transform: uppercase;
    font-weight: 500;
    letter-spacing: 0.3px;
  }
`;

export const Logo = styled.img`
  width: 100px;
  height: 100px;
`;
