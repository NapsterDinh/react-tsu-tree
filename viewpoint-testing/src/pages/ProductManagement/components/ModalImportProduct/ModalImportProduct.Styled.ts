import styled from "styled-components";
export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 10px 20px 10px 20px;
  border: solid 1px var(--clr-text);
  border-radius: var(--border-radius-element);
  cursor: pointer;
  margin-top: 0.5rem;
  svg,
  h5,
  h4 {
    color: var(--clr-text);
    text-align: center;
    margin-bottom: 0.1rem;
    margin-top: 0.1rem !important;
  }
  .browse-file {
    color: var(--border-active);
  }
  svg {
    font-size: 70px;
  }
  .ant-upload-list-item-name {
    max-width: 350px;
    width: auto;
    color: var(--clr-text);
  }
  .ant-upload-list-item {
    margin-top: 2px;
  }
  .anticon-paper-clip svg,
  .anticon-delete svg {
    font-size: 1rem !important;
  }
  .ant-upload-list-item-card-actions {
    margin-top: -2px;
  }
  .ant-upload.ant-upload-drag {
    border: none;
    background-color: transparent;
    display: none;
  }
  .ant-upload-text-icon {
    margin-top: 3px;
  }
  &.empty {
    padding: 0px 20px 0px 20px;
    .ant-upload.ant-upload-drag {
      display: block;
    }
  }
  .ant-upload-list-text-container .ant-tooltip {
    display: none !important;
  }
  .ant-upload-list-item:hover .ant-upload-list-item-info {
    background-color: transparent !important;
  }
`;
