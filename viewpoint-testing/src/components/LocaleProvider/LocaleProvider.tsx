import { ConfigProvider } from "antd";

import viVN from "antd/es/locale/vi_VN";
import jaJP from "antd/es/locale/ja_JP";
import enUS from "antd/es/locale/en_US";

const LocaleProvider = ({ children }) => {
  let localeInstance = enUS;
  switch (localStorage.getItem("i18nextLng")) {
    case "jpn":
      localeInstance = jaJP;
      break;
    case "vi":
      localeInstance = viVN;
      break;

    default:
      break;
  }
  return <ConfigProvider locale={localeInstance}>{children}</ConfigProvider>;
};

export default LocaleProvider;
