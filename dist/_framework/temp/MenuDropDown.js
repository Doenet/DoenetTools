import React, {useState, useEffect, useRef} from "../../_snowpack/pkg/react.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {animated, useSpring, useTransition, useChain} from "../../_snowpack/pkg/@react-spring/web.js";
import {faChevronDown} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import styled from "../../_snowpack/pkg/styled-components.js";
const DropDown = styled(animated.div)`
  text-align: center;
  color: black;
  padding: 0px;
  font-size: 16px;
  border-radius: 20px;
  position: relative;
`;
const MenuController = styled.button`
  margin: 0;
  background-color: #8fb8de;
  color: black;
  padding: 16px;
  font-size: 16px;
  cursor: pointer;
  display: block;
`;
const DropDownContent = styled.div`
  opacity: 1;
  display: ${(props) => props.open ? "block" : "none"};
  background-color: rgb(246, 248, 255);
  width: 300px;
  border-radius: 1%;
  border: 1px solid black;
  z-index: 9999;
  color: black;
  position: ${(props) => props.appendToBody ? "fixed" : "absolute"};
  left: ${(props) => props.position === "right" ? 0 : "unset"};
  right: ${(props) => props.position === "left" ? 0 : "unset"};
  top: ${(props) => props.position === "right" ? "55px" : "55px"};
  @media (max-width: 768px) {
    right: -110px;
  }
`;
const DropDownContentItem = styled.div`
  cursor: default;
  max-width: 330px;
`;
const DropdownLabelLink = styled.div`
  height: 45px;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.selected ? "#8fb8de" : "transperant"};
  display: flex;
  color: ${(props) => props.selected ? "white" : "black"};
  &:hover {
    background-color: ${(props) => props.selected ? "#8fb8de" : "lightgray"};
  }
  a {
    width: 190px;
    padding: 20px 0px;
    text-decoration: none !important;
    background-color: transperant;
    color: ${(props) => props.selected ? "white" : "black"};
  }
`;
const DropdownCustomLabelLink = styled.div`
  padding: 8px 5px 0px 5px;
  min-height: 20px;
  max-height: 20px;
  justify-content: center;
  align-items: center;
  display: flex;
  color: black;
  font-weight: 600;
  // font-size:16px;
  // letter-spacing:0.29px;
  a {
    width: 190px;
    padding: 20px 0px;
    text-decoration: none !important;
    background-color: transperant;
    color: black;
  }
`;
const DropdownSubLabel = styled.div`
  padding: 0px 5px 10px 5px;
  max-height: 20px;
  min-height: 24px;
  justify-content: center;
  align-items: center;
  display: flex;
  color: black;
  border-bottom: 1px solid #e2e2e2;
  font-weight: 400;
  // font-size:15px;
  // letter-spacing:normal;

  a {
    width: 190px;
    padding: 20px 0px;
    text-decoration: none !important;
    background-color: transperant;
    color: black;
  }
`;
const DropdownCustomOption = styled.div`
  justify-content: center;
  align-items: center;
  display: flex;
`;
const MenuDropDown = ({
  currentTool,
  showThisMenuText = "",
  options = [],
  menuBase,
  width,
  picture,
  grayTheseOut = [],
  offsetPos = 0,
  appendToBody = false,
  position = "right",
  menuWidth,
  placeholder = "Select Value"
}) => {
  const [MenuWidth, setMenuWidth] = useState(menuWidth);
  let defaultValue = !!options.length && !!showThisMenuText && options.filter((o) => o.label === showThisMenuText)[0];
  if (!defaultValue) {
    defaultValue = [];
  }
  const [currentItemDisplay, setCurrentItemDisplay] = useState(defaultValue);
  let updateNumber = 0;
  const node = useRef();
  const [show, setShow] = useState(false);
  useEffect(() => {
    document.addEventListener("click", handleClick, false);
    return () => {
      document.removeEventListener("click", handleClick, false);
    };
  });
  useEffect(() => {
    setMenuWidth(node.current ? node.current.offsetWidth : 0);
  }, [node.current]);
  const handleClick = (e) => {
    if (node.current.contains(e.target)) {
      setShow(!show);
    } else {
      setShow(false);
    }
  };
  if (!menuBase) {
    menuBase = /* @__PURE__ */ React.createElement("button", {
      style: {
        color: "'black'",
        margin: "0",
        height: "20px",
        fontSize: "14px",
        cursor: "pointer",
        display: "block"
      }
    }, !!Object.keys(currentItemDisplay).length ? /* @__PURE__ */ React.createElement("div", {
      style: {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: "100px",
        display: "inline-block"
      }
    }, currentItemDisplay.label) : /* @__PURE__ */ React.createElement("div", {
      style: {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: "100px",
        display: "inline-block"
      }
    }, placeholder), /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faChevronDown,
      style: {
        verticalAlign: "1px",
        marginLeft: "5px"
      },
      size: "sm"
    }));
  }
  return /* @__PURE__ */ React.createElement(DropDown, {
    ref: node
  }, /* @__PURE__ */ React.createElement("div", null, menuBase), /* @__PURE__ */ React.createElement(DropDownContent, {
    open: show,
    appendToBody,
    position
  }, options.map((o, i) => /* @__PURE__ */ React.createElement(DropDownContentItem, {
    key: i,
    onClick: () => {
      if (o["url"]) {
        window.location.href = o["url"];
      } else {
        setCurrentItemDisplay(o);
        if (o["callBackFunction"]) {
          o["callBackFunction"](o);
        }
      }
    }
  }, !!o["optionElem"] ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(DropdownCustomOption, null, o["optionElem"]), /* @__PURE__ */ React.createElement(DropdownCustomLabelLink, null, !!o.link ? /* @__PURE__ */ React.createElement("a", {
    href: o.link
  }, o["label"]) : o["label"]), o["subLabel"] && /* @__PURE__ */ React.createElement(DropdownSubLabel, null, o["subLabel"])) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(DropdownLabelLink, {
    selected: currentItemDisplay && currentItemDisplay.id === o["id"]
  }, !!o.link ? /* @__PURE__ */ React.createElement("a", {
    href: o.link
  }, o["label"]) : o["label"]), o["subLabel"] && /* @__PURE__ */ React.createElement(DropdownSubLabel, null, o["subLabel"]))))));
};
export default MenuDropDown;
