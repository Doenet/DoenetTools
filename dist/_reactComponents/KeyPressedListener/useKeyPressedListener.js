import {useState, useEffect} from "../../_snowpack/pkg/react.js";
function useKeyPressedListener(targetKey) {
  const [keyPressed, setKeyPressed] = useState(false);
  function downHandler({key}) {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  }
  const upHandler = ({key}) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, []);
  return keyPressed;
}
export default useKeyPressedListener;
