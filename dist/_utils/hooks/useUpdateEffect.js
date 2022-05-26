import {useEffect, useRef} from "../../_snowpack/pkg/react.js";
export default function useUpdateEffect(callback, dependencies) {
  const firstRenderRef = useRef(true);
  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    return callback();
  }, [...dependencies, callback]);
}
