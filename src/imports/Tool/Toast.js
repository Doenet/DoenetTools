import React, { useRef } from "react";
import {
  atom,
  useRecoilValue,
  useSetRecoilState,
  useRecoilCallback,
} from "recoil";
import styled from "styled-components";
import { animated, useSpring } from "react-spring";

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
  background: #1a5a99;
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
    ({ set }) => (msg, priority = 0, onClick = null, timeout = 3000) => {
      set(toastStack, (old) => [
        ...old,
        <ToastMessage
          key={id}
          priority={priority}
          onClick={onClick}
          duration={timeout}
          tId={id}
        >
          {msg}
        </ToastMessage>,
      ]);
      id++;
    },
    []
  );
};

export default function Toast() {
  const toasts = useRecoilValue(toastStack);

  return <ToastContainer>{toasts.map((toast) => toast)}</ToastContainer>;
}

function ToastMessage({
  defConfig = { tension: 125, friction: 20, precision: 0.1 },
  priority,
  onClick,
  duration,
  tId,
  children,
}) {
  const setToats = useSetRecoilState(toastStack);
  const ref = useRef();
  const props = useSpring({
    from: { opacity: 0, height: 0, life: "100%" },
    to: async (next, cancel) => {
      ref.current.cancel = cancel;
      await next({ opacity: 1, height: ref.current.offsetHeight });
      await next({ life: "0%", config: { duration: duration } });
      await next({ opacity: 0 });
      await next({ height: 0 });
    },
    config: defConfig,
    onRest: () => {
      setToats((old) => old.filter((i) => i.props.tId !== tId));
    },
  });
  return (
    <Message style={props}>
      <Content ref={ref} key={tId}>
        <Life style={{ right: props.life }} />
        <p>{children}</p>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            ref.current.cancel();
          }}
        >
          X
        </Button>
      </Content>
    </Message>
  );
}
