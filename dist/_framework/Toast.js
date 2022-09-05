import React, {useRef} from "../_snowpack/pkg/react.js";
import {
  atom,
  useRecoilValue,
  useSetRecoilState,
  useRecoilCallback
} from "../_snowpack/pkg/recoil.js";
import styled from "../_snowpack/pkg/styled-components.js";
import {animated, useSpring} from "../_snowpack/pkg/@react-spring/web.js";
import {FontAwesomeIcon} from "../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faTimes} from "../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
const ToastContainer = styled.div`
  position: fixed;
  width: 0 auto;
  top: unset;
  left: unset;
  bottom: 50px;
  right: 20px;
  display: flex;
  flex-direction: column;
  pointer-events: none;
  align-items: center;
  gap: 5px;
`;
const Message = styled(animated.div)`
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  width: 40ch;
  @media (max-width: 680px) {
    width: 100%;
  }
  border-radius: 4px;
`;
const Content = styled("div")`
  color: var(--canvastext);
  /* background:  */
  /* opacity: 0.9; */
  background: var(--canvas);
  padding: 12px 22px;
  font-size: 1em;
  display: grid;
  grid-template-columns: ${(props) => props.canClose === false ? "1fr" : "1fr auto"};
  grid-gap: 10px;
  overflow: hidden;
  height: auto;
  border-radius: 3px;
  border: 2px solid var(--mainGray);
  border-left: 12px solid;
  border-left-color: ${({type}) => type?.background};
`;
const Life = styled(animated.div)`
  position: absolute;
  bottom: ${(props) => props.top ? "10px" : "0"};
  left: 0px;
  width: auto;
  background-image: linear-gradient(
    130deg,
    var(--mainBlue),
    var(--solidLightBlue)
  );
  height: 5px;
`;
const Button = styled("button")`
  cursor: pointer;
  pointer-events: all;
  border: none;
  border-radius: 20px;
  background: transparent;
  display: flex;
  align-items: center;
  overflow: hidden;
  margin-top: 14px;
  padding: 0;
  height: 20px;
  // color: var(--canvas);
  // :hover {
  //   color: var(--canvas);
  // }
  color: var(--canvastext);
  font-size: 1em;
  &: focus {
    outline: 2px solid var(--canvastext);
    outline-offset: 2px;
  }
`;
const toastStack = atom({
  key: "toastStack",
  default: []
});
const toastStackId = atom({
  key: "toastStackId",
  default: 0
});
export const recoilAddToast = ({set, snapshot}) => (msg, type = toastType.INFO, action = null) => {
  const id = snapshot.getLoadable(toastStackId).getValue();
  set(toastStack, (old) => [
    ...old,
    /* @__PURE__ */ React.createElement(ToastMessage, {
      key: id,
      type,
      action,
      duration: type.timeout,
      tId: id
    }, msg)
  ]);
  set(toastStackId, (prev) => prev + 1);
};
export const useToast = () => {
  const addToast = useRecoilCallback(recoilAddToast, []);
  return addToast;
};
export const toastType = Object.freeze({
  ERROR: {
    timeout: -1,
    background: "var(--mainRed)",
    gradientEnd: "rgba()"
  },
  ALERT: {
    timeout: -1,
    background: "var(--lightYellow)"
  },
  ACTION: {
    timeout: -1,
    background: "rgba()"
  },
  INFO: {
    timeout: -1,
    background: "var(--mainBlue)"
  },
  SUCCESS: {
    timeout: -1,
    background: "var(--mainGreen)"
  },
  CONFIRMATION: {
    timeout: -1,
    background: "var(--mainBlue)"
  }
});
export default function Toast() {
  const toasts = useRecoilValue(toastStack);
  return /* @__PURE__ */ React.createElement(ToastContainer, null, toasts.map((toast) => toast));
}
function ToastMessage({
  defConfig = {tension: 125, friction: 20, precision: 0.1},
  type,
  action,
  duration,
  tId,
  children
}) {
  const setToasts = useSetRecoilState(toastStack);
  const ref = useRef();
  const props = useSpring({
    from: {opacity: 0, height: 0, life: "100%"},
    to: async (next, cancel) => {
      ref.current.cancel = cancel;
      await next({opacity: 1, height: ref.current.offsetHeight});
      if (duration > 0) {
        await next({life: "0%", config: {duration}});
        await next({opacity: 0});
        await next({height: 0});
      }
    },
    config: defConfig,
    onRest: () => {
      if (duration > 0) {
        setToasts((old) => old.filter((i) => i.props.tId !== tId));
      }
    }
  });
  return /* @__PURE__ */ React.createElement(Message, {
    style: props,
    role: "alert"
  }, /* @__PURE__ */ React.createElement(Content, {
    ref,
    key: tId,
    type,
    "data-test": "toast"
  }, /* @__PURE__ */ React.createElement(Life, {
    style: {right: props.life}
  }), /* @__PURE__ */ React.createElement("p", {
    id: "alert-message"
  }, children), /* @__PURE__ */ React.createElement(Button, {
    "data-test": "toast cancel button",
    onClick: (e) => {
      e.stopPropagation();
      ref.current.cancel();
      setToasts((old) => old.filter((i) => i.props.tId !== tId));
    },
    "aria-label": "Close alert:",
    "aria-labelledby": "alert-message"
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faTimes
  }))));
}
