import { replaceAll } from "./stringUtils";

export const checkValidTypeFile = (file) => {
  if (!file) {
    return false;
  }
  const arrayName = file.name.split(".");
  const typeFile = arrayName[arrayName.length - 1];

  if (typeFile === "xlsx" || typeFile === "csv" || typeFile === "xls") {
    return true;
  }
  return false;
};

export const handleFileNameWithLangueAndTimeNow = (
  fileName: string,
  language: string,
  shortType: string
) => {
  const convertedShortType = `(${shortType.toLocaleUpperCase()})`;
  const languageName = `(${language.toLocaleUpperCase()})`;
  const convertedFileName = replaceAll(fileName, " ", "_");
  const timeCreated = replaceAll(
    new Date(Date.now()).toISOString().split("T")[0].toString(),
    "-",
    ""
  );

  return `${languageName}${convertedShortType}${convertedFileName}_${timeCreated}`;
};
