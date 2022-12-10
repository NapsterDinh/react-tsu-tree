import { Button } from "antd";
import styled from "styled-components";

export const ButtonIcon = styled(Button)`
  border: none;
  border-radius: var(--border-radius-icon) !important;
  transition: all 0.5s ease 0s;
  position: relative;

  & > svg {
    color: #f6cc46;
    transform: translateY(2px);
    font-size: 20px !important;
    margin-top: 2px;
  }
`;
