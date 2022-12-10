export const specialCharacterRegExp = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
export const characterRegExp =
  /^[a-zA-Z0-9]+(([',. -][a-zA-Z0-9])?[a-zA-Z0-9]*)*$/;

export const patternNotContainsSpecialCharacters =
  /\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\+|\=|\[|\{|\]|\}|\||\\|\'|\<|\,|\>|\?|\""|\;|\:/;

export const patternNotContainEmoji =
  /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/;
