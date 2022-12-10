import { rootState } from "@models/type";
import { MenuItem } from "@utils/componentUtis";
import IVSLogoDark from "assets/images/logo_ivs_dark.png";

import { Menu } from "antd";
import Sider from "antd/lib/layout/Sider";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Wrapper } from "./SidebarStyle";

interface IProps {
  collapsed: boolean;
  items: MenuItem[];
  selectedKey: any[];
  setSelectedKey: (_keys: any[]) => void;
}

const Sidebar = ({ collapsed, items, selectedKey, setSelectedKey }: IProps) => {
  const [openKeys, setOpenKeys] = useState(["menuItem2"]);
  const { theme } = useSelector((state: rootState) => state.theme);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  pathname;

  useEffect(() => {
    !collapsed && setOpenKeys(["menuItem2"]);
  }, [collapsed]);
  return (
    <Wrapper>
      <Sider
        width={
          collapsed ? "var(--width-sidebar-collapsed)" : "var(--width-sidebar)"
        }
        collapsed={collapsed}
        className="sidebar"
      >
        <Link to="/">
          <div className="logo">
            <img
              src={IVSLogoDark}
              className={`logo__img ${collapsed ? "collapsed" : ""}`}
            />
            <div className={`logo__title ${collapsed ? "collapsed" : ""}`}>
              AkaVIP
            </div>
          </div>
        </Link>
        <Menu
          onSelect={({ selectedKeys }) => {
            setSelectedKey(selectedKeys);
            navigate(selectedKeys[0]);
          }}
          onClick={({ keyPath }) => {
            navigate(keyPath[0]);
          }}
          selectedKeys={selectedKey}
          defaultOpenKeys={["menuItem2"]}
          openKeys={collapsed ? [] : openKeys}
          mode="inline"
          style={{ height: "100%", borderRight: 0 }}
          inlineCollapsed={collapsed}
          items={items}
          onOpenChange={(arrayOpenKeys) => setOpenKeys(arrayOpenKeys)}
        />
        <div className="version">{`Version ${window?.__RUNTIME_CONFIG__?.VERSION} ${window?.__RUNTIME_CONFIG__?.RELEASE_DATE}`}</div>
      </Sider>
    </Wrapper>
  );
};

export default Sidebar;
