import styled, { createGlobalStyle } from "styled-components";
import { animated } from "react-spring";

export const GlobalStyle = createGlobalStyle`
  html,
  body {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    overflow: hidden;
    user-select: none;
    font-family: -apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica, ubuntu, roboto, noto,
      segoe ui, arial, sans-serif;
    background: rgb(246, 248, 255);
  }

  #root {
    width: 100%;
    height: 100%;
  }

  .hvr-shutter-in-horizontal {
  display: inline-block;
  vertical-align: middle;
  -webkit-transform: perspective(1px) translateZ(0);
  transform: perspective(1px) translateZ(0);
  box-shadow: 0 0 1px rgba(0, 0, 0, 0);
  position: relative;
  background: #f3ff35;
  z-index: 5;
  -webkit-transition-property: color;
  transition-property: color;
  -webkit-transition-duration: 0.3s;
  transition-duration: 0.3s;
}

.hvr-shutter-in-horizontal:before {
  content: "";
  position: absolute;
  z-index: -1;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #e1e1e1;
  -webkit-transform: scaleX(1);
  transform: scaleX(1);
  -webkit-transform-origin: 50%;
  transform-origin: 50%;
  -webkit-transition-property: transform;
  transition-property: transform;
  -webkit-transition-duration: 0.3s;
  transition-duration: 0.3s;
  -webkit-transition-timing-function: ease-out;
  transition-timing-function: ease-out;
}
.hvr-shutter-in-horizontal:active {
  /* color: white; */
}
.hvr-shutter-in-horizontal:active:before {
  -webkit-transform: scaleX(0);
  transform: scaleX(0);
}

`;

export const Main = styled("div")`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #676767;
`;

export const Container = styled("div")`
  position: fixed;
  z-index: 1000;
  width: 0 auto;
  top: ${(props) => (props.top ? "30px" : "unset")};
  bottom: ${(props) => (props.top ? "unset" : "30px")};
  margin: 0 auto;
  left: 30px;
  right: 30px;
  display: flex;
  flex-direction: ${(props) => (props.top ? "column-reverse" : "column")};
  pointer-events: none;
  align-items: ${(props) =>
    props.position === "center" ? "center" : `flex-${props.position || "end"}`};
  @media (max-width: 680px) {
    align-items: center;
  }
`;

export const Message = styled(animated.div)`
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  width: 40ch;
  @media (max-width: 680px) {
    width: 100%;
  }
`;

export const Content = styled("div")`
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

export const Button = styled("button")`
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

export const Life = styled(animated.div)`
  position: absolute;
  bottom: ${(props) => (props.top ? "10px" : "0")};
  left: 0px;
  width: auto;
  background-image: linear-gradient(130deg, #00b4e6, #00f0e0);
  height: 5px;
`;
