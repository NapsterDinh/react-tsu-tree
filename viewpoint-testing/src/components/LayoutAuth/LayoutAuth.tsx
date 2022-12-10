import DarkMode from "@components/DarkMode/DarkMode";
import LanguageSelector from "@components/LanguageSelector/LanguageSelector";
import { rootState } from "@models/type";
import { Space } from "antd";
import IVSLogoDark from "assets/images/logo_shop.png";
import React from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import {
  AuthContent,
  AuthHeader,
  StyledAuthLayout,
  WrapperContent,
  WrapperHeader,
} from "./LayoutAuthStyle";

const LayoutAuth: React.FC = () => {
  const { theme } = useSelector((state: rootState) => state.theme);

  return (
    <StyledAuthLayout>
      <AuthHeader>
        <WrapperHeader>
          <img src={IVSLogoDark} style={{ width: "200px", height: "60px" }} />
          <Space>
            <LanguageSelector />
            <DarkMode />
          </Space>
        </WrapperHeader>
      </AuthHeader>
      <AuthContent>
        <WrapperContent>
          <Outlet />
        </WrapperContent>
      </AuthContent>
    </StyledAuthLayout>
  );
};

export default LayoutAuth;
