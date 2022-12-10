import { checkContainsSpecialCharacter, removeEmoji } from "./helpersUtils";

export const VALIDATE_TRIGGER = ["onBlur", "onChange"];

type TValidateInput = {
  messageRequired?: string;
  messageTrimSpace?: string;
  maxLength?: number;
  messageMaxLength?: string;
  minLength?: number;
  messageMinLength?: string;
  messageNotContainSpecialCharacter?: string;
};
export const validateInput = ({
  messageRequired,
  messageTrimSpace,
  maxLength,
  messageMaxLength,
  minLength,
  messageMinLength,
  messageNotContainSpecialCharacter,
}: TValidateInput) => {
  return {
    validator(_: any, value: any) {
      const newValue = !value
        ? ""
        : typeof value === "object"
        ? value.value
        : value;
      if (messageRequired && !newValue) {
        return Promise.reject(messageRequired);
      } else if (
        messageNotContainSpecialCharacter &&
        checkContainsSpecialCharacter(newValue)
      ) {
        return Promise.reject(messageNotContainSpecialCharacter);
      } else if (messageNotContainSpecialCharacter && removeEmoji(newValue)) {
        return Promise.reject(messageNotContainSpecialCharacter);
      } else if (
        messageTrimSpace &&
        newValue?.trim()?.length !== newValue?.length
      ) {
        return Promise.reject(messageTrimSpace);
      } else if (minLength && newValue.length < minLength) {
        return Promise.reject(messageMinLength);
      } else if (maxLength && newValue.length > maxLength) {
        return Promise.reject(messageMaxLength);
      }
      return Promise.resolve();
    },
  };
};
