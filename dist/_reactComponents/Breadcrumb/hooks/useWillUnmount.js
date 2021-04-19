import { useEffect, useRef } from "../../../_snowpack/pkg/react.js";

export const useWillUnmount = (callback) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(
    () => () => {
      callbackRef.current();
    },
    []
  );
};