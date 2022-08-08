import {useState, useCallback} from "../../_snowpack/pkg/react.js";
export default function useStateWithValidation(validationFunc, initialValue) {
  const [state, setState] = useState(initialValue);
  const [isValid, setIsValid] = useState(() => validationFunc(state));
  const onChange = useCallback((nextState) => {
    const value = typeof nextState === "function" ? nextState(state) : nextState;
    setState(value);
    setIsValid(validationFunc(value));
  }, [state, validationFunc]);
  return [state, onChange, isValid];
}
