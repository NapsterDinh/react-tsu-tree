import { LANGUAGE } from "@utils/constants";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const useLanguageData = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const getDataLanguage = () => {
    return localStorage.getItem("dataLanguage")
      ? localStorage.getItem("dataLanguage")
      : localStorage.getItem("i18nextLng")
      ? localStorage.getItem("i18nextLng")
      : LANGUAGE.EN;
  };

  const setDataLanguage = (language) => {
    setSearchParams({
      lang: language,
    });
    localStorage.setItem("dataLanguage", language);
  };

  const setDataLanguageDefault = () => {
    localStorage.getItem("i18nextLng")
      ? localStorage.setItem("dataLanguage", localStorage.getItem("i18nextLng"))
      : localStorage.setItem("dataLanguage", LANGUAGE.EN);
  };

  const handleSetDefaultDataLanguage = () => {
    if (searchParams.get("lang")) {
      localStorage.setItem("dataLanguage", searchParams.get("lang"));
    } else {
      setDataLanguageDefault();
    }
  };

  handleSetDefaultDataLanguage();
  useEffect(() => {
    return () => {
      setDataLanguageDefault();
    };
  }, []);
  return {
    getDataLanguage,
    setDataLanguage,
    setDataLanguageDefault,
    handleSetDefaultDataLanguage,
  };
};

export default useLanguageData;
