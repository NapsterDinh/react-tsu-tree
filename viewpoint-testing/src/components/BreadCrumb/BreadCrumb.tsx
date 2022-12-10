import { HomeOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";
import React from "react";
import { Link } from "react-router-dom";

export type BreadCrumbProps = {
  breadCrumb?: boolean;
  link?: string;
  previousTitle?: string;
  title?: string;
};

const BreadCrumb: React.FC<BreadCrumbProps> = (props) => {
  const { breadCrumb = false, link, previousTitle, title } = props;
  return (
    <>
      {breadCrumb ? (
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={"/"}>
              <HomeOutlined style={{ marginRight: "0.25rem" }} />
              <span>{previousTitle}</span>
            </Link>
          </Breadcrumb.Item>
          {link ? (
            <>
              <Breadcrumb.Item>{title}</Breadcrumb.Item>
            </>
          ) : null}
        </Breadcrumb>
      ) : null}
      <h1
        style={{
          marginTop: "20px",
          fontSize: "1.5rem",
          fontWeight: "600",
          color: "var(--clr-text)",
        }}
      >
        {title}
      </h1>
    </>
  );
};

export default BreadCrumb;
