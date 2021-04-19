import { useContext, useRef, useState } from "../../../_snowpack/pkg/react.js";
import { BreadcrumbContext } from "../BreadcrumbProvider.js";
import { useImmediateEffect } from "./useImmediateEffect.js";
import { useWillUnmount } from "./useWillUnmount.js";

export const useBreadcrumbItems = () => {
  const subscriptionRef = useRef();
  const [items, setItems] = useState([]);
  const { subscribe } = useContext(BreadcrumbContext);

  useImmediateEffect(() => {
    subscriptionRef.current = subscribe(setItems);
  }, []);

  useWillUnmount(() => {
    subscriptionRef.current.unsubscribe();
  });

  return items;
};