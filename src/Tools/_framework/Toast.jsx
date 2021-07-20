import React, { useRef } from 'react';
import {
  atom,
  useRecoilValue,
  useSetRecoilState,
  useRecoilCallback,
} from 'recoil';
import styled from 'styled-components';
import { animated, useSpring } from '@react-spring/web';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

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

const Content = styled('div')`
  color: black;
  /* background:  */
  /* opacity: 0.9; */
  background: white;
  padding: 12px 22px;
  font-size: 1em;
  display: grid;
  grid-template-columns: ${(props) =>
    props.canClose === false ? '1fr' : '1fr auto'};
  grid-gap: 10px;
  overflow: hidden;
  height: auto;
  border-radius: 3px;
  border: 2px solid #e2e2e2;
  border-left: 12px solid;
  border-left-color: ${({ type }) => type?.background};
`;

const Life = styled(animated.div)`
  position: absolute;
  bottom: ${(props) => (props.top ? '10px' : '0')};
  left: 0px;
  width: auto;
  background-image: linear-gradient(130deg, #1a5a99, #8fb8de);
  height: 5px;
`;

const Button = styled('button')`
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
  // color: rgba(255, 255, 255, 0.7);
  // :hover {
  //   color: rgba(255, 255, 255, 0.9);
  // }
  color: black;
  font-size: 1em;
`;

export const toastType = Object.freeze({
  //Color contrast with accessibility -- no text on color
  ERROR: {
    // process failed or error occured, user must dissmis
    timeout: -1,
    background: 'rgba(193, 41, 46, 1)',
    gradientEnd: 'rgba()',
  },
  ALERT: {
    // user attetion reqired to dissmiss
    timeout: -1,
    background: 'rgba(255, 230, 0, 1)',
  },
  ACTION: {
    // requires user interaction
    timeout: -1,
    background: 'rgba()',
  },
  INFO: {
    // non-interactive information
    timeout: 3000,
    background: 'rgba(26, 90, 153,1)',
  },
  SUCCESS: {
    // confirm action
    timeout: 3000,
    background: 'rgba(41, 193, 67,  1)',
  },
  CONFIRMATION: {
    //confirm action and offer undo
    timeout: 5000,
    background: 'rgba(26,90,153,1)',
  },
});

const toastStack = atom({
  key: 'toastStack',
  default: [],
});

let id = 0;

export const useToast = () => {
  const addToast = useRecoilCallback(
    ({ set }) =>
      (msg, type = toastType.INFO, action = null) => {
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
        id++;
      },
    [],
  );
  return addToast;
};

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
    from: { opacity: 0, height: 0, life: '100%' },
    to: async (next, cancel) => {
      ref.current.cancel = cancel;
      // console.log(">>>offsetHight", ref.current.offsetHeight);
      await next({ opacity: 1, height: ref.current.offsetHeight });
      if (duration > 0) {
        await next({ life: '0%', config: { duration: duration } });
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
    <Message style={props}>
      <Content ref={ref} key={tId} type={type}>
        <Life style={{ right: props.life }} />
        <p>{children}</p>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            ref.current.cancel();
            setToasts((old) => old.filter((i) => i.props.tId !== tId));
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </Button>
      </Content>
    </Message>
  );
}
