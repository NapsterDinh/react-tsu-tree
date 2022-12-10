import { ProductIcon, UserIcon, UserRoleIcon } from "@assets/svg";
import { Header } from "@components";
import { usePermissions } from "@hooks/usePermissions";
import type { MenuItem } from "@utils/componentUtis";
import { getItem } from "@utils/componentUtis";
import { debounce } from "@utils/helpersUtils";
import { Layout as LayoutAntd } from "antd";
import { Content } from "antd/lib/layout/layout";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AiOutlineCluster,
  AiOutlineFileText,
  AiOutlineHome,
  AiOutlineSetting,
  AiOutlineSolution
} from "react-icons/ai";
import { Outlet, useLocation } from "react-router-dom";
import { routes } from "routes";
import { Sidebar } from "./components";
import { Wrapper } from "./LayoutStyle";

const Layout = () => {
  const { t } = useTranslation(["common"]);
  const { checkPermission } = usePermissions();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState(["home"]);
  const location = useLocation();
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    const handleResize = debounce(() => {
      window.innerWidth < 992 ? setCollapsed(true) : setCollapsed(false);
    }, 100);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  useEffect(() => {
    const arrayRoutes = Object.keys(routes).filter((key) => {
      return routes[key].isRequired;
    });
    let isFound = false;
    for (let index = 0; index < arrayRoutes.length; index++) {
      const element = routes[arrayRoutes[index]];
      for (let index2 = 0; index2 < element.path.length; index2++) {
        const element2 = element.path[index2];
        if (location.pathname.includes(element2)) {
          isFound = true;
          setSelectedKey(element.path[0]);
          break;
        }
      }
      if (isFound) {
        break;
      }
    }
  }, [location.pathname]);

  const items: MenuItem[] = [
    getItem(
      t("common:dashboard.name"),
      routes.HomePage.path[0],
      <AiOutlineHome />
    ),
    getItem(t("common:common.management"), "menuItem2", <AiOutlineSetting />, [
      checkPermission(["ROLE.VIEW"]) &&
        getItem(
          t("common:role_management.name"),
          routes.RoleManagement.path[0],
          <UserRoleIcon />
        ),
      checkPermission(["USER.VIEW"]) &&
        getItem(
          t("common:user_management.name"),
          routes.UserManagement.path[0],
          <UserIcon />
        ),
      checkPermission(["DOMAIN.VIEW"]) &&
        getItem(
          t("common:domain_management.name"),
          routes.DomainManagement.path[0],
          <AiOutlineCluster />
        ),
      // checkPermission(["TEST_TYPE.VIEW"]) &&
      // getItem(
      //   t("common:test_type"),
      //   routes.TestTypeManagement.path[0],
      //   <AiOutlineSecurityScan />
      // ),
      // checkPermission(["CATEGORY.VIEW"]) &&
      //   getItem(
      //     t("common:category"),
      //     routes.CategoryManagement.path[0],
      //     <BiCategoryAlt />
      //   ),
      // checkPermission(["FUNCTION_GROUP.VIEW"]) &&
      //   getItem(
      //     t("common:function_group"),
      //     routes.FunctionGroup.path[0],
      //     <AiOutlineApartment />
      //   ),
      checkPermission(["REQUEST.VIEW"]) &&
        getItem(
          t("common:request_management.name"),
          routes.RequestManagement.path[0],
          <AiOutlineSolution />
        ),
      checkPermission(["VIEWPOINT.VIEW"]) &&
        getItem(
          t("common:viewpoint_collection.name"),
          routes.ViewpointCollection.path[0],
          <AiOutlineFileText />
        ),
      checkPermission(["PRODUCT.VIEW"]) &&
        getItem(
          t("common:product.name"),
          routes.ProductManagement.path[0],
          <ProductIcon />
        ),
    ]),
  ];
  return (
    <Wrapper>
      <LayoutAntd>
        <Sidebar
          collapsed={collapsed}
          items={items}
          selectedKey={selectedKey}
          setSelectedKey={setSelectedKey}
        />
        <LayoutAntd>
          <Header onClick={toggleCollapsed} collapsed={collapsed} />
          <Content
            className="content"
            style={{
              marginLeft: collapsed
                ? "var(--width-sidebar-collapsed)"
                : "var(--width-sidebar)",
            }}
          >
            <Outlet />
          </Content>
        </LayoutAntd>
      </LayoutAntd>
    </Wrapper>
  );
};
export default Layout;
