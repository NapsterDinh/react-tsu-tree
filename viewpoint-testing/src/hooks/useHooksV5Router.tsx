/**
 * These hooks re-implement the now removed useBlocker and usePrompt hooks in 'react-router-dom'.
 * Thanks for the idea @piecyk https://github.com/remix-run/react-router/issues/8139#issuecomment-953816315
 * Source: https://github.com/remix-run/react-router/commit/256cad70d3fd4500b1abcfea66f3ee622fb90874#diff-b60f1a2d4276b2a605c05e19816634111de2e8a4186fe9dd7de8e344b65ed4d3L344-L381
 */
import { useContext, useEffect, useCallback, useState, useMemo } from "react";
import {
  UNSAFE_NavigationContext as NavigationContext,
  useLocation,
  useNavigate,
} from "react-router-dom";
/**
 * Blocks all navigation attempts. This is useful for preventing the page from
 * changing until some condition is met, like saving form data.
 *
 * @param  blocker
 * @param  when
 * @see https://reactrouter.com/api/useBlocker
 */
export function useBlocker(blocker, when = true) {
  const { navigator }: any = useContext(NavigationContext);

  useEffect(() => {
    if (!when) return;

    const unblock = navigator.block((tx) => {
      const autoUnblockingTx = {
        ...tx,
        retry() {
          // Automatically unblock the transition so it can play all the way
          // through before retrying it. TODO: Figure out how to re-enable
          // this block if the transition is cancelled for some reason.
          unblock();
          tx.retry();
        },
      };

      blocker(autoUnblockingTx);
    });

    return unblock;
  }, [navigator, blocker, when]);
}
/**
 * Prompts the user with an Alert before they leave the current screen.
 *
 * @param  message
 * @param  when
 */
export function usePrompt(message, when = true) {
  const blocker = useCallback(
    (tx) => {
      // eslint-disable-next-line no-alert
      if (window.confirm(message)) tx.retry();
    },
    [message]
  );

  useBlocker(blocker, when);
}

export default function withPreventNavigation(WrappedComponent) {
  return function preventNavigation(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const [lastLocation, setLastLocation] = useState(null);
    const [confirmedNavigation, setConfirmedNavigation] = useState(false);
    const [shouldBlock, setShouldBlock] = useState(false);

    let handleLeave = null;

    const cancelNavigation = useCallback(() => {
      setShouldBlock(false);
    }, []);

    const handleBlockedNavigation = useCallback(
      (nextLocation) => {
        if (
          !confirmedNavigation &&
          nextLocation.location.pathname !== location.pathname
        ) {
          handleLeave(nextLocation);
          setLastLocation(nextLocation);
          return false;
        }
        return true;
      },
      [confirmedNavigation]
    );

    const confirmNavigation = useCallback(() => {
      setConfirmedNavigation(true);
    }, []);

    useEffect(() => {
      if (confirmedNavigation && lastLocation) {
        navigate(lastLocation.location.pathname);
      }
    }, [confirmedNavigation, lastLocation]);

    const provideLeaveHandler = (handler) => {
      handleLeave = handler;
    };

    const getShouldBlock = useMemo(() => {
      return shouldBlock;
    }, [shouldBlock]);

    useBlocker(handleBlockedNavigation, shouldBlock);

    return (
      <WrappedComponent
        {...props}
        provideLeaveHandler={provideLeaveHandler}
        getShouldBlock={getShouldBlock}
        setPreventNavigation={setShouldBlock}
        confirmNavigation={confirmNavigation}
        cancelNavigation={cancelNavigation}
      />
    );
  };
}
