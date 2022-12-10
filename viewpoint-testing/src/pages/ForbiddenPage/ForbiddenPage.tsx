import { Button, Result } from "antd";
import * as React from "react";
import { useNavigate } from "react-router-dom";

const ForbiddenPage = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="403"
      title="Forbidden"
      subTitle="Sorry, you have not permission to access this page."
      extra={
        <Button type="primary" onClick={() => navigate("/", { replace: true })}>
          Back Home
        </Button>
      }
    />
  );
};

export default ForbiddenPage;
