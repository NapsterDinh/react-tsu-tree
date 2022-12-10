import LoadingFullScreen from "@components/LoadingFullScreen/LoadingFullScreen";
import "antd/dist/antd.min.css";
import "antd/dist/antd.variable.min.css";
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import i18n from "./assets/i18";
import { AuthProvider } from "./context/AuthProvider";
import "./index.css";
import { store } from "./redux/store";
import reportWebVitals from "./reportWebVitals";

const App = React.lazy(() => import("./App"));

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <Provider store={store}>
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <Suspense fallback={<LoadingFullScreen />}>
          <AuthProvider>
            <Routes>
              <Route path="/*" element={<App />} />
            </Routes>
          </AuthProvider>
        </Suspense>
      </BrowserRouter>
    </I18nextProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals())
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
