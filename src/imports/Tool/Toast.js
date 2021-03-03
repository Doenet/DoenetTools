import React, { useState, useEffect } from "react";
import { atom, useRecoilState, useRecoilCallback } from "recoil";
import styled from "styled-components";
import { animated, useTransition } from "react-spring";

const ToastContainer = styled.div`
  position: fixed;
  width: 0 auto;
  top: unset;
  left: unset;
  bottom: 30px;
  right: 20px;
  border-radius: 4px;
  background-color: darkgray;
`;

const Message = styled(animated.div)`
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  width: 40ch;
  @media (max-width: 680px) {
    width: 100%;
  }
`;

const Content = styled("div")`
  color: white;
  background: #445159;
  opacity: 0.9;
  padding: 12px 22px;
  font-size: 1em;
  display: grid;
  grid-template-columns: ${(props) =>
    props.canClose === false ? "1fr" : "1fr auto"};
  grid-gap: 10px;
  overflow: hidden;
  height: auto;
  border-radius: 3px;
  margin-top: ${(props) => (props.top ? "0" : "10px")};
  margin-bottom: ${(props) => (props.top ? "10px" : "0")};
`;

export const Life = styled(animated.div)`
  position: absolute;
  bottom: ${(props) => (props.top ? "10px" : "0")};
  left: 0px;
  width: auto;
  background-image: linear-gradient(130deg, #00b4e6, #00f0e0);
  height: 5px;
`;

const toastStack = atom({
  key: "toastStack",
  default: [],
});

let id = 0;

export const useToast = () => {
  return useRecoilCallback(
    ({ set }) => (msg, timeout = 3000) => {
      set(toastStack, (old) => [...old, { msg, timeout, key: id++ }]);
    },
    []
  );
};

export default function Toast({
  config: defConfig = { tension: 125, friction: 20, precision: 0.1 },
}) {
  const [toasts, setToasts] = useRecoilState(toastStack);
  const [refMap] = useState(() => new WeakMap());
  const [cancelMap] = useState(() => new WeakMap());
  const transitions = useTransition(toasts, (toast) => toast.key, {
    from: { opacity: 0, height: 0, life: "100%" },
    enter: (toast) => async (next) => {
      await next({ opacity: 1, height: refMap.get(toast).offsetHeight });
    },
    leave: (toast) => async (next, cancel) => {
      cancelMap.set(toast, cancel);
      await next({ life: "0%" });
      await next({ opacity: 0 });
      await next({ height: 0 });
    },
    config: (toast, state) => {
      console.log(
        ">>>Config for",
        toast.key,
        state === "leave"
          ? [{ duration: toast.timeout }, defConfig, defConfig]
          : defConfig
      );
      return state === "leave"
        ? [
            { duration: toast.timeout },
            { duration: 5000, ...defConfig },
            defConfig,
          ]
        : defConfig;
    },
    onRest: (toast) => {
      setToasts((state) => state.filter((i) => i.key !== toast.key));
    },
  });

  useEffect(() => {
    console.log(toasts);
  }, [toasts]);

  return (
    <ToastContainer>
      {transitions.map(({ key, item, props: { life, ...style } }) => (
        <Message key={key} style={style}>
          <Content ref={(ref) => ref && refMap.set(item, ref)}>
            <Life style={{ right: life }} />
            <p>{item.msg}</p>
            {/* <Button
              onClick={(e) => {
                e.stopPropagation();
                cancelMap.has(item) && cancelMap.get(item)();
              }}
            >
              <X size={18} />
            </Button> */}
          </Content>
        </Message>
      ))}
    </ToastContainer>
  );
}
