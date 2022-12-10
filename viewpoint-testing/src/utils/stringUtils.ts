export const replaceAll = (str, pattern_1, pattern_2) => {
  return str.split(pattern_1).join(pattern_2);
};

export const randomGUID12characters = () => {
  return Math.floor(100000000000 + Math.random() * 900000000000);
};
