import { Layout, LayoutAuth } from "@components";
import LoadingFullScreen from "@components/LoadingFullScreen/LoadingFullScreen";
import RequiredPermission, {
  PublicRoute,
} from "@components/RequiredAuth/RequiredAuth";
import { rootState } from "@models/type";
import {
  AccessDenied,
  FunctionGroupManagement,
  LoginPage,
  NotFoundPage,
  ServerError,
} from "@pages";
import ForbiddenPage from "@pages/ForbiddenPage/ForbiddenPage";
import { BackTop } from "antd";
import { GlobalStyle } from "AppStyled";
import i18n from "i18next";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { renderMultiRoutes, routes } from "routes";

const App: React.FC = () => {
  const { userLoading } = useSelector((state: rootState) => state.auth);

  useEffect(() => {
    if (!localStorage.getItem("i18nextLng")) {
      localStorage.setItem("i18nextLng", "en");
      i18n.changeLanguage("en");
    } else {
      i18n.changeLanguage(localStorage.getItem("i18nextLng"));
    }
  }, []);

  const renderRoutes = () => {
    return Object.keys(routes)
      .filter((key) => {
        return routes[key].isRequired;
      })
      .map((item) => {
        return (
          <Route
            key={item}
            element={
              <RequiredPermission
                allowedPermission={routes[item].permissions}
              />
            }
          >
            {renderMultiRoutes(routes[item])}
          </Route>
        );
      });
  };

  return (
    <>
      {userLoading ? (
        <LoadingFullScreen />
      ) : (
        <React.Fragment>
          <GlobalStyle />
          <BackTop />
          <Routes>
            <Route element={<LayoutAuth />}>
              <Route element={<PublicRoute />}>
                <Route path="/login" element={<LoginPage />}></Route>
              </Route>
            </Route>
            {/* <Route element={<Layout />}>
              <Route path="/function-group">
                <Route
                  path="/function-group"
                  element={<FunctionGroupManagement />}
                />
              </Route>
            </Route> */}
            <Route element={<Layout />}>{renderRoutes()}</Route>
            <Route path="/forbidden" element={<ForbiddenPage />}></Route>
            <Route path="unauthorized" element={<AccessDenied />} />
            <Route path="error" element={<ServerError />} />
            <Route path="not-found" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </React.Fragment>
      )}
    </>
  );
};

export default App;
