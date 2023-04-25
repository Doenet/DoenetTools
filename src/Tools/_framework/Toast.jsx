import React, { useRef } from "react";
import {
  atom,
  useRecoilValue,
  useSetRecoilState,
  useRecoilCallback,
} from "recoil";
import styled from "styled-components";
import { animated, useSpring } from "@react-spring/web";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
// import { toastType } from './ToastTypes';

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
  grid-template-columns: ${(props) =>
    props.canClose === false ? "1fr" : "1fr auto"};
  grid-gap: 10px;
  overflow: hidden;
  height: auto;
  border-radius: 3px;
  border: 2px solid var(--mainGray);
  border-left: 12px solid;
  border-left-color: ${({ type }) => type?.background};
`;

const Life = styled(animated.div)`
  position: absolute;
  bottom: ${(props) => (props.top ? "10px" : "0")};
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
  default: [],
});

const toastStackId = atom({
  key: "toastStackId",
  default: 0,
});

export const recoilAddToast =
  ({ set, snapshot }) =>
  (msg, type = toastType.INFO, action = null) => {
    const id = snapshot.getLoadable(toastStackId).getValue();
    set(toastStack, (old) => [
      ...old,
      <ToastMessage
        key={id}
        type={type}
        action={action}
        duration={type.timeout}
        tId={id}
      >
        {msg}
      </ToastMessage>,
    ]);
    set(toastStackId, (prev) => prev + 1);
  };

export const useToast = () => {
  const addToast = useRecoilCallback(recoilAddToast, []);
  return addToast;
};

export const toastType = Object.freeze({
  //Color contrast with accessibility -- no text on color
  ERROR: {
    // process failed or error occured, user must dissmis
    timeout: -1,
    background: "var(--mainRed)",
    gradientEnd: "rgba()",
  },
  ALERT: {
    // user attetion reqired to dissmiss
    timeout: -1,
    background: "var(--lightYellow)",
  },
  ACTION: {
    // requires user interaction
    timeout: -1,
    background: "rgba()",
  },
  INFO: {
    // non-interactive information
    timeout: -1,
    background: "var(--mainBlue)",
  },
  SUCCESS: {
    // confirm action
    timeout: -1,
    background: "var(--mainGreen)",
  },
  CONFIRMATION: {
    //confirm action and offer undo
    timeout: -1,
    background: "var(--mainBlue)",
  },
});

export default function Toast() {
  const toasts = useRecoilValue(toastStack);

  return <ToastContainer>{toasts.map((toast) => toast)}</ToastContainer>;
}

function ToastMessage({
  defConfig = { tension: 125, friction: 20, precision: 0.1 },
  type,
  action,
  duration,
  tId,
  children,
}) {
  const setToasts = useSetRecoilState(toastStack);
  const ref = useRef();
  const props = useSpring({
    from: { opacity: 0, height: 0, life: "100%" },
    to: async (next, cancel) => {
      ref.current.cancel = cancel;
      // console.log(">>>offsetHight", ref.current.offsetHeight);
      await next({ opacity: 1, height: ref.current.offsetHeight });
      if (duration > 0) {
        await next({ life: "0%", config: { duration: duration } });
        await next({ opacity: 0 });
        await next({ height: 0 });
      }
    },
    config: defConfig,
    onRest: () => {
      if (duration > 0) {
        setToasts((old) => old.filter((i) => i.props.tId !== tId));
      }
    },
  });
  return (
    <Message style={props} role="alert">
      <Content ref={ref} key={tId} type={type} data-test="toast">
        <Life style={{ right: props.life }} />
        <p id="alert-message">{children}</p>
        <Button
          data-test="toast cancel button"
          onClick={(e) => {
            e.stopPropagation();
            ref.current.cancel();
            setToasts((old) => old.filter((i) => i.props.tId !== tId));
          }}
          aria-label="Close alert:"
          aria-labelledby="alert-message"
        >
          <FontAwesomeIcon icon={faTimes} />
        </Button>
      </Content>
    </Message>
  );
}
