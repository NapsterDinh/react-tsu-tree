import { notification } from "antd";

const notificationProps = {
  top: 10,
  duration: 3,
};

export const showSuccessNotification = (message) => {
  notification.success({
    message: message || "Success",
    ...notificationProps,
  });
};

export const showErrorNotification = (message) => {
  notification.error({
    message: message || "Error",
    ...notificationProps,
  });
};

export const showInfoNotification = (message) => {
  notification.info({
    message: message || "Info",
    ...notificationProps,
  });
};
