import * as React from "react";

export const useBeforeUnload = ({ when, message }) => {
  React.useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = message;
      return message;
    };

    if (when) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [when, message]);
};
