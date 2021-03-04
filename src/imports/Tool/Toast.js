import React, { useState } from "react";
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
  display: flex;
  flex-direction: column;
  pointer-events: none;
  align-items: center;
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

const Life = styled(animated.div)`
  position: absolute;
  bottom: ${(props) => (props.top ? "10px" : "0")};
  left: 0px;
  width: auto;
  background-image: linear-gradient(130deg, #00b4e6, #00f0e0);
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
  color: rgba(255, 255, 255, 0.5);
  :hover {
    color: rgba(255, 255, 255, 0.6);
  }
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
      await next({
        life: "0%",
        config: () => {
          return { duration: toast.timeout };
        },
      });
      await next({ opacity: 0, config: () => ({ duration: 0, ...defConfig }) });
      await next({ height: 0, config: () => ({ duration: 0, ...defConfig }) });
    },
    config: defConfig,
    onRest: (toast) => {
      setToasts((state) => state.filter((i) => i.key !== toast.key));
    },
  });

  return (
    <ToastContainer>
      {transitions.map(({ key, item, props: { life, ...style } }) => (
        <Message key={key} style={style}>
          <Content ref={(ref) => ref && refMap.set(item, ref)}>
            <Life style={{ right: life }} />
            <p>{item.msg}</p>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                cancelMap.has(item) && cancelMap.get(item)();
              }}
            >
              X
            </Button>
          </Content>
        </Message>
      ))}
    </ToastContainer>
  );
}
