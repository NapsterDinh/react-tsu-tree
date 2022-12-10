import { Avatar, Dropdown, Space, Typography } from "antd";
import React, { useEffect, useRef, useState } from "react";
import {
  AiOutlineLogout,
  AiOutlineMenuFold,
  AiOutlineMenuUnfold
} from "react-icons/ai";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
const { Title, Text } = Typography;

import DarkMode from "@components/DarkMode/DarkMode";
import LanguageSelector from "@components/LanguageSelector/LanguageSelector";
import { authActions } from "@redux/slices";
import { AvatarPlaceholder } from "@utils/mediaUtils";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import {
  AvatarInfo,
  ButtonIcon,
  NavbarContainer,
  ProfileMenu,
  Wrapper
} from "./HeaderStyled";

interface IProps {
  onClick?: React.MouseEventHandler<HTMLElement>;
  collapsed: boolean;
}

const Header = ({ onClick, collapsed }: IProps) => {
  const { t } = useTranslation(["common"]);
  const dispatch = useDispatch();
  const location = useLocation();
  const [isShowSearch, setShowSearch] = useState(false);
  const currentUser = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const refSearch = useRef(null);
  const refButtonOpenSearch = useRef(null);
  const [contentSearch, setContentSearch] = useState("");

  const onSearch = () => {
    return contentSearch;
  };

  const handleLogout = () => {
    dispatch(authActions.logoutUser({}));
    // window.location.replace("/login");
  };

  useEffect(() => {
    // document.addEventListener("click", handleOutsideClick, false);
    // return () => {
    //   document.removeEventListener("click", handleOutsideClick, false);
    // };
  }, []);

  useEffect(() => {
    !isShowSearch && setContentSearch("");
  }, [isShowSearch]);

  useEffect(() => {
    setShowSearch(false);
  }, [location.pathname]);

  const handleOutsideClick = (e) => {
    if (!refSearch.current.contains(e.target)) {
      if (
        refButtonOpenSearch.current === e.target ||
        document.getElementById("icon-open-search") === e.target
      ) {
        setShowSearch(true);
      } else {
        setShowSearch(false);
      }
    }
  };

  const menu = (
    <ProfileMenu
      items={[
        // {
        //   key: "profile",
        //   label: (
        //     <div>
        //       <p style={{ color: "var(--clr-text)" }}>({currentUser?.role})</p>
        //     </div>
        //   ),
        // },
        // {
        //   key: "settings",
        //   label: (
        //     <Link to="/settings">
        //       <AiOutlineSetting />
        //       <Text>Settings</Text>
        //     </Link>
        //   ),
        // },
        {
          key: "logout",
          label: (
            <Link to="" onClick={handleLogout}>
              <AiOutlineLogout />
              <Text>{t("common.logout")}</Text>
            </Link>
          ),
        },
      ]}
    />
  );

  return (
    <Wrapper>
      <header
        style={{
          marginLeft: collapsed
            ? "var(--width-sidebar-collapsed)"
            : "var(--width-sidebar)",
        }}
      >
        <ButtonIcon
          icon={collapsed ? <AiOutlineMenuUnfold /> : <AiOutlineMenuFold />}
          onClick={onClick}
        />
        <NavbarContainer>
          <div
            style={{ minWidth: "40px", minHeight: "40px", display: "flex" }}
          ></div>
          <Space>
            <LanguageSelector />
            <DarkMode />
            <Dropdown
              overlay={menu}
              trigger={["click"]}
              placement="bottomRight"
            >
              <AvatarInfo>
                <Avatar src={<img src={AvatarPlaceholder} />} size="small" />
                <Title level={5}>{currentUser?.account}</Title>
                <span
                  style={{ color: "var(--clr-text)", marginLeft: "0.25rem" }}
                >
                  ({currentUser?.role})
                </span>
              </AvatarInfo>
            </Dropdown>
          </Space>
        </NavbarContainer>
      </header>
    </Wrapper>
  );
};

export default Header;
