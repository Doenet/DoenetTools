import {useEffect} from "../../_snowpack/pkg/react.js";
import useTimeout from "./useTimeout.js";
export default function useDebounce(callback, delay, dependencies) {
  const {reset, clear} = useTimeout(callback, delay);
  useEffect(reset, [...dependencies, reset]);
  useEffect(clear, [clear]);
}
