import { Button, Result } from "antd";
import { WrapperCenter } from "AppStyled";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { from } = (location.state as any) || { from: { pathname: "/" } };

  console.log(location);

  return (
    <WrapperCenter>
      <Result
        status="404"
        title="Page Not Found"
        subTitle="The page you are looking was moved, removed, renamed, or might never exist!"
        extra={
          <Button
            type="primary"
            onClick={() =>
              navigate(from?.pathname, {
                replace: true,
              })
            }
          >
            Back Home
          </Button>
        }
      />
    </WrapperCenter>
  );
};

export default NotFoundPage;
