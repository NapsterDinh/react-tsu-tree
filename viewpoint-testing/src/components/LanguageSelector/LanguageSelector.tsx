import ENFlag from "@assets/images/en.png";
import JPNFlag from "@assets/images/jpn.png";
import VIFlag from "@assets/images/vi.png";
import React from "react";
import { StyledSelect } from "./LanguageSelectorStyle";

const languages = [
  {
    key: "vi",
    value: "Việt Nam",
    flag: VIFlag,
  },
  {
    key: "en",
    value: "English",
    flag: ENFlag,
  },
  {
    key: "jpn",
    value: "日本",
    flag: JPNFlag,
  },
];

const LanguageSelector: React.FC = () => {
  const handleChangeLanguages = (value) => {
    const selectedLanguage = languages.find((item) => item.value === value);
    localStorage.setItem("i18nextLng", selectedLanguage.key);
    localStorage.setItem("dataLanguage", selectedLanguage.key);
    window.location.reload();
  };

  const getFlag = () => {
    const target = localStorage.getItem("i18nextLng") ?? "en";
    return languages.find((item) => item.key === target).flag;
  };

  const getValuesLanguage = () => {
    switch (localStorage.getItem("i18nextLng")) {
      case "vi":
        return "VietNam";
      case "jpn":
        return "Japan";
      case "en":
        return "English";

      default:
        return "English";
    }
  };

  return (
    <StyledSelect
      suffixIcon={<img src={getFlag()}></img>}
      defaultValue={getValuesLanguage()}
      onChange={handleChangeLanguages}
      options={languages}
      dropdownMatchSelectWidth={false}
    />
  );
};

export default LanguageSelector;
