import {useCallback, useState, useEffect} from "../../_snowpack/pkg/react.js";
export function useLocalStorage(key, defaultValue) {
  return useStorage(key, defaultValue, window.localStorage);
}
export function useSessionStorage(key, defaultValue) {
  return useStorage(key, defaultValue, window.sessionStorage);
}
function useStorage(key, defaultValue, storageObject) {
  const [value, setValue] = useState(() => {
    const jsonValue = storageObject.getItem(key);
    if (jsonValue != null)
      return JSON.parse(jsonValue);
    if (typeof defaultValue === "function") {
      return defaultValue();
    } else {
      return defaultValue;
    }
  });
  useEffect(() => {
    if (value === void 0)
      return storageObject.removeItem(key);
    storageObject.setItem(key, JSON.stringify(value));
  }, [key, value, storageObject]);
  const remove = useCallback(() => {
    setValue(void 0);
  }, []);
  return [value, setValue, remove];
}
