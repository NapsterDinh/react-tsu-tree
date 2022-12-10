import DarkMode from "@components/DarkMode/DarkMode";
import LanguageSelector from "@components/LanguageSelector/LanguageSelector";
import { rootState } from "@models/type";
import { Space } from "antd";
import IVSLogoDark from "assets/images/logo_ivs_dark.png";
import IVSLogoLight from "assets/images/logo_ivs_light.png";
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
          {theme === "dark" ? (
            <img src={IVSLogoDark} style={{ width: "80px", height: "45px" }} />
          ) : (
            <img src={IVSLogoLight} style={{ width: "80px", height: "45px" }} />
          )}
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
