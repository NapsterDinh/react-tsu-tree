import i18n from "i18next";
import detector from "i18next-browser-languagedetector";

// us
import commonEn from "./en/common.json";
import validateEn from "./en/validate.json";
import responseMessageEn from "./en/responseMessage.json";

// vn
import commonVi from "./vi/common.json";
import validateVi from "./vi/validate.json";
import responseMessageVi from "./vi/responseMessage.json";
import common1Vi from "./vi/common1.json";

// jpn
import commonJpn from "./jpn/common.json";
import validateJpn from "./jpn/validate.json";
import responseMessageJpn from "./jpn/responseMessage.json";
import common1Jpn from "./jpn/common1.json";

i18n.init({
  resources: {
    en: {
      common: commonEn,
      validate: validateEn,
      responseMessage: responseMessageEn,
    },
    vi: {
      common: common1Vi,
      validate: validateVi,
      responseMessage: responseMessageVi,
    },
    jpn: {
      common: common1Jpn,
      validate: validateJpn,
      responseMessage: responseMessageJpn,
    },
  },
  // lng: "en", //use language detector, so comment this line
  fallbackLng: ["en", "vi", "jpn"],
  debug: false,
  ns: ["common"],
  va: ["validate"],
  ca: ["cart"],
  od: ["order"],
  // keySeparator: false,
  interpolation: {
    escapeValue: false,
  },
  react: {
    wait: true,
    useSuspense: false,
  },
});

export default i18n;
