import React, {useRef} from "react";
import {
  atom,
  useRecoilValue,
  useSetRecoilState,
  useRecoilCallback
} from "recoil";
import styled from "styled-components";
import {animated, useSpring} from "react-spring";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
const ToastContainer = styled.div`
  position: fixed;
  width: 0 auto;
  top: unset;
  left: unset;
  bottom: 30px;
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
  color: white;
  background: ${({type}) => type?.background};
  /* opacity: 0.9; */
  padding: 12px 22px;
  font-size: 1em;
  display: grid;
  grid-template-columns: ${(props) => props.canClose === false ? "1fr" : "1fr auto"};
  grid-gap: 10px;
  overflow: hidden;
  height: auto;
  border-radius: 3px;
`;
const Life = styled(animated.div)`
  position: absolute;
  bottom: ${(props) => props.top ? "10px" : "0"};
  left: 0px;
  width: auto;
  background-image: linear-gradient(130deg, #1a5a99, #8fb8de);
  height: 5px;
`;
const Button = styled("button")`
  cursor: pointer;
  pointer-events: all;
  outline: 0;
  border: none;
  background: transparent;
  display: flex;
  align-self: flex-end;
  overflow: hidden;
  margin: 0;
  padding: 0;
  padding-bottom: 14px;
  color: rgba(255, 255, 255, 0.7);
  :hover {
    color: rgba(255, 255, 255, 0.9);
  }
  font-size: 1em;
`;
const ToastType = {
  ERROR: {
    timeout: -1,
    background: "rgba(193, 41, 46, 0.6)",
    gradientEnd: "rgba()"
  },
  ALERT: {
    timeout: -1,
    background: "rgba(255, 230, 0, 0.6)"
  },
  ACTION: {
    timeout: -1,
    background: "rgba()"
  },
  INFO: {
    timeout: 3e3,
    background: "rgba(26, 90, 153,0.6)"
  },
  SUCCESS: {
    timeout: 3e3,
    background: "rgba(0, 222, 41,0.6)"
  },
  CONFIRMATION: {
    timeout: 5e3,
    background: "rgba(26,90,153,0.6)"
  }
};
const toastStack = atom({
  key: "toastStack",
  default: []
});
let id = 0;
export const useToast = () => {
  const addToast = useRecoilCallback(({set}) => (msg, type = ToastType.INFO, action = null) => {
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
    id++;
  }, []);
  return [addToast, ToastType];
};
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
      console.log(">>>offsetHight", ref.current.offsetHeight);
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
    style: props
  }, /* @__PURE__ */ React.createElement(Content, {
    ref,
    key: tId,
    type
  }, /* @__PURE__ */ React.createElement(Life, {
    style: {right: props.life}
  }), /* @__PURE__ */ React.createElement("p", null, children), /* @__PURE__ */ React.createElement(Button, {
    onClick: (e) => {
      e.stopPropagation();
      ref.current.cancel();
      setToasts((old) => old.filter((i) => i.props.tId !== tId));
    }
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faTimes
  }))));
}
