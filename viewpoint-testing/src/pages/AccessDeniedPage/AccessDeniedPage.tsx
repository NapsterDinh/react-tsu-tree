import { Button, Result } from "antd";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Wrapper } from "./AccessDeniedPage.Styled";
const AccessDenied: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Wrapper>
      <Result
        status="403"
        title="Access Denied"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <Button
            type="primary"
            onClick={() => navigate("/", { replace: true })}
          >
            Back Home
          </Button>
        }
      />
    </Wrapper>
  );
};

export default AccessDenied;
