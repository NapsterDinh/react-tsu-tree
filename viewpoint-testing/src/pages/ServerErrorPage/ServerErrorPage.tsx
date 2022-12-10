import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { WrapperCenter } from "AppStyled";

const ServerErrorPage = () => {
  const navigate = useNavigate();
  return (
    <WrapperCenter>
      <Result
        status="500"
        title="Internal Server Error"
        subTitle="Server error 500. We are fixing the problem. Please try again at a later stage."
        extra={
          <Button
            type="primary"
            onClick={() => navigate("/", { replace: true })}
          >
            Back Home
          </Button>
        }
      />
    </WrapperCenter>
  );
};

export default ServerErrorPage;
