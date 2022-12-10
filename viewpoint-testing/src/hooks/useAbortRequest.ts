import { ERR_CANCELED_RECEIVE_RESPONSE } from "@utils/constants";
import * as React from "react";

const useAbortRequest = (callback = null) => {
  const controller = new AbortController();

  React.useEffect(() => {
    callback &&
      (async () => {
        try {
          await callback();
        } catch (error) {
          if (error?.code === ERR_CANCELED_RECEIVE_RESPONSE) {
            return;
          }
        }
      })();
    return () => {
      controller.abort();
    };
  }, []);
  return { signal: controller.signal };
};

export default useAbortRequest;
