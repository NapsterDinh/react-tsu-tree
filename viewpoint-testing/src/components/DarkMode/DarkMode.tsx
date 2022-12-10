import React, { useEffect } from "react";
import { BsMoonStarsFill, BsFillSunFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";

import { rootState } from "@models/type";
import { ButtonIcon } from "./DarkModeStyle";
import { themeActions } from "@redux/slices/themeSlice";

const DarkMode: React.FC = (): JSX.Element => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state: rootState) => state.theme);

  // function handle switching theme and storing them into local storage
  const switchTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    if (newTheme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    }
    dispatch(themeActions.switchTheme(newTheme));
  };

  useEffect(() => {
    // initial theme in local storage
    if (theme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  return (
    <ButtonIcon
      className="ant-btn-icon-only"
      onClick={() => switchTheme()}
      icon={theme === "dark" ? <BsMoonStarsFill /> : <BsFillSunFill />}
    />
  );
};

export default DarkMode;
